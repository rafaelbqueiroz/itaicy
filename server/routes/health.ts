import { Router } from 'express';
import { getDbStatus, getDb } from '../lib/database-connection';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const dbStatus = getDbStatus();

    // Try to get a database connection
    let dbConnectionTest = false;
    try {
      const db = await getDb();
      dbConnectionTest = true;
    } catch (error) {
      console.error("Health check DB connection failed:", error.message);
    }

    res.json({
      status: dbConnectionTest ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      database: {
        connected: dbStatus.connected,
        lastSuccessfulConnection: dbStatus.lastSuccessfulConnection,
        retryCount: dbStatus.retryCount,
        availableConnections: dbStatus.availableConnections,
        connectionTest: dbConnectionTest
      },
      services: {
        database: process.env.DATABASE_URL ? 'configured' : 'not configured',
        server: 'running'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Database status endpoint
router.get('/db-status', async (req, res) => {
  try {
    const status = getDbStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
