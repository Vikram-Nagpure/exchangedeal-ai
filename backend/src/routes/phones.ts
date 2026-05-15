import { Router, Request, Response } from 'express';
import { Phone } from '../models';

export const phonesRouter = Router();

phonesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { brand, category, page = '1', limit = '20' } = req.query as Record<string, string>;
    const filter: Record<string, string> = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    const phones = await Phone.find(filter).skip((+page - 1) * +limit).limit(+limit).lean();
    const total = await Phone.countDocuments(filter);
    res.json({ phones, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

phonesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const phone = await Phone.findById(req.params.id).lean();
    if (!phone) return res.status(404).json({ error: 'Phone not found' });
    res.json(phone);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
