import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Fetch the webpage
    const startTime = Date.now();
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
      }
    });
    const ttfb = Date.now() - startTime;
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract SEO data
    const title = $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((i, el) => $(el).text()).get();
    const h2Tags = $('h2').map((i, el) => $(el).text()).get();
    const images = $('img').length;
    const imagesWithAlt = $('img[alt]').length;
    
    // Check for important SEO elements
    const hasCanonical = $('link[rel="canonical"]').length > 0;
    const hasRobotsMeta = $('meta[name="robots"]').length > 0;
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const hasStructuredData = $('script[type="application/ld+json"]').length > 0;
    
    // Calculate SEO score
    let score = 0;
    let maxScore = 0;
    
    // Title scoring (20 points)
    maxScore += 20;
    if (title.length > 0) {
      if (title.length >= 30 && title.length <= 60) score += 20;
      else if (title.length > 0) score += 10;
    }
    
    // Meta description scoring (15 points)
    maxScore += 15;
    if (metaDescription.length > 0) {
      if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 15;
      else if (metaDescription.length > 0) score += 7;
    }
    
    // H1 tags scoring (15 points)
    maxScore += 15;
    if (h1Tags.length === 1) score += 15;
    else if (h1Tags.length > 1) score += 5;
    
    // Images with alt text (10 points)
    maxScore += 10;
    if (images === 0) score += 10; // No images is fine
    else if (imagesWithAlt === images) score += 10;
    else if (imagesWithAlt > 0) score += 5;
    
    // Technical SEO (40 points total)
    maxScore += 10; // HTTPS
    maxScore += 10; // Canonical
    maxScore += 10; // Viewport
    maxScore += 10; // Structured data
    
    if (normalizedUrl.startsWith('https://')) score += 10;
    if (hasCanonical) score += 10;
    if (hasViewport) score += 10;
    if (hasStructuredData) score += 10;
    
    const finalScore = Math.round((score / maxScore) * 100);
    
    // Build response
    const analysisResult = {
      url: normalizedUrl,
      status: response.status,
      ttfbMs: ttfb,
      score: finalScore,
      metrics: {
        content: {
          title: {
            text: title,
            length: title.length,
            optimal: title.length >= 30 && title.length <= 60
          },
          metaDescription: {
            text: metaDescription,
            length: metaDescription.length,
            optimal: metaDescription.length >= 120 && metaDescription.length <= 160
          },
          headings: {
            h1Count: h1Tags.length,
            h2Count: h2Tags.length,
            h1Texts: h1Tags.slice(0, 3) // First 3 H1s
          }
        },
        technical: {
          https: normalizedUrl.startsWith('https://'),
          canonical: hasCanonical,
          viewport: hasViewport,
          robotsMeta: hasRobotsMeta,
          structuredData: hasStructuredData
        },
        images: {
          total: images,
          withAlt: imagesWithAlt,
          altOptimized: images === 0 || imagesWithAlt === images
        }
      },
      recommendations: generateRecommendations({
        title, metaDescription, h1Tags, images, imagesWithAlt,
        hasCanonical, hasViewport, hasStructuredData, 
        isHttps: normalizedUrl.startsWith('https://')
      })
    };
    
    res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('SEO Analysis error:', error);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(400).json({ error: 'Unable to reach the website. Please check the URL.' });
    }
    
    if (error.response?.status === 404) {
      return res.status(400).json({ error: 'Page not found (404). Please check the URL.' });
    }
    
    res.status(500).json({ error: 'Failed to analyze website' });
  }
}

function generateRecommendations({ title, metaDescription, h1Tags, images, imagesWithAlt, hasCanonical, hasViewport, hasStructuredData, isHttps }) {
  const recommendations = [];
  
  if (!title || title.length < 30 || title.length > 60) {
    recommendations.push({
      type: 'title',
      priority: 'high',
      message: title.length === 0 
        ? 'Add a page title (30-60 characters recommended)'
        : `Optimize title length (current: ${title.length} chars, recommended: 30-60)`
    });
  }
  
  if (!metaDescription || metaDescription.length < 120 || metaDescription.length > 160) {
    recommendations.push({
      type: 'meta-description',
      priority: 'high',
      message: metaDescription.length === 0
        ? 'Add a meta description (120-160 characters recommended)'
        : `Optimize meta description length (current: ${metaDescription.length} chars, recommended: 120-160)`
    });
  }
  
  if (h1Tags.length === 0) {
    recommendations.push({
      type: 'headings',
      priority: 'high',
      message: 'Add an H1 heading to your page'
    });
  } else if (h1Tags.length > 1) {
    recommendations.push({
      type: 'headings',
      priority: 'medium',
      message: `Use only one H1 tag per page (found ${h1Tags.length})`
    });
  }
  
  if (images > 0 && imagesWithAlt < images) {
    recommendations.push({
      type: 'images',
      priority: 'medium',
      message: `Add alt text to ${images - imagesWithAlt} images for better accessibility`
    });
  }
  
  if (!isHttps) {
    recommendations.push({
      type: 'security',
      priority: 'high',
      message: 'Enable HTTPS for better security and SEO'
    });
  }
  
  if (!hasCanonical) {
    recommendations.push({
      type: 'technical',
      priority: 'medium',
      message: 'Add a canonical URL to prevent duplicate content issues'
    });
  }
  
  if (!hasViewport) {
    recommendations.push({
      type: 'mobile',
      priority: 'high',
      message: 'Add a viewport meta tag for mobile optimization'
    });
  }
  
  if (!hasStructuredData) {
    recommendations.push({
      type: 'structured-data',
      priority: 'low',
      message: 'Consider adding structured data (JSON-LD) for rich snippets'
    });
  }
  
  return recommendations;
}