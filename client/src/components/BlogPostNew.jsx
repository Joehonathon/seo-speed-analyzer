import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

export default function BlogPostNew({ postId, onBack, onNavigateToSEO }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!postId) return

    const loadArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch the markdown file
        const response = await fetch(`/content/${postId}.md`)
        if (!response.ok) {
          throw new Error(`Article not found: ${postId}`)
        }
        
        const markdown = await response.text()
        
        // Parse frontmatter and content
        const parts = markdown.split('---')
        if (parts.length < 3) {
          throw new Error('Invalid markdown format')
        }
        
        // Parse frontmatter (simple YAML parsing)
        const frontmatter = {}
        const frontmatterLines = parts[1].trim().split('\n')
        frontmatterLines.forEach(line => {
          const [key, ...valueParts] = line.split(':')
          if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim()
            // Remove quotes if present
            value = value.replace(/^["']|["']$/g, '')
            // Handle arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
              value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''))
            }
            frontmatter[key.trim()] = value
          }
        })
        
        // Parse content
        const content = parts.slice(2).join('---')
        const htmlContent = marked(content)
        
        setArticle({
          ...frontmatter,
          content: htmlContent
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [postId])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1b23 0%, #2d1b3d 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#9ca3af' }}>Loading article...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1b23 0%, #2d1b3d 100%)',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ padding: '40px 0 20px' }}>
            <button onClick={onBack} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Blog
            </button>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.6 }}>❌</div>
            <h1 style={{
              fontSize: '32px',
              color: '#ffffff',
              margin: '0 0 12px',
              fontWeight: '700'
            }}>Article Not Found</h1>
            <p style={{
              color: '#9ca3af',
              margin: '0 0 30px',
              fontSize: '16px'
            }}>
              {error}
            </p>
            <button onClick={onBack} style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '32px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Return to Blog
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!article) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1b23 0%, #2d1b3d 100%)',
      color: '#ffffff'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        {/* Navigation */}
        <div style={{ padding: '40px 0 20px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </button>
        </div>

        {/* Article Header */}
        <header style={{ padding: '20px 0 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#8b5cf6',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {article.category?.replace('-', ' ')}
            </span>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>{article.readTime}</span>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>•</span>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              {new Date(article.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <h1 style={{
            fontSize: '42px',
            fontWeight: '900',
            margin: '0 0 20px',
            lineHeight: '1.2',
            color: '#ffffff'
          }}>
            {article.title}
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#cbd5e0',
            lineHeight: '1.6',
            margin: '0'
          }}>
            {article.excerpt}
          </p>

          {article.tags && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '24px'
            }}>
              {article.tags.map((tag, index) => (
                <span key={index} style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#9ca3af',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article style={{ padding: '40px 0 80px' }}>
          <div 
            style={{ 
              fontSize: '16px', 
              lineHeight: '1.8', 
              color: '#e5e7eb' 
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Call to Action */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '32px',
          padding: '40px',
          textAlign: 'center',
          margin: '0 0 80px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '800',
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ready to analyze your website?
          </h3>
          <p style={{
            color: '#cbd5e0',
            fontSize: '16px',
            margin: '0 0 24px',
            lineHeight: '1.6'
          }}>
            Put these insights into action with our comprehensive SEO analyzer
          </p>
          <button onClick={onNavigateToSEO} style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}>
            Analyze My Website
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
          </button>
        </section>
      </div>

      {/* Custom styles for markdown content */}
      <style>{`
        article h2 {
          font-size: 28px !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          margin: 40px 0 20px !important;
          line-height: 1.3 !important;
        }
        
        article h3 {
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #ffffff !important;
          margin: 32px 0 16px !important;
          line-height: 1.3 !important;
        }
        
        article h4 {
          font-size: 20px !important;
          font-weight: 600 !important;
          color: #ffffff !important;
          margin: 24px 0 12px !important;
        }
        
        article p {
          margin-bottom: 24px !important;
          color: #e5e7eb !important;
        }
        
        article ul, article ol {
          padding-left: 24px !important;
          margin-bottom: 24px !important;
        }
        
        article li {
          margin-bottom: 8px !important;
          color: #e5e7eb !important;
        }
        
        article pre {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 16px !important;
          padding: 24px !important;
          margin: 32px 0 !important;
          overflow-x: auto !important;
        }
        
        article code {
          background: rgba(255,255,255,0.1) !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 14px !important;
          color: #22c55e !important;
        }
        
        article pre code {
          background: transparent !important;
          padding: 0 !important;
          color: #cbd5e0 !important;
        }
        
        article blockquote {
          border-left: 4px solid #8b5cf6 !important;
          padding-left: 24px !important;
          margin: 32px 0 !important;
          font-style: italic !important;
          color: #cbd5e0 !important;
        }
        
        article table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 32px 0 !important;
          background: rgba(255,255,255,0.03) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        
        article th, article td {
          padding: 12px 16px !important;
          text-align: left !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        article th {
          background: rgba(139, 92, 246, 0.2) !important;
          font-weight: 600 !important;
          color: #ffffff !important;
        }
        
        article td {
          color: #e5e7eb !important;
        }
      `}</style>
    </div>
  )
}