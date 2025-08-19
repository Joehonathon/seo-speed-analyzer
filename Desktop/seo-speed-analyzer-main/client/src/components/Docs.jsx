import React, { useState } from 'react'

export default function Docs({ onNavigateToSEO }) {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'best-practices', title: 'SEO Best Practices', icon: '⭐' },
    { id: 'common-issues', title: 'Common Issues & Fixes', icon: '🔧' },
    { id: 'glossary', title: 'SEO Glossary', icon: '📚' }
  ]

  return (
    <div className="docs-page">
      <div className="docs-header">
        <h1>Documentation</h1>
        <p>Everything you need to know about SEO optimization and using Website Scanner</p>
      </div>

      <div className="docs-container">
        <nav className="docs-sidebar">
          <div className="sidebar-content">
            <h3>Contents</h3>
            <ul className="docs-nav">
              {sections.map(section => (
                <li key={section.id}>
                  <button 
                    className={`docs-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="docs-content">
          {activeSection === 'getting-started' && (
            <section className="doc-section">
              <h2>🚀 Getting Started</h2>
              
              <div className="doc-subsection">
                <h3>How to Use Website Scanner</h3>
                <p>Website Scanner is designed to be simple and intuitive. Follow these steps to analyze your website:</p>
                
                <div className="step-guide">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Enter Your URL</h4>
                      <p>Navigate to the SEO Analyzer and enter your website URL in the input field. Make sure to include the full URL (e.g., https://yourwebsite.com).</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Click Analyze</h4>
                      <p>Click the "Analyze" button to start the scanning process. Our tool will crawl your website and analyze over 20+ SEO factors.</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Review Your Results</h4>
                      <p>Within seconds, you'll receive a comprehensive SEO score and detailed breakdown of your website's performance.</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Implement Fixes</h4>
                      <p>Use our priority fixes and step-by-step instructions to improve your SEO score and search engine rankings.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Understanding Your SEO Score</h3>
                <p>Your SEO score is calculated based on multiple factors weighted by their importance to search engines:</p>
                
                <div className="score-breakdown">
                  <div className="score-item">
                    <div className="score-range good">90-100</div>
                    <div className="score-desc">
                      <h4>Excellent</h4>
                      <p>Your website follows SEO best practices and is well-optimized for search engines.</p>
                    </div>
                  </div>
                  
                  <div className="score-item">
                    <div className="score-range ok">70-89</div>
                    <div className="score-desc">
                      <h4>Good</h4>
                      <p>Your website has solid SEO foundations but has room for improvement in some areas.</p>
                    </div>
                  </div>
                  
                  <div className="score-item">
                    <div className="score-range bad">Below 70</div>
                    <div className="score-desc">
                      <h4>Needs Improvement</h4>
                      <p>Your website has significant SEO issues that should be addressed to improve search rankings.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Analyzing Your Reports</h3>
                <p>Each report is divided into six key areas:</p>
                
                <div className="report-areas">
                  <div className="area-card">
                    <h4>Basics</h4>
                    <p>Essential meta tags, title, description, and fundamental SEO elements.</p>
                  </div>
                  <div className="area-card">
                    <h4>Content Structure</h4>
                    <p>Heading hierarchy, word count, and content organization.</p>
                  </div>
                  <div className="area-card">
                    <h4>Keywords & SEO</h4>
                    <p>Keyword usage, structured data, and search engine optimization.</p>
                  </div>
                  <div className="area-card">
                    <h4>Technical SEO</h4>
                    <p>HTTPS, robots.txt, sitemaps, and technical implementation.</p>
                  </div>
                  <div className="area-card">
                    <h4>Social & Sharing</h4>
                    <p>Open Graph tags, Twitter cards, and social media optimization.</p>
                  </div>
                  <div className="area-card">
                    <h4>Links & Navigation</h4>
                    <p>Internal and external links, navigation structure, and link optimization.</p>
                  </div>
                </div>
              </div>

              <div className="cta-box">
                <h3>Ready to Get Started?</h3>
                <p>Try analyzing your website now and see how it performs!</p>
                <button className="cta-button" onClick={() => onNavigateToSEO && onNavigateToSEO()}>
                  Analyze Your Website
                </button>
              </div>
            </section>
          )}

          {activeSection === 'best-practices' && (
            <section className="doc-section">
              <h2>⭐ SEO Best Practices</h2>
              
              <div className="doc-subsection">
                <h3>Essential On-Page SEO</h3>
                
                <div className="practice-item">
                  <h4>Title Tags</h4>
                  <div className="practice-content">
                    <p><strong>Best Practice:</strong> Keep titles between 50-60 characters and include your primary keyword.</p>
                    <div className="code-example">
                      <code>&lt;title&gt;Best SEO Tools for Web Designers | Website Scanner&lt;/title&gt;</code>
                    </div>
                    <ul>
                      <li>Include your primary keyword near the beginning</li>
                      <li>Make it compelling and click-worthy</li>
                      <li>Avoid keyword stuffing</li>
                      <li>Each page should have a unique title</li>
                    </ul>
                  </div>
                </div>

                <div className="practice-item">
                  <h4>Meta Descriptions</h4>
                  <div className="practice-content">
                    <p><strong>Best Practice:</strong> Write compelling descriptions between 150-160 characters that encourage clicks.</p>
                    <div className="code-example">
                      <code>&lt;meta name="description" content="Analyze your website's SEO with our free tool. Get instant scores, detailed reports, and actionable insights to improve your search rankings."&gt;</code>
                    </div>
                    <ul>
                      <li>Include relevant keywords naturally</li>
                      <li>Write for users, not just search engines</li>
                      <li>Include a clear call-to-action</li>
                      <li>Avoid duplicate descriptions across pages</li>
                    </ul>
                  </div>
                </div>

                <div className="practice-item">
                  <h4>Header Structure</h4>
                  <div className="practice-content">
                    <p><strong>Best Practice:</strong> Use exactly one H1 tag per page and create a logical heading hierarchy.</p>
                    <div className="code-example">
                      <code>
                        &lt;h1&gt;Main Page Topic&lt;/h1&gt;<br/>
                        &lt;h2&gt;Main Section&lt;/h2&gt;<br/>
                        &lt;h3&gt;Subsection&lt;/h3&gt;<br/>
                        &lt;h3&gt;Another Subsection&lt;/h3&gt;<br/>
                        &lt;h2&gt;Another Main Section&lt;/h2&gt;
                      </code>
                    </div>
                    <ul>
                      <li>H1 should describe the main topic of the page</li>
                      <li>Don't skip heading levels (H1 → H3)</li>
                      <li>Include keywords in headings when relevant</li>
                      <li>Use headings to structure content logically</li>
                    </ul>
                  </div>
                </div>

                <div className="practice-item">
                  <h4>Image Optimization</h4>
                  <div className="practice-content">
                    <p><strong>Best Practice:</strong> Add descriptive alt text to all images and optimize file sizes.</p>
                    <div className="code-example">
                      <code>&lt;img src="seo-analysis-report.jpg" alt="SEO analysis report showing website score of 85 out of 100"&gt;</code>
                    </div>
                    <ul>
                      <li>Write descriptive, specific alt text</li>
                      <li>Include keywords when relevant and natural</li>
                      <li>Optimize image file sizes for faster loading</li>
                      <li>Use appropriate file formats (WebP, JPEG, PNG)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Technical SEO Fundamentals</h3>
                
                <div className="practice-item">
                  <h4>Mobile Optimization</h4>
                  <div className="practice-content">
                    <p><strong>Essential:</strong> Ensure your website is mobile-friendly with proper viewport configuration.</p>
                    <div className="code-example">
                      <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>
                    </div>
                  </div>
                </div>

                <div className="practice-item">
                  <h4>HTTPS Security</h4>
                  <div className="practice-content">
                    <p><strong>Essential:</strong> Use HTTPS for all pages. Search engines favor secure websites.</p>
                    <ul>
                      <li>Install an SSL certificate</li>
                      <li>Redirect HTTP to HTTPS</li>
                      <li>Update internal links to use HTTPS</li>
                      <li>Check for mixed content warnings</li>
                    </ul>
                  </div>
                </div>

                <div className="practice-item">
                  <h4>Page Speed</h4>
                  <div className="practice-content">
                    <p><strong>Goal:</strong> Aim for page load times under 3 seconds for optimal user experience.</p>
                    <ul>
                      <li>Optimize images and use modern formats</li>
                      <li>Minimize CSS and JavaScript</li>
                      <li>Use browser caching</li>
                      <li>Consider a Content Delivery Network (CDN)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Content Best Practices</h3>
                
                <div className="practice-grid">
                  <div className="practice-card">
                    <h4>Quality Content</h4>
                    <ul>
                      <li>Write for your audience first</li>
                      <li>Provide unique, valuable information</li>
                      <li>Keep content fresh and updated</li>
                      <li>Use natural keyword integration</li>
                    </ul>
                  </div>
                  
                  <div className="practice-card">
                    <h4>Content Structure</h4>
                    <ul>
                      <li>Use short paragraphs and sentences</li>
                      <li>Include bullet points and lists</li>
                      <li>Add relevant images and media</li>
                      <li>Create scannable content</li>
                    </ul>
                  </div>
                  
                  <div className="practice-card">
                    <h4>Internal Linking</h4>
                    <ul>
                      <li>Link to relevant internal pages</li>
                      <li>Use descriptive anchor text</li>
                      <li>Create a logical site structure</li>
                      <li>Help users navigate easily</li>
                    </ul>
                  </div>
                  
                  <div className="practice-card">
                    <h4>External Links</h4>
                    <ul>
                      <li>Link to authoritative sources</li>
                      <li>Use rel="noopener" for external links</li>
                      <li>Check links regularly for 404s</li>
                      <li>Consider link relevance and quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'common-issues' && (
            <section className="doc-section">
              <h2>🔧 Common Issues & Fixes</h2>
              
              <div className="doc-subsection">
                <h3>Most Common SEO Problems</h3>
                <p>Here are the most frequently encountered SEO issues and step-by-step solutions:</p>
                
                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority high">High Priority</span>
                    <h4>Missing or Poor Title Tags</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Pages without title tags or with generic titles like "Untitled Document" or "Home".</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Add a unique <code>&lt;title&gt;</code> tag to each page's <code>&lt;head&gt;</code> section</li>
                        <li>Keep titles between 50-60 characters</li>
                        <li>Include your primary keyword near the beginning</li>
                        <li>Make each title unique and descriptive</li>
                      </ol>
                    </div>
                    
                    <div className="before-after">
                      <div className="before">
                        <h6>❌ Before (Poor):</h6>
                        <code>&lt;title&gt;Home&lt;/title&gt;</code>
                      </div>
                      <div className="after">
                        <h6>✅ After (Good):</h6>
                        <code>&lt;title&gt;Professional SEO Tools for Web Designers | Website Scanner&lt;/title&gt;</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority high">High Priority</span>
                    <h4>Missing Meta Descriptions</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Pages without meta descriptions, causing search engines to generate poor snippets.</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Add a <code>&lt;meta name="description"&gt;</code> tag to each page</li>
                        <li>Write compelling descriptions between 150-160 characters</li>
                        <li>Include relevant keywords naturally</li>
                        <li>Write unique descriptions for each page</li>
                      </ol>
                    </div>
                    
                    <div className="code-example">
                      <h6>✅ Example:</h6>
                      <code>&lt;meta name="description" content="Free SEO analysis tool for web designers. Get instant website scores, detailed reports, and step-by-step optimization guides to improve your search rankings."&gt;</code>
                    </div>
                  </div>
                </div>

                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority high">High Priority</span>
                    <h4>Multiple or Missing H1 Tags</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Pages with no H1 tags, multiple H1 tags, or poorly structured headings.</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Ensure each page has exactly one H1 tag</li>
                        <li>Make the H1 descriptive of the page content</li>
                        <li>Use H2, H3, H4 for subheadings in order</li>
                        <li>Don't skip heading levels (H1 → H3)</li>
                      </ol>
                    </div>
                    
                    <div className="before-after">
                      <div className="before">
                        <h6>❌ Before (Poor Structure):</h6>
                        <code>
                          &lt;h1&gt;Welcome&lt;/h1&gt;<br/>
                          &lt;h1&gt;Our Services&lt;/h1&gt;<br/>
                          &lt;h4&gt;SEO Tools&lt;/h4&gt;
                        </code>
                      </div>
                      <div className="after">
                        <h6>✅ After (Good Structure):</h6>
                        <code>
                          &lt;h1&gt;Professional SEO Analysis Tools&lt;/h1&gt;<br/>
                          &lt;h2&gt;Our Services&lt;/h2&gt;<br/>
                          &lt;h3&gt;SEO Analysis Tools&lt;/h3&gt;<br/>
                          &lt;h3&gt;Performance Testing&lt;/h3&gt;
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority medium">Medium Priority</span>
                    <h4>Images Missing Alt Text</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Images without alt attributes, making content inaccessible and missing SEO opportunities.</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Add descriptive alt text to all content images</li>
                        <li>Use empty alt="" for decorative images</li>
                        <li>Include keywords when relevant and natural</li>
                        <li>Keep descriptions concise but descriptive</li>
                      </ol>
                    </div>
                    
                    <div className="before-after">
                      <div className="before">
                        <h6>❌ Before:</h6>
                        <code>&lt;img src="chart.png"&gt;</code>
                      </div>
                      <div className="after">
                        <h6>✅ After:</h6>
                        <code>&lt;img src="chart.png" alt="SEO performance chart showing 40% improvement in search rankings over 6 months"&gt;</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority medium">Medium Priority</span>
                    <h4>Missing Viewport Meta Tag</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Website not optimized for mobile devices, affecting mobile search rankings.</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Add the viewport meta tag to your HTML head section</li>
                        <li>Test your website on mobile devices</li>
                        <li>Ensure responsive design is working properly</li>
                        <li>Check mobile-friendliness with Google's Mobile-Friendly Test</li>
                      </ol>
                    </div>
                    
                    <div className="code-example">
                      <h6>✅ Add this to your &lt;head&gt; section:</h6>
                      <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>
                    </div>
                  </div>
                </div>

                <div className="issue-item">
                  <div className="issue-header">
                    <span className="issue-priority low">Low Priority</span>
                    <h4>Missing Canonical URL</h4>
                  </div>
                  <div className="issue-content">
                    <p><strong>Problem:</strong> Potential duplicate content issues without canonical tags.</p>
                    
                    <div className="fix-steps">
                      <h5>How to Fix:</h5>
                      <ol>
                        <li>Add a canonical link tag to each page</li>
                        <li>Point to the preferred version of the page</li>
                        <li>Use absolute URLs</li>
                        <li>Ensure consistency across similar pages</li>
                      </ol>
                    </div>
                    
                    <div className="code-example">
                      <h6>✅ Example:</h6>
                      <code>&lt;link rel="canonical" href="https://yourwebsite.com/page-url"&gt;</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Technical Issues</h3>
                
                <div className="technical-issues">
                  <div className="tech-issue">
                    <h4>Broken Links</h4>
                    <p>Regularly check for and fix 404 errors. Use tools like Google Search Console to identify broken links.</p>
                  </div>
                  
                  <div className="tech-issue">
                    <h4>Slow Loading Speed</h4>
                    <p>Optimize images, enable compression, use browser caching, and consider a CDN to improve page speed.</p>
                  </div>
                  
                  <div className="tech-issue">
                    <h4>Missing HTTPS</h4>
                    <p>Install an SSL certificate and redirect all HTTP traffic to HTTPS for security and SEO benefits.</p>
                  </div>
                  
                  <div className="tech-issue">
                    <h4>Missing Robots.txt</h4>
                    <p>Create a robots.txt file to guide search engine crawlers and improve indexing efficiency.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'glossary' && (
            <section className="doc-section">
              <h2>📚 SEO Glossary</h2>
              
              <div className="doc-subsection">
                <p>Essential SEO terms and concepts every web designer should know:</p>
                
                <div className="glossary-grid">
                  <div className="glossary-item">
                    <h4>Alt Text (Alternative Text)</h4>
                    <p>Descriptive text added to images that helps screen readers and search engines understand image content. Essential for accessibility and SEO.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Backlink</h4>
                    <p>A link from another website pointing to your site. High-quality backlinks from authoritative sites improve your search rankings.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Canonical URL</h4>
                    <p>The preferred version of a webpage when multiple URLs display similar content. Helps prevent duplicate content issues.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Crawling</h4>
                    <p>The process by which search engines discover and scan web pages to understand their content and structure.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Domain Authority (DA)</h4>
                    <p>A metric that predicts how well a website will rank in search engine results. Higher DA indicates stronger ranking potential.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Featured Snippet</h4>
                    <p>A special search result that appears at the top of Google's results, providing a direct answer to user queries.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Indexing</h4>
                    <p>The process of adding web pages to a search engine's database so they can appear in search results.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Internal Links</h4>
                    <p>Links that connect different pages within the same website. Help with navigation and distribute page authority.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>JSON-LD</h4>
                    <p>A method of structured data markup that helps search engines understand your content better. Improves rich snippet potential.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Keyword Density</h4>
                    <p>The percentage of times a keyword appears on a page compared to the total word count. Should be natural, not forced.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Long-tail Keywords</h4>
                    <p>Longer, more specific keyword phrases that are easier to rank for and often have higher conversion rates.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Meta Description</h4>
                    <p>A brief summary of a page's content that appears in search results. Influences click-through rates from search engines.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>NoFollow Link</h4>
                    <p>A link with rel="nofollow" attribute that tells search engines not to pass ranking credit to the linked page.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Open Graph Tags</h4>
                    <p>Meta tags that control how your content appears when shared on social media platforms like Facebook and LinkedIn.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Page Authority (PA)</h4>
                    <p>A score that predicts how well a specific page will rank in search engine results. Similar to Domain Authority but page-specific.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>PageRank</h4>
                    <p>Google's original algorithm for ranking web pages based on the quality and quantity of links pointing to them.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Robots.txt</h4>
                    <p>A file that tells search engine crawlers which pages or sections of your site should not be crawled or indexed.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Schema Markup</h4>
                    <p>Structured data code that helps search engines understand your content and display rich snippets in search results.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>SERP (Search Engine Results Page)</h4>
                    <p>The page displayed by search engines in response to a user's query, containing organic results, ads, and featured snippets.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Sitemap</h4>
                    <p>A file that lists all important pages on your website, helping search engines discover and crawl your content more efficiently.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Title Tag</h4>
                    <p>The clickable headline that appears in search results and browser tabs. One of the most important on-page SEO elements.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>User Experience (UX)</h4>
                    <p>How users interact with and experience your website. Good UX is increasingly important for SEO rankings.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>Viewport Meta Tag</h4>
                    <p>HTML tag that controls how a webpage is displayed on mobile devices. Essential for mobile SEO and responsive design.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>White Hat SEO</h4>
                    <p>Ethical SEO practices that follow search engine guidelines and focus on providing value to users rather than gaming the system.</p>
                  </div>

                  <div className="glossary-item">
                    <h4>XML Sitemap</h4>
                    <p>A structured file that lists all your website's pages in XML format, making it easier for search engines to crawl your site.</p>
                  </div>
                </div>
              </div>

              <div className="doc-subsection">
                <h3>Common SEO Metrics</h3>
                
                <div className="metrics-grid">
                  <div className="metric-item">
                    <h4>Click-Through Rate (CTR)</h4>
                    <p>The percentage of people who click on your search result compared to how many see it. Higher CTR indicates better title and description optimization.</p>
                  </div>

                  <div className="metric-item">
                    <h4>Bounce Rate</h4>
                    <p>The percentage of visitors who leave your site after viewing only one page. Lower bounce rates generally indicate better user engagement.</p>
                  </div>

                  <div className="metric-item">
                    <h4>Dwell Time</h4>
                    <p>How long a user stays on your page after clicking from search results. Longer dwell time may indicate content quality and relevance.</p>
                  </div>

                  <div className="metric-item">
                    <h4>Core Web Vitals</h4>
                    <p>Google's metrics for page experience including loading speed (LCP), interactivity (FID), and visual stability (CLS).</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}