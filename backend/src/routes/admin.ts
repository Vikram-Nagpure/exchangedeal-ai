import { Router, Request, Response } from 'express';
import { ScrapeLog, Offer } from '../models';
import { requireAdmin } from '../middleware/auth';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [offersToday, recentLogs] = await Promise.all([
      Offer.countDocuments({ scrapedAt: { $gte: new Date(Date.now() - 86400000) } }),
      ScrapeLog.find().sort({ createdAt: -1 }).limit(20).lean(),
    ]);
    res.json({ offersToday, recentLogs });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

adminRouter.get('/logs', async (_req: Request, res: Response) => {
  try {
    const logs = await ScrapeLog.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json(logs);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
