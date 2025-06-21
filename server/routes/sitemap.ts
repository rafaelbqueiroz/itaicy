import { Router } from 'express';
import { SitemapService } from '../services/sitemap.js';

const router = Router();

/**
 * @route POST /api/sitemap/generate
 * @desc Generate and update sitemap.xml
 */
router.post('/generate', async (req, res) => {
  try {
    const urls = SitemapService.getStaticSitemap();
    const sitemapXml = SitemapService.generateSitemapXml(urls);
    
    console.log('Generated sitemap with:', urls.length, 'URLs');
    res.set('Content-Type', 'application/xml');
    res.send(sitemapXml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sitemap',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /sitemap.xml
 * @desc Serve sitemap XML
 */
router.get('../../sitemap.xml', (req, res) => {
  const urls = SitemapService.getStaticSitemap();
  const sitemapXml = SitemapService.generateSitemapXml(urls);
  
  res.set('Content-Type', 'application/xml');
  res.send(sitemapXml);
});

/**
 * @route GET /api/sitemap/url
 * @desc Get sitemap URL
 */
router.get('/url', (req, res) => {
  res.json({
    success: true,
    url: SitemapService.getSitemapUrl()
  });
});

export default router;
