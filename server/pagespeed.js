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
  
  // Normalize URL - add https:// if no protocol
  let url = targetUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  const isPro = userTier === 'pro';

  // Always get basic HTTP response data first
  console.log('Debug: Starting basic HTTP request for:', url);
  const started = Date.now();
  let basicHttpData;
  try {
    const resp = await axios.get(url, {
      timeout: 30000,
      maxRedirects: 5,
      responseType: 'arraybuffer',
      validateStatus: () => true,
      headers: { 'User-Agent': 'SpeedCheck/1.0' }
    });
    const elapsed = Date.now() - started;
    const size = resp.data ? resp.data.byteLength : 0;
    
    basicHttpData = {
      status: resp.status,
      timeMs: elapsed,
      bytes: size
    };
    console.log('Debug: Basic HTTP request completed:', basicHttpData);
  } catch (error) {
    console.log('Basic HTTP request failed:', error.message);
    basicHttpData = {
      status: 0,
      timeMs: Date.now() - started,
      bytes: 0
    };
    console.log('Debug: Basic HTTP request failed, using defaults:', basicHttpData);
  }

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
      const { data } = await axios.get(endpoint, { 
        params: { ...params, key: apiKey }, 
        timeout: 60000  // Increased timeout to 60 seconds
      });
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

      // Helper function to extract opportunity recommendations
      const getOpportunityText = (audit) => {
        if (!audit) return 'Not analyzed';
        
        // If the audit passed, return a positive message
        if (audit.score === 1) {
          switch(audit.id) {
            case 'unused-javascript':
              return 'JavaScript is optimized';
            case 'uses-optimized-images':
              return 'Images are optimized';
            case 'render-blocking-resources':
              return 'Resources load efficiently';
            case 'uses-text-compression':
              return 'Text compression enabled';
            case 'modern-image-formats':
              return 'Using modern image formats';
            case 'uses-long-cache-ttl':
              return 'Caching configured properly';
            default:
              return 'Optimized';
          }
        }
        
        // If audit failed or needs improvement, return recommendation
        if (audit.title) {
          // Check if there are specific details or savings
          let savings = '';
          if (audit.details?.overallSavingsMs) {
            savings = ` (Save ${Math.round(audit.details.overallSavingsMs)}ms)`;
          } else if (audit.details?.overallSavingsBytes) {
            const kb = Math.round(audit.details.overallSavingsBytes / 1024);
            savings = ` (Save ${kb}KB)`;
          }
          
          return `${audit.title}${savings}`;
        }
        
        return audit.description || 'Not analyzed';
      };
      
      // Extract timing metrics
      const metricsData = lighthouse.audits?.['metrics']?.details?.items?.[0] || {};
      
      // Debug logging to see what metrics data we're getting
      console.log('PageSpeed API Debug - Raw lighthouse audits keys:', Object.keys(lighthouse.audits || {}));
      console.log('PageSpeed API Debug - Metrics audit structure:', lighthouse.audits?.['metrics']);
      console.log('PageSpeed API Debug - Metrics data:', metricsData);
      console.log('PageSpeed API Debug - FMP audit:', lighthouse.audits?.['first-meaningful-paint']);
      console.log('PageSpeed API Debug - Basic HTTP data:', basicHttpData);
      
      // Process opportunities data
      const opportunitiesData = {
        unusedJS: getOpportunityText(lighthouse.audits?.['unused-javascript']),
        images: getOpportunityText(lighthouse.audits?.['uses-optimized-images']) || 
                getOpportunityText(lighthouse.audits?.['modern-image-formats']) ||
                getOpportunityText(lighthouse.audits?.['uses-responsive-images']) ||
                'Images are optimized',
        renderBlocking: getOpportunityText(lighthouse.audits?.['render-blocking-resources']),
        textCompression: getOpportunityText(lighthouse.audits?.['uses-text-compression']),
        nextGenFormats: getOpportunityText(lighthouse.audits?.['modern-image-formats']),
        efficientCaching: getOpportunityText(lighthouse.audits?.['uses-long-cache-ttl'])
      };

      console.log('PageSpeed API Debug - Opportunities data:', opportunitiesData);
      console.log('Debug: PageSpeed API success, returning with basic data:', basicHttpData);
      
      return {
        usingPageSpeedAPI: true,
        performanceScore: perf,
        basic: basicHttpData, // Include basic HTTP data even with PageSpeed API
        metrics: {
          FCP: lighthouse.audits?.['first-contentful-paint']?.displayValue || null,
          LCP: lighthouse.audits?.['largest-contentful-paint']?.displayValue || null,
          TBT: lighthouse.audits?.['total-blocking-time']?.displayValue || null,
          CLS: lighthouse.audits?.['cumulative-layout-shift']?.displayValue || null,
          SI: lighthouse.audits?.['speed-index']?.displayValue || null,
          TTI: lighthouse.audits?.['interactive']?.displayValue || null,
          FMP: lighthouse.audits?.['first-meaningful-paint']?.displayValue || 
               (lighthouse.audits?.['first-meaningful-paint']?.scoreDisplayMode === 'notApplicable' ? 'Not Available' : null),
          DCL: formatTiming(metricsData.observedDomContentLoaded || metricsData.domContentLoaded),
          Load: formatTiming(metricsData.observedLoad || metricsData.load)
        },
        opportunities: opportunitiesData,
        raw: data
      };
    } catch (e) {
      console.log('PageSpeed API Error:', e.message);
      console.log('API Key configured:', !!apiKey);
      console.log('URL being tested:', url);
      // fall through to basic fallback with the HTTP data we already collected
    }
  }

  // Fallback: use the basic HTTP data we already collected
  const note = isPro 
    ? 'Add your Google PageSpeed Insights API key above to get detailed Lighthouse metrics with Core Web Vitals and performance recommendations.'
    : 'Login and upgrade to Pro for advanced PageSpeed Insights analysis with Core Web Vitals and performance recommendations.';
  
  return {
    usingPageSpeedAPI: false,
    note,
    basic: basicHttpData
  };
}

module.exports = { runPageSpeed };
