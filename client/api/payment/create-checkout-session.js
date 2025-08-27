// Simple mock payment endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock response for now - in production this would create a real Stripe session
    const mockCheckoutUrl = 'https://buy.stripe.com/test_mock_checkout_session';
    
    res.status(200).json({
      url: mockCheckoutUrl,
      message: 'Mock checkout session created'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}