// Simple login endpoint with hardcoded users (for Vercel compatibility)
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
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password required' });
    }

    // Hardcoded users for Vercel compatibility (since SQLite doesn't work in serverless)
    const hardcodedUsers = {
      'testpro@example.com': {
        id: 10,
        username: 'testpro',
        email: 'testpro@example.com',
        password: 'testpassword123',
        tier: 'pro'
      },
      'testpro': {
        id: 10,
        username: 'testpro',
        email: 'testpro@example.com',
        password: 'testpassword123',
        tier: 'pro'
      },
      'joehonathon@gmail.com': {
        id: 1,
        username: 'Joehonathon',
        email: 'joehonathon@gmail.com',
        password: 'password123',
        tier: 'pro'
      },
      'test@example.com': {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        tier: 'free'
      }
    };

    // Find user by email or username
    const user = hardcodedUsers[emailOrUsername];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check (in production you'd use bcrypt)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create response user object
    const responseUser = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      tier: user.tier
    };

    const token = 'mock-jwt-token-' + user.id;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: responseUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}