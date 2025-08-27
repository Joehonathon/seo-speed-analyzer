import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import ResultCard from './ResultCard.jsx';
import ScoreBadge from './ScoreBadge.jsx';
import PageSpeedGuide from './PageSpeedGuide.jsx';
import PricingModal from './PricingModal.jsx';

import API_BASE from '../config/api.js';

// Helper function to get displayable speed time from either PageSpeed API or basic response
const getSpeedDisplayTime = (speedData) => {
  if (!speedData) return 0;
  
  // If using PageSpeed API, try to extract a meaningful timing metric
  if (speedData.usingPageSpeedAPI && speedData.metrics) {
    // Try Load time first (full page load)
    if (speedData.metrics.Load) {
      const loadMatch = speedData.metrics.Load.match(/(\d+(?:\.\d+)?)/);
      if (loadMatch) {
        const value = parseFloat(loadMatch[1]);
        // Convert seconds to milliseconds if needed
        return speedData.metrics.Load.includes('s') ? Math.round(value * 1000) : Math.round(value);
      }
    }
    
    // Fallback to Time to Interactive (TTI)
    if (speedData.metrics.TTI) {
      const ttiMatch = speedData.metrics.TTI.match(/(\d+(?:\.\d+)?)/);
      if (ttiMatch) {
        const value = parseFloat(ttiMatch[1]);
        // Convert seconds to milliseconds if needed
        return speedData.metrics.TTI.includes('s') ? Math.round(value * 1000) : Math.round(value);
      }
    }
    
    // Fallback to First Contentful Paint (FCP)
    if (speedData.metrics.FCP) {
      const fcpMatch = speedData.metrics.FCP.match(/(\d+(?:\.\d+)?)/);
      if (fcpMatch) {
        const value = parseFloat(fcpMatch[1]);
        return speedData.metrics.FCP.includes('s') ? Math.round(value * 1000) : Math.round(value);
      }
    }
  }
  
  // Fallback to basic timing (when PageSpeed API is not used)
  return speedData.basic?.timeMs || 0;
};

export default function UserDashboard({ user, token, onLogout, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newProject, setNewProject] = useState({ name: '', url: '' });
  const [showNewProject, setShowNewProject] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [savedReports, setSavedReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const buttonRefs = useRef({});
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaving, setApiKeySaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (user.tier === 'pro') {
      fetchProjects();
    }
    // Fetch usage data for all users (free users need to see their limits)
    fetchUsageData();
  }, []);

  // Fetch saved reports when reports tab becomes active
  useEffect(() => {
    if (activeTab === 'reports' && user.tier === 'pro') {
      fetchSavedReports();
    }
  }, [activeTab, user.tier]);

  // Close tooltip when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking inside the tooltip
      if (e.target.closest('.fix-tooltip-portal')) {
        return
      }
      setOpenTooltip(null)
    }
    
    const handleScroll = () => {
      setOpenTooltip(null)
    }
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenTooltip(null)
      }
    }
    
    if (openTooltip !== null) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('scroll', handleScroll, true)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [openTooltip]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    if (user.tier === 'pro') return; // Pro users don't have limits
    
    setLoadingUsage(true);
    try {
      const response = await fetch(`${API_BASE}/api/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchSavedReports = async () => {
    console.log('Fetching saved reports for pro user...');
    setLoadingReports(true);
    try {
      const response = await axios.get(`${API_BASE}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Saved reports fetched successfully:', response.data);
      setSavedReports(response.data);
    } catch (err) {
      console.error('Failed to fetch saved reports:', err.response?.data || err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  const createProject = async () => {
    try {
      const response = await axios.post(`${API_BASE}/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([...projects, response.data]);
      setNewProject({ name: '', url: '' });
      setShowNewProject(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const runProjectAnalysis = async (project) => {
    setRunningAnalysis(project.id);
    
    try {
      // Normalize URL - add https:// if no protocol
      let normalizedUrl = project.url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      
      console.log(`Running analysis for ${project.name} - ${normalizedUrl}`);
      
      let results;
      try {
        // Use the new combined project analysis endpoint that only increments usage once
        const response = await axios.get(`${API_BASE}/project-analysis`, {
          params: { url: normalizedUrl, strategy: 'mobile' },
          headers: { Authorization: `Bearer ${token}` }
        });

        results = response.data;

        // Only show error if both analyses failed
        if (results.seo.error && results.speed.error) {
          alert('Analysis failed. Both SEO and speed analysis encountered errors.');
          return;
        }
      } catch (error) {
        console.error('Analysis failed:', error);
        alert('Analysis failed. Please try again.');
        return;
      }

      // Store results in state
      setAnalysisResults(prev => ({
        ...prev,
        [project.id]: results
      }));

      // Save report to database for Pro users
      try {
        console.log(`Attempting to save report for project ${project.id}:`, {
          seoData: results.seo?.error ? null : results.seo,
          speedData: results.speed?.error ? null : results.speed,
          url: normalizedUrl
        });
        
        const saveResponse = await axios.post(`${API_BASE}/projects/${project.id}/reports`, {
          seoData: results.seo?.error ? null : results.seo,
          speedData: results.speed?.error ? null : results.speed,
          url: normalizedUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Report saved successfully to database:', saveResponse.data);
        
        // Always refresh saved reports and projects after successful analysis
        console.log('Refreshing saved reports and projects...');
        fetchSavedReports();
        fetchProjects(); // Refresh projects to get updated metrics
      } catch (saveError) {
        console.error('Failed to save report:', saveError.response?.data || saveError.message);
        alert('Warning: Analysis completed but report saving failed. Please check console for details.');
      }

      // Update project's last_scan timestamp
      setProjects(prev => prev.map(p => 
        p.id === project.id 
          ? { ...p, last_scan: results.timestamp }
          : p
      ));

      // Refresh profile to update "Reports Today" counter
      await fetchProfile();

      console.log('Analysis completed:', results);
      
      // Show partial success message if only one analysis failed
      if (results.seo.error) {
        alert('Analysis completed with SEO analysis error. Speed analysis was successful.');
      } else if (results.speed.error) {
        alert('Analysis completed with speed analysis error. SEO analysis was successful.');
      }
      
    } finally {
      setRunningAnalysis(null);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated reports.`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/projects/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from projects list
      setProjects(prev => prev.filter(p => p.id !== project.id));
      
      // Remove analysis results
      setAnalysisResults(prev => {
        const { [project.id]: deleted, ...rest } = prev;
        return rest;
      });

      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    onLogout();
  };

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      alert('Please enter an API key');
      return;
    }

    setApiKeySaving(true);
    try {
      const response = await axios.put(`${API_BASE}/auth/profile/pagespeed-api-key`, {
        apiKey: apiKeyInput.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setShowApiKeyForm(false);
        setApiKeyInput('');
        alert('PageSpeed API key saved successfully! Advanced metrics are now enabled.');
        // Refresh profile to get updated API key status
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to save API key:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save API key';
      alert(errorMessage);
    } finally {
      setApiKeySaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    if (!window.confirm('Are you sure you want to remove your PageSpeed API key? This will disable advanced Lighthouse metrics.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE}/auth/profile/pagespeed-api-key`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('PageSpeed API key removed successfully.');
        // Refresh profile to get updated API key status
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to remove API key:', err);
      const errorMessage = err.response?.data?.error || 'Failed to remove API key';
      alert(errorMessage);
    }
  };

  const handleFixClick = (projectId, index, e) => {
    e.stopPropagation()
    
    const tooltipKey = `${projectId}-${index}`;
    
    if (openTooltip === tooltipKey) {
      setOpenTooltip(null)
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      const tooltipWidth = 320
      const tooltipHeight = 200
      
      // Position above and to the left of button
      let x = rect.right - tooltipWidth
      let y = rect.top - tooltipHeight - 12
      
      // Adjust if off screen
      if (y < 10) y = rect.bottom + 12
      if (x < 10) x = 10
      if (x + tooltipWidth > window.innerWidth - 10) {
        x = window.innerWidth - tooltipWidth - 10
      }
      
      setTooltipPosition({ x, y })
      setOpenTooltip(tooltipKey)
    }
  }

  const getFixInstructions = (issue) => {
    const fixes = {
      'Missing <title>': {
        title: 'Add Page Title',
        description: 'Every page needs a unique, descriptive title tag.',
        instructions: '• Add <title>Your Page Title</title> in the <head> section\n• Keep it 50-60 characters long\n• Make it unique and descriptive\n• Include your main keyword naturally'
      },
      'Missing meta description': {
        title: 'Add Meta Description',
        description: 'Meta descriptions help search engines understand your page content.',
        instructions: '• Add <meta name="description" content="Your description"> in <head>\n• Keep it 150-160 characters long\n• Make it compelling and accurate\n• Include relevant keywords naturally'
      },
      '<html lang> attribute missing': {
        title: 'Add Language Attribute',
        description: 'Specify the language of your page for accessibility and SEO.',
        instructions: '• Add lang="en" to your <html> tag\n• Use appropriate language code (en, es, fr, etc.)\n• This helps screen readers and search engines\n• Required for accessibility compliance'
      },
      'Missing canonical link tag': {
        title: 'Add Canonical URL',
        description: 'Prevent duplicate content issues with canonical tags.',
        instructions: '• Add <link rel="canonical" href="https://yourdomain.com/page"> in <head>\n• Use your preferred URL version\n• Helps consolidate link equity\n• Prevents duplicate content penalties'
      },
      'Missing Open Graph title/description': {
        title: 'Add Social Media Tags',
        description: 'Optimize how your page appears when shared on social media.',
        instructions: '• Add <meta property="og:title" content="Your Title">\n• Add <meta property="og:description" content="Description">\n• Add <meta property="og:image" content="image-url">\n• Improves social media sharing appearance'
      },
      'Add structured data markup': {
        title: 'Implement Schema Markup',
        description: 'Help search engines understand your content better.',
        instructions: '• Add JSON-LD structured data to your pages\n• Use schema.org vocabulary\n• Include relevant business/content types\n• Test with Google\'s Rich Results Test tool'
      },
      'Address accessibility issues': {
        title: 'Improve Accessibility',
        description: 'Make your website accessible to all users.',
        instructions: '• Add alt text to all images\n• Ensure proper heading hierarchy (H1→H2→H3)\n• Use sufficient color contrast\n• Add keyboard navigation support'
      },
      'Improve server configuration and security headers': {
        title: 'Enhance Security Headers',
        description: 'Improve website security and performance.',
        instructions: '• Add Content-Security-Policy header\n• Enable HSTS (HTTP Strict Transport Security)\n• Add X-Frame-Options header\n• Enable compression (gzip/brotli)'
      }
    };

    // Default fallback for issues not in the list
    const defaultFix = {
      title: 'SEO Improvement Required',
      description: 'This issue affects your search engine optimization.',
      instructions: '• Review the specific issue mentioned\n• Research best practices for this SEO element\n• Implement the recommended changes\n• Test your changes and monitor results'
    };

    return fixes[issue] || defaultFix;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const usagePercentage = profile?.usage?.limit === 'unlimited' 
    ? 0 
    : (profile?.usage?.today / profile?.usage?.limit) * 100;

  return (
    <div className="user-dashboard">
      <div className="welcome-section">
        <div className={`welcome-card ${user.tier}`}>
          <div className="welcome-content">
            <div className="welcome-left">
              <div className="greeting">
                <span className="wave-emoji">👋</span>
                <h2>Welcome back!</h2>
              </div>
              <div className="user-info-section">
                <span className="username">@{user.username}</span>
                <span className={`tier-badge ${user.tier}`}>
                  {user.tier === 'free' ? (
                    <>
                      <span className="tier-icon">🆓</span>
                      <span>Free Plan</span>
                    </>
                  ) : (
                    <>
                      <span className="tier-icon">⭐</span>
                      <span>Pro Plan</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="welcome-right">
              {user.tier === 'free' && (
                <button 
                  onClick={() => setShowPricingModal(true)} 
                  className="upgrade-button-small"
                >
                  <span>🚀</span>
                  <span>Upgrade</span>
                </button>
              )}
              <button onClick={handleLogout} className="logout-button">
                <span className="logout-icon">⏻</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tracking for Free Users */}
      {user.tier === 'free' && (
        <div className="usage-section">
          <div className="usage-card">
            <div className="usage-header">
              <h3>📊 Daily Usage</h3>
              <span className="usage-date">{new Date().toLocaleDateString()}</span>
            </div>
            {loadingUsage ? (
              <div className="usage-loading">Loading usage data...</div>
            ) : usageData ? (
              <>
                <div className="usage-bar-container">
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(usageData.scansUsed / usageData.dailyLimit) * 100}%` }}
                    />
                  </div>
                  <div className="usage-text">
                    <span>{usageData.scansUsed} / {usageData.dailyLimit} scans used</span>
                    <span className={`remaining ${usageData.scansRemaining === 0 ? 'limit-reached' : ''}`}>
                      {usageData.scansRemaining} remaining
                    </span>
                  </div>
                </div>
                {usageData.scansRemaining === 0 && (
                  <div className="usage-limit-message">
                    <span>🚫 Daily limit reached!</span>
                    <button 
                      onClick={() => setShowPricingModal(true)} 
                      className="upgrade-button-inline"
                    >
                      Upgrade for unlimited scans
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="usage-error">Unable to load usage data</div>
            )}
          </div>
        </div>
      )}

      {user.tier === 'pro' && (
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      )}

      {activeTab === 'overview' && (
        <>

          {/* Google PageSpeed API Key Management Card */}
          <div className="card pagespeed-api-card">
            <div className="pagespeed-header">
              <div className="header-main">
                <div className="header-icon">
                  <div className="lighthouse-beacon"></div>
                  <span className="main-icon">🚀</span>
                </div>
                <div className="header-content">
                  <h4>Google PageSpeed API</h4>
                  <p>Unlock advanced Lighthouse performance metrics</p>
                </div>
              </div>
              <div className="header-actions">
                <div className="api-status-badge">
                  {profile?.pagespeedApi?.hasKey ? (
                    <div className="status-badge connected">
                      <div className="status-dot"></div>
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="status-badge disconnected">
                      <div className="status-dot"></div>
                      <span>Setup Required</span>
                    </div>
                  )}
                </div>
                <button 
                  className="help-trigger"
                  onClick={() => onNavigate('pagespeed-api-docs')}
                  title="Learn about PageSpeed API"
                >
                  <span className="help-icon">?</span>
                  <span className="help-text">What's this?</span>
                </button>
              </div>
            </div>
            
            <div className="pagespeed-content">
              
              {profile?.pagespeedApi?.hasKey ? (
                <div className="connected-state">
                  <div className="success-message">
                    <div className="success-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <div className="success-text">
                      <h5>API Key Active</h5>
                      <p>Your PageSpeed API is configured and ready to provide detailed performance insights.</p>
                    </div>
                  </div>
                  
                  <div className="active-features">
                    <div className="features-grid">
                      <div className="feature-item active">
                        <div className="feature-icon">⚡</div>
                        <div className="feature-text">
                          <strong>Core Web Vitals</strong>
                          <span>LCP, FID, CLS metrics</span>
                        </div>
                      </div>
                      <div className="feature-item active">
                        <div className="feature-icon">📊</div>
                        <div className="feature-text">
                          <strong>Performance Score</strong>
                          <span>0-100 Lighthouse rating</span>
                        </div>
                      </div>
                      <div className="feature-item active">
                        <div className="feature-icon">🎯</div>
                        <div className="feature-text">
                          <strong>Optimization Tips</strong>
                          <span>Actionable improvements</span>
                        </div>
                      </div>
                      <div className="feature-item active">
                        <div className="feature-icon">🔍</div>
                        <div className="feature-text">
                          <strong>Detailed Analysis</strong>
                          <span>Complete audit reports</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="key-info">
                    <div className="key-display">
                      <span className="key-label">API Key:</span>
                      <code className="masked-key">{profile.pagespeedApi.maskedKey}</code>
                    </div>
                  </div>
                  
                  <div className="management-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowApiKeyForm(true)}
                    >
                      <span className="btn-icon">🔄</span>
                      Update Key
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={handleRemoveApiKey}
                    >
                      <span className="btn-icon">🗑️</span>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="setup-state">
                  <div className="setup-intro">
                    <div className="intro-content">
                      <h5>Unlock Advanced Performance Insights</h5>
                      <p>Configure your Google PageSpeed API key to access detailed Lighthouse metrics and optimization recommendations.</p>
                    </div>
                  </div>
                  
                  <div className="features-preview">
                    <div className="features-grid">
                      <div className="feature-item preview">
                        <div className="feature-icon">⚡</div>
                        <div className="feature-text">
                          <strong>Core Web Vitals</strong>
                          <span>LCP, FID, CLS metrics</span>
                        </div>
                        <div className="feature-lock">🔒</div>
                      </div>
                      <div className="feature-item preview">
                        <div className="feature-icon">📊</div>
                        <div className="feature-text">
                          <strong>Performance Score</strong>
                          <span>0-100 Lighthouse rating</span>
                        </div>
                        <div className="feature-lock">🔒</div>
                      </div>
                      <div className="feature-item preview">
                        <div className="feature-icon">🎯</div>
                        <div className="feature-text">
                          <strong>Optimization Tips</strong>
                          <span>Actionable improvements</span>
                        </div>
                        <div className="feature-lock">🔒</div>
                      </div>
                      <div className="feature-item preview">
                        <div className="feature-icon">🔍</div>
                        <div className="feature-text">
                          <strong>Detailed Analysis</strong>
                          <span>Complete audit reports</span>
                        </div>
                        <div className="feature-lock">🔒</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="setup-cta">
                    <button 
                      className="btn-primary large"
                      onClick={() => setShowApiKeyForm(true)}
                    >
                      <span className="btn-icon">🔑</span>
                      Configure API Key
                    </button>
                    <button 
                      className="btn-outline"
                      onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                    >
                      <span className="btn-icon">📖</span>
                      How to Get API Key
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user.tier === 'free' && (
            <div className="upgrade-section" style={{ marginTop: '2rem' }}>
              <div className="upgrade-card">
                <h4>🚀 Upgrade to Pro</h4>
                <div className="pro-features">
                  <ul>
                    <li>✅ Unlimited daily reports</li>
                    <li>✅ Project management & tracking</li>
                    <li>✅ Historical data & trends</li>
                    <li>✅ Advanced SEO metrics</li>
                    <li>✅ Export reports & analytics</li>
                    <li>✅ Competitor monitoring</li>
                    <li>✅ Custom alerts & notifications</li>
                  </ul>
                </div>
                <button 
                  className="upgrade-button" 
                  onClick={() => setShowPricingModal(true)}
                >
                  Upgrade to Pro - $4.99/month
                </button>
                <p className="upgrade-note">
                  Unlock unlimited SEO analysis, project management, and advanced features!
                </p>
              </div>
            </div>
          )}

          {user.tier === 'pro' && (
            <div className="pro-benefits-section">
              <div className="pro-benefits-card">
                <h4>✨ Pro Member Benefits</h4>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="benefit-icon">🚀</div>
                    <div className="benefit-text">
                      <h5>Unlimited Reports</h5>
                      <p>Run as many SEO analyses as you need, anytime</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📊</div>
                    <div className="benefit-text">
                      <h5>Project Management</h5>
                      <p>Track multiple websites and monitor progress</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📈</div>
                    <div className="benefit-text">
                      <h5>Advanced Analytics</h5>
                      <p>Historical data, trends, and detailed insights</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🎯</div>
                    <div className="benefit-text">
                      <h5>Priority Support</h5>
                      <p>Get faster responses and dedicated assistance</p>
                    </div>
                  </div>
                </div>
                <div className="pro-status">
                  <span className="status-indicator">🟢</span>
                  <span className="status-text">Pro membership active</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {(activeTab === 'projects' || activeTab === 'reports') && user.tier === 'pro' && (
        <>
          {activeTab === 'projects' && (
            <div 
              className="purple-projects-page"
              style={window.innerWidth <= 768 ? {
                padding: '12px',
                width: 'calc(100% - 24px)',
                maxWidth: 'none',
                overflow: 'hidden',
                boxSizing: 'border-box'
              } : {}}
            >
              {/* Main Content Card */}
              <div 
                className="projects-main-card"
                style={window.innerWidth <= 768 ? {
                  padding: '20px',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                } : {}}
              >
                <div className="projects-card-header">
                  <span className="projects-badge">🚀 Project Management</span>
                  <h1 
                    className="projects-title"
                    style={window.innerWidth <= 768 ? {
                      fontSize: '28px',
                      lineHeight: '1.3',
                      wordWrap: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    } : {}}
                  >
                    Manage Your Website's
                    <span className="gradient-text"> SEO Projects</span>
                  </h1>
                  <p 
                    className="projects-subtitle"
                    style={window.innerWidth <= 768 ? {
                      fontSize: '16px',
                      wordWrap: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    } : {}}
                  >
                    Get instant insights into your website's SEO health with our comprehensive project management tool.
                  </p>
                  
                  <button 
                    className="new-project-btn"
                    onClick={() => setShowNewProject(true)}
                  >
                    Create New Project
                    <span className="btn-arrow">→</span>
                  </button>
                </div>

                <div 
                  className="projects-stats"
                  style={window.innerWidth <= 768 ? {
                    flexDirection: 'column',
                    gap: '16px',
                    marginTop: '24px',
                    justifyContent: 'center',
                    maxWidth: '100vw',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  } : {}}
                >
                  <div 
                    className="stat-item"
                    style={window.innerWidth <= 768 ? {
                      padding: '16px',
                      minWidth: '0',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    } : {}}
                  >
                    <div 
                      className="stat-value"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '28px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      {projects.length}
                    </div>
                    <div 
                      className="stat-label"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '10px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      TOTAL PROJECTS
                    </div>
                  </div>
                  
                  <div 
                    className="stat-item"
                    style={window.innerWidth <= 768 ? {
                      padding: '16px',
                      minWidth: '0',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    } : {}}
                  >
                    <div 
                      className="stat-value"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '28px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      {projects.length > 0 ? (() => {
                        const scores = projects.map(p => analysisResults[p.id]?.seo?.score || p.last_seo_score).filter(s => s);
                        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—';
                      })() : '—'}
                    </div>
                    <div 
                      className="stat-label"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '10px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      AVG SCORE
                    </div>
                  </div>
                  
                  <div 
                    className="stat-item"
                    style={window.innerWidth <= 768 ? {
                      padding: '16px',
                      minWidth: '0',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    } : {}}
                  >
                    <div 
                      className="stat-value"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '28px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      {projects.length > 0 ? (() => {
                        const lastScan = Math.max(...projects.map(p => p.last_scan ? new Date(p.last_scan).getTime() : 0));
                        if (lastScan === 0) return '—';
                        const daysSince = Math.max(0, Math.floor((Date.now() - lastScan) / (1000 * 60 * 60 * 24)));
                        return `${daysSince}d`;
                      })() : '—'}
                    </div>
                    <div 
                      className="stat-label"
                      style={window.innerWidth <= 768 ? {
                        fontSize: '10px',
                        wordWrap: 'break-word'
                      } : {}}
                    >
                      LAST CHECK
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects List Section */}
              {projects.length === 0 ? (
                <div className="empty-projects-state">
                  <div className="empty-icon-wrapper">
                    <span className="empty-icon">📁</span>
                  </div>
                  <h3>No Projects Yet</h3>
                  <p>Start tracking your website's SEO performance by creating your first project.</p>
                  <button 
                    className="start-project-btn"
                    onClick={() => setShowNewProject(true)}
                  >
                    Get Started →
                  </button>
                </div>
              ) : (
                <div className="projects-list-container">
                  <div className="projects-list-header">
                    <h2>Your Projects</h2>
                    <span className="projects-count">{projects.length} total</span>
                  </div>

                  <div className="projects-grid">
                    {projects.map(project => {
                      const isRunning = runningAnalysis === project.id;
                      const results = analysisResults[project.id];
                      const seoScore = results?.seo?.score || project.last_seo_score || 0;
                      const speedTime = results?.speed ? getSpeedDisplayTime(results.speed) : 0;
                      const issuesCount = (results?.seo?.freeIssues?.length || 0) + (results?.seo?.proIssues?.length || 0);
                      
                      return (
                        <div key={project.id} className="purple-project-card">
                          <div className="project-card-body">
                            <div className="project-header">
                              <div className="project-icon">🌐</div>
                              <div className="project-info">
                                <h3>{project.name}</h3>
                                <p className="project-url">{project.url}</p>
                              </div>
                              <button 
                                className="project-delete"
                                onClick={() => deleteProject(project)}
                                title="Delete project"
                              >
                                ×
                              </button>
                            </div>

                            <div className="project-stats-row">
                              <div className="project-stat">
                                <div className={`stat-circle ${seoScore >= 80 ? 'good' : seoScore >= 60 ? 'ok' : 'bad'}`}>
                                  {seoScore}
                                </div>
                                <span className="stat-name">SEO Score</span>
                              </div>

                              <div className="project-stat">
                                <div className={`stat-circle ${speedTime <= 500 ? 'good' : speedTime <= 1000 ? 'ok' : 'bad'}`}>
                                  {speedTime}ms
                                </div>
                                <span className="stat-name">Load Time</span>
                              </div>

                              <div className="project-stat">
                                <div className={`stat-circle ${issuesCount === 0 ? 'good' : issuesCount <= 5 ? 'ok' : 'bad'}`}>
                                  {issuesCount}
                                </div>
                                <span className="stat-name">Issues</span>
                              </div>
                            </div>

                            <div className="project-footer">
                              <button 
                                className={`analyze-project-btn ${isRunning ? 'loading' : ''}`}
                                onClick={() => runProjectAnalysis(project)}
                                disabled={isRunning}
                              >
                                {isRunning ? (
                                  <>
                                    <span className="btn-spinner"></span>
                                    Analyzing...
                                  </>
                                ) : (
                                  'Analyze Now →'
                                )}
                              </button>
                              
                              {results && (
                                <button 
                                  className="view-report-btn"
                                  onClick={() => setActiveTab('report-detail-' + project.id)}
                                >
                                  View Report
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Project Modal */}
              {showNewProject && (
                <div className="project-modal-overlay">
                  <div className="project-modal">
                    <div className="modal-header">
                      <div className="modal-title">
                        <span className="modal-icon">🚀</span>
                        <h3>Create New Project</h3>
                      </div>
                      <button 
                        className="modal-close-btn"
                        onClick={() => setShowNewProject(false)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="modal-content">
                      <div className="form-section">
                        <div className="form-group">
                          <label className="form-label">Project Name</label>
                          <input
                            type="text"
                            placeholder="e.g., My Website"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Website URL</label>
                          <input
                            type="url"
                            placeholder="https://example.com"
                            value={newProject.url}
                            onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => setShowNewProject(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="create-btn"
                        onClick={createProject}
                        disabled={!newProject.name.trim() || !newProject.url.trim()}
                      >
                        <span className="btn-icon">✨</span>
                        Create Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
          <div className="reports-header-section">
            <div className="reports-title">
              <h4>⚡ Analysis Reports History</h4>
              <p className="reports-subtitle">View and analyze your recent SEO performance reports</p>
            </div>
          </div>
          
          <div className="reports-content">
            {loadingReports ? (
              <div className="loading-reports">
                <div className="loading-spinner"></div>
                <p>Loading your reports...</p>
              </div>
            ) : savedReports.length === 0 ? (
              <div className="no-reports">
                <div className="no-reports-icon">📊</div>
                <h5>No Reports Yet</h5>
                <p>Run analysis from the Projects tab to generate your first report.</p>
                <button 
                  className="create-report-btn"
                  onClick={() => setActiveTab('projects')}
                >
                  Create Your First Report
                </button>
              </div>
            ) : (
              <div className="reports-grid">
                <div className="project-reports-card">
                  <div className="project-card-header">
                    <div className="project-info">
                      <h5 className="project-name">Recent Analysis Reports</h5>
                      <p className="project-url">Last 6 reports from all projects</p>
                    </div>
                    <div className="reports-count-badge">
                      {savedReports.length} report{savedReports.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="reports-timeline">
                    {savedReports.slice(0, 6).map((report, index) => {
                      const reportDate = new Date(report.created_at);
                      const now = new Date();
                      const diffTime = Math.abs(now - reportDate);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      const getRelativeTime = (date) => {
                        const now = new Date();
                        const diffMs = now - date;
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        
                        if (diffMins < 1) return 'Just now';
                        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                        });
                      };
                      
                      const isMobile = window.innerWidth <= 768;
                      
                      return (
                        <div 
                          key={report.id} 
                          className={`report-card ${index === 0 ? 'latest' : ''}`}
                          style={isMobile ? {
                            maxWidth: '100vw',
                            width: '100%',
                            overflow: 'hidden',
                            boxSizing: 'border-box'
                          } : {}}
                        >
                          <div className="report-timeline-marker">
                            {index === 0 && <div className="latest-indicator">Latest</div>}
                          </div>
                          
                          <div 
                            className="report-card-content"
                            style={isMobile ? {
                              maxWidth: '100%',
                              overflow: 'hidden',
                              boxSizing: 'border-box'
                            } : {}}
                          >
                            <div 
                              className="report-card-header"
                              style={isMobile ? {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '12px',
                                maxWidth: '100%',
                                overflow: 'hidden'
                              } : {}}
                            >
                              <div 
                                className="project-info-inline"
                                style={isMobile ? {
                                  width: '100%',
                                  maxWidth: '100%',
                                  overflow: 'hidden'
                                } : {}}
                              >
                                <h6 
                                  className="report-project-name"
                                  style={isMobile ? {
                                    fontSize: '16px',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100%',
                                    overflow: 'hidden'
                                  } : {}}
                                >
                                  {report.project_name}
                                </h6>
                                <span 
                                  className="report-project-url"
                                  style={isMobile ? {
                                    fontSize: '12px',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100%',
                                    overflow: 'hidden'
                                  } : {}}
                                >
                                  {report.project_url}
                                </span>
                              </div>
                              <div className="report-timestamp">
                                <span className="relative-time">{getRelativeTime(reportDate)}</span>
                                <span className="full-time">
                                  {reportDate.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              <button 
                                className="view-report-btn modern"
                                onClick={() => setActiveTab('saved-report-detail-' + report.id)}
                                title="View detailed report"
                                style={isMobile ? {
                                  width: '100%',
                                  padding: '10px 16px',
                                  fontSize: '14px',
                                  marginTop: '8px'
                                } : {}}
                              >
                                <span className="btn-icon">👁</span>
                                View
                              </button>
                            </div>
                            
                            <div 
                              className="report-metrics"
                              style={isMobile ? {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '8px',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                boxSizing: 'border-box'
                              } : {}}
                            >
                              <div 
                                className="metric-card seo"
                                style={isMobile ? {
                                  minWidth: '0',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  boxSizing: 'border-box',
                                  padding: '12px 6px'
                                } : {}}
                              >
                                <div className="metric-icon">🔍</div>
                                <div className="metric-info">
                                  <span 
                                    className="metric-label"
                                    style={isMobile ? {
                                      fontSize: '10px',
                                      wordWrap: 'break-word'
                                    } : {}}
                                  >
                                    SEO Score
                                  </span>
                                  {!report.report_data.seo ? (
                                    <span className="metric-value error">Error</span>
                                  ) : (
                                    <div className="score-display">
                                      <span className={`metric-value ${(report.report_data.seo?.score || 0) >= 80 ? 'excellent' : (report.report_data.seo?.score || 0) >= 60 ? 'good' : (report.report_data.seo?.score || 0) >= 40 ? 'fair' : 'poor'}`}>
                                        {report.report_data.seo?.score || 0}
                                      </span>
                                      <span className="score-max">{'/'} 100</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div 
                                className="metric-card speed"
                                style={isMobile ? {
                                  minWidth: '0',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  boxSizing: 'border-box',
                                  padding: '12px 6px'
                                } : {}}
                              >
                                <div className="metric-icon">⚡</div>
                                <div className="metric-info">
                                  <span 
                                    className="metric-label"
                                    style={isMobile ? {
                                      fontSize: '10px',
                                      wordWrap: 'break-word'
                                    } : {}}
                                  >
                                    Load Time
                                  </span>
                                  {!report.report_data.speed ? (
                                    <span className="metric-value error">Error</span>
                                  ) : (
                                    <span className={`metric-value ${getSpeedDisplayTime(report.report_data.speed) <= 200 ? 'excellent' : getSpeedDisplayTime(report.report_data.speed) <= 500 ? 'good' : getSpeedDisplayTime(report.report_data.speed) <= 1000 ? 'fair' : 'poor'}`}>
                                      {getSpeedDisplayTime(report.report_data.speed)}ms
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div 
                                className="metric-card issues"
                                style={isMobile ? {
                                  minWidth: '0',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  boxSizing: 'border-box',
                                  padding: '12px 6px'
                                } : {}}
                              >
                                <div className="metric-icon">⚠️</div>
                                <div className="metric-info">
                                  <span 
                                    className="metric-label"
                                    style={isMobile ? {
                                      fontSize: '10px',
                                      wordWrap: 'break-word'
                                    } : {}}
                                  >
                                    Issues
                                  </span>
                                  {!report.report_data.seo ? (
                                    <span className="metric-value error">Error</span>
                                  ) : (
                                    <span className={`metric-value ${((report.report_data.seo?.freeIssues?.length || 0) + (report.report_data.seo?.proIssues?.length || 0)) === 0 ? 'excellent' : ((report.report_data.seo?.freeIssues?.length || 0) + (report.report_data.seo?.proIssues?.length || 0)) <= 3 ? 'good' : ((report.report_data.seo?.freeIssues?.length || 0) + (report.report_data.seo?.proIssues?.length || 0)) <= 6 ? 'fair' : 'poor'}`}>
                                      {(report.report_data.seo?.freeIssues?.length || 0) + (report.report_data.seo?.proIssues?.length || 0)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {index === 0 && (
                              <div className="latest-report-badge">
                                <span>Most Recent</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
            </div>
          )}
        </>
      )}

      {/* Detailed Report Views - Using same components as main analysis pages */}
      {projects.map(project => {
        if (activeTab !== 'report-detail-' + project.id) return null;
        const results = analysisResults[project.id];
        if (!results) return null;

        return (
          <div key={`report-${project.id}`} className="report-detail-section">
            <div className="report-detail-header">
              <button 
                className="back-btn"
                onClick={() => setActiveTab('reports')}
              >
                ← Back to Reports
              </button>
              <h4>{project.name} - Complete Analysis Report</h4>
              <p className="report-detail-url">{project.url}</p>
              <p className="report-detail-date">
                Generated: {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>

            {/* SEO Analysis Section - Identical to main SEO page */}
            {results.seo && !results.seo.error && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>🔍 SEO Analysis Report</h3>
                  <ScoreBadge score={results.seo.score || 0} />
                </div>
                
                <div className="analysis-grid">
                  <ResultCard
                    title="Social/Sharing"
                    items={[
                      ['Open Graph Title', results.seo.metrics?.og?.title || '—'],
                      ['Open Graph Description', results.seo.metrics?.og?.description || '—'],
                      ['Open Graph Image', results.seo.metrics?.og?.image || '—'],
                      ['Twitter Card', results.seo.metrics?.twitterCard || '—'],
                      ['Social Media Readiness', (results.seo.metrics?.og?.title && results.seo.metrics?.og?.description) ? 'Good' : 'Needs Work'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Links"
                    items={[
                      ['Total Links', results.seo.metrics?.linkTotals?.total || '—'],
                      ['Internal Links', results.seo.metrics?.linkTotals?.internal || '—'],
                      ['External Links', results.seo.metrics?.linkTotals?.external || '—'],
                      ['Link Quality', results.seo.metrics?.linkTotals?.total > 0 ? 'Present' : 'Missing'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Basics"
                    items={[
                      ['Title', results.seo.metrics?.title || '—'],
                      ['Meta Description', results.seo.metrics?.metaDescription || '—'],
                      ['Language', results.seo.metrics?.lang || '—'],
                      ['Viewport', results.seo.metrics?.viewport || '—'],
                      ['Canonical URL', results.seo.metrics?.canonical || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Headings & Content"
                    items={[
                      ['H1 Count', results.seo.metrics?.h1Count || '—'],
                      ['Header Hierarchy', results.seo.metrics?.headerHierarchy?.isGood ? 'Good' : (results.seo.metrics?.headerHierarchy?.issue || 'Poor')],
                      ['Word Count', results.seo.wordCount || '—'],
                      ['Content Quality', results.seo.wordCount > 300 ? 'Good' : 'Needs More Content'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Content Structure"
                    items={[
                      ['Images Count', results.seo.metrics?.imgCount || '—'],
                      ['Images Missing Alt', results.seo.metrics?.imgsMissingAlt || '—'],
                      ['Alt Text Coverage', results.seo.metrics?.imgCount > 0 ? `${Math.round(((results.seo.metrics?.imgCount - results.seo.metrics?.imgsMissingAlt) / results.seo.metrics?.imgCount) * 100) || 0}%` : '—'],
                      ['JSON-LD Blocks', results.seo.metrics?.jsonLdCount || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Keywords"
                    items={[
                      ['Title Keywords', results.seo.metrics?.title ? 'Present' : 'Missing'],
                      ['Meta Keywords', results.seo.metrics?.metaInformation?.keywords || '—'],
                      ['Keyword Density', 'Available in Pro'],
                      ['Focus Keywords', 'Available in Pro'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Technical SEO"
                    items={[
                      ['HTTPS', results.seo.metrics?.technical?.https ? 'Yes' : 'No'],
                      ['Robots Meta', results.seo.metrics?.metaInformation?.robotsMeta || '—'],
                      ['Schema Markup', results.seo.metrics?.jsonLdCount > 0 ? 'Present' : 'Missing'],
                      ['SSL Certificate', results.seo.metrics?.technical?.https ? 'Valid' : 'Missing'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Links & Navigation"
                    items={[
                      ['Navigation Links', results.seo.metrics?.linkTotals?.internal || '—'],
                      ['External References', results.seo.metrics?.linkTotals?.external || '—'],
                      ['Link Structure', (results.seo.metrics?.linkTotals?.internal > 5) ? 'Good' : 'Needs More Internal Links'],
                      ['Breadcrumbs', 'Check Manually'],
                    ]}
                  />
                </div>

                {/* Pro-tier Advanced Metrics */}
                {user.tier === 'pro' && (
                  <>
                    <div className="pro-metrics-header">
                      <h4>⭐ Advanced Pro Metrics</h4>
                      <span className="pro-badge">Pro Only</span>
                    </div>
                    
                    <div className="analysis-grid pro-metrics">
                      <ResultCard
                        title="Meta Information"
                        items={[
                          ['Completeness Score', `${results.seo.metrics?.metaInformation?.score || 0}/100`],
                          ['Meta Robots', results.seo.metrics?.metaInformation?.robotsMeta || '—'],
                          ['Meta Keywords', results.seo.metrics?.metaInformation?.keywords || '—'],
                          ['Meta Author', results.seo.metrics?.metaInformation?.author || '—'],
                          ['Dublin Core', results.seo.metrics?.metaInformation?.dublinCore ? 'Present' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Schema Markup"
                        items={[
                          ['Schema Score', `${results.seo.metrics?.schemaMarkup?.score || 0}/100`],
                          ['Structured Data Count', results.seo.metrics?.schemaMarkup?.count || 0],
                          ['JSON-LD Scripts', results.seo.metrics?.schemaMarkup?.jsonLdCount || 0],
                          ['Microdata Elements', results.seo.metrics?.schemaMarkup?.microdataCount || 0],
                          ['Schema Types', (results.seo.metrics?.schemaMarkup?.types || []).join(', ') || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Server Configuration"
                        items={[
                          ['Config Score', `${results.seo.metrics?.serverConfiguration?.score || 0}/100`],
                          ['Security Headers', results.seo.metrics?.serverConfiguration?.securityHeaders || 0],
                          ['Compression', results.seo.metrics?.serverConfiguration?.compression ? 'Enabled' : 'Disabled'],
                          ['Caching Headers', results.seo.metrics?.serverConfiguration?.caching ? 'Present' : 'Missing'],
                          ['Server Response', results.seo.metrics?.serverConfiguration?.serverHeader || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Accessibility"
                        items={[
                          ['Accessibility Score', `${results.seo.metrics?.accessibility?.score || 0}/100`],
                          ['Alt Text Coverage', `${results.seo.metrics?.accessibility?.altTextCoverage || 0}%`],
                          ['Heading Structure', results.seo.metrics?.accessibility?.headingStructure ? 'Good' : 'Needs Work'],
                          ['Color Contrast', results.seo.metrics?.accessibility?.colorContrast ? 'Good' : 'Check Needed'],
                          ['Focus Management', results.seo.metrics?.accessibility?.focusManagement ? 'Present' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Content Quality"
                        items={[
                          ['Content Score', `${results.seo.metrics?.contentQuality?.score || 0}/100`],
                          ['Word Count', results.seo.metrics?.contentQuality?.wordCount || 0],
                          ['Reading Level', results.seo.metrics?.contentQuality?.readingLevel || '—'],
                          ['Paragraph Count', results.seo.metrics?.contentQuality?.paragraphCount || 0],
                          ['Content Structure', results.seo.metrics?.contentQuality?.hasGoodStructure ? 'Good' : 'Needs Work'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Advanced Images"
                        items={[
                          ['Image Score', `${results.seo.metrics?.advancedImages?.score || 0}/100`],
                          ['Lazy Loading', results.seo.metrics?.advancedImages?.lazyLoading ? 'Implemented' : 'Missing'],
                          ['Modern Formats', `${results.seo.metrics?.advancedImages?.modernFormats || 0}%`],
                          ['Responsive Images', results.seo.metrics?.advancedImages?.responsiveImages ? 'Present' : 'Missing'],
                          ['Image Compression', results.seo.metrics?.advancedImages?.compression || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Mobile Friendly"
                        items={[
                          ['Mobile Score', `${results.seo.metrics?.mobileFriendly?.score || 0}/100`],
                          ['Responsive Design', results.seo.metrics?.mobileFriendly?.responsive ? 'Yes' : 'No'],
                          ['Touch Targets', results.seo.metrics?.mobileFriendly?.touchTargets ? 'Adequate' : 'Too Small'],
                          ['Mobile Speed', results.seo.metrics?.mobileFriendly?.speed || '—'],
                          ['Viewport Config', results.seo.metrics?.mobileFriendly?.viewportConfig ? 'Correct' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Security Analysis"
                        items={[
                          ['Security Score', `${results.seo.metrics?.security?.score || 0}/100`],
                          ['HTTPS Enforced', results.seo.metrics?.security?.httpsEnforced ? 'Yes' : 'No'],
                          ['CSP Header', results.seo.metrics?.security?.csp ? 'Present' : 'Missing'],
                          ['HSTS', results.seo.metrics?.security?.hsts ? 'Enabled' : 'Disabled'],
                          ['Security Vulnerabilities', results.seo.metrics?.security?.vulnerabilities || 0],
                        ]}
                      />
                    </div>
                  </>
                )}

                {/* Priority Fixes - Match main SEO analysis design */}
                {((results.seo.freeIssues?.length > 0) || (results.seo.proIssues?.length > 0)) && (
                  <div className="top-fixes-card">
                    <div className="top-fixes-header">
                      <div className="fix-icon">⚡</div>
                      <div className="fix-header-content">
                        <h3>Top Priority Fixes</h3>
                        <p>Address these issues to improve your SEO score</p>
                      </div>
                      <div className="fixes-count">
                        {(results.seo.freeIssues?.length || 0) + (results.seo.proIssues?.length || 0)}
                      </div>
                    </div>
                    
                    <div className="fixes-list">
                      {/* Free tier issues - always visible */}
                      {results.seo.freeIssues?.map((issue, i) => (
                        <div key={`free-${i}`} className="fix-item">
                          <div className="fix-priority">
                            <span className="priority-number">{i + 1}</span>
                          </div>
                          <div className="fix-content">
                            <div className="fix-text">{issue}</div>
                            <div className="fix-impact">High Impact</div>
                          </div>
                          <div className="fix-action">
                            <button className="fix-btn">
                              Fix
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pro tier issues - since dashboard is Pro-only, show them normally */}
                      {results.seo.proIssues?.map((issue, i) => (
                        <div key={`pro-${i}`} className="fix-item">
                          <div className="fix-priority">
                            <span className="priority-number">{(results.seo.freeIssues?.length || 0) + i + 1}</span>
                          </div>
                          <div className="fix-content">
                            <div className="fix-text">{issue}</div>
                            <div className="fix-impact">Advanced</div>
                          </div>
                          <div className="fix-action">
                            <button className="fix-btn">
                              Fix
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO Analysis Error */}
            {results.seo?.error && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>🔍 SEO Analysis Report</h3>
                  <div className="error-badge">
                    <span className="error-text">Error</span>
                  </div>
                </div>
                <div className="error-message">
                  <p>SEO analysis failed for this project. Please try running the analysis again or check the URL format.</p>
                </div>
              </div>
            )}

            {/* Speed Analysis Section */}
            {results.speed && !results.speed.error && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>⚡ Speed Analysis Report</h3>
                  {results.speed.performanceScore ? (
                    <ScoreBadge score={results.speed.performanceScore} label="Performance Score" />
                  ) : (
                    <div className="speed-badge">
                      <span className={`speed-time ${getSpeedDisplayTime(results.speed) <= 200 ? 'good' : getSpeedDisplayTime(results.speed) <= 500 ? 'ok' : 'bad'}`}>
                        {getSpeedDisplayTime(results.speed)}ms
                      </span>
                    </div>
                  )}
                </div>
                
                {results.speed.usingPageSpeedAPI ? (
                  <div className="analysis-grid">
                    <ResultCard
                      title="Core Web Vitals"
                      items={[
                        ['First Contentful Paint (FCP)', results.speed.metrics?.FCP || '—'],
                        ['Largest Contentful Paint (LCP)', results.speed.metrics?.LCP || '—'],
                        ['Cumulative Layout Shift (CLS)', results.speed.metrics?.CLS || '—']
                      ]}
                    />
                    
                    <ResultCard
                      title="Performance Metrics"
                      items={[
                        ['Total Blocking Time (TBT)', results.speed.metrics?.TBT || '—'],
                        ['Speed Index', results.speed.metrics?.SI || '—'],
                        ['Time to Interactive (TTI)', results.speed.metrics?.TTI || '—']
                      ]}
                    />

                    <ResultCard
                      title="Loading Analysis"
                      items={[
                        ['First Meaningful Paint', results.speed.metrics?.FMP || '—'],
                        ['DOM Content Loaded', results.speed.metrics?.DCL || '—'],
                        ['Full Load Time', results.speed.metrics?.Load || '—']
                      ]}
                    />

                    <ResultCard
                      title="Opportunities"
                      items={[
                        ['Unused JavaScript', results.speed.opportunities?.unusedJS || 'Not analyzed'],
                        ['Image Optimization', results.speed.opportunities?.images || 'Not analyzed'],
                        ['Render-blocking Resources', results.speed.opportunities?.renderBlocking || 'Not analyzed'],
                        ['Text Compression', results.speed.opportunities?.textCompression || 'Not analyzed'],
                        ['Modern Image Formats', results.speed.opportunities?.nextGenFormats || 'Not analyzed'],
                        ['Browser Caching', results.speed.opportunities?.efficientCaching || 'Not analyzed']
                      ]}
                    />

                    <ResultCard
                      title="Basic Performance"
                      items={[
                        ['Response Time', `${getSpeedDisplayTime(results.speed)}ms`],
                        ['Status Code', results.speed.basic?.status || '—'],
                        ['Response Size', `${Math.round((results.speed.basic?.bytes || 0) / 1024)}KB`],
                        ['Using PageSpeed API', 'Yes']
                      ]}
                    />
                  </div>
                ) : (
                  <div className="analysis-grid">
                    <ResultCard
                      title="Basic Performance"
                      items={[
                        ['Response Time', `${getSpeedDisplayTime(results.speed)}ms`],
                        ['Status Code', results.speed.basic?.status || '—'],
                        ['Response Size', `${Math.round((results.speed.basic?.bytes || 0) / 1024)}KB`],
                        ['Using PageSpeed API', 'No']
                      ]}
                    />
                  </div>
                )}

                {!results.speed.usingPageSpeedAPI && (
                  <div className="info-section">
                    <div className={`info-card ${user.tier === 'free' ? 'upgrade-needed' : ''}`}>
                      {user.tier === 'free' ? (
                        <>
                          <h5>🚀 Upgrade to Pro for Advanced Speed Analysis</h5>
                          <p>Get detailed Core Web Vitals, performance opportunities, and comprehensive speed metrics with PageSpeed Insights integration.</p>
                          <p className="note">{results.speed.note}</p>
                        </>
                      ) : (
                        <>
                          <h5>💡 Enhanced Speed Analysis Available</h5>
                          <p>Configure Google PageSpeed API key for detailed Core Web Vitals, performance opportunities, and comprehensive speed metrics.</p>
                          <p className="note">{results.speed.note}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Speed Analysis Error */}
            {results.speed?.error && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>⚡ Speed Analysis Report</h3>
                  <div className="error-badge">
                    <span className="error-text">Error</span>
                  </div>
                </div>
                <div className="error-message">
                  <p>Speed analysis failed for this project. Please try running the analysis again or check the URL format.</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Saved Report Detail Views */}
      {savedReports.map(report => {
        if (activeTab !== 'saved-report-detail-' + report.id) return null;
        const results = report.report_data;
        
        return (
          <div key={`saved-report-${report.id}`} className="report-detail-section">
            <div className="report-detail-header">
              <button 
                className="back-btn"
                onClick={() => setActiveTab('reports')}
              >
                ← Back to Reports
              </button>
              <h4>{report.project_name} - Saved Analysis Report</h4>
              <p className="report-detail-url">{report.project_url}</p>
              <p className="report-detail-date">
                Generated: {new Date(report.created_at).toLocaleString()}
              </p>
            </div>

            {/* SEO Analysis Section - Identical to main SEO page */}
            {results.seo && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>🔍 SEO Analysis Report</h3>
                  <ScoreBadge score={results.seo.score || 0} />
                </div>
                
                <div className="analysis-grid">
                  <ResultCard
                    title="Social/Sharing"
                    items={[
                      ['Open Graph Title', results.seo.metrics?.og?.title || '—'],
                      ['Open Graph Description', results.seo.metrics?.og?.description || '—'],
                      ['Open Graph Image', results.seo.metrics?.og?.image || '—'],
                      ['Twitter Card', results.seo.metrics?.twitterCard || '—'],
                      ['Social Media Readiness', (results.seo.metrics?.og?.title && results.seo.metrics?.og?.description) ? 'Good' : 'Needs Work'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Links"
                    items={[
                      ['Total Links', results.seo.metrics?.linkTotals?.total || '—'],
                      ['Internal Links', results.seo.metrics?.linkTotals?.internal || '—'],
                      ['External Links', results.seo.metrics?.linkTotals?.external || '—'],
                      ['Link Quality', results.seo.metrics?.linkTotals?.total > 0 ? 'Present' : 'Missing'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Basics"
                    items={[
                      ['Title', results.seo.metrics?.title || '—'],
                      ['Meta Description', results.seo.metrics?.metaDescription || '—'],
                      ['Language', results.seo.metrics?.lang || '—'],
                      ['Viewport', results.seo.metrics?.viewport || '—'],
                      ['Canonical URL', results.seo.metrics?.canonical || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Headings & Content"
                    items={[
                      ['H1 Count', results.seo.metrics?.h1Count || '—'],
                      ['Header Hierarchy', results.seo.metrics?.headerHierarchy?.isGood ? 'Good' : (results.seo.metrics?.headerHierarchy?.issue || 'Poor')],
                      ['Word Count', results.seo.wordCount || '—'],
                      ['Content Quality', results.seo.wordCount > 300 ? 'Good' : 'Needs More Content'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Content Structure"
                    items={[
                      ['Images Count', results.seo.metrics?.imgCount || '—'],
                      ['Images Missing Alt', results.seo.metrics?.imgsMissingAlt || '—'],
                      ['Alt Text Coverage', results.seo.metrics?.imgCount > 0 ? `${Math.round(((results.seo.metrics?.imgCount - results.seo.metrics?.imgsMissingAlt) / results.seo.metrics?.imgCount) * 100) || 0}%` : '—'],
                      ['JSON-LD Blocks', results.seo.metrics?.jsonLdCount || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Keywords"
                    items={[
                      ['Title Keywords', results.seo.metrics?.title ? 'Present' : 'Missing'],
                      ['Meta Keywords', results.seo.metrics?.metaInformation?.keywords || '—'],
                      ['Keyword Density', 'Available in Pro'],
                      ['Focus Keywords', 'Available in Pro'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Technical SEO"
                    items={[
                      ['HTTPS', results.seo.metrics?.technical?.https ? 'Yes' : 'No'],
                      ['Robots Meta', results.seo.metrics?.metaInformation?.robotsMeta || '—'],
                      ['Schema Markup', results.seo.metrics?.jsonLdCount > 0 ? 'Present' : 'Missing'],
                      ['SSL Certificate', results.seo.metrics?.technical?.https ? 'Valid' : 'Missing'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Links & Navigation"
                    items={[
                      ['Navigation Links', results.seo.metrics?.linkTotals?.internal || '—'],
                      ['External References', results.seo.metrics?.linkTotals?.external || '—'],
                      ['Link Structure', (results.seo.metrics?.linkTotals?.internal > 5) ? 'Good' : 'Needs More Internal Links'],
                      ['Breadcrumbs', 'Check Manually'],
                    ]}
                  />
                </div>

                {/* Pro-tier Advanced Metrics */}
                {user.tier === 'pro' && (
                  <>
                    <div className="pro-metrics-header">
                      <h4>⭐ Advanced Pro Metrics</h4>
                      <span className="pro-badge">Pro Only</span>
                    </div>
                    
                    <div className="analysis-grid pro-metrics">
                      <ResultCard
                        title="Meta Information"
                        items={[
                          ['Completeness Score', `${results.seo.metrics?.metaInformation?.score || 0}/100`],
                          ['Meta Robots', results.seo.metrics?.metaInformation?.robotsMeta || '—'],
                          ['Meta Keywords', results.seo.metrics?.metaInformation?.keywords || '—'],
                          ['Meta Author', results.seo.metrics?.metaInformation?.author || '—'],
                          ['Dublin Core', results.seo.metrics?.metaInformation?.dublinCore ? 'Present' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Schema Markup"
                        items={[
                          ['Schema Score', `${results.seo.metrics?.schemaMarkup?.score || 0}/100`],
                          ['Structured Data Count', results.seo.metrics?.schemaMarkup?.count || 0],
                          ['JSON-LD Scripts', results.seo.metrics?.schemaMarkup?.jsonLdCount || 0],
                          ['Microdata Elements', results.seo.metrics?.schemaMarkup?.microdataCount || 0],
                          ['Schema Types', (results.seo.metrics?.schemaMarkup?.types || []).join(', ') || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Server Configuration"
                        items={[
                          ['Config Score', `${results.seo.metrics?.serverConfiguration?.score || 0}/100`],
                          ['Security Headers', results.seo.metrics?.serverConfiguration?.securityHeaders || 0],
                          ['Compression', results.seo.metrics?.serverConfiguration?.compression ? 'Enabled' : 'Disabled'],
                          ['Caching Headers', results.seo.metrics?.serverConfiguration?.caching ? 'Present' : 'Missing'],
                          ['Server Response', results.seo.metrics?.serverConfiguration?.serverHeader || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Accessibility"
                        items={[
                          ['Accessibility Score', `${results.seo.metrics?.accessibility?.score || 0}/100`],
                          ['Alt Text Coverage', `${results.seo.metrics?.accessibility?.altTextCoverage || 0}%`],
                          ['Heading Structure', results.seo.metrics?.accessibility?.headingStructure ? 'Good' : 'Needs Work'],
                          ['Color Contrast', results.seo.metrics?.accessibility?.colorContrast ? 'Good' : 'Check Needed'],
                          ['Focus Management', results.seo.metrics?.accessibility?.focusManagement ? 'Present' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Content Quality"
                        items={[
                          ['Content Score', `${results.seo.metrics?.contentQuality?.score || 0}/100`],
                          ['Word Count', results.seo.metrics?.contentQuality?.wordCount || 0],
                          ['Reading Level', results.seo.metrics?.contentQuality?.readingLevel || '—'],
                          ['Paragraph Count', results.seo.metrics?.contentQuality?.paragraphCount || 0],
                          ['Content Structure', results.seo.metrics?.contentQuality?.hasGoodStructure ? 'Good' : 'Needs Work'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Advanced Images"
                        items={[
                          ['Image Score', `${results.seo.metrics?.advancedImages?.score || 0}/100`],
                          ['Lazy Loading', results.seo.metrics?.advancedImages?.lazyLoading ? 'Implemented' : 'Missing'],
                          ['Modern Formats', `${results.seo.metrics?.advancedImages?.modernFormats || 0}%`],
                          ['Responsive Images', results.seo.metrics?.advancedImages?.responsiveImages ? 'Present' : 'Missing'],
                          ['Image Compression', results.seo.metrics?.advancedImages?.compression || '—'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Mobile Friendly"
                        items={[
                          ['Mobile Score', `${results.seo.metrics?.mobileFriendly?.score || 0}/100`],
                          ['Responsive Design', results.seo.metrics?.mobileFriendly?.responsive ? 'Yes' : 'No'],
                          ['Touch Targets', results.seo.metrics?.mobileFriendly?.touchTargets ? 'Adequate' : 'Too Small'],
                          ['Mobile Speed', results.seo.metrics?.mobileFriendly?.speed || '—'],
                          ['Viewport Config', results.seo.metrics?.mobileFriendly?.viewportConfig ? 'Correct' : 'Missing'],
                        ]}
                      />
                      
                      <ResultCard
                        title="Security Analysis"
                        items={[
                          ['Security Score', `${results.seo.metrics?.security?.score || 0}/100`],
                          ['HTTPS Enforced', results.seo.metrics?.security?.httpsEnforced ? 'Yes' : 'No'],
                          ['CSP Header', results.seo.metrics?.security?.csp ? 'Present' : 'Missing'],
                          ['HSTS', results.seo.metrics?.security?.hsts ? 'Enabled' : 'Disabled'],
                          ['Security Vulnerabilities', results.seo.metrics?.security?.vulnerabilities || 0],
                        ]}
                      />
                    </div>
                  </>
                )}

                {/* Priority Fixes */}
                {((results.seo.freeIssues?.length > 0) || (results.seo.proIssues?.length > 0)) && (
                  <div className="top-fixes-card">
                    <div className="top-fixes-header">
                      <div className="fix-icon">⚡</div>
                      <div className="fix-header-content">
                        <h3>Top Priority Fixes</h3>
                        <p>Address these issues to improve your SEO score</p>
                      </div>
                      <div className="fixes-count">
                        {(results.seo.freeIssues?.length || 0) + (results.seo.proIssues?.length || 0)}
                      </div>
                    </div>
                    
                    <div className="fixes-list">
                      {results.seo.freeIssues?.map((issue, i) => (
                        <div key={`free-${i}`} className="fix-item">
                          <div className="fix-priority">
                            <span className="priority-number">{i + 1}</span>
                          </div>
                          <div className="fix-content">
                            <div className="fix-text">{issue}</div>
                            <div className="fix-impact">High Impact</div>
                          </div>
                          <div className="fix-action">
                            <button className="fix-btn">
                              Fix
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {results.seo.proIssues?.map((issue, i) => (
                        <div key={`pro-${i}`} className="fix-item">
                          <div className="fix-priority">
                            <span className="priority-number">{(results.seo.freeIssues?.length || 0) + i + 1}</span>
                          </div>
                          <div className="fix-content">
                            <div className="fix-text">{issue}</div>
                            <div className="fix-impact">Advanced</div>
                          </div>
                          <div className="fix-action">
                            <button className="fix-btn">
                              Fix
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Speed Analysis Section */}
            {results.speed && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>⚡ Speed Analysis Report</h3>
                  {results.speed.performanceScore ? (
                    <ScoreBadge score={results.speed.performanceScore} label="Performance Score" />
                  ) : (
                    <div className="speed-badge">
                      <span className={`speed-time ${getSpeedDisplayTime(results.speed) <= 200 ? 'good' : getSpeedDisplayTime(results.speed) <= 500 ? 'ok' : 'bad'}`}>
                        {getSpeedDisplayTime(results.speed)}ms
                      </span>
                    </div>
                  )}
                </div>
                
                {results.speed.usingPageSpeedAPI ? (
                  <div className="analysis-grid">
                    <ResultCard
                      title="Core Web Vitals"
                      items={[
                        ['First Contentful Paint (FCP)', results.speed.metrics?.FCP || '—'],
                        ['Largest Contentful Paint (LCP)', results.speed.metrics?.LCP || '—'],
                        ['Cumulative Layout Shift (CLS)', results.speed.metrics?.CLS || '—']
                      ]}
                    />
                    
                    <ResultCard
                      title="Performance Metrics"
                      items={[
                        ['Total Blocking Time (TBT)', results.speed.metrics?.TBT || '—'],
                        ['Speed Index', results.speed.metrics?.SI || '—'],
                        ['Time to Interactive (TTI)', results.speed.metrics?.TTI || '—']
                      ]}
                    />

                    <ResultCard
                      title="Loading Analysis"
                      items={[
                        ['First Meaningful Paint', results.speed.metrics?.FMP || '—'],
                        ['DOM Content Loaded', results.speed.metrics?.DCL || '—'],
                        ['Full Load Time', results.speed.metrics?.Load || '—']
                      ]}
                    />

                    <ResultCard
                      title="Opportunities"
                      items={[
                        ['Unused JavaScript', results.speed.opportunities?.unusedJS || 'Not analyzed'],
                        ['Image Optimization', results.speed.opportunities?.images || 'Not analyzed'],
                        ['Render-blocking Resources', results.speed.opportunities?.renderBlocking || 'Not analyzed'],
                        ['Text Compression', results.speed.opportunities?.textCompression || 'Not analyzed'],
                        ['Modern Image Formats', results.speed.opportunities?.nextGenFormats || 'Not analyzed'],
                        ['Browser Caching', results.speed.opportunities?.efficientCaching || 'Not analyzed']
                      ]}
                    />

                    <ResultCard
                      title="Basic Performance"
                      items={[
                        ['Response Time', `${getSpeedDisplayTime(results.speed)}ms`],
                        ['Status Code', results.speed.basic?.status || '—'],
                        ['Response Size', `${Math.round((results.speed.basic?.bytes || 0) / 1024)}KB`],
                        ['Using PageSpeed API', 'Yes']
                      ]}
                    />
                  </div>
                ) : (
                  <div className="analysis-grid">
                    <ResultCard
                      title="Basic Performance"
                      items={[
                        ['Response Time', `${getSpeedDisplayTime(results.speed)}ms`],
                        ['Status Code', results.speed.basic?.status || '—'],
                        ['Response Size', `${Math.round((results.speed.basic?.bytes || 0) / 1024)}KB`],
                        ['Using PageSpeed API', 'No']
                      ]}
                    />
                  </div>
                )}

                {!results.speed.usingPageSpeedAPI && (
                  <div className="info-section">
                    <div className={`info-card ${user.tier === 'free' ? 'upgrade-needed' : ''}`}>
                      {user.tier === 'free' ? (
                        <>
                          <h5>🚀 Upgrade to Pro for Advanced Speed Analysis</h5>
                          <p>Get detailed Core Web Vitals, performance opportunities, and comprehensive speed metrics with PageSpeed Insights integration.</p>
                          <p className="note">{results.speed.note}</p>
                        </>
                      ) : (
                        <>
                          <h5>💡 Enhanced Speed Analysis Available</h5>
                          <p>Configure Google PageSpeed API key for detailed Core Web Vitals, performance opportunities, and comprehensive speed metrics.</p>
                          <p className="note">{results.speed.note}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* API Key Configuration Modal */}
      {showApiKeyForm && (
        <div className="modal-overlay" onClick={() => setShowApiKeyForm(false)}>
          <div className="api-key-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Configure PageSpeed API Key</h4>
              <button 
                className="close-modal-btn"
                onClick={() => setShowApiKeyForm(false)}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="api-form">
                <div className="form-group">
                  <label htmlFor="apiKey">Google PageSpeed Insights API Key:</label>
                  <input
                    id="apiKey"
                    type="text"
                    placeholder="AIzaSy... (paste your API key here)"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="api-input"
                    autoFocus
                  />
                  <div className="input-hint">
                    API keys typically start with "AIza" and are around 40 characters long.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="help-section">
                <button 
                  className="help-link-btn"
                  onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
                >
                  <span className="help-btn-icon">📖</span>
                  How to get an API key
                </button>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowApiKeyForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={handleSaveApiKey}
                  disabled={apiKeySaving || !apiKeyInput.trim()}
                >
                  {apiKeySaving ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PageSpeed Guide Modal */}
      {showGuide && (
        <PageSpeedGuide onClose={() => setShowGuide(false)} />
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal 
          onClose={() => setShowPricingModal(false)} 
          user={user} 
        />
      )}
    </div>
  );
}