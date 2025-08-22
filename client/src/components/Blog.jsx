import React, { useState } from 'react'

export default function Blog({ onNavigateToSEO, onNavigateToPost }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const articles = [
    {
      id: 1,
      title: "The Complete Guide to Title Tag Optimization",
      excerpt: "Learn how to craft perfect title tags that boost your search rankings and click-through rates.",
      category: "technical-seo",
      readTime: "8 min read",
      date: "2024-12-15",
      tags: ["Title Tags", "On-Page SEO", "SERP Optimization"],
      featured: true
    },
    {
      id: 2,
      title: "Meta Descriptions That Drive Clicks: A Step-by-Step Guide",
      excerpt: "Master the art of writing compelling meta descriptions that improve your click-through rates.",
      category: "technical-seo",
      readTime: "6 min read",
      date: "2024-12-10",
      tags: ["Meta Descriptions", "CTR Optimization", "SERP Snippets"],
      slug: "meta-descriptions-guide"
    },
    {
      id: 3,
      title: "Header Hierarchy: Why H1, H2, H3 Structure Matters for SEO",
      excerpt: "Understand how proper header structure helps search engines and users navigate your content.",
      category: "technical-seo",
      readTime: "7 min read",
      date: "2024-12-08",
      tags: ["Header Tags", "Content Structure", "Accessibility"],
      slug: "header-hierarchy-guide"
    },
    {
      id: 4,
      title: "Image Alt Text: Beyond Accessibility - SEO Benefits Explained",
      excerpt: "Discover how optimized alt text improves both accessibility and search rankings.",
      category: "technical-seo",
      readTime: "5 min read",
      date: "2024-12-05",
      tags: ["Alt Text", "Image SEO", "Accessibility"],
      slug: "alt-text-seo-guide"
    },
    {
      id: 5,
      title: "Core Web Vitals: Understanding LCP, FID, and CLS",
      excerpt: "Deep dive into Google's Core Web Vitals metrics and learn how to optimize them.",
      category: "performance",
      readTime: "10 min read",
      date: "2024-12-01",
      tags: ["Core Web Vitals", "Page Speed", "Performance"],
      featured: true
    },
    {
      id: 6,
      title: "Site Speed Optimization: 15 Proven Techniques",
      excerpt: "Comprehensive guide to making your website faster with proven optimization techniques.",
      category: "performance",
      readTime: "12 min read",
      date: "2024-11-28",
      tags: ["Site Speed", "Performance", "User Experience"],
      slug: "site-speed-optimization-guide"
    },
    {
      id: 7,
      title: "HTTPS Migration: SEO Checklist for a Smooth Transition",
      excerpt: "Complete checklist for migrating from HTTP to HTTPS without losing search rankings.",
      category: "technical-seo",
      readTime: "9 min read",
      date: "2024-11-25",
      tags: ["HTTPS", "SSL", "Site Migration"],
      slug: "https-migration-checklist"
    },
    {
      id: 8,
      title: "Schema Markup for Beginners: Structured Data That Works",
      excerpt: "Learn how to implement schema markup to enhance your search results.",
      category: "advanced-seo",
      readTime: "11 min read",
      date: "2024-11-20",
      tags: ["Schema Markup", "Structured Data", "Rich Snippets"]
    },
    {
      id: 9,
      title: "Local SEO: Optimizing for 'Near Me' Searches",
      excerpt: "Master local SEO with proven strategies for Google My Business and local citations.",
      category: "local-seo",
      readTime: "13 min read",
      date: "2024-11-18",
      tags: ["Local SEO", "Google My Business", "Local Citations"],
      featured: true
    },
    {
      id: 10,
      title: "Mobile-First Indexing: What It Means for Your SEO",
      excerpt: "Understand Google's mobile-first indexing and how to ensure your mobile site performs well.",
      category: "technical-seo",
      readTime: "8 min read",
      date: "2024-11-15",
      tags: ["Mobile SEO", "Mobile-First", "Responsive Design"]
    },
    {
      id: 11,
      title: "Content Quality vs. Quantity: Finding the Right Balance",
      excerpt: "Learn how to create content that satisfies both users and search engines.",
      category: "content-strategy",
      readTime: "9 min read",
      date: "2024-11-12",
      tags: ["Content Strategy", "Quality Content", "SEO Writing"]
    },
    {
      id: 12,
      title: "Keyword Research in 2024: Tools, Techniques, and Trends",
      excerpt: "Modern keyword research strategies that go beyond search volume.",
      category: "content-strategy",
      readTime: "14 min read",
      date: "2024-11-10",
      tags: ["Keyword Research", "Search Intent", "Competitive Analysis"]
    }
  ]

  const categories = [
    { id: 'all', name: 'All Articles', count: articles.length },
    { id: 'technical-seo', name: 'Technical SEO', count: articles.filter(a => a.category === 'technical-seo').length },
    { id: 'performance', name: 'Performance', count: articles.filter(a => a.category === 'performance').length },
    { id: 'content-strategy', name: 'Content Strategy', count: articles.filter(a => a.category === 'content-strategy').length },
    { id: 'local-seo', name: 'Local SEO', count: articles.filter(a => a.category === 'local-seo').length },
    { id: 'advanced-seo', name: 'Advanced SEO', count: articles.filter(a => a.category === 'advanced-seo').length }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredArticles = articles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  return (
    <>
      <style>{`
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1b23 0%, #2d1b3d 100%)',
        color: '#ffffff'
      }}>
        {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 30%, #8b5cf6 60%, #a855f7 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            margin: '0 0 20px',
            color: '#ffffff',
            lineHeight: '1.1'
          }}>
            SEO Knowledge Hub
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 40px',
            lineHeight: '1.6',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Expert guides, tutorials, and insights to boost your website's search visibility and performance
          </p>
          
          {/* Search Bar in Hero */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50px',
              padding: '4px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <input
                type="text"
                placeholder="Search articles, topics, or techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  border: 'none',
                  borderRadius: '46px',
                  fontSize: '16px',
                  background: 'transparent',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21L16.65 16.65"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Featured Articles */}
        {selectedCategory === 'all' && !searchQuery && (
          <section style={{ 
            padding: '40px 0 20px',
            background: 'transparent'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0',
                color: '#ffffff'
              }}>
                Featured
              </h2>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#8b5cf6'
              }}></div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '40px'
            }}>
              {featuredArticles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => article.slug && onNavigateToPost(article.slug)}
                  style={{
                    minWidth: '280px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      Featured
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>{article.readTime}</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px',
                    lineHeight: '1.4',
                    color: '#ffffff'
                  }}>
                    {article.title}
                  </h3>
                  
                  <p style={{
                    color: '#9ca3af',
                    lineHeight: '1.4',
                    margin: '0',
                    fontSize: '13px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '40px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background: selectedCategory === category.id 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                  : 'rgba(255,255,255,0.05)',
                border: selectedCategory === category.id 
                  ? '1px solid #8b5cf6' 
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '40px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: selectedCategory === category.id ? 'white' : '#cbd5e0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div style={{
          padding: '30px 0',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '16px'
        }}>
          {searchQuery ? (
            <p style={{ margin: 0 }}>
              Found <strong style={{ color: '#8b5cf6' }}>{filteredArticles.length}</strong> article{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Showing <strong style={{ color: '#8b5cf6' }}>{filteredArticles.length}</strong> article{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <section style={{ padding: '20px 0 80px' }}>
          {filteredArticles.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '30px'
            }}>
              {(selectedCategory === 'all' && !searchQuery ? regularArticles : filteredArticles).map((article) => (
                <article 
                  key={article.id}
                  onClick={() => article.slug && onNavigateToPost(article.slug)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '32px',
                    padding: '30px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}>
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
                      borderRadius: '32px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>{article.readTime}</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: '0 0 12px',
                    lineHeight: '1.3',
                    color: '#ffffff'
                  }}>
                    {article.title}
                  </h3>
                  
                  <p style={{
                    color: '#cbd5e0',
                    lineHeight: '1.6',
                    margin: '0 0 20px',
                    fontSize: '15px'
                  }}>
                    {article.excerpt}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#9ca3af',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                      {new Date(article.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    
                    <div style={{
                      color: '#8b5cf6',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
                opacity: 0.6
              }}>🔍</div>
              <h3 style={{
                fontSize: '28px',
                color: '#ffffff',
                margin: '0 0 12px',
                fontWeight: '700'
              }}>No articles found</h3>
              <p style={{
                color: '#9ca3af',
                margin: '0 0 30px',
                fontSize: '16px'
              }}>Try adjusting your search terms or selecting a different category.</p>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '32px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Show All Articles
              </button>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '32px',
          padding: '60px 40px',
          textAlign: 'center',
          margin: '40px 0 80px'
        }}>
          <h3 style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ready to optimize your website?
          </h3>
          <p style={{
            color: '#cbd5e0',
            fontSize: '18px',
            margin: '0 0 30px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Put these insights into action with our comprehensive SEO analyzer
          </p>
          <button onClick={onNavigateToSEO} style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}>
            Analyze My Website
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
          </button>
        </section>
      </div>
    </div>
    </>
  )
}