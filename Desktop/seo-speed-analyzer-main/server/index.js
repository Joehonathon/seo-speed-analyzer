const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { analyzeUrl } = require('./seoAnalyzer.js');
const { runPageSpeed } = require('./pagespeed.js');
const { authenticateToken, checkRateLimit, register, login, getProfile } = require('./auth');
const db = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Public routes
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'SEO & Speed Analyzer API online' });
});

// Authentication routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', authenticateToken, getProfile);

// Free tier - basic analysis (limited to 3/day for free users)
app.get('/api/analyze', authenticateToken, checkRateLimit, async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const result = await analyzeUrl(url);
    
    // Save report for tracking (Pro users only get saved reports)
    if (req.user.tier === 'pro') {
      await db.saveReport(req.user.id, null, url, result, result.score || 0);
    }
    
    res.json({
      ...result,
      usage: req.usageInfo || { unlimited: true }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to analyze URL' });
  }
});

// Speed analysis (also rate limited for free users)
app.get('/api/pagespeed', authenticateToken, checkRateLimit, async (req, res) => {
  const url = req.query.url;
  const strategy = req.query.strategy || 'mobile'; // 'mobile' | 'desktop'
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const result = await runPageSpeed(url, strategy);
    res.json({
      ...result,
      usage: req.usageInfo || { unlimited: true }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to check site speed' });
  }
});

// Pro tier routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    if (req.user.tier !== 'pro') {
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    
    const projects = await db.getUserProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    if (req.user.tier !== 'pro') {
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL required' });
    }
    
    const projectId = await db.createProject(req.user.id, name, url);
    res.status(201).json({ id: projectId, name, url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/projects/:id/reports', authenticateToken, async (req, res) => {
  try {
    if (req.user.tier !== 'pro') {
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    
    const reports = await db.getProjectReports(req.params.id);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Development endpoint to upgrade user to pro (remove in production)
app.post('/api/dev/upgrade-to-pro', authenticateToken, async (req, res) => {
  try {
    await db.updateUserTier(req.user.id, 'pro');
    const user = await db.getUserById(req.user.id);
    res.json({ 
      message: 'User upgraded to Pro', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
