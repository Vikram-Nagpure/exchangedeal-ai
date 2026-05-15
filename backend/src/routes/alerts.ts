import { Router, Request, Response } from 'express';
import { Alert } from '../models';
import { requireAuth } from '../middleware/auth';

export const alertsRouter = Router();

alertsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const alert = await Alert.create({ ...req.body, userId });
    res.status(201).json(alert);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

alertsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const alerts = await Alert.find({ userId }).lean();
    res.json(alerts);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

alertsRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, userId: (req as any).userId });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
