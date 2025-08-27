const express = require('express');
const router = express.Router();
const db = require('./database');

// Initialize Stripe (will be null until keys are properly set)
let stripe = null;

function initializeStripe() {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized successfully');
  } else {
    console.log('⚠️ Stripe not initialized - missing STRIPE_SECRET_KEY');
  }
}

// Initialize Stripe on module load
initializeStripe();

// Create checkout session for Pro subscription
router.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'SEO Speed Analyzer Pro',
            description: 'Unlimited SEO reports, project management, PageSpeed API integration, and priority support'
          },
          recurring: {
            interval: 'month'
          },
          unit_amount: 499 // $4.99 in cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?canceled=true`,
      client_reference_id: userId.toString(),
      metadata: {
        user_id: userId.toString()
      },
      allow_promotion_codes: true,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get checkout session details
router.get('/checkout-session/:sessionId', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      customer_email: session.customer_details?.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer portal session
router.post('/create-portal-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const { customerId } = req.body;
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
router.post('/webhook', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📥 Received webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
    }

    res.json({received: true});
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Webhook handler functions
async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout completed for session:', session.id);
  
  const userId = parseInt(session.client_reference_id);
  if (!userId) return;

  try {
    // Update user to pro tier
    await db.updateUserTier(userId, 'pro');
    
    // Store customer ID for future use
    await db.run(
      'UPDATE users SET stripe_customer_id = ?, subscription_status = ? WHERE id = ?',
      [session.customer, 'active', userId]
    );
    
    console.log(`✅ User ${userId} upgraded to Pro`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('📝 Subscription created:', subscription.id);
  // Additional subscription logic if needed
}

async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    // Find user by customer ID
    const user = await db.get('SELECT * FROM users WHERE stripe_customer_id = ?', [customer.id]);
    
    if (user) {
      const status = subscription.status === 'active' ? 'pro' : 'free';
      await db.updateUserTier(user.id, status);
      
      await db.run(
        'UPDATE users SET subscription_status = ? WHERE id = ?',
        [subscription.status, user.id]
      );
      
      console.log(`✅ User ${user.id} subscription updated: ${subscription.status}`);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription canceled:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await db.get('SELECT * FROM users WHERE stripe_customer_id = ?', [customer.id]);
    
    if (user) {
      await db.updateUserTier(user.id, 'free');
      await db.run(
        'UPDATE users SET subscription_status = ? WHERE id = ?',
        ['canceled', user.id]
      );
      
      console.log(`✅ User ${user.id} downgraded to Free`);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('💰 Payment succeeded for invoice:', invoice.id);
  // Additional payment success logic if needed
}

async function handlePaymentFailed(invoice) {
  console.log('💸 Payment failed for invoice:', invoice.id);
  // Handle failed payment - maybe send email notification
}

// Test route to verify Stripe connection
router.get('/test-connection', (req, res) => {
  if (!stripe) {
    return res.json({ 
      connected: false, 
      message: 'Stripe not initialized - check environment variables' 
    });
  }
  
  res.json({ 
    connected: true, 
    message: 'Stripe connection successful',
    webhook_configured: !!process.env.STRIPE_WEBHOOK_SECRET
  });
});

// Development test route for payment flow (remove in production)
router.post('/test-checkout', async (req, res) => {
  if (!stripe) {
    return res.json({ error: 'Stripe not configured', success: false });
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'SEO Speed Analyzer Pro (TEST)',
            description: 'Test subscription for development'
          },
          recurring: {
            interval: 'month'
          },
          unit_amount: 100 // $1.00 for testing
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?test=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?test=canceled`,
      client_reference_id: 'test_user_123',
      metadata: {
        user_id: 'test_user_123',
        test_mode: 'true'
      }
    });
    
    res.json({ 
      success: true, 
      checkout_url: session.url,
      session_id: session.id
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;