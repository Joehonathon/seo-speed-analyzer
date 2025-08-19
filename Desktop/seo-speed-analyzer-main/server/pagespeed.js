import axios from 'axios';

export async function runPageSpeed(targetUrl, strategy = 'mobile') {
  const apiKey = process.env.PAGESPEED_API_KEY || '';
  const url = new URL(targetUrl, 'https://dummy-base.invalid').href.replace('https://dummy-base.invalid', '');

  if (apiKey) {
    const endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const params = {
      url,
      strategy
    };
    try {
      const { data } = await axios.get(endpoint, { params: { ...params, key: apiKey }, timeout: 30000 });
      const lighthouse = data.lighthouseResult || {};
      const categories = lighthouse.categories || {};
      const perf = categories.performance ? Math.round((categories.performance.score || 0) * 100) : null;
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
          FMP: lighthouse.audits?.['first-meaningful-paint']?.displayValue || null
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
    timeout: 20000,
    maxRedirects: 5,
    responseType: 'arraybuffer',
    validateStatus: () => true,
    headers: { 'User-Agent': 'SpeedCheck/1.0' }
  });
  const elapsed = Date.now() - started;
  const size = resp.data ? resp.data.byteLength : 0;
  return {
    usingPageSpeedAPI: false,
    note: 'Set PAGESPEED_API_KEY in server/.env to use Google PageSpeed Insights for richer metrics.',
    basic: {
      status: resp.status,
      timeMs: elapsed,
      bytes: size
    }
  };
}
