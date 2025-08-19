import React from 'react'

export default function SeoBestPractices({ onNavigateToSEO }) {
  return (
    <section className="card">
      <div className="seo-guide-header">
        <h1>🚀 SEO Best Practices Guide</h1>
        <p className="guide-intro">
          Master the fundamentals of Search Engine Optimization to improve your website's visibility, 
          rankings, and organic traffic. This comprehensive guide covers essential SEO techniques 
          that work in 2025.
        </p>
      </div>

      <div className="seo-guide-content">
        {/* Technical SEO Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">⚙️</span>
            <h2>Technical SEO Fundamentals</h2>
          </div>
          
          <div className="best-practice">
            <h3>🔒 HTTPS & Security</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> HTTPS is a confirmed Google ranking factor and builds user trust.</p>
              <div className="practice-steps">
                <h4>Implementation:</h4>
                <ul>
                  <li>Install an SSL certificate from your hosting provider</li>
                  <li>Redirect all HTTP traffic to HTTPS using 301 redirects</li>
                  <li>Update internal links to use HTTPS URLs</li>
                  <li>Add security headers (HSTS, CSP, X-Frame-Options)</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example HTTPS redirect (.htaccess):</h4>
                <pre><code>{`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📱 Mobile Optimization</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Google uses mobile-first indexing, making mobile optimization crucial.</p>
              <div className="practice-steps">
                <h4>Essential Elements:</h4>
                <ul>
                  <li>Responsive design that adapts to all screen sizes</li>
                  <li>Fast loading times on mobile devices</li>
                  <li>Touch-friendly navigation and buttons</li>
                  <li>Readable text without zooming</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Viewport meta tag:</h4>
                <pre><code>{`<meta name="viewport" content="width=device-width, initial-scale=1">`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>⚡ Page Speed Optimization</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Page speed is a ranking factor and directly impacts user experience.</p>
              <div className="practice-steps">
                <h4>Core Web Vitals to Monitor:</h4>
                <ul>
                  <li><strong>LCP (Largest Contentful Paint):</strong> Should be under 2.5 seconds</li>
                  <li><strong>FID (First Input Delay):</strong> Should be under 100 milliseconds</li>
                  <li><strong>CLS (Cumulative Layout Shift):</strong> Should be under 0.1</li>
                </ul>
              </div>
              <div className="optimization-tips">
                <h4>Speed Optimization Techniques:</h4>
                <ul>
                  <li>Optimize and compress images (use WebP format)</li>
                  <li>Minify CSS, JavaScript, and HTML</li>
                  <li>Enable browser caching</li>
                  <li>Use a Content Delivery Network (CDN)</li>
                  <li>Implement lazy loading for images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* On-Page SEO Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">📝</span>
            <h2>On-Page SEO Essentials</h2>
          </div>

          <div className="best-practice">
            <h3>🏷️ Title Tags</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Title tags are one of the most important on-page SEO factors.</p>
              <div className="practice-steps">
                <h4>Best Practices:</h4>
                <ul>
                  <li>Keep titles between 50-60 characters</li>
                  <li>Include your primary keyword near the beginning</li>
                  <li>Make each title unique across your site</li>
                  <li>Write compelling titles that encourage clicks</li>
                  <li>Include your brand name at the end</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example title tag:</h4>
                <pre><code>{`<title>Best SEO Tools 2025 | Ultimate Guide | YourBrand</title>`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📄 Meta Descriptions</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> While not a direct ranking factor, meta descriptions impact click-through rates.</p>
              <div className="practice-steps">
                <h4>Optimization Guidelines:</h4>
                <ul>
                  <li>Keep descriptions between 150-160 characters</li>
                  <li>Include your target keywords naturally</li>
                  <li>Write compelling copy that encourages clicks</li>
                  <li>Include a clear call-to-action</li>
                  <li>Make each description unique</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example meta description:</h4>
                <pre><code>{`<meta name="description" content="Discover the best SEO tools for 2025. Our comprehensive guide covers free and premium tools to boost your search rankings. Start optimizing today!">`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>🏗️ Header Structure (H1-H6)</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Proper header hierarchy helps search engines understand your content structure.</p>
              <div className="practice-steps">
                <h4>Header Best Practices:</h4>
                <ul>
                  <li>Use exactly one H1 tag per page</li>
                  <li>Include your primary keyword in the H1</li>
                  <li>Use H2-H6 tags in logical hierarchy</li>
                  <li>Don't skip heading levels (H1 → H3 without H2)</li>
                  <li>Keep headers descriptive and concise</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example header structure:</h4>
                <pre><code>{`<h1>Ultimate SEO Guide for 2025</h1>
<h2>Technical SEO</h2>
<h3>Page Speed Optimization</h3>
<h3>Mobile Optimization</h3>
<h2>On-Page SEO</h2>
<h3>Keyword Research</h3>
<h3>Content Optimization</h3>`}</code></pre>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>🖼️ Image Optimization</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Optimized images improve page speed and provide accessibility benefits.</p>
              <div className="practice-steps">
                <h4>Image SEO Checklist:</h4>
                <ul>
                  <li>Add descriptive alt text to all images</li>
                  <li>Use descriptive file names with keywords</li>
                  <li>Compress images to reduce file size</li>
                  <li>Use modern formats like WebP when possible</li>
                  <li>Implement lazy loading for below-the-fold images</li>
                  <li>Include images in your XML sitemap</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example optimized image tag:</h4>
                <pre><code>{`<img src="seo-tools-guide-2025.webp" 
     alt="Best SEO tools and software for 2025 digital marketing"
     width="800" 
     height="400"
     loading="lazy">`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Content Strategy Section */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">📚</span>
            <h2>Content Strategy & Optimization</h2>
          </div>

          <div className="best-practice">
            <h3>🎯 Keyword Research & Strategy</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Proper keyword research ensures you're targeting terms your audience actually searches for.</p>
              <div className="practice-steps">
                <h4>Keyword Research Process:</h4>
                <ul>
                  <li>Start with seed keywords related to your business</li>
                  <li>Use tools like Google Keyword Planner, Ahrefs, or SEMrush</li>
                  <li>Analyze search intent (informational, navigational, transactional)</li>
                  <li>Target long-tail keywords for easier ranking</li>
                  <li>Research competitor keywords</li>
                  <li>Group keywords by topic and search intent</li>
                </ul>
              </div>
              <div className="keyword-strategy">
                <h4>Keyword Placement Strategy:</h4>
                <ul>
                  <li><strong>Primary keyword:</strong> Title tag, H1, first paragraph, URL</li>
                  <li><strong>Secondary keywords:</strong> H2/H3 tags, throughout content</li>
                  <li><strong>LSI keywords:</strong> Related terms naturally throughout content</li>
                  <li><strong>Avoid keyword stuffing:</strong> Maintain natural, readable content</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>✍️ High-Quality Content Creation</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Google prioritizes high-quality, helpful content that satisfies user intent.</p>
              <div className="practice-steps">
                <h4>Content Quality Guidelines:</h4>
                <ul>
                  <li>Create comprehensive, in-depth content (typically 1,000+ words)</li>
                  <li>Focus on user intent and providing value</li>
                  <li>Use clear, well-structured formatting</li>
                  <li>Include relevant images, videos, and multimedia</li>
                  <li>Write for humans first, search engines second</li>
                  <li>Keep content fresh and updated regularly</li>
                </ul>
              </div>
              <div className="content-structure">
                <h4>Ideal Content Structure:</h4>
                <ul>
                  <li><strong>Introduction:</strong> Hook readers and state what they'll learn</li>
                  <li><strong>Table of contents:</strong> For longer articles</li>
                  <li><strong>Clear sections:</strong> Use headers to break up content</li>
                  <li><strong>Bullet points and lists:</strong> Make content scannable</li>
                  <li><strong>Conclusion:</strong> Summarize key points and include CTA</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>🔗 Internal Linking Strategy</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Internal links help distribute page authority and improve user navigation.</p>
              <div className="practice-steps">
                <h4>Internal Linking Best Practices:</h4>
                <ul>
                  <li>Link to relevant, related content naturally within your text</li>
                  <li>Use descriptive anchor text (avoid "click here")</li>
                  <li>Create topic clusters with pillar pages</li>
                  <li>Ensure important pages are easily accessible</li>
                  <li>Link to both newer and older relevant content</li>
                  <li>Don't overdo it - quality over quantity</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example internal link:</h4>
                <pre><code>{`<a href="/keyword-research-guide">comprehensive keyword research guide</a>`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Schema & Structured Data */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">🏗️</span>
            <h2>Schema Markup & Structured Data</h2>
          </div>

          <div className="best-practice">
            <h3>📊 JSON-LD Structured Data</h3>
            <div className="practice-content">
              <p><strong>Why it matters:</strong> Structured data helps search engines understand your content and can result in rich snippets.</p>
              <div className="practice-steps">
                <h4>Common Schema Types:</h4>
                <ul>
                  <li><strong>Organization:</strong> Business information</li>
                  <li><strong>Article:</strong> Blog posts and news articles</li>
                  <li><strong>LocalBusiness:</strong> Local business information</li>
                  <li><strong>Product:</strong> Product details and reviews</li>
                  <li><strong>BreadcrumbList:</strong> Navigation breadcrumbs</li>
                  <li><strong>FAQ:</strong> Frequently asked questions</li>
                </ul>
              </div>
              <div className="code-example">
                <h4>Example Organization schema:</h4>
                <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "url": "https://yourwebsite.com",
  "logo": "https://yourwebsite.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  }
}
</script>`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Tools & Monitoring */}
        <div className="guide-section">
          <div className="section-header">
            <span className="section-icon">🛠️</span>
            <h2>Essential SEO Tools & Monitoring</h2>
          </div>

          <div className="best-practice">
            <h3>📈 Free SEO Tools</h3>
            <div className="practice-content">
              <div className="tools-grid">
                <div className="tool-category">
                  <h4>Google Tools (Free)</h4>
                  <ul>
                    <li><strong>Google Search Console:</strong> Monitor search performance</li>
                    <li><strong>Google Analytics:</strong> Track website traffic and behavior</li>
                    <li><strong>PageSpeed Insights:</strong> Analyze page speed</li>
                    <li><strong>Google Keyword Planner:</strong> Basic keyword research</li>
                  </ul>
                </div>
                <div className="tool-category">
                  <h4>Other Free Tools</h4>
                  <ul>
                    <li><strong>Screaming Frog:</strong> Technical SEO auditing</li>
                    <li><strong>Yoast SEO:</strong> WordPress SEO plugin</li>
                    <li><strong>Google Trends:</strong> Keyword trend analysis</li>
                    <li><strong>Answer The Public:</strong> Question-based keywords</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="best-practice">
            <h3>📊 SEO Monitoring & KPIs</h3>
            <div className="practice-content">
              <div className="practice-steps">
                <h4>Key Metrics to Track:</h4>
                <ul>
                  <li><strong>Organic Traffic:</strong> Total visits from search engines</li>
                  <li><strong>Keyword Rankings:</strong> Position for target keywords</li>
                  <li><strong>Click-Through Rate (CTR):</strong> Percentage of searchers who click</li>
                  <li><strong>Bounce Rate:</strong> Percentage of single-page sessions</li>
                  <li><strong>Page Load Speed:</strong> Time to load your pages</li>
                  <li><strong>Backlink Profile:</strong> Quality and quantity of inbound links</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="guide-section action-section">
          <div className="section-header">
            <span className="section-icon">✅</span>
            <h2>Quick Action Checklist</h2>
          </div>
          
          <div className="checklist-grid">
            <div className="checklist-column">
              <h4>Immediate Actions (Today)</h4>
              <ul className="action-checklist">
                <li>✓ Install Google Search Console</li>
                <li>✓ Set up Google Analytics</li>
                <li>✓ Verify HTTPS is working</li>
                <li>✓ Check mobile-friendliness</li>
                <li>✓ Test page speed</li>
              </ul>
            </div>
            
            <div className="checklist-column">
              <h4>This Week</h4>
              <ul className="action-checklist">
                <li>✓ Optimize title tags and meta descriptions</li>
                <li>✓ Add alt text to all images</li>
                <li>✓ Create/update XML sitemap</li>
                <li>✓ Implement basic schema markup</li>
                <li>✓ Audit internal linking</li>
              </ul>
            </div>
            
            <div className="checklist-column">
              <h4>This Month</h4>
              <ul className="action-checklist">
                <li>✓ Conduct keyword research</li>
                <li>✓ Create content strategy</li>
                <li>✓ Optimize existing content</li>
                <li>✓ Build topic clusters</li>
                <li>✓ Monitor and track progress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="guide-cta">
          <div className="cta-content">
            <h3>🚀 Ready to Optimize Your Website?</h3>
            <p>Use our free SEO analyzer to identify issues and opportunities on your website.</p>
            <button 
              className="cta-button"
              onClick={() => {
                onNavigateToSEO()
                window.scrollTo(0, 0)
              }}
            >
              Analyze My Website Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}