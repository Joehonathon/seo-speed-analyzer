import React, { useState } from 'react'
import ScoreBadge from './ScoreBadge.jsx'
import ResultCard from './ResultCard.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050';

// Speed-specific metric card component
function SpeedMetricCard({ title, icon, items }) {
  return (
    <div className="enhanced-card">
      <div className="enhanced-card-header">
        <div className="card-icon">{icon}</div>
        <div className="card-title-content">
          <h4>{title}</h4>
          <div className="card-stats">{items.length} metrics</div>
        </div>
      </div>
      <div className="enhanced-card-body">
        {items.map(([key, value, status], i) => (
          <div key={i} className="enhanced-row">
            <div className="row-content">
              <div className="row-key">{key}</div>
              <div className="row-value">{value}</div>
            </div>
            <div className={`status-indicator ${status}`}>
              {status === 'good' && '✓'}
              {status === 'warning' && '⚠'}
              {status === 'missing' && '✗'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
function getMetricStatus(metric, value) {
  if (!value || value === '—') return 'missing'
  
  // Parse numeric values from strings like "1.2s" or "0.05"
  const numericValue = parseFloat(value)
  
  switch (metric) {
    case 'FCP':
      return numericValue <= 1.8 ? 'good' : numericValue <= 3.0 ? 'warning' : 'missing'
    case 'LCP':
      return numericValue <= 2.5 ? 'good' : numericValue <= 4.0 ? 'warning' : 'missing'
    case 'CLS':
      return numericValue <= 0.1 ? 'good' : numericValue <= 0.25 ? 'warning' : 'missing'
    case 'TBT':
      return numericValue <= 200 ? 'good' : numericValue <= 600 ? 'warning' : 'missing'
    case 'SI':
      return numericValue <= 3.4 ? 'good' : numericValue <= 5.8 ? 'warning' : 'missing'
    case 'TTI':
      return numericValue <= 3.8 ? 'good' : numericValue <= 7.3 ? 'warning' : 'missing'
    default:
      return 'good'
  }
}

function getBasicTimeStatus(timeMs) {
  if (!timeMs) return 'missing'
  return timeMs <= 200 ? 'good' : timeMs <= 1000 ? 'warning' : 'missing'
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

export default function SpeedForm() {
  const [url, setUrl] = useState('https://example.com')
  const [strategy, setStrategy] = useState('mobile')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch(`${API_BASE}/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setData(json)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const perf = data?.performanceScore

  return (
    <section className="card">
      <h2>Site Speed</h2>
      <p>Get a quick speed read. If a PageSpeed API key is configured on the server, you’ll see Lighthouse metrics.</p>
      <form onSubmit={onSubmit} className="form">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yoursite.com" />
        <select value={strategy} onChange={e=>setStrategy(e.target.value)}>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <button disabled={loading}>{loading ? 'Testing…' : 'Run Test'}</button>
      </form>

      {error && <div className="error">{error}</div>}
      {data && (
        <div className="results">
          <div className="results-header">
            {typeof perf === 'number' ? (
              <ScoreBadge score={perf} label="Performance Score" />
            ) : (
              <div className="enhanced-card">
                <div className="enhanced-card-header">
                  <div className="card-icon">⚡</div>
                  <div className="card-title-content">
                    <h4>Basic Speed Test</h4>
                    <div className="card-stats">Simple metrics</div>
                  </div>
                </div>
                <div className="enhanced-card-body">
                  <div className="enhanced-row">
                    <div className="row-content">
                      <div className="row-key">Status</div>
                      <div className="row-value">{data.basic?.status || 'Unknown'}</div>
                    </div>
                    <div className="status-indicator good">✓</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {data.usingPageSpeedAPI ? (
            <div className="grid">
              <SpeedMetricCard 
                title="Core Web Vitals" 
                icon="🎯"
                items={[
                  ['First Contentful Paint (FCP)', data.metrics?.FCP || '—', getMetricStatus('FCP', data.metrics?.FCP)],
                  ['Largest Contentful Paint (LCP)', data.metrics?.LCP || '—', getMetricStatus('LCP', data.metrics?.LCP)],
                  ['Cumulative Layout Shift (CLS)', data.metrics?.CLS || '—', getMetricStatus('CLS', data.metrics?.CLS)]
                ]}
              />
              
              <SpeedMetricCard 
                title="Performance Metrics" 
                icon="📊"
                items={[
                  ['Total Blocking Time (TBT)', data.metrics?.TBT || '—', getMetricStatus('TBT', data.metrics?.TBT)],
                  ['Speed Index', data.metrics?.SI || '—', getMetricStatus('SI', data.metrics?.SI)],
                  ['Time to Interactive (TTI)', data.metrics?.TTI || '—', getMetricStatus('TTI', data.metrics?.TTI)]
                ]}
              />

              <SpeedMetricCard 
                title="Loading Analysis" 
                icon="🚀"
                items={[
                  ['First Meaningful Paint', data.metrics?.FMP || '—', 'good'],
                  ['DOM Content Loaded', data.metrics?.DCL || '—', 'good'],
                  ['Full Load Time', data.metrics?.Load || '—', 'good']
                ]}
              />

              <SpeedMetricCard 
                title="Opportunities" 
                icon="💡"
                items={[
                  ['Unused JavaScript', data.opportunities?.unusedJS || 'Not analyzed', 'warning'],
                  ['Image Optimization', data.opportunities?.images || 'Not analyzed', 'warning'],
                  ['Render-blocking Resources', data.opportunities?.renderBlocking || 'Not analyzed', 'warning']
                ]}
              />
            </div>
          ) : (
            <div className="grid">
              <SpeedMetricCard 
                title="Basic Metrics" 
                icon="⏱️"
                items={[
                  ['Response Time', `${data.basic?.timeMs || 0} ms`, getBasicTimeStatus(data.basic?.timeMs)],
                  ['Content Size', formatBytes(data.basic?.bytes), 'good'],
                  ['Test Strategy', strategy.charAt(0).toUpperCase() + strategy.slice(1), 'good']
                ]}
              />

              <div className="enhanced-card">
                <div className="enhanced-card-header">
                  <div className="card-icon">🔧</div>
                  <div className="card-title-content">
                    <h4>Get Detailed Metrics</h4>
                    <div className="card-stats">Lighthouse integration</div>
                  </div>
                </div>
                <div className="enhanced-card-body">
                  <div className="upgrade-message">
                    <p>Add a Google PageSpeed Insights API key to get comprehensive Lighthouse metrics including:</p>
                    <ul>
                      <li>Core Web Vitals (FCP, LCP, CLS)</li>
                      <li>Performance opportunities</li>
                      <li>Detailed diagnostics</li>
                      <li>Mobile/Desktop comparisons</li>
                    </ul>
                    <div className="api-setup">
                      <strong>Setup:</strong> Add <code>PAGESPEED_API_KEY</code> to <code>server/.env</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
