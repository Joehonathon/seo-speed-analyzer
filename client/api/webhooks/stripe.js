import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
          // In a real implementation, you would update your database here
          // For now, we'll just log the successful payment
          console.log(`User ${userId} successfully upgraded to Pro via session ${session.id}`);
          
          // TODO: Update user tier in your database
          // Example:
          // await updateUserTier(userId, 'pro', session.customer);
          
        } catch (error) {
          console.error('Failed to upgrade user:', error);
        }
      }
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // TODO: Downgrade user tier in your database
      // Example:
      // await updateUserTier(subscription.metadata?.userId, 'free');
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