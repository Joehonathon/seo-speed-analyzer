import React from 'react'

export default function SpeedOptimization({ onNavigateToSpeed }) {
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

  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginTop: '16px'
  }

  const metricCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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
        <h1 style={titleStyle}>⚡ Website Speed Optimization Guide</h1>
        <p style={subtitleStyle}>
          Master the art of website performance optimization to deliver lightning-fast user experiences, 
          improve search rankings, and boost conversions. This comprehensive guide covers modern speed 
          optimization techniques for 2025.
        </p>
      </div>

      {/* Core Web Vitals */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>📊</span>
          <h2 style={sectionTitleStyle}>Core Web Vitals Mastery</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🎯 Largest Contentful Paint (LCP)</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Target:</strong> LCP should occur within 2.5 seconds of when the page first starts loading.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Optimization Strategies:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Optimize your largest image or text block above the fold</li>
            <li style={listItemStyle}>Use faster hosting with good TTFB (Time to First Byte)</li>
            <li style={listItemStyle}>Remove render-blocking CSS and JavaScript</li>
            <li style={listItemStyle}>Implement resource hints (preload, prefetch)</li>
            <li style={listItemStyle}>Use efficient image formats (WebP, AVIF)</li>
          </ul>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Preload critical resources:</h4>
          <div style={codeBlockStyle}>
{`<link rel="preload" href="/hero-image.webp" as="image">
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/main-font.woff2" as="font" type="font/woff2" crossorigin>`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>⚡ Interaction to Next Paint (INP)</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Target:</strong> INP should be 200 milliseconds or less for optimal user experience.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Optimization Techniques:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Minimize main thread blocking tasks</li>
            <li style={listItemStyle}>Break up long JavaScript tasks into smaller chunks</li>
            <li style={listItemStyle}>Use web workers for heavy computations</li>
            <li style={listItemStyle}>Optimize event handlers and reduce DOM complexity</li>
            <li style={listItemStyle}>Implement code splitting and lazy loading</li>
          </ul>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📐 Cumulative Layout Shift (CLS)</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Target:</strong> CLS should be less than 0.1 to ensure visual stability.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Layout Stability Techniques:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Always include size attributes on images and videos</li>
            <li style={listItemStyle}>Reserve space for ads and dynamic content</li>
            <li style={listItemStyle}>Avoid inserting content above existing content</li>
            <li style={listItemStyle}>Use CSS aspect-ratio property for responsive media</li>
            <li style={listItemStyle}>Preload fonts to prevent font swap layout shifts</li>
          </ul>
          <div style={codeBlockStyle}>
{`/* Prevent layout shifts with aspect-ratio */
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}`}
          </div>
        </div>
      </div>

      {/* Image Optimization */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>🖼️</span>
          <h2 style={sectionTitleStyle}>Advanced Image Optimization</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🎨 Modern Image Formats</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Modern formats like WebP and AVIF provide 25-50% better compression than JPEG/PNG.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Format Selection Guide:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}><strong style={{color: '#10b981'}}>AVIF:</strong> Best compression, newest format (use with fallbacks)</li>
            <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>WebP:</strong> Excellent compression, wide support</li>
            <li style={listItemStyle}><strong style={{color: '#ef4444'}}>JPEG:</strong> Fallback for photos</li>
            <li style={listItemStyle}><strong style={{color: '#a78bfa'}}>PNG:</strong> Fallback for graphics with transparency</li>
          </ul>
          <div style={codeBlockStyle}>
{`<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero image" width="1200" height="600" loading="lazy">
</picture>`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📱 Responsive Images</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Serve appropriately sized images for different devices and screen densities.
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Use srcset for different resolutions and screen densities</li>
            <li style={listItemStyle}>Implement art direction with picture element</li>
            <li style={listItemStyle}>Generate multiple image sizes during build process</li>
            <li style={listItemStyle}>Use sizes attribute for optimal image selection</li>
          </ul>
        </div>
      </div>

      {/* JavaScript Optimization */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>⚙️</span>
          <h2 style={sectionTitleStyle}>JavaScript Performance</h2>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>📦 Code Splitting & Lazy Loading</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Load only the JavaScript needed for the current page, reducing initial bundle size.
          </p>
          <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 18px)'}}>Implementation Strategies:</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Split code by routes and components</li>
            <li style={listItemStyle}>Use dynamic imports for heavy libraries</li>
            <li style={listItemStyle}>Implement lazy loading for below-the-fold components</li>
            <li style={listItemStyle}>Preload critical route components</li>
          </ul>
          <div style={codeBlockStyle}>
{`// Route-based code splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Component lazy loading
const HeavyChart = lazy(() => 
  import('./HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);`}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>🔧 Bundle Optimization</h3>
          <p style={textStyle}>
            <strong style={{color: '#c084fc'}}>Why it matters:</strong> Smaller bundles load faster and improve parsing/execution time.
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Tree shaking to eliminate dead code</li>
            <li style={listItemStyle}>Minification and compression (Gzip/Brotli)</li>
            <li style={listItemStyle}>Replace large libraries with smaller alternatives</li>
            <li style={listItemStyle}>Use bundle analyzers to identify large dependencies</li>
          </ul>
        </div>
      </div>

      {/* Performance Tools */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>🛠️</span>
          <h2 style={sectionTitleStyle}>Performance Tools & Monitoring</h2>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>Google Tools (Free)</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>PageSpeed Insights:</strong> Core Web Vitals analysis</li>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>Lighthouse:</strong> Comprehensive performance audit</li>
              <li style={listItemStyle}><strong style={{color: '#10b981'}}>Chrome DevTools:</strong> Real-time performance profiling</li>
            </ul>
          </div>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>Advanced Tools</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>WebPageTest:</strong> Detailed performance testing</li>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>GTmetrix:</strong> Performance monitoring and alerts</li>
              <li style={listItemStyle}><strong style={{color: '#f59e0b'}}>SpeedCurve:</strong> Continuous performance monitoring</li>
            </ul>
          </div>
        </div>

        {/* Key Metrics */}
        <h3 style={{...cardTitleStyle, marginTop: '24px'}}>📊 Key Metrics to Track</h3>
        <div style={metricsGridStyle}>
          <div style={metricCardStyle}>
            <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 16px)', marginBottom: '8px'}}>🚀 Speed Metrics</h4>
            <ul style={{...listStyle, paddingLeft: '16px', marginBottom: 0}}>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Time to First Byte (TTFB) &lt; 200ms</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>First Contentful Paint (FCP) &lt; 1.8s</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Largest Contentful Paint (LCP) &lt; 2.5s</li>
            </ul>
          </div>
          <div style={metricCardStyle}>
            <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 16px)', marginBottom: '8px'}}>⚡ Interactivity</h4>
            <ul style={{...listStyle, paddingLeft: '16px', marginBottom: 0}}>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Interaction to Next Paint (INP) &lt; 200ms</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Total Blocking Time (TBT) &lt; 200ms</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Time to Interactive (TTI) &lt; 3.8s</li>
            </ul>
          </div>
          <div style={metricCardStyle}>
            <h4 style={{...cardTitleStyle, fontSize: 'clamp(14px, 3vw, 16px)', marginBottom: '8px'}}>🎯 Stability</h4>
            <ul style={{...listStyle, paddingLeft: '16px', marginBottom: 0}}>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Cumulative Layout Shift (CLS) &lt; 0.1</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Visual completeness at 85%+</li>
              <li style={{...listItemStyle, fontSize: 'clamp(12px, 2.5vw, 14px)'}}>Resource loading efficiency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Budget */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={iconStyle}>🎯</span>
          <h2 style={sectionTitleStyle}>Performance Budget & Checklist</h2>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>📦 Resource Budgets</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ Total page weight &lt; 1.5MB</li>
              <li style={listItemStyle}>✓ JavaScript bundle &lt; 500KB</li>
              <li style={listItemStyle}>✓ CSS files &lt; 100KB</li>
              <li style={listItemStyle}>✓ Images optimized and &lt; 500KB total</li>
              <li style={listItemStyle}>✓ Fonts &lt; 100KB total</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>⏱️ Timing Budgets</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ TTFB under 200ms</li>
              <li style={listItemStyle}>✓ LCP under 2.5 seconds</li>
              <li style={listItemStyle}>✓ INP under 200ms</li>
              <li style={listItemStyle}>✓ CLS under 0.1</li>
              <li style={listItemStyle}>✓ Page fully loaded under 5 seconds</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h4 style={cardTitleStyle}>🔧 Technical Optimizations</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>✓ Enable Gzip/Brotli compression</li>
              <li style={listItemStyle}>✓ Implement HTTP/2 or HTTP/3</li>
              <li style={listItemStyle}>✓ Use modern image formats (WebP/AVIF)</li>
              <li style={listItemStyle}>✓ Minify HTML, CSS, and JavaScript</li>
              <li style={listItemStyle}>✓ Eliminate render-blocking resources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={ctaStyle}>
        <div style={ctaOverlayStyle}></div>
        <h3 style={ctaTitleStyle}>🚀 Ready to Test Your Website Speed?</h3>
        <p style={{...textStyle, color: 'white', marginBottom: 0, position: 'relative', zIndex: 1}}>
          Use our free speed analyzer to measure your website's performance and get detailed optimization recommendations.
        </p>
        <button 
          style={ctaButtonStyle}
          onClick={() => {
            onNavigateToSpeed()
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
          Test My Website Speed
        </button>
      </div>
    </div>
  )
}