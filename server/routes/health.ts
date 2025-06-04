import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    services: {
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      server: 'running'
    }
  });
});

export default router;
