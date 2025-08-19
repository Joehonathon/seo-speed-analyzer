import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard.jsx';
import ScoreBadge from './ScoreBadge.jsx';

const API_BASE = 'http://localhost:5050/api';

export default function UserDashboard({ user, token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newProject, setNewProject] = useState({ name: '', url: '' });
  const [showNewProject, setShowNewProject] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    fetchProfile();
    if (user.tier === 'pro') {
      fetchProjects();
    }
  }, []);

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
      
      // Run both SEO analysis and pagespeed, but handle errors separately
      const [seoResult, speedResult] = await Promise.allSettled([
        axios.get(`${API_BASE}/analyze`, {
          params: { url: normalizedUrl },
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/pagespeed`, {
          params: { url: normalizedUrl, strategy: 'mobile' },
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const results = {
        timestamp: new Date().toISOString()
      };

      // Handle SEO analysis result
      if (seoResult.status === 'fulfilled') {
        results.seo = seoResult.value.data;
      } else {
        console.error('SEO analysis failed:', seoResult.reason);
        results.seo = { error: 'SEO analysis failed' };
      }

      // Handle speed analysis result
      if (speedResult.status === 'fulfilled') {
        results.speed = speedResult.value.data;
      } else {
        console.error('Speed analysis failed:', speedResult.reason);
        results.speed = { error: 'Speed analysis failed' };
      }

      // Only show error if both analyses failed
      if (results.seo.error && results.speed.error) {
        alert('Analysis failed. Both SEO and speed analysis encountered errors.');
        return;
      }

      // Store results in state
      setAnalysisResults(prev => ({
        ...prev,
        [project.id]: results
      }));

      // Update project's last_scan timestamp
      setProjects(prev => prev.map(p => 
        p.id === project.id 
          ? { ...p, last_scan: results.timestamp }
          : p
      ));

      console.log('Analysis completed:', results);
      
      // Show partial success message if only one analysis failed
      if (results.seo.error) {
        alert('Analysis completed with SEO analysis error. Speed analysis was successful.');
      } else if (results.speed.error) {
        alert('Analysis completed with speed analysis error. SEO analysis was successful.');
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
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
              <button onClick={handleLogout} className="logout-button">
                <span className="logout-icon">⏻</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
          <div className="usage-section">
            <h4>Daily Usage</h4>
            {user.tier === 'free' ? (
              <div className="usage-card">
                <div className="usage-info">
                  <span className="usage-count">
                    {profile?.usage?.today || 0} / {profile?.usage?.limit || 3}
                  </span>
                  <span className="usage-label">Reports used today</span>
                </div>
                <div className="usage-bar">
                  <div 
                    className="usage-progress" 
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                {usagePercentage >= 100 && (
                  <div className="usage-warning">
                    Daily limit reached! Upgrade to Pro for unlimited access.
                  </div>
                )}
              </div>
            ) : (
              <div className="usage-card pro">
                <div className="usage-info">
                  <span className="usage-count">∞</span>
                  <span className="usage-label">Unlimited reports</span>
                </div>
                <div className="pro-stats">
                  <div className="stat">
                    <span className="stat-number">{projects.length}</span>
                    <span className="stat-label">Active Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{profile?.usage?.today || 0}</span>
                    <span className="stat-label">Reports Today</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user.tier === 'free' && (
            <div className="upgrade-section">
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
                <button className="upgrade-button" disabled>
                  Coming Soon - Pro Tier
                </button>
                <p className="upgrade-note">
                  We're working hard to bring you Pro features. Stay tuned!
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

      {activeTab === 'projects' && user.tier === 'pro' && (
        <div className="projects-section">
          <div className="projects-header">
            <h4>Your Projects</h4>
            <button 
              className="add-project-btn"
              onClick={() => setShowNewProject(true)}
            >
              + Add Project
            </button>
          </div>

          {showNewProject && (
            <div className="new-project-form">
              <h5>Create New Project</h5>
              <input
                type="text"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
              <input
                type="url"
                placeholder="Website URL"
                value={newProject.url}
                onChange={(e) => setNewProject({...newProject, url: e.target.value})}
              />
              <div className="form-actions">
                <button onClick={createProject} className="create-btn">Create</button>
                <button onClick={() => setShowNewProject(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="no-projects">
                <p>No projects yet. Create your first project to start tracking SEO performance!</p>
              </div>
            ) : (
              projects.map(project => {
                const isRunning = runningAnalysis === project.id;
                const results = analysisResults[project.id];
                
                return (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <div className="project-info">
                        <h5>{project.name}</h5>
                        <p className="project-url">{project.url}</p>
                      </div>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteProject(project)}
                        title="Delete project"
                      >
                        ×
                      </button>
                    </div>
                    <div className="project-meta">
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                      {project.last_scan && (
                        <span>Last scan: {new Date(project.last_scan).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    {results && (
                      <div className="analysis-summary">
                        <div className="summary-item">
                          <span className="summary-label">SEO Score:</span>
                          {results.seo?.error ? (
                            <span className="summary-value bad">Error</span>
                          ) : (
                            <span className={`summary-value ${(results.seo?.score || 0) >= 80 ? 'good' : (results.seo?.score || 0) >= 60 ? 'ok' : 'bad'}`}>
                              {results.seo?.score || 0}/100
                            </span>
                          )}
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Response Time:</span>
                          {results.speed?.error ? (
                            <span className="summary-value bad">Error</span>
                          ) : (
                            <span className={`summary-value ${(results.speed?.basic?.timeMs || 0) <= 200 ? 'good' : (results.speed?.basic?.timeMs || 0) <= 500 ? 'ok' : 'bad'}`}>
                              {results.speed?.basic?.timeMs || 0}ms
                            </span>
                          )}
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Priority Fixes:</span>
                          {results.seo?.error ? (
                            <span className="summary-value bad">Error</span>
                          ) : (
                            <span className={`summary-value ${(results.seo?.issues?.length || 0) === 0 ? 'good' : (results.seo?.issues?.length || 0) <= 3 ? 'ok' : 'bad'}`}>
                              {results.seo?.issues?.length || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="project-actions">
                      <button 
                        className={`scan-btn ${isRunning ? 'running' : ''}`}
                        onClick={() => runProjectAnalysis(project)}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <>
                            <span className="spinner"></span>
                            Running Analysis...
                          </>
                        ) : (
                          'Run Analysis'
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
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && user.tier === 'pro' && (
        <div className="reports-section">
          <h4>Analysis Reports</h4>
          <div className="reports-content">
            {projects.length === 0 ? (
              <div className="no-reports">
                <p>📊 No projects yet. Create a project and run analysis to see reports here.</p>
              </div>
            ) : (
              <div className="reports-list">
                {projects.map(project => {
                  const projectResults = analysisResults[project.id];
                  return (
                    <div key={project.id} className="report-project-section">
                      <h5>{project.name}</h5>
                      <p className="report-url">{project.url}</p>
                      {projectResults ? (
                        <div className="report-summary">
                          <div className="report-header">
                            <span className="report-date">
                              Last Report: {new Date(projectResults.timestamp).toLocaleString()}
                            </span>
                            <button 
                              className="view-report-btn"
                              onClick={() => setActiveTab('report-detail-' + project.id)}
                            >
                              View Full Report
                            </button>
                          </div>
                          <div className="report-scores">
                            <div className="score-item">
                              <span className="score-label">SEO Score</span>
                              {projectResults.seo?.error ? (
                                <span className="score-value bad">Error</span>
                              ) : (
                                <span className={`score-value ${(projectResults.seo?.score || 0) >= 80 ? 'good' : (projectResults.seo?.score || 0) >= 60 ? 'ok' : 'bad'}`}>
                                  {projectResults.seo?.score || 0}/100
                                </span>
                              )}
                            </div>
                            <div className="score-item">
                              <span className="score-label">Response Time</span>
                              {projectResults.speed?.error ? (
                                <span className="score-value bad">Error</span>
                              ) : (
                                <span className={`score-value ${(projectResults.speed?.basic?.timeMs || 0) <= 200 ? 'good' : (projectResults.speed?.basic?.timeMs || 0) <= 500 ? 'ok' : 'bad'}`}>
                                  {projectResults.speed?.basic?.timeMs || 0}ms
                                </span>
                              )}
                            </div>
                            <div className="score-item">
                              <span className="score-label">Priority Fixes</span>
                              {projectResults.seo?.error ? (
                                <span className="score-value bad">Error</span>
                              ) : (
                                <span className={`score-value ${(projectResults.seo?.issues?.length || 0) === 0 ? 'good' : (projectResults.seo?.issues?.length || 0) <= 3 ? 'ok' : 'bad'}`}>
                                  {projectResults.seo?.issues?.length || 0}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="no-report">
                          <p>No reports yet. Run analysis to generate the first report.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
                    title="Basics"
                    items={[
                      ['Title', results.seo.metrics?.title || '—'],
                      ['Meta Description', results.seo.metrics?.metaDescription || '—'],
                      ['Viewport', results.seo.metrics?.viewport || '—'],
                      ['Language', results.seo.metrics?.lang || '—'],
                      ['Canonical URL', results.seo.metrics?.canonical || '—'],
                      ['HTTPS', results.seo.metrics?.technical?.https ? 'Yes' : 'No'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Headings & Content"
                    items={[
                      ['H1 Count', results.seo.metrics?.h1Count || '—'],
                      ['Header Hierarchy', results.seo.metrics?.headerHierarchy?.isGood ? 'Good' : (results.seo.metrics?.headerHierarchy?.issue || 'Poor')],
                      ['Word Count', results.seo.wordCount || '—'],
                      ['Images Count', results.seo.metrics?.imgCount || '—'],
                      ['Images Missing Alt', results.seo.metrics?.imgsMissingAlt || '—'],
                      ['JSON-LD Blocks', results.seo.metrics?.jsonLdCount || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Social/Sharing"
                    items={[
                      ['Open Graph Title', results.seo.metrics?.og?.title || '—'],
                      ['Open Graph Description', results.seo.metrics?.og?.description || '—'],
                      ['Open Graph Image', results.seo.metrics?.og?.image || '—'],
                      ['Twitter Card', results.seo.metrics?.twitterCard || '—'],
                    ]}
                  />
                  
                  <ResultCard
                    title="Links"
                    items={[
                      ['Total Links', results.seo.metrics?.linkTotals?.total || '—'],
                      ['Internal Links', results.seo.metrics?.linkTotals?.internal || '—'],
                      ['External Links', results.seo.metrics?.linkTotals?.external || '—'],
                    ]}
                  />
                </div>

                {results.seo.issues && results.seo.issues.length > 0 && (
                  <div className="issues-section">
                    <h4>Priority Fixes</h4>
                    <div className="issues-list">
                      {results.seo.issues.map((issue, index) => (
                        <div key={index} className="issue-item">
                          <span className="issue-priority">!</span>
                          <span className="issue-text">{issue}</span>
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

            {/* Speed Analysis Section - Basic metrics */}
            {results.speed && !results.speed.error && (
              <div className="analysis-section">
                <div className="section-header">
                  <h3>⚡ Speed Analysis Report</h3>
                  <div className="speed-badge">
                    <span className={`speed-time ${(results.speed.basic?.timeMs || 0) <= 200 ? 'good' : (results.speed.basic?.timeMs || 0) <= 500 ? 'ok' : 'bad'}`}>
                      {results.speed.basic?.timeMs || 0}ms
                    </span>
                  </div>
                </div>
                
                <div className="analysis-grid">
                  <ResultCard
                    title="Basic Performance"
                    items={[
                      ['Response Time', `${results.speed.basic?.timeMs || 0}ms`],
                      ['Status Code', results.speed.basic?.status || '—'],
                      ['Response Size', `${Math.round((results.speed.basic?.bytes || 0) / 1024)}KB`],
                      ['Using PageSpeed API', results.speed.usingPageSpeedAPI ? 'Yes' : 'No'],
                    ]}
                  />
                </div>

                {!results.speed.usingPageSpeedAPI && (
                  <div className="info-section">
                    <div className="info-card">
                      <h5>💡 Enhanced Speed Analysis Available</h5>
                      <p>Configure Google PageSpeed API key for detailed Core Web Vitals, performance opportunities, and comprehensive speed metrics.</p>
                      <p className="note">{results.speed.note}</p>
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
    </div>
  );
}