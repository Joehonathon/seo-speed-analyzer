const axios = require('axios');
const db = require('./database');

async function runPageSpeed(targetUrl, strategy = 'mobile', userTier = 'free', userApiKey = null, userId = null) {
  // Priority order: userApiKey (manual override), then user's saved API key from dashboard, then none
  let apiKey = userApiKey || '';
  
  // If no manual API key provided and user is authenticated, check for saved API key
  if (!apiKey && userId) {
    try {
      const savedApiKey = await db.getPageSpeedApiKey(userId);
      if (savedApiKey) {
        apiKey = savedApiKey;
      }
    } catch (error) {
      console.error('Failed to get saved API key:', error);
    }
  }
  
  const url = new URL(targetUrl, 'https://dummy-base.invalid').href.replace('https://dummy-base.invalid', '');
  const isPro = userTier === 'pro';

  // Pro users get PageSpeed API analysis only if they provide their own API key
  if (apiKey && isPro) {
    const endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const params = {
      url,
      strategy
    };
    try {
      // Security: Log API usage without exposing the key
      console.log(`PageSpeed API request: ${url} (${strategy}) - ${userApiKey ? 'User key' : 'Server key'}`);
      const { data } = await axios.get(endpoint, { params: { ...params, key: apiKey }, timeout: 30000 });
      const lighthouse = data.lighthouseResult || {};
      const categories = lighthouse.categories || {};
      const perf = categories.performance ? Math.round((categories.performance.score || 0) * 100) : null;
      
      // Helper function to format timing values
      const formatTiming = (value) => {
        if (!value) return null;
        if (typeof value === 'number') {
          return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(1)}s`;
        }
        return value;
      };
      
      // Extract timing metrics
      const metricsData = lighthouse.audits?.['metrics']?.details?.items?.[0] || {};
      
      // Debug logging to see what metrics data we're getting
      console.log('PageSpeed API Debug - Raw lighthouse audits keys:', Object.keys(lighthouse.audits || {}));
      console.log('PageSpeed API Debug - Metrics audit structure:', lighthouse.audits?.['metrics']);
      console.log('PageSpeed API Debug - Metrics data:', metricsData);
      console.log('PageSpeed API Debug - FMP audit:', lighthouse.audits?.['first-meaningful-paint']);
      
      return {
        usingPageSpeedAPI: true,
        performanceScore: perf,
        metrics: {
          FCP: lighthouse.audits?.['first-contentful-paint']?.displayValue || null,
          LCP: lighthouse.audits?.['largest-contentful-paint']?.displayValue || null,
          TBT: lighthouse.audits?.['total-blocking-time']?.displayValue || null,
          CLS: lighthouse.audits?.['cumulative-layout-shift']?.displayValue || null,
          SI: lighthouse.audits?.['speed-index']?.displayValue || null,
          TTI: lighthouse.audits?.['interactive']?.displayValue || null,
          FMP: lighthouse.audits?.['first-meaningful-paint']?.displayValue || null,
          DCL: formatTiming(metricsData.observedDomContentLoaded || metricsData.domContentLoaded),
          Load: formatTiming(metricsData.observedLoad || metricsData.load)
        },
        opportunities: {
          unusedJS: lighthouse.audits?.['unused-javascript']?.title || 'Not analyzed',
          images: lighthouse.audits?.['uses-optimized-images']?.title || 'Not analyzed',
          renderBlocking: lighthouse.audits?.['render-blocking-resources']?.title || 'Not analyzed'
        },
        raw: data
      };
    } catch (e) {
      console.log('PageSpeed API Error:', e.message);
      console.log('API Key configured:', !!apiKey);
      console.log('URL being tested:', url);
      // fall through to basic fallback
    }
  }

  // Fallback: simple HEAD/GET timing & size
  const started = Date.now();
  const resp = await axios.get(url, {
    timeout: 30000, // Increased timeout from 20s to 30s
    maxRedirects: 5,
    responseType: 'arraybuffer',
    validateStatus: () => true,
    headers: { 'User-Agent': 'SpeedCheck/1.0' }
  });
  const elapsed = Date.now() - started;
  const size = resp.data ? resp.data.byteLength : 0;
  
  const note = isPro 
    ? 'Add your Google PageSpeed Insights API key above to get detailed Lighthouse metrics with Core Web Vitals and performance recommendations.'
    : 'Login and upgrade to Pro for advanced PageSpeed Insights analysis with Core Web Vitals and performance recommendations.';
  
  return {
    usingPageSpeedAPI: false,
    note,
    basic: {
      status: resp.status,
      timeMs: elapsed,
      bytes: size
    }
  };
}

module.exports = { runPageSpeed };
