import { Router, Request, Response } from 'express';
import { Offer } from '../models';

export const offersRouter = Router();

offersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { phoneName, platform } = req.query as Record<string, string>;
    const filter: Record<string, string> = {};
    if (phoneName) filter.phoneName = phoneName;
    if (platform) filter.platform = platform;
    const offers = await Offer.find(filter).sort({ scrapedAt: -1 }).limit(20).lean();
    res.json(offers);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
