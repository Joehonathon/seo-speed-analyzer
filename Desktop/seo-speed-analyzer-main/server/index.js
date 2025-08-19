import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeUrl } from './seoAnalyzer.js';
import { runPageSpeed } from './pagespeed.js';

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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'SEO & Speed Analyzer API online' });
});

app.get('/api/analyze', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const result = await analyzeUrl(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to analyze URL' });
  }
});

app.get('/api/pagespeed', async (req, res) => {
  const url = req.query.url;
  const strategy = req.query.strategy || 'mobile'; // 'mobile' | 'desktop'
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const result = await runPageSpeed(url, strategy);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to check site speed' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
