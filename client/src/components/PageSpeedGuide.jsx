import React from 'react';

export default function PageSpeedGuide({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📚 Google PageSpeed Insights API Guide</h2>
          <button 
            className="close-modal-btn"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body guide-content">
          {/* What is PageSpeed Insights API */}
          <section className="guide-section">
            <div className="section-icon">🚀</div>
            <div className="section-content">
              <h3>What is Google PageSpeed Insights API?</h3>
              <p>
                Google PageSpeed Insights API is a powerful tool that analyzes your website's performance 
                using the same technology that powers Google's Lighthouse. It provides detailed metrics 
                about how fast your website loads and offers specific recommendations for improvement.
              </p>
            </div>
          </section>

          {/* Why Use It */}
          <section className="guide-section">
            <div className="section-icon">💡</div>
            <div className="section-content">
              <h3>Why Should You Use It?</h3>
              <div className="benefits-list">
                <div className="benefit">
                  <strong>📊 Comprehensive Metrics:</strong> Get detailed performance scores, Core Web Vitals, and technical insights
                </div>
                <div className="benefit">
                  <strong>🎯 Actionable Insights:</strong> Receive specific recommendations for improving your website's speed
                </div>
                <div className="benefit">
                  <strong>🏆 Google Standards:</strong> Use the same metrics Google uses to rank websites in search results
                </div>
                <div className="benefit">
                  <strong>📈 Track Progress:</strong> Monitor improvements over time with consistent measurements
                </div>
              </div>
            </div>
          </section>

          {/* How to Get API Key */}
          <section className="guide-section">
            <div className="section-icon">🔑</div>
            <div className="section-content">
              <h3>How to Get Your API Key</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Go to Google Cloud Console</strong>
                    <p>Visit <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">console.cloud.google.com</a> and sign in with your Google account</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Create or Select a Project</strong>
                    <p>Create a new project or select an existing one from the project dropdown</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Enable the API</strong>
                    <p>Search for "PageSpeed Insights API" in the API Library and click "Enable"</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Create API Key</strong>
                    <p>Go to "Credentials" → "Create Credentials" → "API Key". Copy the generated key.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <strong>Secure Your Key</strong>
                    <p>Restrict your API key to only the PageSpeed Insights API for security</p>
                  </div>
                </div>
              </div>
              
              <div className="quick-link">
                <button 
                  className="primary-btn"
                  onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                >
                  📖 Open Google's Official Guide
                </button>
              </div>
            </div>
          </section>

          {/* Understanding Metrics */}
          <section className="guide-section">
            <div className="section-icon">📊</div>
            <div className="section-content">
              <h3>Understanding the Metrics</h3>
              
              <h4>Core Web Vitals</h4>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-name">Largest Contentful Paint (LCP)</div>
                  <div className="metric-desc">How quickly the main content loads</div>
                  <div className="metric-good">Good: ≤ 2.5 seconds</div>
                </div>
                <div className="metric">
                  <div className="metric-name">First Input Delay (FID)</div>
                  <div className="metric-desc">How quickly the page responds to user interactions</div>
                  <div className="metric-good">Good: ≤ 100 milliseconds</div>
                </div>
                <div className="metric">
                  <div className="metric-name">Cumulative Layout Shift (CLS)</div>
                  <div className="metric-desc">How stable the page layout is as it loads</div>
                  <div className="metric-good">Good: ≤ 0.1</div>
                </div>
              </div>

              <h4>Additional Performance Metrics</h4>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-name">First Contentful Paint (FCP)</div>
                  <div className="metric-desc">When the first content appears on screen</div>
                  <div className="metric-good">Good: ≤ 1.8 seconds</div>
                </div>
                <div className="metric">
                  <div className="metric-name">Speed Index</div>
                  <div className="metric-desc">How quickly content is visually displayed</div>
                  <div className="metric-good">Good: ≤ 3.4 seconds</div>
                </div>
                <div className="metric">
                  <div className="metric-name">Total Blocking Time (TBT)</div>
                  <div className="metric-desc">How long the page is blocked from responding</div>
                  <div className="metric-good">Good: ≤ 200 milliseconds</div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="guide-section">
            <div className="section-icon">⚙️</div>
            <div className="section-content">
              <h3>How It Works in This Tool</h3>
              <div className="workflow">
                <div className="workflow-step">
                  <div className="workflow-icon">1️⃣</div>
                  <div className="workflow-text">You configure your API key once in the dashboard</div>
                </div>
                <div className="workflow-arrow">→</div>
                <div className="workflow-step">
                  <div className="workflow-icon">2️⃣</div>
                  <div className="workflow-text">The tool automatically uses your key for all speed tests</div>
                </div>
                <div className="workflow-arrow">→</div>
                <div className="workflow-step">
                  <div className="workflow-icon">3️⃣</div>
                  <div className="workflow-text">You get detailed Lighthouse reports with actionable insights</div>
                </div>
              </div>
              
              <div className="security-note">
                <div className="note-icon">🔒</div>
                <div className="note-content">
                  <strong>Security:</strong> Your API key is encrypted and stored securely. 
                  Only you can access it, and it's never shared with third parties.
                </div>
              </div>
            </div>
          </section>

          {/* Common Issues */}
          <section className="guide-section">
            <div className="section-icon">⚠️</div>
            <div className="section-content">
              <h3>Common Issues & Solutions</h3>
              <div className="faq">
                <div className="faq-item">
                  <strong>Q: My API key isn't working</strong>
                  <p>A: Make sure you've enabled the PageSpeed Insights API in your Google Cloud Console and that your key isn't restricted to other domains.</p>
                </div>
                <div className="faq-item">
                  <strong>Q: I'm getting quota errors</strong>
                  <p>A: Google provides free quota for API usage. If you exceed it, you may need to set up billing or wait for the quota to reset.</p>
                </div>
                <div className="faq-item">
                  <strong>Q: The API key field won't accept my key</strong>
                  <p>A: Ensure your key starts with "AIza" and is around 40 characters long. Remove any extra spaces.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="modal-footer">
          <button 
            className="primary-btn"
            onClick={onClose}
          >
            Got it! Let's configure my API key
          </button>
        </div>
      </div>
    </div>
  );
}