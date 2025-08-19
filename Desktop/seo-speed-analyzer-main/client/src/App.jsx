import React, { useState } from 'react'
import SeoForm from './components/SeoForm.jsx'
import SpeedForm from './components/SpeedForm.jsx'
import About from './components/About.jsx'
import Docs from './components/Docs.jsx'
import Contact from './components/Contact.jsx'
import SeoBestPractices from './components/SeoBestPractices.jsx'
import SpeedOptimization from './components/SpeedOptimization.jsx'

export default function App() {
  const [tab, setTab] = useState('seo')
  
  const handleNavigateToSEO = () => {
    setTab('seo')
    window.scrollTo(0, 0)
  }

  const handleNavigateToSpeed = () => {
    setTab('speed')
    window.scrollTo(0, 0)
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
              <button className={tab==='seo'?'active':''} onClick={() => setTab('seo')}>SEO Analyzer</button>
              <button className={tab==='speed'?'active':''} onClick={() => setTab('speed')}>Site Speed</button>
              <div className="nav-divider"></div>
              <button className={`nav-link ${tab==='about'?'active':''}`} onClick={() => setTab('about')}>About</button>
              <button className={`nav-link ${tab==='docs'?'active':''}`} onClick={() => setTab('docs')}>Docs</button>
              <button className={`nav-link ${tab==='contact'?'active':''}`} onClick={() => setTab('contact')}>Contact</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {tab === 'seo' && <SeoForm />}
          {tab === 'speed' && <SpeedForm />}
          {tab === 'about' && <About onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'docs' && <Docs onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'contact' && <Contact />}
          {tab === 'seo-best-practices' && <SeoBestPractices onNavigateToSEO={handleNavigateToSEO} />}
          {tab === 'speed-optimization' && <SpeedOptimization onNavigateToSpeed={handleNavigateToSpeed} />}
        </div>
      </main>

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
