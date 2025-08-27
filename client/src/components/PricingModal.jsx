import React, { useState } from 'react';
import API_BASE from '../config/api.js';

export default function PricingModal({ onClose, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please log in to upgrade');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/payment/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Open Stripe Checkout in new browser tab
      window.open(data.url, '_blank');
      
      // Close modal after opening Stripe
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user?.stripe_customer_id) {
      setError('No billing account found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/payment/create-portal-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      window.open(data.url, '_blank');
    } catch (err) {
      setError(err.message || 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        border: '1px solid var(--card-border)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            margin: '0 0 12px', 
            color: 'var(--text)' 
          }}>
            {user?.tier === 'pro' ? 'Manage Billing' : 'Upgrade to Pro'}
          </h2>
          <p style={{ 
            color: 'var(--text-muted)', 
            margin: 0,
            fontSize: '16px'
          }}>
            {user?.tier === 'pro' 
              ? 'Manage your Pro subscription' 
              : 'Unlock unlimited SEO analysis and advanced features'
            }
          </p>
        </div>

        {user?.tier !== 'pro' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '24px',
                color: 'var(--brand)'
              }}>
                Pro Plan
              </h3>
              <div style={{
                marginLeft: 'auto',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'var(--text)'
              }}>
                $4.99<span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/month</span>
              </div>
            </div>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px',
              color: 'var(--text)'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                Unlimited SEO reports
              </li>
              <li style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                Project management & tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                PageSpeed API integration
              </li>
              <li style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                Historical performance data
              </li>
              <li style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                Priority email support
              </li>
            </ul>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {user?.tier === 'pro' ? (
            <button
              onClick={handleManageBilling}
              disabled={loading}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Opening...' : 'Manage Billing'}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          )}
          
          <button
            onClick={onClose}
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          margin: '16px 0 0',
          lineHeight: '1.4'
        }}>
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}