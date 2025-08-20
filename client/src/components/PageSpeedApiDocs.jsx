import React, { useState } from 'react';

export default function PageSpeedApiDocs() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="docs-container-wide">
      {/* Hero Section */}
      <div className="docs-hero-wide">
        <div className="hero-grid">
          <div className="hero-content-left">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>Google PageSpeed API Integration</span>
            </div>
            <h1>Unlock Advanced Performance Insights</h1>
            <p className="hero-description">
              Transform your website analysis with Google's official PageSpeed Insights API. 
              Access the same performance technology that powers Google Search rankings 
              and get actionable recommendations to boost your site's speed.
            </p>
            <div className="hero-actions">
              <button 
                className="hero-btn-primary"
                onClick={() => window.location.hash = 'dashboard'}
              >
                <span className="btn-icon">⚙️</span>
                Configure API Key
              </button>
              <button 
                className="hero-btn-secondary"
                onClick={() => setActiveTab('setup')}
              >
                <span className="btn-icon">📖</span>
                View Setup Guide
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="api-preview-card">
              <div className="preview-header">
                <div className="lighthouse-icon">
                  <div className="lighthouse-beacon"></div>
                  🏆
                </div>
                <div className="preview-title">
                  <h4>Performance Score</h4>
                  <div className="score-display">92</div>
                </div>
              </div>
              <div className="preview-metrics">
                <div className="metric-preview">
                  <span className="metric-name">LCP</span>
                  <span className="metric-value good">1.2s</span>
                </div>
                <div className="metric-preview">
                  <span className="metric-name">FID</span>
                  <span className="metric-value good">89ms</span>
                </div>
                <div className="metric-preview">
                  <span className="metric-name">CLS</span>
                  <span className="metric-value good">0.05</span>
                </div>
              </div>
              <div className="preview-badge">
                <span>✨ Powered by Lighthouse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="docs-navigation">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            className={`nav-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <span className="nav-icon">📏</span>
            Metrics Guide
          </button>
          <button 
            className={`nav-tab ${activeTab === 'setup' ? 'active' : ''}`}
            onClick={() => setActiveTab('setup')}
          >
            <span className="nav-icon">🔑</span>
            Setup Guide
          </button>
          <button 
            className={`nav-tab ${activeTab === 'integration' ? 'active' : ''}`}
            onClick={() => setActiveTab('integration')}
          >
            <span className="nav-icon">⚙️</span>
            Integration
          </button>
          <button 
            className={`nav-tab ${activeTab === 'troubleshooting' ? 'active' : ''}`}
            onClick={() => setActiveTab('troubleshooting')}
          >
            <span className="nav-icon">🔧</span>
            Troubleshooting
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="docs-content-wide">
        {/* Overview Tab - Redesigned Layout */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Hero Section */}
            <div className="overview-hero">
              <div className="hero-content-section">
                <div className="hero-badge-new">
                  <span className="badge-icon">🚀</span>
                  <span>Powered by Google Lighthouse</span>
                </div>
                <h2>Transform Your Website Performance Analysis</h2>
                <p className="hero-subtitle">
                  Access Google's official PageSpeed Insights API to unlock professional-grade 
                  performance metrics, Core Web Vitals, and actionable optimization recommendations.
                </p>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="stat-number-hero">25,000</div>
                    <div className="stat-label-hero">Free API calls daily</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number-hero">6+</div>
                    <div className="stat-label-hero">Performance metrics</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number-hero">100%</div>
                    <div className="stat-label-hero">Google accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get Section */}
            <div className="value-proposition">
              <div className="section-header-center">
                <h3>What You Get With PageSpeed API</h3>
                <p>See the difference between basic speed testing and professional performance analysis</p>
              </div>
              
              <div className="comparison-layout">
                <div className="comparison-side basic-side">
                  <div className="comparison-header">
                    <div className="comparison-icon basic">🔧</div>
                    <div className="comparison-title">
                      <h4>Basic Speed Test</h4>
                      <span className="comparison-badge basic">Built-in</span>
                    </div>
                  </div>
                  <ul className="feature-list-new">
                    <li className="feature-basic">Response time measurement</li>
                    <li className="feature-basic">Content size analysis</li>
                    <li className="feature-basic">Basic connectivity test</li>
                    <li className="feature-missing">Core Web Vitals</li>
                    <li className="feature-missing">Performance score (0-100)</li>
                    <li className="feature-missing">Optimization opportunities</li>
                    <li className="feature-missing">Field data from real users</li>
                  </ul>
                </div>

                <div className="comparison-arrow">
                  <div className="arrow-content">
                    <div className="arrow-icon">→</div>
                    <span>Upgrade</span>
                  </div>
                </div>

                <div className="comparison-side premium-side">
                  <div className="comparison-header">
                    <div className="comparison-icon premium">🏆</div>
                    <div className="comparison-title">
                      <h4>PageSpeed API Analysis</h4>
                      <span className="comparison-badge premium">Professional</span>
                    </div>
                  </div>
                  <ul className="feature-list-new">
                    <li className="feature-premium">Everything from basic test</li>
                    <li className="feature-premium">Core Web Vitals (LCP, FID, CLS)</li>
                    <li className="feature-premium">Performance score (0-100)</li>
                    <li className="feature-premium">Field & lab data</li>
                    <li className="feature-premium">Optimization opportunities</li>
                    <li className="feature-premium">Detailed diagnostics</li>
                    <li className="feature-premium">Real user monitoring (RUM)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Benefits Section */}
            <div className="benefits-section">
              <div className="section-header-center">
                <h3>Why Choose PageSpeed API?</h3>
                <p>The same performance technology Google uses to rank websites</p>
              </div>
              
              <div className="benefits-grid-new">
                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <div className="benefit-icon-new">🎯</div>
                  </div>
                  <h4>Google's Official Metrics</h4>
                  <p>Access Core Web Vitals that directly impact your search rankings. Get the exact metrics Google uses to evaluate user experience.</p>
                  <div className="benefit-highlight">SEO Impact</div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <div className="benefit-icon-new">📊</div>
                  </div>
                  <h4>Real User Data</h4>
                  <p>Field data from actual visitors shows how your site performs in real-world conditions, not just synthetic tests.</p>
                  <div className="benefit-highlight">Authentic Data</div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <div className="benefit-icon-new">💡</div>
                  </div>
                  <h4>Actionable Insights</h4>
                  <p>Get prioritized optimization suggestions with estimated impact scores to focus your development efforts.</p>
                  <div className="benefit-highlight">Clear Direction</div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <div className="benefit-icon-new">📈</div>
                  </div>
                  <h4>Performance Tracking</h4>
                  <p>Monitor improvements over time and track the success of your optimization efforts with historical data.</p>
                  <div className="benefit-highlight">Progress Monitoring</div>
                </div>
              </div>
            </div>

            {/* Quick Action Section */}
            <div className="quick-action-section">
              <div className="action-content">
                <h3>Ready to Get Started?</h3>
                <p>Set up your free API key in just 2 minutes and unlock professional performance analysis</p>
                <div className="action-steps">
                  <div className="action-step">
                    <div className="step-icon">1</div>
                    <span>Get your free API key</span>
                  </div>
                  <div className="step-arrow">→</div>
                  <div className="action-step">
                    <div className="step-icon">2</div>
                    <span>Configure in dashboard</span>
                  </div>
                  <div className="step-arrow">→</div>
                  <div className="action-step">
                    <div className="step-icon">3</div>
                    <span>Start advanced testing</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className="action-btn-primary"
                    onClick={() => setActiveTab('setup')}
                  >
                    <span className="btn-icon">🔑</span>
                    Get API Key Now
                  </button>
                  <button 
                    className="action-btn-secondary"
                    onClick={() => window.location.hash = 'dashboard'}
                  >
                    <span className="btn-icon">⚙️</span>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Guide Tab */}
        {activeTab === 'metrics' && (
          <div className="tab-content">
            <div className="metrics-content">
              <div className="metrics-intro">
                <h2>Performance Metrics Guide</h2>
                <p>Understanding the metrics that matter for web performance and SEO.</p>
              </div>

              <div className="metrics-categories">
                <div className="metric-category-card core-vitals">
                  <div className="category-header">
                    <div className="category-icon">🎯</div>
                    <h3>Core Web Vitals</h3>
                    <span className="category-badge critical">Critical for SEO</span>
                  </div>
                  
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">🎨</div>
                        <div className="metric-info">
                          <h4>Largest Contentful Paint</h4>
                          <div className="metric-code">LCP</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 2.5s</div>
                        </div>
                      </div>
                      <p>Measures loading performance. It marks the point when the page's main content has likely finished loading.</p>
                      <div className="metric-details">
                        <div className="detail-item">
                          <span className="detail-label">Good:</span>
                          <span className="detail-value good">≤ 2.5 seconds</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Needs Work:</span>
                          <span className="detail-value warning">2.5s - 4.0s</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Poor:</span>
                          <span className="detail-value poor">> 4.0 seconds</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">⚡</div>
                        <div className="metric-info">
                          <h4>First Input Delay</h4>
                          <div className="metric-code">FID</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 100ms</div>
                        </div>
                      </div>
                      <p>Measures interactivity. It quantifies the experience users feel when trying to interact with unresponsive pages.</p>
                      <div className="metric-details">
                        <div className="detail-item">
                          <span className="detail-label">Good:</span>
                          <span className="detail-value good">≤ 100ms</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Needs Work:</span>
                          <span className="detail-value warning">100ms - 300ms</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Poor:</span>
                          <span className="detail-value poor">> 300ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">📐</div>
                        <div className="metric-info">
                          <h4>Cumulative Layout Shift</h4>
                          <div className="metric-code">CLS</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 0.1</div>
                        </div>
                      </div>
                      <p>Measures visual stability. It quantifies how much unexpected layout shift occurs during the entire lifespan of a page.</p>
                      <div className="metric-details">
                        <div className="detail-item">
                          <span className="detail-label">Good:</span>
                          <span className="detail-value good">≤ 0.1</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Needs Work:</span>
                          <span className="detail-value warning">0.1 - 0.25</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Poor:</span>
                          <span className="detail-value poor">> 0.25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-category-card performance">
                  <div className="category-header">
                    <div className="category-icon">📊</div>
                    <h3>Additional Performance Metrics</h3>
                    <span className="category-badge">Important</span>
                  </div>
                  
                  <div className="metrics-grid">
                    <div className="metric-card secondary">
                      <div className="metric-header">
                        <div className="metric-icon">🎬</div>
                        <div className="metric-info">
                          <h4>First Contentful Paint</h4>
                          <div className="metric-code">FCP</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 1.8s</div>
                        </div>
                      </div>
                      <p>Measures when users first see any content on your page.</p>
                    </div>

                    <div className="metric-card secondary">
                      <div className="metric-header">
                        <div className="metric-icon">🏃</div>
                        <div className="metric-info">
                          <h4>Speed Index</h4>
                          <div className="metric-code">SI</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 3.4s</div>
                        </div>
                      </div>
                      <p>Measures how quickly content is visually displayed during page load.</p>
                    </div>

                    <div className="metric-card secondary">
                      <div className="metric-header">
                        <div className="metric-icon">⏳</div>
                        <div className="metric-info">
                          <h4>Total Blocking Time</h4>
                          <div className="metric-code">TBT</div>
                        </div>
                        <div className="metric-targets">
                          <div className="target good">≤ 200ms</div>
                        </div>
                      </div>
                      <p>Measures the total time between FCP and TTI where the page was blocked from responding to user input.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Guide Tab */}
        {activeTab === 'setup' && (
          <div className="tab-content">
            <div className="setup-content">
              <div className="setup-intro">
                <h2>Getting Your API Key</h2>
                <p>Follow these steps to get your free Google PageSpeed Insights API key and unlock advanced performance analysis.</p>
              </div>

              <div className="setup-flow">
                <div className="flow-step">
                  <div className="step-indicator">
                    <div className="step-number">1</div>
                    <div className="step-line"></div>
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <h3>Visit Google's PageSpeed API Page</h3>
                      <span className="step-duration">~30 seconds</span>
                    </div>
                    <p>Go to Google's official PageSpeed Insights API getting started page. This is the fastest way to get your free API key.</p>
                    <div className="step-action">
                      <button 
                        className="action-btn primary"
                        onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                      >
                        <span className="btn-icon">🔗</span>
                        Open PageSpeed API Guide
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flow-step">
                  <div className="step-indicator">
                    <div className="step-number">2</div>
                    <div className="step-line"></div>
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <h3>Get Your API Key</h3>
                      <span className="step-duration">~1 minute</span>
                    </div>
                    <p>On Google's page, click the "Get a Key" button. Sign in with your Google account if prompted, and follow the simple setup process.</p>
                    <div className="step-tip">
                      <div className="tip-icon">💡</div>
                      <div className="tip-content">
                        <strong>Tip:</strong> Google will automatically create a project for you and enable the PageSpeed Insights API. No complex setup required!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flow-step">
                  <div className="step-indicator">
                    <div className="step-number">3</div>
                    <div className="step-line"></div>
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <h3>Copy Your API Key</h3>
                      <span className="step-duration">~10 seconds</span>
                    </div>
                    <p>Your API key will be displayed immediately. Copy it to your clipboard - it should start with "AIza" and be about 40 characters long.</p>
                    <div className="step-warning">
                      <div className="warning-icon">⚠️</div>
                      <div className="warning-content">
                        <strong>Important:</strong> Keep your API key secure and don't share it publicly. You can always regenerate it if needed.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flow-step">
                  <div className="step-indicator">
                    <div className="step-number">4</div>
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <h3>Test Your Key (Optional)</h3>
                      <span className="step-duration">~30 seconds</span>
                    </div>
                    <p>Google's page includes a "Try it" section where you can test your new API key immediately with a sample URL.</p>
                    <div className="step-tip">
                      <div className="tip-icon">✅</div>
                      <div className="tip-content">
                        <strong>Verification:</strong> If the test returns performance data, your API key is working correctly and ready to use!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setup-footer">
                <div className="footer-info">
                  <h4>What's Next?</h4>
                  <p>Once you have your API key, head to the Integration tab to learn how to configure it in your dashboard.</p>
                </div>
                <div className="footer-actions">
                  <button 
                    className="action-btn secondary"
                    onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                  >
                    🔑 Get Your API Key Now
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => setActiveTab('integration')}
                  >
                    Next: Integration →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Tab - Redesigned */}
        {activeTab === 'integration' && (
          <div className="tab-content">
            {/* Integration Hero */}
            <div className="integration-hero">
              <div className="integration-hero-content">
                <div className="hero-badge-integration">
                  <span className="badge-icon">⚙️</span>
                  <span>Dashboard Integration</span>
                </div>
                <h2>Connect Your API Key in Minutes</h2>
                <p className="integration-subtitle">
                  Once configured, your API key automatically powers all performance analysis across 
                  speed tests, project monitoring, and detailed reporting.
                </p>
                <div className="hero-action">
                  <button 
                    className="dashboard-access-btn"
                    onClick={() => window.location.hash = 'dashboard'}
                  >
                    <span className="btn-icon">🚀</span>
                    Open Dashboard Now
                  </button>
                </div>
              </div>
            </div>

            {/* Integration Process */}
            <div className="integration-process">
              <div className="process-header">
                <h3>Simple 4-Step Integration</h3>
                <p>Your API key will be encrypted and automatically used across all tools</p>
              </div>
              
              <div className="process-flow">
                <div className="process-step">
                  <div className="step-visual">
                    <div className="step-number">1</div>
                    <div className="step-icon">🏠</div>
                  </div>
                  <div className="step-content">
                    <h4>Access Dashboard</h4>
                    <p>Navigate to your user dashboard from the main navigation menu</p>
                    <div className="step-tip">
                      <span className="tip-icon">💡</span>
                      <span>Login required to access dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="process-connector"></div>

                <div className="process-step">
                  <div className="step-visual">
                    <div className="step-number">2</div>
                    <div className="step-icon">🔍</div>
                  </div>
                  <div className="step-content">
                    <h4>Find API Section</h4>
                    <p>Scroll to the "Google PageSpeed API Configuration" card</p>
                    <div className="step-tip">
                      <span className="tip-icon">📍</span>
                      <span>Located below daily usage statistics</span>
                    </div>
                  </div>
                </div>

                <div className="process-connector"></div>

                <div className="process-step">
                  <div className="step-visual">
                    <div className="step-number">3</div>
                    <div className="step-icon">🔑</div>
                  </div>
                  <div className="step-content">
                    <h4>Enter API Key</h4>
                    <p>Paste your API key and click "Save API Key" to encrypt and store it</p>
                    <div className="step-tip">
                      <span className="tip-icon">🔒</span>
                      <span>Key is encrypted using AES-256</span>
                    </div>
                  </div>
                </div>

                <div className="process-connector"></div>

                <div className="process-step">
                  <div className="step-visual">
                    <div className="step-number">4</div>
                    <div className="step-icon">✨</div>
                  </div>
                  <div className="step-content">
                    <h4>Start Advanced Testing</h4>
                    <p>Your API key is now active across all performance tools automatically</p>
                    <div className="step-tip success">
                      <span className="tip-icon">✅</span>
                      <span>Integration complete!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="enhanced-features">
              <div className="features-header">
                <h3>What Gets Enhanced</h3>
                <p>See how your API integration transforms every aspect of performance analysis</p>
              </div>

              <div className="enhancement-showcase">
                <div className="enhancement-item">
                  <div className="enhancement-visual">
                    <div className="before-after">
                      <div className="before-state">
                        <div className="state-icon basic">⚡</div>
                        <div className="state-content">
                          <h5>Speed Tests</h5>
                          <div className="basic-features">
                            <span>Response time</span>
                            <span>Content size</span>
                            <span>Basic metrics</span>
                          </div>
                        </div>
                      </div>
                      <div className="transformation-arrow">
                        <div className="arrow-circle">
                          <span>→</span>
                        </div>
                      </div>
                      <div className="after-state">
                        <div className="state-icon premium">🚀</div>
                        <div className="state-content">
                          <h5>Advanced Analysis</h5>
                          <div className="premium-features">
                            <span>Core Web Vitals</span>
                            <span>Performance Score</span>
                            <span>Optimization Tips</span>
                            <span>Field Data</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="enhancement-item">
                  <div className="enhancement-visual">
                    <div className="before-after">
                      <div className="before-state">
                        <div className="state-icon basic">📊</div>
                        <div className="state-content">
                          <h5>Project Reports</h5>
                          <div className="basic-features">
                            <span>Simple data</span>
                            <span>Basic charts</span>
                            <span>Limited insights</span>
                          </div>
                        </div>
                      </div>
                      <div className="transformation-arrow">
                        <div className="arrow-circle">
                          <span>→</span>
                        </div>
                      </div>
                      <div className="after-state">
                        <div className="state-icon premium">📈</div>
                        <div className="state-content">
                          <h5>Professional Reports</h5>
                          <div className="premium-features">
                            <span>Detailed Diagnostics</span>
                            <span>Opportunity Analysis</span>
                            <span>Performance Trends</span>
                            <span>Action Items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="security-assurance">
              <div className="security-hero">
                <div className="security-icon-large">🔒</div>
                <h3>Enterprise-Grade Security</h3>
                <p>Your API key is protected with the same security standards used by Fortune 500 companies</p>
              </div>
              
              <div className="security-features">
                <div className="security-feature">
                  <div className="security-badge">🛡️</div>
                  <div className="security-info">
                    <h4>AES-256 Encryption</h4>
                    <p>Military-grade encryption protects your API key at rest</p>
                  </div>
                </div>
                
                <div className="security-feature">
                  <div className="security-badge">🔐</div>
                  <div className="security-info">
                    <h4>Secure Storage</h4>
                    <p>Keys stored in encrypted database with access logging</p>
                  </div>
                </div>
                
                <div className="security-feature">
                  <div className="security-badge">🚫</div>
                  <div className="security-info">
                    <h4>Never Shared</h4>
                    <p>Your API key is never transmitted to third parties</p>
                  </div>
                </div>
                
                <div className="security-feature">
                  <div className="security-badge">⚙️</div>
                  <div className="security-info">
                    <h4>Full Control</h4>
                    <p>Update, view, or remove your key anytime from dashboard</p>
                  </div>
                </div>
              </div>

              <div className="security-actions">
                <div className="security-note">
                  <div className="note-icon">ℹ️</div>
                  <p>Your API key is only used to fetch performance data from Google's servers. We never store or analyze your website data.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Troubleshooting Tab - Redesigned */}
        {activeTab === 'troubleshooting' && (
          <div className="tab-content">
            {/* Troubleshooting Hero */}
            <div className="troubleshooting-hero">
              <div className="diagnostic-visual">
                <div className="diagnostic-icon">
                  <div className="diagnostic-ring"></div>
                  <div className="diagnostic-center">🔧</div>
                </div>
                <div className="diagnostic-status">
                  <div className="status-indicator scanning"></div>
                  <span>Diagnostic Ready</span>
                </div>
              </div>
              <div className="hero-content-diagnostic">
                <div className="hero-badge-diagnostic">
                  <span className="badge-icon">🛠️</span>
                  <span>Problem Solving Center</span>
                </div>
                <h2>Troubleshooting & Support</h2>
                <p className="diagnostic-subtitle">
                  Quick solutions for common issues, diagnostic tools, and expert guidance 
                  to get your PageSpeed API integration working perfectly.
                </p>
                <div className="diagnostic-stats">
                  <div className="diagnostic-stat">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                      <div className="stat-number">95%</div>
                      <div className="stat-label">Issues resolved instantly</div>
                    </div>
                  </div>
                  <div className="diagnostic-stat">
                    <div className="stat-icon">🕐</div>
                    <div className="stat-content">
                      <div className="stat-number">&lt;2min</div>
                      <div className="stat-label">Average fix time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Diagnostic Section */}
            <div className="quick-diagnostic">
              <div className="diagnostic-header">
                <h3>Quick API Key Checker</h3>
                <p>Instantly verify if your API key format is correct</p>
              </div>
              <div className="diagnostic-tool">
                <div className="tool-visual">
                  <div className="scanner-animation"></div>
                  <div className="scanner-content">
                    <div className="scanner-icon">🔍</div>
                    <div className="scanner-text">
                      <h4>API Key Format Validator</h4>
                      <p>Check your API key format instantly</p>
                    </div>
                  </div>
                </div>
                <div className="format-checklist">
                  <div className="check-item">
                    <div className="check-icon">✅</div>
                    <span>Starts with "AIza"</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon">✅</div>
                    <span>~40 characters long</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon">✅</div>
                    <span>No spaces or special characters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Categories */}
            <div className="problem-categories">
              <div className="categories-header">
                <h3>Common Issues & Solutions</h3>
                <p>Expert solutions for the most frequently encountered problems</p>
              </div>

              <div className="problem-grid">
                {/* API Key Problems */}
                <div className="problem-category critical">
                  <div className="category-header-new">
                    <div className="category-visual">
                      <div className="category-icon-bg critical"></div>
                      <div className="category-icon-main">🔑</div>
                    </div>
                    <div className="category-info">
                      <h4>API Key Issues</h4>
                      <span className="category-badge critical">Critical</span>
                      <div className="issue-count">3 common issues</div>
                    </div>
                  </div>

                  <div className="problems-list">
                    <div className="problem-item">
                      <div className="problem-header">
                        <div className="severity-indicator high"></div>
                        <div className="problem-title">
                          <h5>"Invalid API key" Error</h5>
                          <span className="frequency-badge high">Very Common</span>
                        </div>
                      </div>
                      <div className="problem-description">
                        Most common issue - usually a formatting or configuration problem
                      </div>
                      <div className="solution-steps">
                        <div className="solution-step">
                          <div className="step-icon">1</div>
                          <div className="step-content">
                            <strong>Verify Format:</strong> Ensure key starts with "AIza" and is ~40 characters
                          </div>
                        </div>
                        <div className="solution-step">
                          <div className="step-icon">2</div>
                          <div className="step-content">
                            <strong>Check API Status:</strong> Confirm PageSpeed API is enabled in Cloud Console
                          </div>
                        </div>
                        <div className="solution-step">
                          <div className="step-icon">3</div>
                          <div className="step-content">
                            <strong>Remove Restrictions:</strong> Clear any domain or IP restrictions
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="problem-item">
                      <div className="problem-header">
                        <div className="severity-indicator medium"></div>
                        <div className="problem-title">
                          <h5>Key Won't Save in Dashboard</h5>
                          <span className="frequency-badge medium">Common</span>
                        </div>
                      </div>
                      <div className="solution-quick">
                        <div className="quick-icon">💡</div>
                        <div className="quick-text">
                          <strong>Quick Fix:</strong> Remove any extra spaces, ensure you're logged in, and try refreshing the page
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quota & Performance */}
                <div className="problem-category warning">
                  <div className="category-header-new">
                    <div className="category-visual">
                      <div className="category-icon-bg warning"></div>
                      <div className="category-icon-main">📊</div>
                    </div>
                    <div className="category-info">
                      <h4>Quota & Performance</h4>
                      <span className="category-badge warning">Important</span>
                      <div className="issue-count">2 common issues</div>
                    </div>
                  </div>

                  <div className="problems-list">
                    <div className="problem-item">
                      <div className="problem-header">
                        <div className="severity-indicator medium"></div>
                        <div className="problem-title">
                          <h5>"Quota Exceeded" Error</h5>
                          <span className="frequency-badge medium">Occasional</span>
                        </div>
                      </div>
                      <div className="quota-info">
                        <div className="quota-visual">
                          <div className="quota-meter">
                            <div className="quota-fill" style={{width: '75%'}}></div>
                          </div>
                          <div className="quota-stats">
                            <span className="quota-label">Daily Limit</span>
                            <span className="quota-number">25,000 calls</span>
                          </div>
                        </div>
                        <div className="quota-solutions">
                          <div className="quota-solution">
                            <div className="solution-icon-small">📈</div>
                            <span>Monitor usage in Google Cloud Console</span>
                          </div>
                          <div className="quota-solution">
                            <div className="solution-icon-small">💳</div>
                            <span>Enable billing for additional quota</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expected Behaviors */}
                <div className="problem-category info">
                  <div className="category-header-new">
                    <div className="category-visual">
                      <div className="category-icon-bg info"></div>
                      <div className="category-icon-main">ℹ️</div>
                    </div>
                    <div className="category-info">
                      <h4>Expected Behaviors</h4>
                      <span className="category-badge info">Good to Know</span>
                      <div className="issue-count">Understanding normal operation</div>
                    </div>
                  </div>

                  <div className="behavior-items">
                    <div className="behavior-item">
                      <div className="behavior-visual">
                        <div className="behavior-icon">⏱️</div>
                        <div className="behavior-indicator normal"></div>
                      </div>
                      <div className="behavior-content">
                        <h5>Tests Take 10-30 Seconds</h5>
                        <p>This is completely normal! PageSpeed API runs comprehensive Lighthouse audits with 100+ performance checks, unlike basic 1-3 second connectivity tests.</p>
                        <div className="behavior-benefit">
                          <span className="benefit-icon">🏆</span>
                          <span>The detailed insights justify the extra time</span>
                        </div>
                      </div>
                    </div>

                    <div className="behavior-item">
                      <div className="behavior-visual">
                        <div className="behavior-icon">📊</div>
                        <div className="behavior-indicator normal"></div>
                      </div>
                      <div className="behavior-content">
                        <h5>Results Vary Between Tests</h5>
                        <p>Performance naturally fluctuates based on server load, network conditions, and real user experiences. This variation provides authentic, real-world data.</p>
                        <div className="behavior-benefit">
                          <span className="benefit-icon">📈</span>
                          <span>Focus on trends rather than individual results</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Resources */}
            <div className="help-resources">
              <div className="resources-hero">
                <div className="resources-icon">🆘</div>
                <h3>Still Need Help?</h3>
                <p>Access official documentation and expert support channels</p>
              </div>
              
              <div className="resources-grid">
                <div className="resource-card primary">
                  <div className="resource-visual">
                    <div className="resource-icon">📖</div>
                    <div className="resource-badge">Official</div>
                  </div>
                  <div className="resource-content">
                    <h4>Google's PageSpeed Docs</h4>
                    <p>Comprehensive documentation directly from Google with setup guides, API reference, and troubleshooting tips.</p>
                  </div>
                  <button 
                    className="resource-action primary"
                    onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                  >
                    <span className="btn-icon">📖</span>
                    View Documentation
                  </button>
                </div>

                <div className="resource-card secondary">
                  <div className="resource-visual">
                    <div className="resource-icon">🔧</div>
                    <div className="resource-badge">Tools</div>
                  </div>
                  <div className="resource-content">
                    <h4>Google Cloud Console</h4>
                    <p>Monitor your API usage, check quotas, manage billing, and review your API key configuration.</p>
                  </div>
                  <button 
                    className="resource-action secondary"
                    onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                  >
                    <span className="btn-icon">⚙️</span>
                    Open Console
                  </button>
                </div>

                <div className="resource-card tertiary">
                  <div className="resource-visual">
                    <div className="resource-icon">🧪</div>
                    <div className="resource-badge">Test</div>
                  </div>
                  <div className="resource-content">
                    <h4>API Testing Tool</h4>
                    <p>Use Google's interactive testing tool to verify your API key and troubleshoot issues directly.</p>
                  </div>
                  <button 
                    className="resource-action tertiary"
                    onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started#APIKey', '_blank')}
                  >
                    <span className="btn-icon">🧪</span>
                    Test Your Key
                  </button>
                </div>
              </div>

              <div className="support-contact">
                <div className="contact-note">
                  <div className="note-icon">💡</div>
                  <div className="note-content">
                    <h5>Pro Tip</h5>
                    <p>Before reaching out for help, try the diagnostic tools above and check Google's official documentation. Most issues can be resolved in under 2 minutes!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="docs-cta-wide">
        <div className="cta-background"></div>
        <div className="cta-content">
          <div className="cta-text">
            <h3>Ready to Boost Your Website Performance?</h3>
            <p>Get your free PageSpeed API key and unlock advanced performance insights today.</p>
          </div>
          <div className="cta-actions">
            <button 
              className="cta-btn primary"
              onClick={() => window.location.hash = 'dashboard'}
            >
              <span className="btn-icon">⚙️</span>
              Configure in Dashboard
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
            >
              <span className="btn-icon">🔑</span>
              Get API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}