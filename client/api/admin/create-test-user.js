// Admin endpoint to create a test free user for payment testing
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MVg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
      console.error('Error creating test user:', error);
      return res.status(500).json({ error: 'Failed to create test user' });
    }

    res.status(201).json({
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
      },
      instructions: [
        '1. Login with these credentials',
        '2. Try to upgrade to Pro via Stripe',
        '3. Complete payment in Stripe',
        '4. Login again to verify Pro status'
      ]
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to create test user',
      details: error.message 
    });
  }
}