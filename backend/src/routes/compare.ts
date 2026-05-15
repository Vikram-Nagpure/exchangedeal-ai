import { Router, Request, Response } from 'express';
import { redis } from '../server';
import { logger } from '../utils/logger';

export const compareRouter = Router();

// Mock data generator - replace with real scrapers when ready
function generateMockResults(input: any) {
  const phones = [
    { name: 'Samsung Galaxy S24', brand: 'Samsung', storage: '256GB', ram: '8GB', category: 'flagship' },
    { name: 'iPhone 15', brand: 'Apple', storage: '128GB', ram: '6GB', category: 'flagship' },
    { name: 'OnePlus 12', brand: 'OnePlus', storage: '256GB', ram: '12GB', category: 'flagship' },
    { name: 'Google Pixel 8', brand: 'Google', storage: '128GB', ram: '8GB', category: 'flagship' },
    { name: 'Xiaomi 14', brand: 'Xiaomi', storage: '256GB', ram: '12GB', category: 'flagship' },
    { name: 'Samsung Galaxy A54', brand: 'Samsung', storage: '128GB', ram: '8GB', category: 'midrange' },
    { name: 'OnePlus Nord 3', brand: 'OnePlus', storage: '128GB', ram: '8GB', category: 'midrange' },
    { name: 'Redmi Note 13 Pro', brand: 'Xiaomi', storage: '256GB', ram: '8GB', category: 'midrange' },
  ];

  const conditionMultiplier: Record<string, number> = {
    Excellent: 1.0, Good: 0.85, Fair: 0.65, Poor: 0.45,
  };
  const mult = conditionMultiplier[input.condition] || 0.85;

  return phones.map((phone, i) => {
    const basePrice = 40000 + i * 8000;
    const baseExchange = Math.round(15000 * mult + i * 1500);
    const amazonPrice = basePrice + Math.round(Math.random() * 2000);
    const flipkartPrice = basePrice - Math.round(Math.random() * 1500);
    const amazonExchange = baseExchange;
    const flipkartExchange = baseExchange + Math.round(Math.random() * 2000);
    const amazonBank = [2000, 3000, 4000, 5000, 6000][i % 5];
    const flipkartBank = [1500, 2500, 3500, 4500, 5000][i % 5];
    const amazonCoupon = i % 2 === 0 ? 1000 : 0;
    const flipkartCoupon = i % 3 === 0 ? 1500 : 0;
    const amazonFinal = amazonPrice - amazonExchange - amazonBank - amazonCoupon;
    const flipkartFinal = flipkartPrice - flipkartExchange - flipkartBank - flipkartCoupon;
    const bestPlatform = amazonFinal <= flipkartFinal ? 'amazon' : 'flipkart';

    return {
      id: `phone_${i}`,
      phoneModel: phone.name,
      brand: phone.brand,
      storage: phone.storage,
      ram: phone.ram,
      image: '📱',
      category: phone.category,
      trending: i < 3,
      bestPlatform,
      bestFinalPrice: Math.min(amazonFinal, flipkartFinal),
      bestExchangeValue: Math.max(amazonExchange, flipkartExchange),
      valueScore: Math.max(amazonExchange, flipkartExchange) / Math.min(amazonFinal, flipkartFinal),
      amazon: {
        platform: 'amazon',
        productPrice: amazonPrice,
        exchangeValue: amazonExchange,
        bankDiscount: amazonBank,
        couponDiscount: amazonCoupon,
        finalPayable: Math.max(0, amazonFinal),
        inStock: true,
        deliveryDate: i % 2 === 0 ? 'Tomorrow' : 'In 2 days',
        rating: 4.2 + Math.random() * 0.5,
        reviewCount: 500 + i * 300,
        productUrl: `https://amazon.in/s?k=${encodeURIComponent(phone.name)}`,
        emiOptions: [
          { bank: 'HDFC', duration: 6, monthlyAmount: Math.round(amazonFinal / 6 * 1.03), totalAmount: Math.round(amazonFinal * 1.03) },
          { bank: 'ICICI', duration: 12, monthlyAmount: Math.round(amazonFinal / 12 * 1.06), totalAmount: Math.round(amazonFinal * 1.06) },
        ],
      },
      flipkart: {
        platform: 'flipkart',
        productPrice: flipkartPrice,
        exchangeValue: flipkartExchange,
        bankDiscount: flipkartBank,
        couponDiscount: flipkartCoupon,
        finalPayable: Math.max(0, flipkartFinal),
        inStock: true,
        deliveryDate: i % 3 === 0 ? 'Tomorrow' : 'In 2-3 days',
        rating: 4.1 + Math.random() * 0.6,
        reviewCount: 600 + i * 400,
        productUrl: `https://flipkart.com/search?q=${encodeURIComponent(phone.name)}`,
        emiOptions: [
          { bank: 'Axis', duration: 6, monthlyAmount: Math.round(flipkartFinal / 6 * 1.02), totalAmount: Math.round(flipkartFinal * 1.02) },
          { bank: 'Kotak', duration: 12, monthlyAmount: Math.round(flipkartFinal / 12 * 1.05), totalAmount: Math.round(flipkartFinal * 1.05) },
        ],
      },
    };
  }).sort((a, b) => a.bestFinalPrice - b.bestFinalPrice);
}

compareRouter.post('/', async (req: Request, res: Response) => {
  const input = req.body;
  const cacheKey = `compare:${input.brand}:${input.model}:${input.storage}:${input.condition}`;

  try {
    // Check cache
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      logger.info('Cache hit');
      return res.json(JSON.parse(cached));
    }

    logger.info(`Comparing for ${input.brand} ${input.model}`);
    const results = generateMockResults(input);

    const best = results[0];
    const recommendation = {
      bestPhone: best.phoneModel,
      bestPlatform: best.bestPlatform,
      finalPayable: best.bestFinalPrice,
      exchangeValue: best.bestExchangeValue,
      reasoning: `Your ${input.brand} ${input.model} (${input.condition} condition) gets ₹${best.bestExchangeValue.toLocaleString('en-IN')} exchange on ${best.bestPlatform === 'amazon' ? 'Amazon' : 'Flipkart'}. Best upgrade: ${best.phoneModel} for just ₹${best.bestFinalPrice.toLocaleString('en-IN')} final payable!`,
    };

    const response = { results, recommendation, totalFound: results.length, scrapedAt: new Date().toISOString() };

    // Cache 30 minutes
    await redis.setex(cacheKey, 1800, JSON.stringify(response)).catch(() => {});

    res.json(response);
  } catch (error: any) {
    logger.error('Compare error:', error.message);
    // Return mock data even on error
    const results = generateMockResults(input);
    res.json({ results, recommendation: null, totalFound: results.length, scrapedAt: new Date().toISOString() });
  }
});

compareRouter.get('/best-deals', async (_req: Request, res: Response) => {
  try {
    const cached = await redis.get('best-deals').catch(() => null);
    if (cached) return res.json(JSON.parse(cached));
    const deals = generateMockResults({ brand: 'Apple', model: 'iPhone 13', storage: '128GB', condition: 'Good' }).slice(0, 5);
    await redis.setex('best-deals', 900, JSON.stringify(deals)).catch(() => {});
    res.json(deals);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
