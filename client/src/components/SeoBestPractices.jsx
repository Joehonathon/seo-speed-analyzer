import React from 'react'

export default function SeoBestPractices({ onNavigateToSEO }) {
  const containerStyle = {
    maxWidth: '100%',
    width: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    backgroundColor: '#0f0f23', // --bg
    minHeight: '100vh'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '0 8px'
  }

  const titleStyle = {
    fontSize: 'clamp(24px, 5vw, 36px)',
    fontWeight: 'bold',
    color: '#8b5cf6', // --brand
    marginBottom: '16px',
    lineHeight: '1.2'
  }

  const subtitleStyle = {
    fontSize: 'clamp(14px, 3vw, 18px)',
    color: '#94a3b8', // --text-muted
    lineHeight: '1.5',
    maxWidth: '600px',
    margin: '0 auto'
  }

  const sectionStyle = {
    marginBottom: '40px',
    backgroundColor: '#1a1a2e', // --bg-card
    borderRadius: '12px',
    padding: '24px 16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    border: '1px solid rgba(139, 92, 246, 0.2)' // --card-border
  }

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  }

  const iconStyle = {
    fontSize: 'clamp(20px, 4vw, 28px)',
    marginRight: '12px'
  }

  const sectionTitleStyle = {
    fontSize: 'clamp(18px, 4vw, 24px)',
    fontWeight: 'bold',
    color: '#e2e8f0', // --text
    margin: 0,
    lineHeight: '1.3'
  }

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // --glass-bg
    borderRadius: '8px',
    padding: '20px 16px',
    marginBottom: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)', // --glass-border
    backdropFilter: 'blur(10px)'
  }

  const cardTitleStyle = {
    fontSize: 'clamp(16px, 3.5vw, 20px)',
    fontWeight: '600',
    color: '#a78bfa', // --brand-light
    marginBottom: '12px',
    lineHeight: '1.3'
  }

  const textStyle = {
    fontSize: 'clamp(14px, 3vw, 16px)',
    lineHeight: '1.6',
    color: '#e2e8f0', // --text
    marginBottom: '16px'
  }

  const listStyle = {
    paddingLeft: '20px',
    marginBottom: '16px'
  }

  const listItemStyle = {
    fontSize: 'clamp(14px, 3vw, 16px)',
    lineHeight: '1.5',
    marginBottom: '8px',
    color: '#94a3b8' // --text-muted
  }

  const codeBlockStyle = {
    backgroundColor: '#0f0f23', // --bg (darker than card)
    color: '#e2e8f0', // --text
    borderRadius: '6px',
    padding: '16px 12px',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    overflow: 'auto',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    border: '1px solid rgba(139, 92, 246, 0.3)' // purple border
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  }

  const ctaStyle = {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6366f1 100%)', // brand gradient
    color: 'white',
    borderRadius: '12px',
    padding: '32px 20px',
    marginTop: '40px',
    position: 'relative',
    overflow: 'hidden'
  }

  const ctaOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none'
  }

  const ctaTitleStyle = {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 'bold',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1
  }

  const ctaButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>🚀 SEO Best Practices Guide</h1>
        <p style={subtitleStyle}>
          Master the fundamentals of Search Engine Optimization to improve your website's visibility, 
          rankings, and organic traffic. This comprehensive guide covers essential SEO techniques 
          that work in 2025.
        </p>
      </div>

      {/* Technical SEO */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>⚙️</span>
          <h2 style={sectionTitleStyle}>Technical SEO Fundamentals</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🔒 HTTPS & Security</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> HTTPS is a confirmed Google ranking factor and builds user trust.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Implementation:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Install an SSL certificate from your hosting provider</li>
            <li style={listItemStyle}>Redirect all HTTP traffic to HTTPS using 301 redirects</li>
            <li style={listItemStyle}>Update internal links to use HTTPS URLs</li>
            <li style={listItemStyle}>Add security headers (HSTS, CSP, X-Frame-Options)</li>
          </ul>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Example HTTPS redirect (.htaccess):</h4>
          <div style={codeBlockStyle}>
{`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📱 Mobile Optimization</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Google uses mobile-first indexing, making mobile optimization crucial.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Essential Elements:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Responsive design that adapts to all screen sizes</li>
            <li style={listItemStyle}>Fast loading times on mobile devices</li>
            <li style={listItemStyle}>Touch-friendly navigation and buttons</li>
            <li style={listItemStyle}>Readable text without zooming</li>
          </ul>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Viewport meta tag:</h4>
          <div style={codeBlockStyle}>
{`<meta name="viewport" content="width=device-width, initial-scale=1">`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>⚡ Page Speed Optimization</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Page speed is a ranking factor and directly impacts user experience.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Core Web Vitals to Monitor:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}><strong style={{color: '#10b981'}}>LCP (Largest Contentful Paint):</strong> Should be under 2.5 seconds</li>
            <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>FID (First Input Delay):</strong> Should be under 100 milliseconds</li>
            <li style={listItemStyle}><strong style={{color: '#ef4444'}}>CLS (Cumulative Layout Shift):</strong> Should be under 0.1</li>
          </ul>
        </div>
      </div>

      {/* On-Page SEO */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>📝</span>
          <h2 style={sectionTitleStyle}>On-Page SEO Essentials</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🏷️ Title Tags</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Title tags are one of the most important on-page SEO factors.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Best Practices:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Keep titles between 50-60 characters</li>
            <li style={listItemStyle}>Include your primary keyword near the beginning</li>
            <li style={listItemStyle}>Make each title unique across your site</li>
            <li style={listItemStyle}>Write compelling titles that encourage clicks</li>
          </ul>
          <div style={codeBlockStyle}>
{`<title>Best SEO Tools 2025 | Ultimate Guide | YourBrand</title>`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📄 Meta Descriptions</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> While not a direct ranking factor, meta descriptions impact click-through rates.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Guidelines:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Keep descriptions between 150-160 characters</li>
            <li style={listItemStyle}>Include your target keywords naturally</li>
            <li style={listItemStyle}>Write compelling copy that encourages clicks</li>
          </ul>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🖼️ Image Optimization</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Optimized images improve page speed and provide accessibility benefits.
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Add descriptive alt text to all images</li>
            <li style={listItemStyle}>Use descriptive file names with keywords</li>
            <li style={listItemStyle}>Compress images to reduce file size</li>
            <li style={listItemStyle}>Use modern formats like WebP when possible</li>
          </ul>
        </div>
      </div>

      {/* Content Strategy */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>📚</span>
          <h2 style={sectionTitleStyle}>Content Strategy</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🎯 Keyword Research</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Proper keyword research ensures you're targeting terms your audience actually searches for.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Process:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Start with seed keywords related to your business</li>
            <li style={listItemStyle}>Use tools like Google Keyword Planner, Ahrefs, or SEMrush</li>
            <li style={listItemStyle}>Target long-tail keywords for easier ranking</li>
            <li style={listItemStyle}>Analyze search intent (informational, navigational, transactional)</li>
          </ul>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>✍️ High-Quality Content</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Google prioritizes high-quality, helpful content that satisfies user intent.
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Create comprehensive, in-depth content (typically 1,000+ words)</li>
            <li style={listItemStyle}>Focus on user intent and providing value</li>
            <li style={listItemStyle}>Use clear, well-structured formatting</li>
            <li style={listItemStyle}>Write for humans first, search engines second</li>
          </ul>
        </div>
      </div>

      {/* SEO Tools */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>🛠️</span>
          <h2 style={sectionTitleStyle}>Essential SEO Tools</h2>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>Google Tools (Free)</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>Google Search Console:</strong> Monitor search performance</li>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>Google Analytics:</strong> Track website traffic</li>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>PageSpeed Insights:</strong> Analyze page speed</li>
            </ul>
          </div>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>Other Free Tools</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>Screaming Frog:</strong> Technical SEO auditing</li>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>Yoast SEO:</strong> WordPress SEO plugin</li>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>Google Trends:</strong> Keyword trend analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Checklist */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>✅</span>
          <h2 style={sectionTitleStyle}>Quick Action Checklist</h2>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>Today</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ Install Google Search Console</li>
              <li style={listItemStyle}>✓ Set up Google Analytics</li>
              <li style={listItemStyle}>✓ Verify HTTPS is working</li>
              <li style={listItemStyle}>✓ Test page speed</li>
            </ul>
          </div>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>This Week</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ Optimize title tags</li>
              <li style={listItemStyle}>✓ Add alt text to images</li>
              <li style={listItemStyle}>✓ Create XML sitemap</li>
              <li style={listItemStyle}>✓ Audit internal linking</li>
            </ul>
          </div>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>This Month</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ Conduct keyword research</li>
              <li style={listItemStyle}>✓ Create content strategy</li>
              <li style={listItemStyle}>✓ Optimize existing content</li>
              <li style={listItemStyle}>✓ Monitor progress</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={ctaStyle}>
        <div style={ctaOverlayStyle}></div>
        <h3 style={ctaTitleStyle}>🚀 Ready to Optimize Your Website?</h3>
        <p style={{...textStyle, color: 'white', marginBottom: 0, position: 'relative', zIndex: 1}}>
          Use our free SEO analyzer to identify issues and opportunities on your website.
        </p>
        <button 
          style={ctaButtonStyle}
          onClick={() => {
            onNavigateToSEO()
            window.scrollTo(0, 0)
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          Analyze My Website Now
        </button>
      </div>
    </div>
  )
}