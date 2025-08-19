import React from 'react'

const getCardIcon = (title) => {
  switch (title) {
    case 'Basics': return '📋'
    case 'Headings & Content': return '📝'
    case 'Social/Sharing': return '🔗'
    case 'Links': return '🌐'
    default: return '📊'
  }
}

const getStatusIndicator = (key, value) => {
  const stringValue = String(value).toLowerCase()
  
  // Check for specific metrics first
  if (key === 'HTTPS') {
    return stringValue === 'yes' ? 'good' : 'bad'
  }
  
  
  // Check for missing or empty values
  if (stringValue === '—' || stringValue === '' || stringValue === 'null' || stringValue === 'missing') {
    return 'bad'
  }
  
  // Check for "No" values 
  if (stringValue === 'no') {
    return 'bad'
  }
  
  // Check for "Yes" values (like HTTPS: Yes, Found values)
  if (stringValue === 'yes' || stringValue === 'found') {
    return 'good'
  }
  
  if (key === 'H1 Count') {
    const count = parseInt(stringValue)
    return count === 1 ? 'good' : 'bad'
  }
  
  if (key === 'Header Hierarchy') {
    return stringValue === 'good' ? 'good' : 'bad'
  }
  
  if (key === 'Images Missing Alt') {
    const count = parseInt(stringValue)
    return count === 0 ? 'good' : 'bad'
  }
  
  if (key === 'Keywords in Title' || key === 'Keywords in Description') {
    return stringValue === 'yes' ? 'good' : 'bad'
  }
  
  if (key === 'Image Optimization') {
    return stringValue === 'good' ? 'good' : 'bad'
  }
  
  if (key === 'Broken Links') {
    // Extract number of broken links
    const brokenMatch = stringValue.match(/^(\d+)/)
    if (brokenMatch) {
      const brokenCount = parseInt(brokenMatch[1])
      return brokenCount === 0 ? 'good' : 'bad'
    }
  }
  
  // For content with actual values (not just present/missing)
  if (key === 'Title' || key === 'Meta Description' || key === 'Canonical URL' || 
      key === 'OG Title' || key === 'OG Description' || key === 'Language') {
    return stringValue !== '—' && stringValue !== '' ? 'good' : 'bad'
  }
  
  // Default to good for values that have content
  return stringValue !== '—' && stringValue !== '' ? 'good' : 'bad'
}

export default function ResultCard({ title, items=[], brokenLinks=[] }) {
  return (
    <div className="enhanced-card">
      <div className="enhanced-card-header">
        <div className="card-icon">{getCardIcon(title)}</div>
        <div className="card-title-content">
          <h4>{title}</h4>
          <div className="card-stats">{items.length} items</div>
        </div>
      </div>
      <div className="enhanced-card-body">
        {items.map(([k, v], i) => {
          const status = getStatusIndicator(k, v)
          return (
            <div key={i} className="enhanced-row">
              <div className="row-content">
                <div className="row-key">{k}</div>
                <div className="row-value">{String(v)}</div>
              </div>
              <div className={`status-indicator ${status}`}>
                {status === 'good' && '✓'}
                {status === 'bad' && '✗'}
              </div>
            </div>
          )
        })}
        {title === 'Technical SEO' && brokenLinks.length > 0 && (
          <div className="broken-links-section">
            <div className="broken-links-header">
              <span className="broken-links-icon">🔗</span>
              <span className="broken-links-title">
                {brokenLinks.length} Broken Link{brokenLinks.length === 1 ? '' : 's'} Found:
              </span>
            </div>
            {brokenLinks.map((link, i) => (
              <div key={i} className="broken-link-item">
                <div className="broken-link-url">
                  <span className="link-number">{i + 1}.</span>
                  <span className="link-url">{link.url}</span>
                </div>
                <div className="broken-link-status">
                  <span className="status-badge status-error">
                    {link.status === 'timeout/error' ? 'Connection Failed' : `HTTP ${link.status}`}
                  </span>
                  {link.error && <span className="error-detail">({link.error})</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
