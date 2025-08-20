import React, { useState, useEffect } from 'react'
import SeoForm from './components/SeoForm.jsx'
import SpeedForm from './components/SpeedForm.jsx'
import About from './components/About.jsx'
import Docs from './components/Docs.jsx'
import Contact from './components/Contact.jsx'
import SeoBestPractices from './components/SeoBestPractices.jsx'
import SpeedOptimization from './components/SpeedOptimization.jsx'
import PageSpeedApiDocs from './components/PageSpeedApiDocs.jsx'
import Auth from './components/Auth.jsx'
import UserDashboard from './components/UserDashboard.jsx'

export default function App() {
  const [tab, setTab] = useState('seo')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Check for existing auth on app load
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])
  
  const handleNavigateToSEO = () => {
    setTab('seo')
    window.scrollTo(0, 0)
  }

  const handleNavigateToSpeed = () => {
    setTab('speed')
    window.scrollTo(0, 0)
  }

  const handleAuth = ({ token, user }) => {
    setToken(token)
    setUser(user)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
  }

  const requireAuth = () => {
    if (!user) {
      setShowAuth(true)
      return false
    }
    return true
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="container">
          <div className="navbar">
            <div className="brand">
              <div className="logo">
                <img src="/websitescanner.png" alt="Website Scanner Logo" className="logo-image" onClick={handleNavigateToSEO} style={{cursor: 'pointer'}} />
              </div>
              <div className="brand-text">
                <h1>Website Scanner</h1>
                <p>Quick SEO insights & Speed checks</p>
              </div>
            </div>
            <nav className="nav">
              <button className={`nav-btn ${tab==='seo'?'active':''}`} onClick={() => setTab('seo')}>SEO Analyzer</button>
              <button className={`nav-btn ${tab==='speed'?'active':''}`} onClick={() => setTab('speed')}>Site Speed</button>
              <div className="nav-divider"></div>
              {user && (
                <button className={`nav-link ${tab==='dashboard'?'active':''}`} onClick={() => setTab('dashboard')}>
                  Dashboard
                </button>
              )}
              <button className={`nav-link ${tab==='about'?'active':''}`} onClick={() => setTab('about')}>About</button>
              <button className={`nav-link ${tab==='docs'?'active':''}`} onClick={() => setTab('docs')}>Docs</button>
              <button className={`nav-link ${tab==='contact'?'active':''}`} onClick={() => setTab('contact')}>Contact</button>
              {user ? (
                <>
                  <span className="user-email">@{user.username}</span>
                  <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className="login-btn" onClick={() => setShowAuth(true)}>Login</button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {tab === 'seo' && <SeoForm user={user} token={token} requireAuth={requireAuth} />}
          {tab === 'speed' && <SpeedForm user={user} token={token} requireAuth={requireAuth} />}
          {tab === 'dashboard' && user && <UserDashboard user={user} token={token} onLogout={handleLogout} onNavigate={setTab} />}
          {tab === 'about' && <About onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'docs' && <Docs onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'contact' && <Contact />}
          {tab === 'seo-best-practices' && <SeoBestPractices onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'speed-optimization' && <SpeedOptimization onNavigateToSpeed={handleNavigateToSpeed} />}
          {tab === 'pagespeed-api-docs' && <PageSpeedApiDocs />}
        </div>
      </main>

      {showAuth && <Auth onAuth={handleAuth} />}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <div className="footer-logo">
                  <img src="/websitescanner.png" alt="Website Scanner Logo" className="footer-logo-image" onClick={handleNavigateToSEO} style={{cursor: 'pointer'}} />
                </div>
                <div>
                  <h3>Website Scanner</h3>
                  <p>Quick SEO insights & Speed checks for modern websites</p>
                </div>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Tools</h4>
              <ul>
                <li>SEO Analyzer</li>
                <li>Site Speed Test</li>
                <li>Performance Metrics</li>
                <li>Meta Tag Analysis</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><button className="footer-link" onClick={() => setTab('seo-best-practices')}>SEO Best Practices</button></li>
                <li><button className="footer-link" onClick={() => setTab('speed-optimization')}>Speed Optimization</button></li>
                <li><button className="footer-link" onClick={() => setTab('pagespeed-api-docs')}>PageSpeed API Guide</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>About</h4>
              <ul>
                <li><button className="footer-link" onClick={() => setTab('about')}>About This Project</button></li>
                <li><button className="footer-link" onClick={() => setTab('about')}>How It Works</button></li>
                <li><button className="footer-link" onClick={() => setTab('about')}>Why We Built This</button></li>
                <li><button className="footer-link" onClick={() => setTab('about')}>Who It's For</button></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Website Scanner • Built for demonstration purposes</p>
            <div className="footer-links">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
