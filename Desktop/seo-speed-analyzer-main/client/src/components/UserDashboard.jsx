import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5050/api';

export default function UserDashboard({ user, token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newProject, setNewProject] = useState({ name: '', url: '' });
  const [showNewProject, setShowNewProject] = useState(false);

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
      <div className="dashboard-header">
        <div className="user-info">
          <h3>Welcome back, @{user.username}!</h3>
          <span className={`tier-badge ${user.tier}`}>
            {user.tier === 'free' ? '🆓 Free' : '⭐ Pro'}
          </span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
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
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
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
              projects.map(project => (
                <div key={project.id} className="project-card">
                  <h5>{project.name}</h5>
                  <p className="project-url">{project.url}</p>
                  <div className="project-meta">
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.last_scan && (
                      <span>Last scan: {new Date(project.last_scan).toLocaleDateString()}</span>
                    )}
                  </div>
                  <button className="scan-btn">Run Analysis</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && user.tier === 'pro' && (
        <div className="analytics-section">
          <h4>Analytics Dashboard</h4>
          <div className="analytics-placeholder">
            <p>📊 Advanced analytics coming soon!</p>
            <ul>
              <li>Historical SEO score trends</li>
              <li>Performance comparisons</li>
              <li>Competitive analysis</li>
              <li>Keyword ranking changes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}