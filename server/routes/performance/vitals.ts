import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db.js';
import { webVitals } from '@shared/schema';
import { eq, and, gte, lte, desc, sql, avg, count } from 'drizzle-orm';

const router = Router();

// Web Vitals metric schema
const webVitalSchema = z.object({
  name: z.enum(['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'DOM_CONTENT_LOADED', 'LOAD_EVENT', 'DNS_LOOKUP', 'TCP_CONNECT']),
  value: z.number(),
  delta: z.number().optional(),
  id: z.string(),
  url: z.string().url(),
  userAgent: z.string(),
  connectionType: z.string().optional(),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']),
  timestamp: z.number(),
  sessionId: z.string(),
});

// Batch metrics schema
const batchVitalsSchema = z.object({
  metrics: z.array(webVitalSchema),
});

/**
 * POST /api/vitals
 * Receive and store Web Vitals metrics
 */
router.post('/', async (req, res) => {
  try {
    // Handle both single metric and batch
    let metrics: z.infer<typeof webVitalSchema>[];
    
    if (Array.isArray(req.body)) {
      metrics = req.body;
    } else if (req.body.metrics) {
      const batch = batchVitalsSchema.parse(req.body);
      metrics = batch.metrics;
    } else {
      metrics = [webVitalSchema.parse(req.body)];
    }

    console.log(`📊 Received ${metrics.length} Web Vitals metrics`);

    // Store metrics in database
    const insertData = metrics.map(metric => ({
      name: metric.name,
      value: metric.value,
      delta: metric.delta || metric.value,
      metricId: metric.id,
      url: metric.url,
      userAgent: metric.userAgent,
      connectionType: metric.connectionType,
      deviceType: metric.deviceType,
      sessionId: metric.sessionId,
      timestamp: new Date(metric.timestamp),
    }));

    await db.insert(webVitals).values(insertData);

    // Check for performance alerts
    await checkPerformanceAlerts(metrics);

    res.status(200).json({
      success: true,
      message: `Stored ${metrics.length} metrics`,
      count: metrics.length,
    });

  } catch (error) {
    console.error('❌ Failed to store Web Vitals:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid metrics data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to store metrics',
      message: error.message,
    });
  }
});

/**
 * GET /api/vitals/summary
 * Get Web Vitals summary and statistics
 */
router.get('/summary', async (req, res) => {
  try {
    const { 
      days = 7, 
      page, 
      deviceType,
      metric 
    } = req.query;

    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    console.log(`📈 Getting Web Vitals summary for ${daysNum} days`);

    // Build filters
    const filters = [gte(webVitals.timestamp, startDate)];
    
    if (page) {
      filters.push(eq(webVitals.url, page as string));
    }
    
    if (deviceType) {
      filters.push(eq(webVitals.deviceType, deviceType as any));
    }
    
    if (metric) {
      filters.push(eq(webVitals.name, metric as any));
    }

    // Get summary statistics
    const summary = await db
      .select({
        name: webVitals.name,
        avgValue: avg(webVitals.value),
        count: count(webVitals.id),
        deviceType: webVitals.deviceType,
      })
      .from(webVitals)
      .where(and(...filters))
      .groupBy(webVitals.name, webVitals.deviceType)
      .orderBy(webVitals.name);

    // Get percentiles (simplified - using SQL for better performance)
    const percentiles = await db.execute(sql`
      SELECT 
        name,
        device_type,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as p75,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY value) as p95
      FROM web_vitals 
      WHERE timestamp >= ${startDate}
      ${page ? sql`AND url = ${page}` : sql``}
      ${deviceType ? sql`AND device_type = ${deviceType}` : sql``}
      ${metric ? sql`AND name = ${metric}` : sql``}
      GROUP BY name, device_type
      ORDER BY name
    `);

    // Calculate performance scores
    const scores = calculatePerformanceScores(summary);

    res.json({
      success: true,
      period: `${daysNum} days`,
      summary,
      percentiles: percentiles.rows,
      scores,
      filters: { page, deviceType, metric },
    });

  } catch (error) {
    console.error('❌ Failed to get Web Vitals summary:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get summary',
      message: error.message,
    });
  }
});

/**
 * GET /api/vitals/trends
 * Get Web Vitals trends over time
 */
router.get('/trends', async (req, res) => {
  try {
    const { 
      days = 30, 
      metric = 'LCP',
      deviceType,
      interval = 'day'
    } = req.query;

    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    console.log(`📊 Getting ${metric} trends for ${daysNum} days`);

    // Build date truncation based on interval
    const dateFormat = interval === 'hour' ? 'YYYY-MM-DD HH24:00:00' : 'YYYY-MM-DD';

    const trends = await db.execute(sql`
      SELECT 
        DATE_TRUNC(${interval}, timestamp) as period,
        AVG(value) as avg_value,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as p75,
        COUNT(*) as sample_count
      FROM web_vitals 
      WHERE timestamp >= ${startDate}
        AND name = ${metric}
        ${deviceType ? sql`AND device_type = ${deviceType}` : sql``}
      GROUP BY DATE_TRUNC(${interval}, timestamp)
      ORDER BY period
    `);

    res.json({
      success: true,
      metric,
      period: `${daysNum} days`,
      interval,
      trends: trends.rows,
    });

  } catch (error) {
    console.error('❌ Failed to get Web Vitals trends:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get trends',
      message: error.message,
    });
  }
});

/**
 * GET /api/vitals/alerts
 * Get performance alerts and thresholds
 */
router.get('/alerts', async (req, res) => {
  try {
    const { days = 1 } = req.query;
    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    console.log(`🚨 Checking performance alerts for ${daysNum} days`);

    // Get recent poor performance metrics
    const alerts = await db.execute(sql`
      SELECT 
        name,
        device_type,
        COUNT(*) as poor_count,
        COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM web_vitals w2 
          WHERE w2.name = web_vitals.name 
            AND w2.device_type = web_vitals.device_type
            AND w2.timestamp >= ${startDate}
        ) as poor_percentage,
        AVG(value) as avg_value
      FROM web_vitals
      WHERE timestamp >= ${startDate}
        AND (
          (name = 'CLS' AND value > 0.1) OR
          (name = 'FID' AND value > 100) OR
          (name = 'LCP' AND value > 2500) OR
          (name = 'FCP' AND value > 1800) OR
          (name = 'TTFB' AND value > 800)
        )
      GROUP BY name, device_type
      HAVING COUNT(*) * 100.0 / (
        SELECT COUNT(*) 
        FROM web_vitals w2 
        WHERE w2.name = web_vitals.name 
          AND w2.device_type = web_vitals.device_type
          AND w2.timestamp >= ${startDate}
      ) > 10
      ORDER BY poor_percentage DESC
    `);

    res.json({
      success: true,
      period: `${daysNum} days`,
      alerts: alerts.rows,
      thresholds: {
        CLS: { good: 0.1, poor: 0.25 },
        FID: { good: 100, poor: 300 },
        LCP: { good: 2500, poor: 4000 },
        FCP: { good: 1800, poor: 3000 },
        TTFB: { good: 800, poor: 1800 }
      },
    });

  } catch (error) {
    console.error('❌ Failed to get performance alerts:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get alerts',
      message: error.message,
    });
  }
});

/**
 * Check for performance alerts and send notifications
 */
async function checkPerformanceAlerts(metrics: any[]): Promise<void> {
  const thresholds = {
    CLS: 0.1,
    FID: 100,
    LCP: 2500,
    FCP: 1800,
    TTFB: 800
  };

  const alerts: string[] = [];

  metrics.forEach(metric => {
    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold && metric.value > threshold) {
      alerts.push(`${metric.name}: ${metric.value} (threshold: ${threshold})`);
    }
  });

  if (alerts.length > 0) {
    console.warn(`⚠️ Performance alerts triggered:`, alerts);
    // Here you could send notifications to Slack, email, etc.
  }
}

/**
 * Calculate performance scores based on Web Vitals
 */
function calculatePerformanceScores(summary: any[]): Record<string, any> {
  const scores: Record<string, any> = {};

  summary.forEach(item => {
    const { name, avgValue, deviceType } = item;
    
    let score = 'poor';
    if (name === 'CLS' && avgValue <= 0.1) score = 'good';
    else if (name === 'CLS' && avgValue <= 0.25) score = 'needs-improvement';
    else if (name === 'FID' && avgValue <= 100) score = 'good';
    else if (name === 'FID' && avgValue <= 300) score = 'needs-improvement';
    else if (name === 'LCP' && avgValue <= 2500) score = 'good';
    else if (name === 'LCP' && avgValue <= 4000) score = 'needs-improvement';
    else if (name === 'FCP' && avgValue <= 1800) score = 'good';
    else if (name === 'FCP' && avgValue <= 3000) score = 'needs-improvement';
    else if (name === 'TTFB' && avgValue <= 800) score = 'good';
    else if (name === 'TTFB' && avgValue <= 1800) score = 'needs-improvement';

    if (!scores[deviceType]) scores[deviceType] = {};
    scores[deviceType][name] = {
      value: Math.round(avgValue),
      score,
      grade: score === 'good' ? 'A' : score === 'needs-improvement' ? 'B' : 'C'
    };
  });

  return scores;
}

export default router;
