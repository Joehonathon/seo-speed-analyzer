const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { analyzeUrl } = require('./seoAnalyzer.js');
const { runPageSpeed } = require('./pagespeed.js');
const { authenticateToken, checkRateLimit, checkRateLimitWithoutIncrement, checkProjectRateLimit, register, login, getProfile } = require('./auth');
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
    const result = await analyzeUrl(url, req.user.tier);
    
    
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
  const userApiKey = req.query.apiKey || null; // Optional user-provided API key
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const result = await runPageSpeed(url, strategy, req.user.tier, userApiKey, req.user.id);
    res.json({
      ...result,
      usage: req.usageInfo || { unlimited: true }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to check site speed' });
  }
});

// Combined project analysis - counts as single usage
app.get('/api/project-analysis', authenticateToken, checkProjectRateLimit, async (req, res) => {
  const url = req.query.url;
  const strategy = req.query.strategy || 'mobile';
  const userApiKey = req.query.apiKey || null; // Optional user-provided API key
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  
  try {
    // Run both analyses in parallel
    const [seoResult, speedResult] = await Promise.allSettled([
      analyzeUrl(url, req.user.tier),
      runPageSpeed(url, strategy, req.user.tier, userApiKey, req.user.id)
    ]);

    const results = {
      timestamp: new Date().toISOString(),
      usage: req.usageInfo || { unlimited: true }
    };

    // Handle SEO analysis result
    if (seoResult.status === 'fulfilled') {
      results.seo = seoResult.value;
    } else {
      console.error('SEO analysis failed:', seoResult.reason);
      results.seo = { error: 'SEO analysis failed' };
    }

    // Handle speed analysis result
    if (speedResult.status === 'fulfilled') {
      results.speed = speedResult.value;
    } else {
      console.error('Speed analysis failed:', speedResult.reason);
      results.speed = { error: 'Speed analysis failed' };
    }

    // Only show error if both analyses failed
    if (results.seo.error && results.speed.error) {
      return res.status(500).json({ error: 'Both SEO and speed analysis failed' });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to run project analysis' });
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

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.tier !== 'pro') {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    const projectId = req.params.id;
    const deleted = await db.deleteProject(projectId, req.user.id);
    
    if (deleted) {
      res.json({ success: true, message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found or access denied' });
    }
  } catch (err) {
    console.error('Failed to delete project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
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

// Save project analysis report
app.post('/api/projects/:id/reports', authenticateToken, async (req, res) => {
  try {
    console.log(`Saving report for project ${req.params.id} by user ${req.user.id} (${req.user.tier})`);
    
    if (req.user.tier !== 'pro') {
      console.log('Access denied: User is not pro tier');
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    
    const { seoData, speedData, url } = req.body;
    console.log('Report data received:', { 
      hasSeoData: !!seoData, 
      hasSpeedData: !!speedData, 
      url 
    });
    
    if (!seoData && !speedData) {
      console.log('Validation failed: No SEO or Speed data provided');
      return res.status(400).json({ error: 'Either SEO or Speed data required' });
    }
    
    const reportId = await db.saveProjectReport(req.user.id, req.params.id, url, seoData, speedData);
    console.log(`Report saved successfully with ID: ${reportId}`);
    
    res.status(201).json({ 
      success: true, 
      reportId,
      message: 'Report saved successfully' 
    });
  } catch (err) {
    console.error('Failed to save report:', err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Get all reports for user (for reports dashboard)
app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    console.log(`Fetching all reports for user ${req.user.id} (${req.user.tier})`);
    
    if (req.user.tier !== 'pro') {
      console.log('Access denied: User is not pro tier');
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    
    const reports = await db.getAllProjectReportsForUser(req.user.id);
    console.log(`Found ${reports.length} reports for user ${req.user.id}`);
    
    res.json(reports);
  } catch (err) {
    console.error('Failed to get reports:', err);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Google PageSpeed API key management endpoints
app.put('/api/auth/profile/pagespeed-api-key', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Basic validation for Google API key format
    const trimmedKey = apiKey.trim();
    if (trimmedKey.length < 20 || !trimmedKey.startsWith('AIza')) {
      return res.status(400).json({ error: 'Invalid Google API key format' });
    }
    
    await db.savePageSpeedApiKey(req.user.id, trimmedKey);
    
    res.json({ 
      success: true,
      message: 'PageSpeed API key saved successfully',
      maskedKey: db.getMaskedApiKey(trimmedKey)
    });
  } catch (err) {
    console.error('Failed to save API key:', err);
    res.status(500).json({ error: 'Failed to save API key' });
  }
});

app.delete('/api/auth/profile/pagespeed-api-key', authenticateToken, async (req, res) => {
  try {
    await db.deletePageSpeedApiKey(req.user.id);
    
    res.json({ 
      success: true,
      message: 'PageSpeed API key removed successfully'
    });
  } catch (err) {
    console.error('Failed to delete API key:', err);
    res.status(500).json({ error: 'Failed to remove API key' });
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
