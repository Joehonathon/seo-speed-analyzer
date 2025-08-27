import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import ScoreBadge from './ScoreBadge.jsx'
import ResultCard from './ResultCard.jsx'

import API_BASE from '../config/api.js';

export default function SeoFormNew({ user, token, requireAuth }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [openTooltip, setOpenTooltip] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [urlValid, setUrlValid] = useState(true)
  const buttonRefs = useRef({})

  // URL validation function
  const validateUrl = (input) => {
    if (!input.trim()) return true // Allow empty input
    try {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  // Handle URL input changes
  const handleUrlChange = (e) => {
    const value = e.target.value
    setUrl(value)
    setUrlValid(validateUrl(value))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!requireAuth()) {
      return
    }
    
    // Normalize URL - add https:// if no protocol is present
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    
    setLoading(true); setError(''); setData(null)
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const res = await fetch(`${API_BASE}/api/analyze?url=` + encodeURIComponent(normalizedUrl), { headers })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          setError('Please login to analyze websites')
          return
        }
        if (res.status === 429) {
          setError(json.message || 'Daily limit reached. Upgrade to Pro for unlimited access.')
          return
        }
        throw new Error(json.error || 'Failed')
      }
      setData(json)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="seo-analyzer-modern">
        <div className="analyzer-container">
          <div className="analyzer-header">
            <div className="header-content">
              <div className="status-badge">
                <div className="badge-dot"></div>
                <span>SEO Analysis Tool</span>
              </div>
              <h1 className="main-title">
                Analyze Your Website's
                <span className="gradient-text">SEO Performance</span>
              </h1>
              <p className="main-description">
                Get instant insights into your website's SEO health with our comprehensive analysis tool.
              </p>
            </div>
            
            <div className="stats-preview">
              <div className="stat-item">
                <div className="stat-number">95</div>
                <div className="stat-label">Avg Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1.2s</div>
                <div className="stat-label">Load Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12+</div>
                <div className="stat-label">Checks</div>
              </div>
            </div>
          </div>

          <div className="analyzer-form-modern">
            <form onSubmit={onSubmit} className="modern-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21L16.65 16.65"/>
                    </svg>
                  </div>
                  <input 
                    value={url} 
                    onChange={handleUrlChange} 
                    placeholder="Enter your website URL (e.g., example.com)" 
                    className={`url-input ${!urlValid && url ? 'error' : ''}`}
                    type="text"
                    required
                  />
                  {url && (
                    <div className="input-actions">
                      {!urlValid && url && (
                        <div className="error-icon" title="Invalid URL">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                        </div>
                      )}
                      {urlValid && (
                        <div className="success-icon" title="Valid URL">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      )}
                      <button 
                        type="button" 
                        className="clear-button"
                        onClick={() => {
                          setUrl('')
                          setUrlValid(true)
                        }}
                        title="Clear"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !url.trim() || !urlValid} 
                  className="analyze-btn"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Now</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              <div className="form-footer">
                <div className="examples">
                  <span className="examples-label">Try these examples:</span>
                  <div className="example-links">
                    <button 
                      type="button" 
                      className="example-link"
                      onClick={() => {
                        setUrl('google.com')
                        setUrlValid(true)
                      }}
                    >
                      google.com
                    </button>
                    <button 
                      type="button" 
                      className="example-link"
                      onClick={() => {
                        setUrl('github.com')
                        setUrlValid(true)
                      }}
                    >
                      github.com
                    </button>
                    <button 
                      type="button" 
                      className="example-link"
                      onClick={() => {
                        setUrl('stackoverflow.com')
                        setUrlValid(true)
                      }}
                    >
                      stackoverflow.com
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="error-notification-modern">
            <div className="error-content">
              <div className="error-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="error-text">
                <h4>Analysis Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="results-modern">
            <div className="results-header">
              <div className="results-badge">
                <div className="badge-dot success"></div>
                <span>Analysis Complete</span>
              </div>
              <h2 className="results-title">
                Results for <span className="domain-name">{new URL(url.startsWith('http') ? url : `https://${url}`).hostname}</span>
              </h2>
            </div>
            
            <div className="score-section">
              <div className="main-score">
                <ScoreBadge score={data.score} label="Overall SEO Score" />
              </div>
              
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">{data.status}</div>
                  <div className="metric-label">Status</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{data.ttfbMs}ms</div>
                  <div className="metric-label">Response Time</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{data.wordCount}</div>
                  <div className="metric-label">Word Count</div>
                </div>
              </div>
            </div>

            <div className="analysis-sections">
              <div className="section-modern">
                <div className="section-header">
                  <h3>Core SEO Analysis</h3>
                  <p>Fundamental elements affecting search visibility</p>
                </div>
                <div className="cards-grid-modern">
                  <ResultCard title="Basics" items={[
                    ['Title', data.metrics.title || '—'],
                    ['Meta Description', data.metrics.metaDescription || '—'],
                    ['Viewport', data.metrics.viewport || '—'],
                    ['Language', data.metrics.lang || '—'],
                    ['Canonical URL', data.metrics.canonical || '—'],
                  ]} />

                  <ResultCard title="Content Structure" items={[
                    ['H1 Count', String(data.metrics.h1Count)],
                    ['Header Hierarchy', data.metrics.headerHierarchy?.isGood ? 'Good' : data.metrics.headerHierarchy?.issue || 'Issues'],
                    ['Word Count', String(data.wordCount)],
                    ['Images Total', String(data.metrics.imgCount)],
                    ['Images Missing Alt', String(data.metrics.imgsMissingAlt)],
                  ]} />

                  <ResultCard title="Technical SEO" items={[
                    ['HTTPS', data.metrics.technical?.https ? 'Yes' : 'No'],
                    ['Broken Links', `${data.metrics.technical?.brokenLinks?.brokenCount || 0} broken link${(data.metrics.technical?.brokenLinks?.brokenCount || 0) === 1 ? '' : 's'}`],
                    ['JSON-LD Structured Data', String(data.metrics.jsonLdCount)],
                    ['Robots Meta', data.metrics.robotsMeta || '—'],
                  ]} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}