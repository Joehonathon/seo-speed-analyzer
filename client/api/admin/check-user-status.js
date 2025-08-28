// Admin endpoint to check user status in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MVg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        tier: user.tier,
        subscription_status: user.subscription_status,
        stripe_customer_id: user.stripe_customer_id,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      status: {
        isProUser: user.tier === 'pro',
        hasActiveSubscription: user.subscription_status === 'active',
        hasStripeCustomer: !!user.stripe_customer_id
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to check user status',
      details: error.message 
    });
  }
}