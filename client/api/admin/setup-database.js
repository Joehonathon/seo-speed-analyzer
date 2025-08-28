// Admin endpoint to set up Supabase database with test users
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MVg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if users table already has data
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .limit(1);

    if (checkError) {
      return res.status(500).json({ 
        error: 'Database not accessible. Make sure to run the SQL setup script in Supabase first.',
        details: checkError.message 
      });
    }

    const results = [];

    // Test users to create
    const testUsers = [
      {
        username: 'testpro',
        email: 'testpro@example.com',
        password: 'testpassword123',
        tier: 'pro',
        subscription_status: 'active',
        stripe_customer_id: 'cus_testpro123'
      },
      {
        username: 'Joehonathon',
        email: 'joehonathon@gmail.com', 
        password: 'password123',
        tier: 'pro',
        subscription_status: 'active',
        stripe_customer_id: null
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123', 
        tier: 'free',
        subscription_status: 'inactive',
        stripe_customer_id: null
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        results.push({
          email: userData.email,
          status: 'already_exists'
        });
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          password_hash: hashedPassword,
          tier: userData.tier,
          subscription_status: userData.subscription_status,
          stripe_customer_id: userData.stripe_customer_id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        results.push({
          email: userData.email,
          status: 'error',
          error: error.message
        });
      } else {
        results.push({
          email: userData.email,
          status: 'created',
          id: newUser.id,
          tier: newUser.tier
        });
      }
    }

    res.status(200).json({
      message: 'Database setup completed',
      results
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Failed to set up database',
      details: error.message 
    });
  }
}