import React, { useState, useEffect } from 'react'
import ScoreBadge from './ScoreBadge.jsx'
import ResultCard from './ResultCard.jsx'

import API_BASE from '../config/api.js';

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
              {status === 'bad' && '✗'}
              {status === 'missing' && '?'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Opportunities recommendation card component
function OpportunitiesCard({ title, icon, items }) {
  return (
    <div className="opportunities-card">
      <div className="opportunities-header">
        <div className="opportunities-icon-wrapper">
          <div className="opportunities-icon">{icon}</div>
          <div className="opportunities-pulse"></div>
        </div>
        <div className="opportunities-title-content">
          <h4>{title}</h4>
          <div className="opportunities-subtitle">Performance Recommendations</div>
        </div>
        <div className="opportunities-badge">
          <span className="badge-text">Live Analysis</span>
        </div>
      </div>
      <div className="opportunities-body">
        {items.map(([key, value, status], i) => (
          <div key={i} className={`opportunity-item ${status}`}>
            <div className="opportunity-indicator">
              {status === 'good' && <span className="indicator-icon good">✓</span>}
              {status === 'warning' && <span className="indicator-icon warning">⚠</span>}
              {status === 'bad' && <span className="indicator-icon bad">!</span>}
              {status === 'missing' && <span className="indicator-icon missing">?</span>}
            </div>
            <div className="opportunity-content">
              <div className="opportunity-category">{key}</div>
              <div className="opportunity-recommendation">{value}</div>
            </div>
            <div className="opportunity-action">
              {status === 'bad' && <span className="action-label">Fix</span>}
              {status === 'warning' && <span className="action-label">Review</span>}
              {status === 'good' && <span className="action-label">✓</span>}
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
      return numericValue <= 1.8 ? 'good' : numericValue <= 3.0 ? 'warning' : 'bad'
    case 'LCP':
      return numericValue <= 2.5 ? 'good' : numericValue <= 4.0 ? 'warning' : 'bad'
    case 'CLS':
      return numericValue <= 0.1 ? 'good' : numericValue <= 0.25 ? 'warning' : 'bad'
    case 'TBT':
      return numericValue <= 200 ? 'good' : numericValue <= 600 ? 'warning' : 'bad'
    case 'SI':
      return numericValue <= 3.4 ? 'good' : numericValue <= 5.8 ? 'warning' : 'bad'
    case 'TTI':
      return numericValue <= 3.8 ? 'good' : numericValue <= 7.3 ? 'warning' : 'bad'
    default:
      return 'good'
  }
}

function getBasicTimeStatus(timeMs) {
  if (!timeMs) return 'missing'
  return timeMs <= 200 ? 'good' : timeMs <= 1000 ? 'warning' : 'bad'
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

// Helper function to determine opportunity status
function getOpportunityStatus(opportunityText) {
  if (!opportunityText || opportunityText === 'Not analyzed') return 'missing'
  
  // Positive indicators (optimized)
  const optimizedKeywords = [
    'is optimized', 'are optimized', 'load efficiently', 
    'compression enabled', 'using modern', 'configured properly',
    'Optimized'
  ]
  
  if (optimizedKeywords.some(keyword => opportunityText.includes(keyword))) {
    return 'good'
  }
  
  // If it contains savings or specific recommendations, it's a warning (needs improvement)
  if (opportunityText.includes('Save ') || opportunityText.includes('Eliminate ') || 
      opportunityText.includes('Reduce ') || opportunityText.includes('Enable ')) {
    return 'bad'
  }
  
  // Default to warning for opportunities that need attention
  return 'warning'
}

export default function SpeedForm({ user, token, requireAuth }) {
  const [url, setUrl] = useState('https://example.com')
  const [strategy, setStrategy] = useState('mobile')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState(null)

  // Load user profile to check for saved API key
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`${API_BASE}/api/auth/profile`, { headers });
      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (!requireAuth()) {
      return; // requireAuth will show the login modal
    }

    setLoading(true); setError(''); setData(null)
    try {
      // Normalize URL - add https:// if no protocol
      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // The backend will automatically use the user's saved API key from dashboard
      const apiUrl = `${API_BASE}/api/pagespeed?url=${encodeURIComponent(normalizedUrl)}&strategy=${strategy}`;
      
      const res = await fetch(apiUrl, { headers })
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
      <p>Get a quick speed read. {!user && <span className="auth-required">Login required to run speed tests.</span>} {user && 'If a PageSpeed API key is configured on the server, you\'ll see Lighthouse metrics.'}</p>
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
        <div className="results speed-results">
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
                title="Basic Performance" 
                icon="⚡"
                items={[
                  ['Response Time', `${data.basic?.timeMs || 0} ms`, getBasicTimeStatus(data.basic?.timeMs)],
                  ['Status Code', data.basic?.status || '—', data.basic?.status === 200 ? 'good' : 'bad'],
                  ['Response Size', formatBytes(data.basic?.bytes) || '—', 'good'],
                  ['Using PageSpeed API', 'Yes', 'good']
                ]}
              />

              <OpportunitiesCard 
                title="Opportunities" 
                icon="💡"
                items={[
                  ['Unused JavaScript', data.opportunities?.unusedJS || 'Not analyzed', getOpportunityStatus(data.opportunities?.unusedJS)],
                  ['Image Optimization', data.opportunities?.images || 'Not analyzed', getOpportunityStatus(data.opportunities?.images)],
                  ['Render-blocking Resources', data.opportunities?.renderBlocking || 'Not analyzed', getOpportunityStatus(data.opportunities?.renderBlocking)],
                  ['Text Compression', data.opportunities?.textCompression || 'Not analyzed', getOpportunityStatus(data.opportunities?.textCompression)],
                  ['Modern Image Formats', data.opportunities?.nextGenFormats || 'Not analyzed', getOpportunityStatus(data.opportunities?.nextGenFormats)],
                  ['Browser Caching', data.opportunities?.efficientCaching || 'Not analyzed', getOpportunityStatus(data.opportunities?.efficientCaching)]
                ]}
              />
            </div>
          ) : (
            <div className="grid">
              <SpeedMetricCard 
                title="Basic Performance" 
                icon="⏱️"
                items={[
                  ['Response Time', `${data.basic?.timeMs || 0} ms`, getBasicTimeStatus(data.basic?.timeMs)],
                  ['Status Code', data.basic?.status || '—', data.basic?.status === 200 ? 'good' : 'bad'],
                  ['Content Size', formatBytes(data.basic?.bytes), 'good'],
                  ['Test Strategy', strategy.charAt(0).toUpperCase() + strategy.slice(1), 'good']
                ]}
              />

              <div className="lighthouse-card">
                <div className="lighthouse-header">
                  <div className="lighthouse-icon">
                    <div className="lighthouse-beacon"></div>
                    🚀
                  </div>
                  <div className="lighthouse-title">
                    <h4>Unlock Lighthouse Metrics</h4>
                    <p>Get Google's advanced performance insights</p>
                  </div>
                  {userProfile?.pagespeedApi?.hasKey && (
                    <div className="lighthouse-status">
                      <div className="status-dot"></div>
                      <span>Connected</span>
                    </div>
                  )}
                </div>

                <div className="lighthouse-body">
                  {!userProfile?.pagespeedApi?.hasKey ? (
                    <div className="lighthouse-setup">
                      <div className="metrics-preview">
                        <div className="preview-grid">
                          <div className="metric-preview">
                            <div className="metric-icon">⚡</div>
                            <span>Core Web Vitals</span>
                          </div>
                          <div className="metric-preview">
                            <div className="metric-icon">📊</div>
                            <span>Performance Score</span>
                          </div>
                          <div className="metric-preview">
                            <div className="metric-icon">🎯</div>
                            <span>Opportunities</span>
                          </div>
                          <div className="metric-preview">
                            <div className="metric-icon">🔍</div>
                            <span>Diagnostics</span>
                          </div>
                        </div>
                      </div>

                      <div className="setup-actions">
                        <div className="dashboard-notice">
                          <div className="notice-icon">ℹ️</div>
                          <div className="notice-content">
                            <p><strong>Configure in Dashboard</strong></p>
                            <p>Set up your PageSpeed API key in your user dashboard for automatic use across all speed tests and project analysis.</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          className="primary-setup-btn"
                          onClick={() => window.location.hash = 'dashboard'}
                        >
                          <span className="btn-icon">⚙️</span>
                          Go to Dashboard Settings
                        </button>
                        <button 
                          type="button"
                          className="secondary-setup-btn"
                          onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                        >
                          <span className="btn-icon">📖</span>
                          How to Get API Key
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="lighthouse-connected">
                      <div className="connection-success">
                        <div className="success-icon">✅</div>
                        <div className="success-content">
                          <h5>Lighthouse Metrics Enabled!</h5>
                          <p>Your PageSpeed API key is configured. You'll get detailed Core Web Vitals, performance opportunities, and diagnostics with every speed test.</p>
                          {userProfile?.pagespeedApi?.maskedKey && (
                            <div className="api-key-display">
                              <span className="key-label">API Key:</span>
                              <code className="masked-key">{userProfile.pagespeedApi.maskedKey}</code>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="manage-btn"
                          onClick={() => window.location.hash = 'dashboard'}
                          title="Manage API key in dashboard"
                        >
                          Manage in Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
