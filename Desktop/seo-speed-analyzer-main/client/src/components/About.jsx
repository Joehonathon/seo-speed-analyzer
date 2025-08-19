import React from 'react'

export default function About({ onNavigateToSEO }) {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Website Scanner</h1>
          <p className="hero-subtitle">Your comprehensive SEO and performance optimization toolkit</p>
        </div>
      </section>

      <div className="about-content">
        <section className="about-section">
          <div className="section-header">
            <div className="section-icon">🎯</div>
            <h2>Our Mission</h2>
          </div>
          <p>
            Website Scanner is a powerful SEO analysis tool designed specifically for web designers, developers, 
            and digital marketers who want to optimize their websites for search engines and improve site performance. 
            Our mission is to make professional-grade SEO analysis accessible to everyone, regardless of technical expertise.
          </p>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-icon">⚡</div>
            <h2>What We Do</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>SEO Analysis</h3>
              <p>
                Get comprehensive SEO scores based on industry best practices. Our analyzer examines over 20+ 
                critical SEO factors including meta tags, content structure, image optimization, and technical SEO elements.
              </p>
            </div>
            <div className="feature-card">
              <h3>Performance Testing</h3>
              <p>
                Measure your website's loading speed and performance metrics. Identify bottlenecks and get 
                actionable recommendations to improve your site's user experience and search engine rankings.
              </p>
            </div>
            <div className="feature-card">
              <h3>Actionable Insights</h3>
              <p>
                Receive detailed reports with priority fixes and step-by-step instructions. Our tool doesn't 
                just identify problems—it tells you exactly how to fix them.
              </p>
            </div>
            <div className="feature-card">
              <h3>Multiple Export Formats</h3>
              <p>
                Download your analysis results in various formats including TXT, JSON, and CSV. Perfect for 
                client reports, documentation, or further analysis.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-icon">🚀</div>
            <h2>Why Choose Website Scanner?</h2>
          </div>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <div className="benefit-content">
                <h4>Professional Results</h4>
                <p>Get the same quality analysis that professional SEO agencies use, without the cost.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <div className="benefit-content">
                <h4>Lightning Fast</h4>
                <p>Analyze any website in seconds, not minutes. Our optimized scanning engine delivers results quickly.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <div className="benefit-content">
                <h4>Comprehensive Reports</h4>
                <p>Detailed analysis covering technical SEO, content optimization, and performance metrics.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔧</div>
              <div className="benefit-content">
                <h4>Easy to Understand</h4>
                <p>No technical jargon. Clear explanations and step-by-step fixes that anyone can implement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-icon">👥</div>
            <h2>Who It's For</h2>
          </div>
          <div className="audience-grid">
            <div className="audience-card">
              <h3>Web Designers</h3>
              <p>Ensure your designs are SEO-friendly from the start. Validate that your creative vision doesn't compromise search engine visibility.</p>
            </div>
            <div className="audience-card">
              <h3>Developers</h3>
              <p>Integrate SEO best practices into your development workflow. Catch technical SEO issues before they go live.</p>
            </div>
            <div className="audience-card">
              <h3>Digital Marketers</h3>
              <p>Monitor and optimize your campaigns with detailed SEO analysis. Track improvements and demonstrate ROI to clients.</p>
            </div>
            <div className="audience-card">
              <h3>Small Business Owners</h3>
              <p>Take control of your website's SEO without hiring expensive consultants. Get professional insights at no cost.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-icon">🛠️</div>
            <h2>How It Works</h2>
          </div>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Enter Your URL</h4>
                <p>Simply paste your website URL into our analyzer tool.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>AI-Powered Analysis</h4>
                <p>Our advanced algorithms scan your site's HTML, content, and technical elements.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Get Your Score</h4>
                <p>Receive a comprehensive SEO score with detailed breakdown and recommendations.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Implement Fixes</h4>
                <p>Follow our step-by-step guidance to improve your SEO and site performance.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <div className="cta-content">
            <h2>Ready to Optimize Your Website?</h2>
            <p>Join thousands of web professionals who trust Website Scanner for their SEO analysis needs.</p>
            <button className="cta-button" onClick={() => onNavigateToSEO && onNavigateToSEO()}>
              Start Your Free Analysis
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}