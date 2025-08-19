import React from 'react'

export default function SpeedOptimization({ onNavigateToSpeed }) {
  return (
    <section className="card">
      <div className="speed-guide-header">
        <h1>⚡ Website Speed Optimization Guide</h1>
        <p className="guide-intro">
          Master the art of website performance optimization to deliver lightning-fast user experiences, 
          improve search rankings, and boost conversions. This comprehensive guide covers modern speed 
          optimization techniques for 2025.
        </p>
      </div>

      <div className="speed-guide-content">
        {/* Core Web Vitals Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h2>Core Web Vitals Mastery</h2>
          </div>
          
          <div className="best-practice">
            <h3>🎯 Largest Contentful Paint (LCP)</h3>
            <div className="practice-content">
              <p><strong>Target:</strong> LCP should occur within 2.5 seconds of when the page first starts loading.</p>
              <div className="practice-steps">
                <h4>Optimization Strategies:</h4>
                <ul>
                  <li>Optimize your largest image or text block above the fold</li>
                  <li>Use faster hosting with good TTFB (Time to First Byte)</li>
                  <li>Remove render-blocking CSS and JavaScript</li>
                  <li>Implement resource hints (preload, prefetch)</li>
                  <li>Use efficient image formats (WebP, AVIF)</li>
                  <li>Optimize CSS delivery with critical CSS inlining</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Preload critical resources:</h4>
                <pre><code>{`<link rel="preload" href="/hero-image.webp" as="image">
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/main-font.woff2" as="font" type="font/woff2" crossorigin>`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>⚡ Interaction to Next Paint (INP)</h3>
            <div className="practice-content">
              <p><strong>Target:</strong> INP should be 200 milliseconds or less for optimal user experience.</p>
              <div className="practice-steps">
                <h4>Optimization Techniques:</h4>
                <ul>
                  <li>Minimize main thread blocking tasks</li>
                  <li>Break up long JavaScript tasks into smaller chunks</li>
                  <li>Use web workers for heavy computations</li>
                  <li>Optimize event handlers and reduce DOM complexity</li>
                  <li>Implement code splitting and lazy loading</li>
                  <li>Defer non-critical JavaScript execution</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Task scheduling example:</h4>
                <pre><code>{`// Break up long tasks
function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

async function processLargeDataset(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);
    
    // Yield to main thread every 50 items
    if (i % 50 === 0) {
      await yieldToMain();
    }
  }
}`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📐 Cumulative Layout Shift (CLS)</h3>
            <div className="practice-content">
              <p><strong>Target:</strong> CLS should be less than 0.1 to ensure visual stability.</p>
              <div className="practice-steps">
                <h4>Layout Stability Techniques:</h4>
                <ul>
                  <li>Always include size attributes on images and videos</li>
                  <li>Reserve space for ads and dynamic content</li>
                  <li>Avoid inserting content above existing content</li>
                  <li>Use CSS aspect-ratio property for responsive media</li>
                  <li>Preload fonts to prevent font swap layout shifts</li>
                  <li>Use transform and opacity for animations</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Prevent layout shifts with aspect-ratio:</h4>
                <pre><code>{`/* CSS */
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* HTML */
<div class="image-container">
  <img src="hero.webp" alt="Hero image" width="1600" height="900">
</div>`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Image Optimization Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">🖼️</span>
            <h2>Advanced Image Optimization</h2>
          </div>

          <div className="best-practice">
            <h3>🎨 Modern Image Formats</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Modern formats like WebP and AVIF provide 25-50% better compression than JPEG/PNG.</p>
              <div className="practice-steps">
                <h4>Format Selection Guide:</h4>
                <ul>
                  <li><strong>AVIF:</strong> Best compression, newest format (use with fallbacks)</li>
                  <li><strong>WebP:</strong> Excellent compression, wide support</li>
                  <li><strong>JPEG XL:</strong> Emerging format with superior quality</li>
                  <li><strong>JPEG:</strong> Fallback for photos</li>
                  <li><strong>PNG:</strong> Fallback for graphics with transparency</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Progressive enhancement with picture element:</h4>
                <pre><code>{`<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero image" width="1200" height="600" loading="lazy">
</picture>`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📱 Responsive Images</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Serve appropriately sized images for different devices and screen densities.</p>
              <div className="practice-steps">
                <h4>Responsive Image Strategies:</h4>
                <ul>
                  <li>Use srcset for different resolutions and screen densities</li>
                  <li>Implement art direction with picture element</li>
                  <li>Generate multiple image sizes during build process</li>
                  <li>Use sizes attribute for optimal image selection</li>
                  <li>Consider container queries for future-proofing</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Responsive image with srcset:</h4>
                <pre><code>{`<img 
  src="hero-800w.webp" 
  srcset="hero-400w.webp 400w,
          hero-800w.webp 800w,
          hero-1200w.webp 1200w,
          hero-1600w.webp 1600w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         800px"
  alt="Hero image"
  width="800"
  height="400"
  loading="lazy"
>`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* JavaScript Optimization Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">⚙️</span>
            <h2>JavaScript Performance Optimization</h2>
          </div>

          <div className="best-practice">
            <h3>📦 Code Splitting & Lazy Loading</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Load only the JavaScript needed for the current page, reducing initial bundle size.</p>
              <div className="practice-steps">
                <h4>Implementation Strategies:</h4>
                <ul>
                  <li>Split code by routes and components</li>
                  <li>Use dynamic imports for heavy libraries</li>
                  <li>Implement lazy loading for below-the-fold components</li>
                  <li>Preload critical route components</li>
                  <li>Use service workers for intelligent caching</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Dynamic imports in React:</h4>
                <pre><code>{`// Route-based code splitting
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

// Component lazy loading
const HeavyChart = lazy(() => 
  import('./HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);

// Conditional loading
const loadAnalytics = async () => {
  if (shouldLoadAnalytics) {
    const { analytics } = await import('./analytics');
    analytics.init();
  }
};`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>🔧 Bundle Optimization</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Smaller bundles load faster and improve parsing/execution time.</p>
              <div className="optimization-tips">
                <h4>Bundle Size Reduction Techniques:</h4>
                <ul>
                  <li>Tree shaking to eliminate dead code</li>
                  <li>Minification and compression (Gzip/Brotli)</li>
                  <li>Replace large libraries with smaller alternatives</li>
                  <li>Use bundle analyzers to identify large dependencies</li>
                  <li>Implement proper module federation for micro-frontends</li>
                  <li>Consider native ESM for modern browsers</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Webpack optimization example:</h4>
                <pre><code>{`// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    },
    usedExports: true,
    sideEffects: false
  }
};`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Optimization Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">🎨</span>
            <h2>CSS Performance Optimization</h2>
          </div>

          <div className="best-practice">
            <h3>🚀 Critical CSS Strategy</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Inline critical CSS to eliminate render-blocking and improve perceived performance.</p>
              <div className="practice-steps">
                <h4>Critical CSS Implementation:</h4>
                <ul>
                  <li>Identify above-the-fold styles using tools like Critical or Penthouse</li>
                  <li>Inline critical CSS in the HTML head</li>
                  <li>Load non-critical CSS asynchronously</li>
                  <li>Use media queries to prioritize CSS loading</li>
                  <li>Implement CSS containment for complex layouts</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Async CSS loading:</h4>
                <pre><code>{`<!-- Inline critical CSS -->
<style>
  /* Critical above-the-fold styles */
  .header { /* styles */ }
  .hero { /* styles */ }
</style>

<!-- Async load non-critical CSS -->
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/styles.css"></noscript>

<!-- Or use media query trick -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>⚡ CSS Architecture</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Well-structured CSS reduces file size and improves rendering performance.</p>
              <div className="practice-steps">
                <h4>Performance-Focused CSS:</h4>
                <ul>
                  <li>Use efficient selectors (avoid deep nesting)</li>
                  <li>Minimize reflows and repaints</li>
                  <li>Prefer CSS custom properties for theming</li>
                  <li>Use CSS containment and content-visibility</li>
                  <li>Optimize font loading and rendering</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>CSS containment for performance:</h4>
                <pre><code>{`/* CSS Containment */
.card {
  contain: layout style paint;
}

/* Content visibility for large lists */
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}

/* Efficient font loading */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Caching & CDN Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">🌐</span>
            <h2>Caching & Content Delivery</h2>
          </div>

          <div className="best-practice">
            <h3>🏎️ Browser Caching Strategy</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Proper caching eliminates redundant downloads and dramatically improves return visit performance.</p>
              <div className="practice-steps">
                <h4>Caching Best Practices:</h4>
                <ul>
                  <li>Use immutable assets with versioned filenames</li>
                  <li>Implement proper cache headers (Cache-Control, ETag)</li>
                  <li>Set up service worker caching strategies</li>
                  <li>Use stale-while-revalidate for API responses</li>
                  <li>Implement intelligent cache invalidation</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Cache headers configuration:</h4>
                <pre><code>{`# .htaccess or server config
# Static assets (1 year)
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML (short-term with revalidation)
<FilesMatch "\\.html$">
  Header set Cache-Control "public, max-age=3600, must-revalidate"
</FilesMatch>

# Service Worker
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>🌍 CDN Implementation</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> CDNs reduce latency by serving content from geographically closer servers.</p>
              <div className="practice-steps">
                <h4>CDN Optimization:</h4>
                <ul>
                  <li>Choose a CDN with global edge locations</li>
                  <li>Optimize for your target audience geography</li>
                  <li>Use HTTP/3 and QUIC protocol support</li>
                  <li>Implement intelligent routing and failover</li>
                  <li>Monitor CDN performance and cache hit rates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Monitoring Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">📈</span>
            <h2>Performance Monitoring & Tools</h2>
          </div>

          <div className="best-practice">
            <h3>🔍 Essential Performance Tools</h3>
            <div className="practice-content">
              <div className="tools-grid">
                <div className="tool-category">
                  <h4>Google Tools (Free)</h4>
                  <ul>
                    <li><strong>PageSpeed Insights:</strong> Core Web Vitals analysis</li>
                    <li><strong>Lighthouse:</strong> Comprehensive performance audit</li>
                    <li><strong>Chrome DevTools:</strong> Real-time performance profiling</li>
                    <li><strong>Web Vitals Extension:</strong> Live Core Web Vitals monitoring</li>
                  </ul>
                </div>
                <div className="tool-category">
                  <h4>Advanced Tools</h4>
                  <ul>
                    <li><strong>WebPageTest:</strong> Detailed performance testing</li>
                    <li><strong>GTmetrix:</strong> Performance monitoring and alerts</li>
                    <li><strong>Pingdom:</strong> Uptime and speed monitoring</li>
                    <li><strong>SpeedCurve:</strong> Continuous performance monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📊 Key Metrics to Track</h3>
            <div className="practice-content">
              <div className="metrics-breakdown">
                <div className="metric-item">
                  <h4>🚀 Speed Metrics</h4>
                  <ul>
                    <li>Time to First Byte (TTFB) &lt; 200ms</li>
                    <li>First Contentful Paint (FCP) &lt; 1.8s</li>
                    <li>Largest Contentful Paint (LCP) &lt; 2.5s</li>
                    <li>Speed Index &lt; 3.4s</li>
                  </ul>
                </div>
                <div className="metric-item">
                  <h4>⚡ Interactivity</h4>
                  <ul>
                    <li>Interaction to Next Paint (INP) &lt; 200ms</li>
                    <li>Total Blocking Time (TBT) &lt; 200ms</li>
                    <li>Time to Interactive (TTI) &lt; 3.8s</li>
                  </ul>
                </div>
                <div className="metric-item">
                  <h4>🎯 Stability</h4>
                  <ul>
                    <li>Cumulative Layout Shift (CLS) &lt; 0.1</li>
                    <li>Visual completeness at 85%+</li>
                    <li>Resource loading efficiency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Budget Section */}
        <div className="guide-section action-section">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h2>Performance Budget & Optimization Checklist</h2>
          </div>
          
          <div className="budget-grid">
            <div className="budget-category">
              <h4>📦 Resource Budgets</h4>
              <ul className="action-checklist">
                <li>Total page weight &lt; 1.5MB</li>
                <li>JavaScript bundle &lt; 500KB</li>
                <li>CSS files &lt; 100KB</li>
                <li>Images optimized and &lt; 500KB total</li>
                <li>Fonts &lt; 100KB total</li>
              </ul>
            </div>
            
            <div className="budget-category">
              <h4>⏱️ Timing Budgets</h4>
              <ul className="action-checklist">
                <li>TTFB under 200ms</li>
                <li>LCP under 2.5 seconds</li>
                <li>INP under 200ms</li>
                <li>CLS under 0.1</li>
                <li>Page fully loaded under 5 seconds</li>
              </ul>
            </div>
            
            <div className="budget-category">
              <h4>🔧 Technical Optimizations</h4>
              <ul className="action-checklist">
                <li>Enable Gzip/Brotli compression</li>
                <li>Implement HTTP/2 or HTTP/3</li>
                <li>Use modern image formats (WebP/AVIF)</li>
                <li>Minify HTML, CSS, and JavaScript</li>
                <li>Eliminate render-blocking resources</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="guide-cta">
          <div className="cta-content">
            <h3>🚀 Ready to Test Your Website Speed?</h3>
            <p>Use our free speed analyzer to measure your website's performance and get detailed optimization recommendations.</p>
            <button 
              className="cta-button"
              onClick={() => {
                onNavigateToSpeed()
                window.scrollTo(0, 0)
              }}
            >
              Test My Website Speed
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}