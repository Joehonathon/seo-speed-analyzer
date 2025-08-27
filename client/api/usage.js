// Simple in-memory usage tracking (in production you'd use a database)
const usageData = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    // Extract user info from mock token (in production you'd validate JWT)
    const token = authHeader.split(' ')[1];
    const userId = token.replace('mock-jwt-token-', '');
    
    if (req.method === 'GET') {
      // Get current usage
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const userKey = `${userId}-${today}`;
      const currentUsage = usageData.get(userKey) || 0;
      
      return res.status(200).json({
        date: today,
        scansUsed: currentUsage,
        scansRemaining: Math.max(0, 3 - currentUsage),
        dailyLimit: 3
      });
    }
    
    if (req.method === 'POST') {
      // Increment usage
      const today = new Date().toISOString().split('T')[0];
      const userKey = `${userId}-${today}`;
      const currentUsage = usageData.get(userKey) || 0;
      
      if (currentUsage >= 3) {
        return res.status(429).json({ 
          error: 'Daily limit reached',
          message: 'Daily limit of 3 scans reached. Upgrade to Pro for unlimited access.',
          scansUsed: currentUsage,
          scansRemaining: 0,
          dailyLimit: 3
        });
      }
      
      const newUsage = currentUsage + 1;
      usageData.set(userKey, newUsage);
      
      return res.status(200).json({
        date: today,
        scansUsed: newUsage,
        scansRemaining: Math.max(0, 3 - newUsage),
        dailyLimit: 3
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Usage tracking error:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
}