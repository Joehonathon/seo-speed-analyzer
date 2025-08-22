const axios = require('axios');
const { load } = require('cheerio');

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    return url.toString();
  } catch {
    const prefixed = 'https://' + u.replace(/^https?:\/\//, '');
    return new URL(prefixed).toString();
  }
}

function scoreItem(ok, weight) {
  if (weight === undefined || weight === null) {
    console.warn('scoreItem called with undefined weight:', weight);
    return 0;
  }
  return ok ? weight : 0;
}

async function analyzeUrl(targetUrl, userTier = 'free') {
  console.log('SEO Analysis - User Tier:', userTier);
  const url = normalizeUrl(targetUrl);
  const urlObj = new URL(url);
  const started = Date.now();
  
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'SEO-Analyzer/1.0 (+https://example.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const ttfbMs = Date.now() - started;
    const status = response.status;
    const html = typeof response.data === 'string' ? response.data : '';

    const $ = load(html || '');

    // Additional checks for comprehensive SEO analysis
    const [brokenLinksCheck] = await Promise.allSettled([
      Promise.race([
        checkBrokenLinks($, url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Broken links check timeout')), 8000))
      ])
    ]);

  const title = $('head > title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  const lang = $('html').attr('lang') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';

  // Header hierarchy analysis
  const h1s = $('h1');
  const h2s = $('h2');
  const h3s = $('h3');
  const h4s = $('h4');
  const h5s = $('h5');
  const h6s = $('h6');
  const h1Count = h1s.length;
  const headerHierarchy = analyzeHeaderHierarchy($);
  
  // Image analysis
  const images = $('img');
  const imgCount = images.length;
  const imgsMissingAlt = images.filter((_, el) => !($(el).attr('alt') || '').trim()).length;
  const imageAnalysis = analyzeImages($);
  
  // Social media links analysis
  const socialLinks = analyzeSocialLinks($);
  
  // Keyword analysis (basic)
  const keywordAnalysis = analyzeKeywords($, title, metaDescription);
  const links = $('a');
  const internalLinks = links.filter((_, el) => {
    try {
      const href = $(el).attr('href') || '';
      const abs = new URL(href, url);
      return abs.host === (new URL(url)).host;
    } catch { return false; }
  }).length;
  const externalLinks = links.length - internalLinks;

  // quick heuristics for mobile-friendly (viewport) & https
  const usesHttps = url.startsWith('https://');
  const hasViewport = /width=device-width/i.test(viewport);

  // count words (rough)
  const text = $('body').text().replace(/\s+/g,' ').trim();
  const wordCount = text ? text.split(' ').filter(Boolean).length : 0;

  // Structured data: presence of JSON-LD
  const jsonLd = $('script[type="application/ld+json"]').length;

  // Enhanced meta information analysis (always run for pro issue detection)
  const isPro = userTier === 'pro';
  console.log('SEO Analysis - isPro:', isPro, 'userTier:', userTier);
  let metaAnalysis, schemaAnalysis, serverConfigAnalysis, accessibilityAnalysis, contentQualityAnalysis, linkAnalysis, imageAnalysisAdvanced, mobileFriendlyAnalysis, securityAnalysis;
  
  try {
    metaAnalysis = analyzeMetaInformation($);
    schemaAnalysis = analyzeSchemaMarkup($);
    serverConfigAnalysis = analyzeServerConfiguration(response);
    accessibilityAnalysis = analyzeAccessibility($);
    contentQualityAnalysis = analyzeContentQuality($, text);
    linkAnalysis = analyzeLinkStructure($, url);
    imageAnalysisAdvanced = analyzeImagesAdvanced($);
    mobileFriendlyAnalysis = analyzeMobileFriendly($, viewport);
    securityAnalysis = analyzeSecurityFeatures($, response, url);
  } catch (error) {
    console.error('Error in advanced analysis functions:', error);
    // Provide default values if analysis functions fail
    metaAnalysis = { score: 0 };
    schemaAnalysis = { score: 0, count: 0 };
    serverConfigAnalysis = { score: 0 };
    accessibilityAnalysis = { score: 0 };
    contentQualityAnalysis = { score: 0, hasGoodLength: false, hasGoodStructure: false };
    linkAnalysis = { score: 0 };
    imageAnalysisAdvanced = { score: 0 };
    mobileFriendlyAnalysis = { score: 0 };
    securityAnalysis = { score: 0 };
  }

  // Tiered scoring system - different weights for free vs pro
  const weights = isPro ? {
    // Pro tier: Comprehensive analysis (weights total 100)
    statusOk: 4,
    https: 4,
    title: 5,
    titleLength: 2,
    metaDescription: 5,
    metaDescriptionLength: 2,
    h1Single: 3,
    headerHierarchy: 3,
    viewport: 4,
    lang: 2,
    canonicalTag: 3,
    ogTags: 3,
    twitterCard: 2,
    imgAlt: 4,
    imageOptimization: 3,
    internalLinks: 3,
    externalLinks: 2,
    socialMediaLinks: 2,
    jsonLd: 3,
    ttfb: 3,
    wordCount: 3,
    keywordPlacement: 4,
    robotsMeta: 2,
    brokenLinks: 2,
    // Advanced Pro metrics
    metaInformation: 5,
    schemaMarkup: 4,
    serverConfig: 4,
    accessibility: 6,
    contentQuality: 5,
    linkStructure: 4,
    advancedImages: 4,
    mobileFriendly: 5,
    security: 6
  } : {
    // Free tier: Basic analysis only (weights total 100)
    statusOk: 7,
    https: 7,
    title: 11,
    titleLength: 3,
    metaDescription: 11,
    metaDescriptionLength: 3,
    h1Single: 7,
    headerHierarchy: 5,
    viewport: 7,
    lang: 3,
    canonicalTag: 5,
    ogTags: 5,
    twitterCard: 3,
    imgAlt: 7,
    imageOptimization: 5,
    internalLinks: 3,
    externalLinks: 2,
    socialMediaLinks: 2,
    jsonLd: 3,
    ttfb: 3,
    wordCount: 3,
    keywordPlacement: 4,
    robotsMeta: 2,
    brokenLinks: 2,
    // No advanced metrics for free users
    metaInformation: 0,
    schemaMarkup: 0,
    serverConfig: 0,
    accessibility: 0,
    contentQuality: 0,
    linkStructure: 0,
    advancedImages: 0,
    mobileFriendly: 0,
    security: 0
  };

  console.log('Selected weights for tier:', userTier, isPro ? 'pro weights' : 'free weights');
  let score = 0;
  score += scoreItem(status >= 200 && status < 400, weights.statusOk);
  score += scoreItem(usesHttps, weights.https);
  score += scoreItem(!!title, weights.title);
  score += scoreItem(title.length >= 10 && title.length <= 60, weights.titleLength);
  score += scoreItem(!!metaDescription, weights.metaDescription);
  score += scoreItem(metaDescription.length >= 50 && metaDescription.length <= 160, weights.metaDescriptionLength);
  score += scoreItem(h1Count === 1, weights.h1Single);
  score += scoreItem(headerHierarchy.isGood, weights.headerHierarchy);
  score += scoreItem(hasViewport, weights.viewport);
  score += scoreItem(!!lang, weights.lang);
  score += scoreItem(!!canonical, weights.canonicalTag);
  score += scoreItem(!!ogTitle && !!ogDesc, weights.ogTags);
  score += scoreItem(!!twitterCard, weights.twitterCard);
  score += scoreItem(imgCount === 0 || (imgsMissingAlt / Math.max(1,imgCount)) <= 0.1, weights.imgAlt);
  score += scoreItem(imageAnalysis.optimized, weights.imageOptimization);
  score += scoreItem(internalLinks >= 5, weights.internalLinks);
  score += scoreItem(externalLinks >= 2 && externalLinks <= 10, weights.externalLinks);
  score += scoreItem(socialLinks.count >= 2, weights.socialMediaLinks);
  score += scoreItem(jsonLd > 0, weights.jsonLd);
  score += scoreItem(ttfbMs <= 800, weights.ttfb);
  score += scoreItem(wordCount >= 300 && wordCount <= 2500, weights.wordCount);
  score += scoreItem(keywordAnalysis.titleHasKeywords && keywordAnalysis.descriptionHasKeywords, weights.keywordPlacement);
  score += scoreItem(!!robotsMeta && !robotsMeta.includes('noindex'), weights.robotsMeta);
  score += scoreItem(brokenLinksCheck.status === 'fulfilled' && brokenLinksCheck.value.brokenCount === 0, weights.brokenLinks);
  
  // Pro tier: Advanced metrics scoring
  if (isPro) {
    score += scoreItem(metaAnalysis.score >= 70, weights.metaInformation);
    score += scoreItem(schemaAnalysis.score >= 30, weights.schemaMarkup);
    score += scoreItem(serverConfigAnalysis.score >= 60, weights.serverConfig);
    score += scoreItem(accessibilityAnalysis.score >= 80, weights.accessibility);
    score += scoreItem(contentQualityAnalysis.hasGoodLength && contentQualityAnalysis.hasGoodStructure, weights.contentQuality);
    score += scoreItem(linkAnalysis.score >= 70, weights.linkStructure);
    score += scoreItem(imageAnalysisAdvanced.score >= 70, weights.advancedImages);
    score += scoreItem(mobileFriendlyAnalysis.score >= 80, weights.mobileFriendly);
    score += scoreItem(securityAnalysis.score >= 70, weights.security);
  }

  // Free tier issues - basic SEO problems
  const freeIssues = [];
  if (!(status >= 200 && status < 400)) freeIssues.push(`HTTP status is ${status}`);
  if (!usesHttps) freeIssues.push('Site should use HTTPS');
  if (!title) freeIssues.push('Missing <title>');
  else if (!(title.length >= 10 && title.length <= 60)) freeIssues.push('Title length should be 10–60 chars');
  if (!metaDescription) freeIssues.push('Missing meta description');
  else if (!(metaDescription.length >= 50 && metaDescription.length <= 160)) freeIssues.push('Meta description should be 50–160 chars');
  if (h1Count !== 1) freeIssues.push('Use exactly one <h1>');
  if (!headerHierarchy.isGood) freeIssues.push(headerHierarchy.issue);
  if (!hasViewport) freeIssues.push('Missing/weak mobile viewport meta');
  if (!lang) freeIssues.push('<html lang> attribute missing');
  if (!canonical) freeIssues.push('Missing canonical link tag');
  if (!ogTitle || !ogDesc) freeIssues.push('Missing Open Graph title/description');
  if (!twitterCard) freeIssues.push('Missing Twitter Card meta');
  if (imgCount > 0 && (imgsMissingAlt / Math.max(1,imgCount)) > 0.1) freeIssues.push('Too many images missing alt text');
  if (!imageAnalysis.optimized) freeIssues.push(imageAnalysis.issue);
  if (internalLinks < 5) freeIssues.push('Add more internal links');
  if (!(externalLinks >= 2 && externalLinks <= 10)) freeIssues.push('Optimize external link count (2-10 recommended)');
  if (socialLinks.count < 2) freeIssues.push('Add social media links');
  if (jsonLd === 0) freeIssues.push('Consider adding JSON-LD structured data');
  if (ttfbMs > 800) freeIssues.push(`High TTFB: ${ttfbMs} ms`);
  if (!(wordCount >= 300 && wordCount <= 2500)) freeIssues.push(`Word count ${wordCount} should be 300-2500`);
  if (!keywordAnalysis.titleHasKeywords || !keywordAnalysis.descriptionHasKeywords) freeIssues.push('Improve keyword placement in title/description');
  if (!robotsMeta || robotsMeta.includes('noindex')) freeIssues.push('Check robots meta tag settings');
  if (brokenLinksCheck.status === 'fulfilled' && brokenLinksCheck.value.brokenCount > 0) freeIssues.push(`${brokenLinksCheck.value.brokenCount} broken links found`);
  
  // Pro tier issues - advanced SEO problems (always generated but only shown to Pro users)
  const proIssues = [];
  if (metaAnalysis.score < 70) proIssues.push('Improve meta information completeness');
  if (schemaAnalysis.count === 0) proIssues.push('Add structured data markup');
  if (serverConfigAnalysis.score < 60) proIssues.push('Improve server configuration and security headers');
  if (accessibilityAnalysis.score < 80) proIssues.push('Address accessibility issues');
  if (!contentQualityAnalysis.hasGoodLength) proIssues.push('Optimize content length (300-2500 words)');
  if (!contentQualityAnalysis.hasGoodStructure) proIssues.push('Improve content structure with headings, lists, or images');
  if (linkAnalysis.score < 70) proIssues.push('Optimize link structure and anchor text');
  if (imageAnalysisAdvanced.score < 70) proIssues.push('Optimize images (alt text, lazy loading, formats)');
  if (mobileFriendlyAnalysis.score < 80) proIssues.push('Improve mobile-friendliness');
  if (securityAnalysis.score < 70) proIssues.push('Enhance website security features');
  
  // Combine issues based on user tier for backward compatibility
  const issues = isPro ? [...freeIssues, ...proIssues] : freeIssues;
  
  console.log('Final SEO score calculated:', Math.round(score), 'for tier:', userTier);
  
  return {
      url,
      status,
      ttfbMs,
      wordCount,
      metrics: {
        title,
        metaDescription,
        viewport,
        robotsMeta,
        lang,
        canonical,
        h1Count,
        headerHierarchy,
        imgCount,
        imgsMissingAlt,
        imageAnalysis,
        linkTotals: { total: links.length, internal: internalLinks, external: externalLinks },
        og: { title: ogTitle, description: ogDesc },
        twitterCard,
        jsonLdCount: jsonLd,
        keywordAnalysis,
        socialLinks,
        technical: {
          https: usesHttps,
          brokenLinks: brokenLinksCheck.status === 'fulfilled' ? brokenLinksCheck.value : { brokenCount: 0, checkedCount: 0, brokenLinks: [] }
        },
        // New comprehensive metrics
        metaInformation: metaAnalysis,
        schemaMarkup: schemaAnalysis,
        serverConfiguration: serverConfigAnalysis,
        accessibility: accessibilityAnalysis,
        contentQuality: contentQualityAnalysis,
        linkStructure: linkAnalysis,
        advancedImages: imageAnalysisAdvanced,
        mobileFriendly: mobileFriendlyAnalysis,
        security: securityAnalysis
      },
      score: Math.round(score),
      issues,
      freeIssues,
      proIssues
    };
  } catch (error) {
    console.error('SEO Analysis Error:', error.message);
    
    // Return a basic error response instead of crashing
    throw new Error(`Failed to analyze URL: ${error.message.includes('timeout') ? 'Request timeout' : 'Network error'}`);
  }
}

// Helper functions for comprehensive SEO analysis


async function checkBrokenLinks($, baseUrl) {
  try {
    const links = $('a[href]').map((_, el) => $(el).attr('href')).get();
    const internalLinks = links.filter(href => {
      try {
        const url = new URL(href, baseUrl);
        return url.host === new URL(baseUrl).host;
      } catch { return false; }
    }).slice(0, 5); // Reduce to 5 links to avoid timeout
    
    const checkedCount = internalLinks.length;
    const brokenLinks = [];
    
    // Use Promise.allSettled with shorter timeout for parallel checking
    const checks = internalLinks.map(async (href) => {
      try {
        const fullUrl = new URL(href, baseUrl).toString();
        
        // First try HEAD request (faster)
        let response;
        try {
          response = await axios.head(fullUrl, { 
            timeout: 5000, // Increased timeout
            validateStatus: () => true,
            maxRedirects: 5,
            headers: {
              'User-Agent': 'SEO-Analyzer/1.0 Link-Checker'
            }
          });
        } catch (headError) {
          // If HEAD fails, try GET request (some servers don't support HEAD)
          try {
            response = await axios.get(fullUrl, { 
              timeout: 5000, // Increased timeout
              validateStatus: () => true,
              maxRedirects: 5,
              headers: {
                'User-Agent': 'SEO-Analyzer/1.0 Link-Checker'
              }
            });
          } catch (getError) {
            throw getError; // If both fail, throw the GET error
          }
        }
        
        return {
          url: fullUrl,
          originalHref: href,
          isBroken: response.status >= 400,
          status: response.status
        };
      } catch (error) {
        return {
          url: href,
          originalHref: href,
          isBroken: true,
          status: 'timeout/error',
          error: error.code || error.message || 'unknown'
        };
      }
    });
    
    const results = await Promise.allSettled(checks);
    const linkResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    const brokenCount = linkResults.filter(link => link.isBroken).length;
    const brokenLinksList = linkResults
      .filter(link => link.isBroken)
      .map(link => ({
        url: link.originalHref,
        fullUrl: link.url,
        status: link.status,
        error: link.error
      }));
    
    return { 
      brokenCount, 
      checkedCount, 
      brokenLinks: brokenLinksList 
    };
  } catch {
    return { brokenCount: 0, checkedCount: 0, brokenLinks: [] };
  }
}

function analyzeHeaderHierarchy($) {
  const headers = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headers.push(parseInt($(el).prop('tagName').substring(1)));
  });
  
  if (headers.length === 0) {
    return { isGood: false, issue: 'No header tags found' };
  }
  
  // Check for proper hierarchy (no skipping levels)
  for (let i = 1; i < headers.length; i++) {
    if (headers[i] > headers[i - 1] + 1) {
      return { isGood: false, issue: 'Header hierarchy skips levels' };
    }
  }
  
  return { isGood: true, structure: headers };
}

function analyzeImages($) {
  const images = $('img');
  let totalSize = 0;
  let oversizedCount = 0;
  
  images.each((_, el) => {
    const src = $(el).attr('src') || '';
    // Basic check for potentially large images
    if (src.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      const width = parseInt($(el).attr('width')) || 0;
      const height = parseInt($(el).attr('height')) || 0;
      
      if (width > 1200 || height > 800) {
        oversizedCount++;
      }
    }
  });
  
  const optimized = oversizedCount === 0;
  const issue = oversizedCount > 0 ? `${oversizedCount} potentially oversized images` : null;
  
  return { optimized, oversizedCount, issue };
}

function analyzeSocialLinks($) {
  const socialDomains = [
    'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
    'youtube.com', 'tiktok.com', 'pinterest.com', 'snapchat.com'
  ];
  
  const socialLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    for (const domain of socialDomains) {
      if (href.includes(domain)) {
        socialLinks.push(domain);
        break;
      }
    }
  });
  
  return { count: socialLinks.length, platforms: [...new Set(socialLinks)] };
}

function analyzeKeywords($, title, metaDescription) {
  const bodyText = $('body').text().toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const descWords = metaDescription.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  // Simple keyword analysis - check if title words appear in content
  const titleHasKeywords = titleWords.length > 0 && titleWords.some(word => bodyText.includes(word));
  const descriptionHasKeywords = descWords.length > 0 && descWords.some(word => bodyText.includes(word));
  
  return {
    titleHasKeywords,
    descriptionHasKeywords,
    potentialKeywords: titleWords.slice(0, 5)
  };
}

// Enhanced meta information analysis
function analyzeMetaInformation($) {
  const metaTags = {};
  
  // Basic meta tags
  metaTags.description = $('meta[name="description"]').attr('content') || '';
  metaTags.keywords = $('meta[name="keywords"]').attr('content') || '';
  metaTags.author = $('meta[name="author"]').attr('content') || '';
  metaTags.generator = $('meta[name="generator"]').attr('content') || '';
  metaTags.copyright = $('meta[name="copyright"]').attr('content') || '';
  
  // SEO-specific meta tags
  metaTags.robots = $('meta[name="robots"]').attr('content') || '';
  metaTags.googlebot = $('meta[name="googlebot"]').attr('content') || '';
  metaTags.revisitAfter = $('meta[name="revisit-after"]').attr('content') || '';
  
  // Language and region
  metaTags.language = $('meta[name="language"]').attr('content') || '';
  metaTags.geoRegion = $('meta[name="geo.region"]').attr('content') || '';
  metaTags.geoPlacename = $('meta[name="geo.placename"]').attr('content') || '';
  
  // Open Graph tags
  const og = {};
  og.title = $('meta[property="og:title"]').attr('content') || '';
  og.description = $('meta[property="og:description"]').attr('content') || '';
  og.image = $('meta[property="og:image"]').attr('content') || '';
  og.url = $('meta[property="og:url"]').attr('content') || '';
  og.type = $('meta[property="og:type"]').attr('content') || '';
  og.siteName = $('meta[property="og:site_name"]').attr('content') || '';
  og.locale = $('meta[property="og:locale"]').attr('content') || '';
  
  // Twitter Card tags
  const twitter = {};
  twitter.card = $('meta[name="twitter:card"]').attr('content') || '';
  twitter.site = $('meta[name="twitter:site"]').attr('content') || '';
  twitter.creator = $('meta[name="twitter:creator"]').attr('content') || '';
  twitter.title = $('meta[name="twitter:title"]').attr('content') || '';
  twitter.description = $('meta[name="twitter:description"]').attr('content') || '';
  twitter.image = $('meta[name="twitter:image"]').attr('content') || '';
  
  // Dublin Core tags
  const dublinCore = {};
  dublinCore.title = $('meta[name="DC.title"]').attr('content') || '';
  dublinCore.creator = $('meta[name="DC.creator"]').attr('content') || '';
  dublinCore.subject = $('meta[name="DC.subject"]').attr('content') || '';
  dublinCore.description = $('meta[name="DC.description"]').attr('content') || '';
  dublinCore.publisher = $('meta[name="DC.publisher"]').attr('content') || '';
  dublinCore.date = $('meta[name="DC.date"]').attr('content') || '';
  dublinCore.type = $('meta[name="DC.type"]').attr('content') || '';
  dublinCore.language = $('meta[name="DC.language"]').attr('content') || '';
  
  return {
    basic: metaTags,
    openGraph: og,
    twitter: twitter,
    dublinCore: dublinCore,
    score: calculateMetaScore(metaTags, og, twitter)
  };
}

function calculateMetaScore(meta, og, twitter) {
  let score = 0;
  const maxScore = 100;
  
  // Basic meta tags (40 points)
  if (meta.description && meta.description.length >= 50 && meta.description.length <= 160) score += 15;
  if (meta.robots && !meta.robots.includes('noindex')) score += 10;
  if (meta.author) score += 5;
  if (meta.keywords && meta.keywords.length > 0) score += 5;
  if (meta.language) score += 5;
  
  // Open Graph (30 points)
  if (og.title) score += 10;
  if (og.description) score += 10;
  if (og.image) score += 5;
  if (og.type) score += 3;
  if (og.url) score += 2;
  
  // Twitter Cards (20 points)
  if (twitter.card) score += 10;
  if (twitter.title) score += 5;
  if (twitter.description) score += 3;
  if (twitter.image) score += 2;
  
  // Geo and regional (10 points)
  if (meta.geoRegion) score += 5;
  if (meta.geoPlacename) score += 5;
  
  return Math.min(score, maxScore);
}

// Schema markup analysis
function analyzeSchemaMarkup($) {
  const schemas = [];
  
  // JSON-LD structured data
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      const schema = JSON.parse(content);
      schemas.push({
        type: 'JSON-LD',
        schema: schema['@type'] || 'Unknown',
        data: schema
      });
    } catch (e) {
      // Invalid JSON-LD
    }
  });
  
  // Microdata
  $('[itemscope]').each((_, el) => {
    const itemType = $(el).attr('itemtype') || '';
    const itemProps = [];
    $(el).find('[itemprop]').each((_, prop) => {
      itemProps.push($(prop).attr('itemprop'));
    });
    
    if (itemType) {
      schemas.push({
        type: 'Microdata',
        schema: itemType.split('/').pop(),
        properties: itemProps
      });
    }
  });
  
  // RDFa
  $('[typeof]').each((_, el) => {
    const typeOf = $(el).attr('typeof') || '';
    const properties = [];
    $(el).find('[property]').each((_, prop) => {
      properties.push($(prop).attr('property'));
    });
    
    if (typeOf) {
      schemas.push({
        type: 'RDFa',
        schema: typeOf,
        properties: properties
      });
    }
  });
  
  return {
    count: schemas.length,
    schemas: schemas,
    hasOrganization: schemas.some(s => s.schema === 'Organization'),
    hasWebsite: schemas.some(s => s.schema === 'WebSite'),
    hasArticle: schemas.some(s => s.schema === 'Article'),
    hasBreadcrumb: schemas.some(s => s.schema === 'BreadcrumbList'),
    hasLocalBusiness: schemas.some(s => s.schema === 'LocalBusiness'),
    score: Math.min(schemas.length * 15, 100)
  };
}

// Server configuration analysis
function analyzeServerConfiguration(response) {
  const headers = response.headers || {};
  const config = {
    server: headers.server || 'Unknown',
    powerBy: headers['x-powered-by'] || '',
    contentType: headers['content-type'] || '',
    contentEncoding: headers['content-encoding'] || '',
    cacheControl: headers['cache-control'] || '',
    expires: headers.expires || '',
    etag: headers.etag || '',
    lastModified: headers['last-modified'] || '',
    xFrameOptions: headers['x-frame-options'] || '',
    xContentTypeOptions: headers['x-content-type-options'] || '',
    xXssProtection: headers['x-xss-protection'] || '',
    strictTransportSecurity: headers['strict-transport-security'] || '',
    contentSecurityPolicy: headers['content-security-policy'] || '',
    referrerPolicy: headers['referrer-policy'] || ''
  };
  
  const security = {
    hasHSTS: !!config.strictTransportSecurity,
    hasCSP: !!config.contentSecurityPolicy,
    hasXFrameOptions: !!config.xFrameOptions,
    hasXContentTypeOptions: !!config.xContentTypeOptions,
    hasXXssProtection: !!config.xXssProtection,
    hasReferrerPolicy: !!config.referrerPolicy
  };
  
  const caching = {
    hasCacheControl: !!config.cacheControl,
    hasETag: !!config.etag,
    hasLastModified: !!config.lastModified,
    hasExpires: !!config.expires
  };
  
  const securityScore = Object.values(security).filter(Boolean).length * 15;
  const cachingScore = Object.values(caching).filter(Boolean).length * 10;
  
  return {
    headers: config,
    security: security,
    caching: caching,
    score: Math.min(securityScore + cachingScore, 100)
  };
}

// Accessibility analysis
function analyzeAccessibility($) {
  const accessibility = {
    imagesWithoutAlt: $('img:not([alt])').length,
    imagesWithEmptyAlt: $('img[alt=""]').length,
    linksWithoutText: $('a:not(:has(img))').filter((_, el) => !$(el).text().trim()).length,
    headingStructure: analyzeHeadingStructure($),
    formLabels: analyzeFormLabels($),
    colorContrast: analyzeColorContrast($),
    focusableElements: analyzeFocusableElements($),
    landmarks: analyzeLandmarks($),
    skipLinks: $('a[href^="#"]').filter((_, el) => $(el).text().toLowerCase().includes('skip')).length
  };
  
  let score = 100;
  if (accessibility.imagesWithoutAlt > 0) score -= accessibility.imagesWithoutAlt * 5;
  if (accessibility.linksWithoutText > 0) score -= accessibility.linksWithoutText * 10;
  if (!accessibility.headingStructure.hasH1) score -= 15;
  if (accessibility.headingStructure.hasSkips) score -= 10;
  if (accessibility.formLabels.unlabeled > 0) score -= accessibility.formLabels.unlabeled * 8;
  if (accessibility.landmarks.count === 0) score -= 10;
  
  return {
    ...accessibility,
    score: Math.max(score, 0)
  };
}

function analyzeHeadingStructure($) {
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headings.push(parseInt($(el).prop('tagName').substring(1)));
  });
  
  const hasH1 = headings.includes(1);
  let hasSkips = false;
  
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      hasSkips = true;
      break;
    }
  }
  
  return { headings, hasH1, hasSkips };
}

function analyzeFormLabels($) {
  const inputs = $('input, textarea, select').not('[type="hidden"], [type="submit"], [type="button"]');
  let labeled = 0;
  let unlabeled = 0;
  
  inputs.each((_, el) => {
    const id = $(el).attr('id');
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const hasAriaLabel = $(el).attr('aria-label');
    const hasAriaLabelledBy = $(el).attr('aria-labelledby');
    
    if (hasLabel || hasAriaLabel || hasAriaLabelledBy) {
      labeled++;
    } else {
      unlabeled++;
    }
  });
  
  return { total: inputs.length, labeled, unlabeled };
}

function analyzeColorContrast($) {
  // Basic color contrast analysis (simplified)
  let potentialIssues = 0;
  
  $('*').each((_, el) => {
    const computedStyle = $(el).attr('style') || '';
    if (computedStyle.includes('color:') && computedStyle.includes('background')) {
      // This is a simplified check - real implementation would need color parsing
      potentialIssues++;
    }
  });
  
  return { potentialIssues };
}

function analyzeFocusableElements($) {
  const focusable = $('a, button, input, textarea, select, [tabindex]').not('[tabindex="-1"]');
  const withTabIndex = $('[tabindex]:not([tabindex="-1"], [tabindex="0"])').length;
  
  return {
    total: focusable.length,
    customTabIndex: withTabIndex,
    hasSkipToContent: $('a[href^="#"]').filter((_, el) => 
      $(el).text().toLowerCase().includes('skip') || 
      $(el).text().toLowerCase().includes('main')
    ).length > 0
  };
}

function analyzeLandmarks($) {
  const landmarks = {
    header: $('header, [role="banner"]').length,
    nav: $('nav, [role="navigation"]').length,
    main: $('main, [role="main"]').length,
    aside: $('aside, [role="complementary"]').length,
    footer: $('footer, [role="contentinfo"]').length,
    section: $('section').length,
    article: $('article').length
  };
  
  const count = Object.values(landmarks).reduce((sum, val) => sum + val, 0);
  
  return { ...landmarks, count };
}

// Content quality analysis
function analyzeContentQuality($, text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = $('p').length;
  const lists = $('ul, ol').length;
  const listItems = $('li').length;
  const tables = $('table').length;
  const images = $('img').length;
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  
  // Reading level analysis (simplified Flesch-Kincaid)
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const avgSyllablesPerWord = syllables / Math.max(words.length, 1);
  
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  // Content structure score
  let structureScore = 0;
  if (paragraphs > 0) structureScore += 20;
  if (lists > 0) structureScore += 15;
  if (tables > 0) structureScore += 10;
  if (images > 0) structureScore += 15;
  if (videos > 0) structureScore += 10;
  if (words.length >= 300) structureScore += 30;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs,
    listCount: lists,
    listItemCount: listItems,
    tableCount: tables,
    imageCount: images,
    videoCount: videos,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    fleschReadingScore: Math.round(fleschScore * 10) / 10,
    readingLevel: getReadingLevel(fleschScore),
    structureScore: Math.min(structureScore, 100),
    hasGoodLength: words.length >= 300 && words.length <= 2500,
    hasGoodStructure: paragraphs >= 3 && (lists > 0 || images > 0)
  };
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  
  return matches ? matches.length : 1;
}

function getReadingLevel(score) {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

// Advanced link structure analysis
function analyzeLinkStructure($, baseUrl) {
  const links = $('a[href]');
  const linkData = {
    total: links.length,
    internal: 0,
    external: 0,
    nofollow: 0,
    noopener: 0,
    noreferrer: 0,
    targetBlank: 0,
    withoutText: 0,
    emailLinks: 0,
    phoneLinks: 0,
    fileLinks: 0,
    anchorLinks: 0,
    jsLinks: 0
  };
  
  const baseDomain = new URL(baseUrl).hostname;
  
  links.each((_, el) => {
    const href = $(el).attr('href') || '';
    const rel = $(el).attr('rel') || '';
    const target = $(el).attr('target') || '';
    const text = $(el).text().trim();
    
    // Link text analysis
    if (!text && !$(el).find('img').length) linkData.withoutText++;
    
    // Link type analysis
    if (href.startsWith('mailto:')) linkData.emailLinks++;
    else if (href.startsWith('tel:')) linkData.phoneLinks++;
    else if (href.startsWith('#')) linkData.anchorLinks++;
    else if (href.startsWith('javascript:')) linkData.jsLinks++;
    else if (href.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar)$/i)) linkData.fileLinks++;
    else {
      try {
        const linkUrl = new URL(href, baseUrl);
        if (linkUrl.hostname === baseDomain) {
          linkData.internal++;
        } else {
          linkData.external++;
        }
      } catch (e) {
        // Invalid URL
      }
    }
    
    // Rel attribute analysis
    if (rel.includes('nofollow')) linkData.nofollow++;
    if (rel.includes('noopener')) linkData.noopener++;
    if (rel.includes('noreferrer')) linkData.noreferrer++;
    
    // Target analysis
    if (target === '_blank') linkData.targetBlank++;
  });
  
  // Calculate score
  let score = 100;
  if (linkData.withoutText > 0) score -= linkData.withoutText * 5;
  if (linkData.internal < 3) score -= 15;
  if (linkData.external > linkData.internal * 2) score -= 10;
  if (linkData.targetBlank > 0 && linkData.noopener === 0) score -= 10;
  if (linkData.jsLinks > 0) score -= linkData.jsLinks * 3;
  
  return {
    ...linkData,
    internalToExternalRatio: linkData.external > 0 ? (linkData.internal / linkData.external).toFixed(2) : 'Infinity',
    score: Math.max(score, 0)
  };
}

// Advanced image analysis
function analyzeImagesAdvanced($) {
  const images = $('img');
  const imageData = {
    total: images.length,
    withAlt: 0,
    withoutAlt: 0,
    withEmptyAlt: 0,
    withTitle: 0,
    withLazyLoading: 0,
    withSrcset: 0,
    webpFormat: 0,
    largeImages: 0,
    decorativeImages: 0,
    informativeImages: 0
  };
  
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const title = $(el).attr('title') || '';
    const loading = $(el).attr('loading') || '';
    const srcset = $(el).attr('srcset') || '';
    const src = $(el).attr('src') || '';
    const width = parseInt($(el).attr('width')) || 0;
    const height = parseInt($(el).attr('height')) || 0;
    
    // Alt text analysis
    if (alt !== undefined) {
      imageData.withAlt++;
      if (alt === '') {
        imageData.withEmptyAlt++;
        imageData.decorativeImages++;
      } else {
        imageData.informativeImages++;
      }
    } else {
      imageData.withoutAlt++;
    }
    
    // Other attributes
    if (title) imageData.withTitle++;
    if (loading === 'lazy') imageData.withLazyLoading++;
    if (srcset) imageData.withSrcset++;
    if (src.includes('.webp')) imageData.webpFormat++;
    
    // Size analysis
    if (width > 1200 || height > 800) imageData.largeImages++;
  });
  
  // Calculate score
  let score = 100;
  if (imageData.withoutAlt > 0) score -= imageData.withoutAlt * 10;
  if (imageData.total > 0 && imageData.withLazyLoading === 0) score -= 15;
  if (imageData.total > 0 && imageData.withSrcset === 0) score -= 10;
  if (imageData.largeImages > 0) score -= imageData.largeImages * 5;
  if (imageData.webpFormat === 0 && imageData.total > 0) score -= 10;
  
  return {
    ...imageData,
    altCoverage: imageData.total > 0 ? ((imageData.withAlt / imageData.total) * 100).toFixed(1) : 0,
    lazyLoadingCoverage: imageData.total > 0 ? ((imageData.withLazyLoading / imageData.total) * 100).toFixed(1) : 0,
    score: Math.max(score, 0)
  };
}

// Mobile-friendly analysis
function analyzeMobileFriendly($, viewport) {
  const mobile = {
    hasViewport: !!viewport && viewport.includes('width=device-width'),
    hasFlexibleLayout: !!viewport && !viewport.includes('width=') || viewport.includes('width=device-width'),
    hasHoverElements: $('[onmouseover], [onmouseout]').length,
    hasSmallText: analyzeTextSize($),
    hasTouchTargets: analyzeTouchTargets($),
    hasFlashContent: $('object[type*="flash"], embed[type*="flash"]').length > 0,
    usesResponsiveImages: $('img[srcset]').length > 0,
    hasMediaQueries: analyzeMediaQueries($)
  };
  
  let score = 100;
  if (!mobile.hasViewport) score -= 30;
  if (mobile.hasHoverElements > 0) score -= 10;
  if (mobile.hasSmallText) score -= 15;
  if (!mobile.hasTouchTargets) score -= 15;
  if (mobile.hasFlashContent) score -= 20;
  if (!mobile.usesResponsiveImages && $('img').length > 0) score -= 10;
  
  return {
    ...mobile,
    score: Math.max(score, 0)
  };
}

function analyzeTextSize($) {
  // Simplified text size analysis
  const elements = $('p, span, div, li, td, th');
  let smallTextCount = 0;
  
  elements.each((_, el) => {
    const style = $(el).attr('style') || '';
    if (style.includes('font-size') && (style.includes('px') || style.includes('pt'))) {
      const sizeMatch = style.match(/font-size:\s*(\d+)(px|pt)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        const unit = sizeMatch[2];
        if ((unit === 'px' && size < 12) || (unit === 'pt' && size < 9)) {
          smallTextCount++;
        }
      }
    }
  });
  
  return smallTextCount > 0;
}

function analyzeTouchTargets($) {
  const targets = $('button, a, input[type="button"], input[type="submit"], [onclick]');
  return targets.length > 0;
}

function analyzeMediaQueries($) {
  const styleTags = $('style');
  let hasMediaQueries = false;
  
  styleTags.each((_, el) => {
    const content = $(el).html() || '';
    if (content.includes('@media')) {
      hasMediaQueries = true;
    }
  });
  
  return hasMediaQueries;
}

// Security features analysis
function analyzeSecurityFeatures($, response, url) {
  const headers = response.headers || {};
  const isHttps = url.startsWith('https://');
  
  const security = {
    isHttps: isHttps,
    hasHSTS: !!headers['strict-transport-security'],
    hasCSP: !!headers['content-security-policy'],
    hasXFrameOptions: !!headers['x-frame-options'],
    hasXContentTypeOptions: !!headers['x-content-type-options'],
    hasXXssProtection: !!headers['x-xss-protection'],
    hasReferrerPolicy: !!headers['referrer-policy'],
    hasPermissionsPolicy: !!headers['permissions-policy'],
    mixedContent: analyzeExternalResources($, isHttps),
    formSecurity: analyzeFormSecurity($),
    cookieSecurity: analyzeCookieSecurity(headers),
    thirdPartyScripts: analyzeThirdPartyScripts($)
  };
  
  let score = 100;
  if (!security.isHttps) score -= 30;
  if (!security.hasHSTS && security.isHttps) score -= 10;
  if (!security.hasCSP) score -= 15;
  if (!security.hasXFrameOptions) score -= 10;
  if (!security.hasXContentTypeOptions) score -= 5;
  if (security.mixedContent.count > 0) score -= 20;
  if (security.formSecurity.insecureForms > 0) score -= 15;
  if (security.thirdPartyScripts.suspicious > 0) score -= 10;
  
  return {
    ...security,
    score: Math.max(score, 0)
  };
}

function analyzeExternalResources($, isHttps) {
  let httpResources = 0;
  
  if (isHttps) {
    $('img, script, link, iframe').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('href') || '';
      if (src.startsWith('http://')) {
        httpResources++;
      }
    });
  }
  
  return { count: httpResources };
}

function analyzeFormSecurity($) {
  const forms = $('form');
  let insecureForms = 0;
  let formsWithCSRF = 0;
  
  forms.each((_, el) => {
    const action = $(el).attr('action') || '';
    const method = $(el).attr('method') || 'get';
    
    if (action.startsWith('http://')) {
      insecureForms++;
    }
    
    if ($(el).find('input[name*="csrf"], input[name*="token"]').length > 0) {
      formsWithCSRF++;
    }
  });
  
  return {
    total: forms.length,
    insecureForms: insecureForms,
    withCSRF: formsWithCSRF
  };
}

function analyzeCookieSecurity(headers) {
  const setCookie = headers['set-cookie'] || [];
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie].filter(Boolean);
  
  let secureCookies = 0;
  let httpOnlyCookies = 0;
  let sameSiteCookies = 0;
  
  cookies.forEach(cookie => {
    if (cookie.includes('Secure')) secureCookies++;
    if (cookie.includes('HttpOnly')) httpOnlyCookies++;
    if (cookie.includes('SameSite')) sameSiteCookies++;
  });
  
  return {
    total: cookies.length,
    secure: secureCookies,
    httpOnly: httpOnlyCookies,
    sameSite: sameSiteCookies
  };
}

function analyzeThirdPartyScripts($) {
  const scripts = $('script[src]');
  let thirdParty = 0;
  let suspicious = 0;
  
  const suspiciousDomains = ['evil.com', 'malware.org']; // Example suspicious domains
  
  scripts.each((_, el) => {
    const src = $(el).attr('src') || '';
    try {
      const url = new URL(src, window.location.href);
      if (url.hostname !== window.location.hostname) {
        thirdParty++;
        if (suspiciousDomains.some(domain => url.hostname.includes(domain))) {
          suspicious++;
        }
      }
    } catch (e) {
      // Invalid URL
    }
  });
  
  return {
    total: scripts.length,
    thirdParty: thirdParty,
    suspicious: suspicious
  };
}

module.exports = { analyzeUrl };
