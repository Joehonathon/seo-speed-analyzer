// Admin endpoint to simulate a successful Stripe payment for testing
import { createClient } from '@supabase/supabase-js';

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
    const { userId, email } = req.body;
    
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

    // Get current status
    const beforeStatus = {
      tier: user.tier,
      subscription_status: user.subscription_status,
      stripe_customer_id: user.stripe_customer_id
    };

    // Update user to pro tier (simulate successful payment)
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
      console.error('Error updating user:', updateError);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    res.status(200).json({
      message: 'Payment simulation successful - user upgraded to Pro!',
      userId: user.id,
      email: user.email,
      before: beforeStatus,
      after: {
        tier: updatedUser.tier,
        subscription_status: updatedUser.subscription_status,
        stripe_customer_id: updatedUser.stripe_customer_id
      },
      instructions: [
        '1. Login again with the same credentials',
        '2. Check that user now shows as Pro tier',
        '3. Verify Pro features are accessible'
      ]
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to simulate payment',
      details: error.message 
    });
  }
}