import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MVg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to update user tier in Supabase
async function updateUserTier(userId, tier, subscriptionStatus = 'active', stripeCustomerId = null) {
  const updateData = {
    tier,
    subscription_status: subscriptionStatus,
    updated_at: new Date().toISOString()
  };
  
  if (stripeCustomerId) {
    updateData.stripe_customer_id = stripeCustomerId;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user tier:', error);
    throw error;
  }

  console.log(`Successfully updated user ${userId} to ${tier} tier`);
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Get user ID from the session metadata
      const userId = session.client_reference_id || session.metadata?.userId;
      
      if (userId) {
        try {
          // Update user tier to pro in Supabase
          await updateUserTier(userId, 'pro', 'active', session.customer);
          
          console.log(`User ${userId} successfully upgraded to Pro via session ${session.id}`);
          
        } catch (error) {
          console.error('Failed to upgrade user:', error);
          return res.status(500).json({ error: 'Failed to upgrade user' });
        }
      } else {
        console.error('No user ID found in session metadata');
      }
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // Get user ID from subscription metadata or find by customer ID
      let subscriptionUserId = subscription.metadata?.userId;
      
      if (!subscriptionUserId) {
        // Try to find user by Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();
          
        subscriptionUserId = user?.id;
      }
      
      if (subscriptionUserId) {
        try {
          // Downgrade user tier to free
          await updateUserTier(subscriptionUserId, 'free', 'cancelled');
          
          console.log(`User ${subscriptionUserId} downgraded to free tier`);
          
        } catch (error) {
          console.error('Failed to downgrade user:', error);
        }
      }
      break;
      
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log('Payment failed for invoice:', invoice.id);
      
      // Optionally handle failed payments (maybe send email, temporarily suspend)
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}