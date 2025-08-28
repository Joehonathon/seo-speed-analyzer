// Consolidated admin endpoint for payment flow testing
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MTg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'create-test-user':
        return await createTestUser(req, res);
      case 'check-status':
        return await checkUserStatus(req, res);
      case 'simulate-payment':
        return await simulatePayment(req, res);
      default:
        return res.status(400).json({ 
          error: 'Invalid action',
          available_actions: ['create-test-user', 'check-status', 'simulate-payment']
        });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function createTestUser(req, res) {
  const testEmail = 'freeuser@example.com';
  const testPassword = 'password123';

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', testEmail)
    .single();

  if (existingUser) {
    return res.status(200).json({
      message: 'Test user already exists',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        tier: existingUser.tier,
        subscription_status: existingUser.subscription_status
      },
      credentials: {
        email: testEmail,
        password: testPassword
      }
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  // Create free user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{
      username: 'freeuser',
      email: testEmail,
      password_hash: hashedPassword,
      tier: 'free',
      subscription_status: 'inactive',
      stripe_customer_id: null,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return res.status(201).json({
    message: 'Test free user created successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      tier: newUser.tier,
      subscription_status: newUser.subscription_status
    },
    credentials: {
      email: testEmail,
      password: testPassword
    }
  });
}

async function checkUserStatus(req, res) {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({
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
}

async function simulatePayment(req, res) {
  const { userId, email } = req.method === 'POST' ? req.body : req.query;
  
  if (!userId && !email) {
    return res.status(400).json({ error: 'userId or email required' });
  }

  // Find user
  let query = supabase.from('users').select('*');
  
  if (userId) {
    query = query.eq('id', userId);
  } else {
    query = query.eq('email', email);
  }
  
  const { data: user, error: findError } = await query.single();

  if (findError || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const beforeStatus = {
    tier: user.tier,
    subscription_status: user.subscription_status,
    stripe_customer_id: user.stripe_customer_id
  };

  // Update user to pro tier
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ 
      tier: 'pro', 
      subscription_status: 'active',
      stripe_customer_id: user.stripe_customer_id || `cus_simulated_${user.id}`,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return res.status(200).json({
    message: 'Payment simulation successful - user upgraded to Pro!',
    userId: user.id,
    email: user.email,
    before: beforeStatus,
    after: {
      tier: updatedUser.tier,
      subscription_status: updatedUser.subscription_status,
      stripe_customer_id: updatedUser.stripe_customer_id
    }
  });
}