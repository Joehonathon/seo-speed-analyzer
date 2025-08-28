import React, { useState } from 'react';
import axios from 'axios';
import API_BASE from '../config/api.js';

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation for registration
    if (!isLogin) {
      if (!username.trim()) {
        setError('Username is required');
        setLoading(false);
        return;
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      let response;
      
      if (isLogin) {
        // Login API call
        response = await axios.post('/api/auth/login-simple', {
          emailOrUsername: email,
          password: password
        });
      } else {
        // Registration API call
        response = await axios.post('/api/auth/register-simple', {
          username: username,
          email: email,
          password: password
        });
      }

      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onAuth({ token, user });
    } catch (err) {
      console.error('Authentication error:', err);
      let errorMessage = 'Authentication failed';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <p>{isLogin ? 'Welcome back!' : 'Join thousands of users optimizing their websites'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                placeholder="Choose a username"
                minLength="3"
                maxLength="20"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{isLogin ? 'Email or Username' : 'Email'}</label>
            <input
              type={isLogin ? "text" : "email"}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={isLogin ? "Enter email or username" : "Enter your email"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                placeholder="Confirm your password"
                minLength="6"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="switch-button"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="tier-info">
          <div className="tier-box">
            <h4>🆓 Free Tier</h4>
            <ul>
              <li>3 reports per day</li>
              <li>Basic SEO analysis</li>
              <li>Page speed testing</li>
            </ul>
          </div>
          <div className="tier-box pro">
            <h4>⭐ Pro Tier</h4>
            <ul>
              <li>Unlimited reports</li>
              <li>Project management</li>
              <li>Historical tracking</li>
              <li>Advanced analytics</li>
              <li>Coming soon!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}