import React, { useState, useEffect } from 'react'

export default function SpeedForm({ user, token, requireAuth }) {
  const [url, setUrl] = useState('https://example.com')
  const [strategy, setStrategy] = useState('mobile')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert('Speed test would run here!')
    }, 1000)
  }

  const containerStyle = {
    padding: isMobile ? '15px' : '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    boxSizing: 'border-box'
  }

  const cardStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: isMobile ? '16px' : '24px',
    padding: isMobile ? '24px 16px' : '60px 30px',
    maxWidth: isMobile ? 'none' : '1200px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(55, 65, 81, 0.3)',
    boxSizing: 'border-box'
  }

  const gridStyle = {
    display: isMobile ? 'block' : 'grid',
    gridTemplateColumns: isMobile ? 'none' : '2fr 1fr',
    gap: isMobile ? '30px' : '60px',
    alignItems: isMobile ? 'stretch' : 'center'
  }

  const titleStyle = {
    fontSize: isMobile ? '28px' : '54px',
    fontWeight: 'bold',
    color: '#f9fafb',
    lineHeight: '1.1',
    margin: '0 0 24px 0',
    wordBreak: 'break-word',
    hyphens: 'auto'
  }

  const formContainerStyle = {
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    borderRadius: '16px',
    padding: '8px',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    marginBottom: '24px'
  }

  const formInnerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: '8px'
  }

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    minWidth: 0,
    marginBottom: isMobile ? '8px' : '0'
  }

  const inputStyle = {
    flex: '1',
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#f9fafb',
    fontSize: '16px',
    padding: '16px 8px 16px 0',
    minWidth: 0
  }

  const controlsStyle = {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    width: isMobile ? '100%' : 'auto'
  }

  const selectStyle = {
    background: 'rgba(55, 65, 81, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.4)',
    borderRadius: '8px',
    color: '#f9fafb',
    padding: '12px 16px',
    fontSize: '14px',
    flex: isMobile ? '1' : 'none',
    minWidth: isMobile ? '0' : 'auto'
  }

  const buttonStyle = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    padding: isMobile ? '12px 16px' : '16px 32px',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: loading ? 0.7 : 1,
    whiteSpace: 'nowrap',
    flex: isMobile ? '1' : 'none'
  }

  const statsContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    gap: isMobile ? '12px' : '20px',
    marginBottom: isMobile ? '30px' : '0'
  }

  const statCardStyle = {
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    borderRadius: '16px',
    padding: isMobile ? '12px 8px' : '24px',
    textAlign: 'center',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    backdropFilter: 'blur(10px)',
    flex: isMobile ? '1' : 'none'
  }

  const examplesStyle = {
    display: 'flex', 
    flexWrap: 'wrap',
    alignItems: 'center', 
    gap: '12px'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={gridStyle}>
          {/* Stats - Mobile first */}
          {isMobile && (
            <div style={statsContainerStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px'}}>95</div>
                <div style={{fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>AVG SCORE</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px'}}>1.2s</div>
                <div style={{fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>LOAD TIME</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px'}}>12+</div>
                <div style={{fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>CHECKS</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginRight: '8px'
              }}></div>
              <span style={{fontSize: '14px', color: '#9ca3af'}}>
                Site Speed Analysis Tool
              </span>
            </div>

            {/* Title */}
            <h1 style={titleStyle}>
              Analyze Your Website's{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Speed Performance
              </span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#d1d5db',
              lineHeight: '1.6',
              marginBottom: '40px',
              maxWidth: '100%'
            }}>
              Get instant insights into your website's loading speed with our comprehensive analysis tool.
            </p>

            {/* Form */}
            <div style={formContainerStyle}>
              <form onSubmit={onSubmit}>
                <div style={formInnerStyle}>
                  {/* URL Input */}
                  <div style={inputContainerStyle}>
                    <div style={{padding: '16px 12px', color: '#9ca3af'}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21L16.65 16.65"/>
                      </svg>
                    </div>
                    <input
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      placeholder="Enter URL"
                      style={inputStyle}
                    />
                  </div>

                  {/* Controls */}
                  <div style={controlsStyle}>
                    <select value={strategy} onChange={e => setStrategy(e.target.value)} style={selectStyle}>
                      <option value="mobile" style={{background: '#1f2937', color: '#f9fafb'}}>📱 Mobile</option>
                      <option value="desktop" style={{background: '#1f2937', color: '#f9fafb'}}>🖥️ Desktop</option>
                    </select>

                    <button type="submit" disabled={loading || !url.trim()} style={buttonStyle}>
                      <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
                      {!loading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9,18 15,12 9,6"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Examples */}
            <div style={examplesStyle}>
              <span style={{fontSize: '14px', color: '#9ca3af'}}>Try:</span>
              {['google.com', 'github.com'].map(example => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setUrl(example)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d1d5db',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px'
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Stats - Desktop */}
          {!isMobile && (
            <div style={statsContainerStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px'}}>95</div>
                <div style={{fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>AVG SCORE</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px'}}>1.2s</div>
                <div style={{fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>LOAD TIME</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px'}}>12+</div>
                <div style={{fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>CHECKS</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}