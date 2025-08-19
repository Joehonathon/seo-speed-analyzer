const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      email: user.email, 
      tier: user.tier 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Check if user has reached daily limit
async function checkRateLimit(req, res, next) {
  try {
    const userId = req.user.id;
    const userTier = req.user.tier;
    
    // Pro users have unlimited access
    if (userTier === 'pro') {
      return next();
    }

    // Check free tier usage
    const todayUsage = await db.getTodayUsage(userId);
    const FREE_TIER_LIMIT = 3;

    if (todayUsage >= FREE_TIER_LIMIT) {
      return res.status(429).json({ 
        error: 'Daily limit reached', 
        message: 'You have reached your daily limit of 3 reports. Upgrade to Pro for unlimited access.',
        upgrade_required: true
      });
    }

    // Increment usage counter
    await db.incrementUsage(userId);
    req.usageInfo = {
      used: todayUsage + 1,
      limit: FREE_TIER_LIMIT,
      remaining: FREE_TIER_LIMIT - (todayUsage + 1)
    };
    
    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Register new user
async function register(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Check if username or email already exists
    const existingUserByEmail = await db.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUserByUsername = await db.getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create new user
    const userId = await db.createUser(username, email, password);
    const user = await db.getUserById(userId);
    
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      if (error.message.includes('username')) {
        return res.status(400).json({ error: 'Username already taken' });
      } else if (error.message.includes('email')) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
}

// Login user
async function login(req, res) {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password required' });
    }

    // Find user by email or username
    const user = await db.getUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

// Get user profile
async function getProfile(req, res) {
  try {
    const user = await db.getUserById(req.user.id);
    const todayUsage = await db.getTodayUsage(req.user.id);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        created_at: user.created_at
      },
      usage: {
        today: todayUsage,
        limit: user.tier === 'pro' ? 'unlimited' : 3
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

module.exports = {
  authenticateToken,
  checkRateLimit,
  register,
  login,
  getProfile,
  generateToken
};