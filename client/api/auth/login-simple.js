// Simple login endpoint with database authentication
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    // Connect to database
    const dbPath = join(process.cwd(), 'server', 'database.sqlite');
    const db = new sqlite3.Database(dbPath);

    // Query user by email or username
    const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
    
    const user = await new Promise((resolve, reject) => {
      db.get(query, [emailOrUsername, emailOrUsername], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    db.close();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create response user object
    const responseUser = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      tier: user.tier || 'free'
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