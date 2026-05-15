import 'dotenv/config';
import Bull from 'bull';
import mongoose from 'mongoose';
import { AmazonScraper } from './amazon';
import { FlipkartScraper } from './flipkart';

const scrapeQueue = new Bull('scrape-queue', process.env.REDIS_URL || 'redis://localhost:6379');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exchangedeal')
  .then(() => console.log('Scraper MongoDB connected'));

// Process queue jobs
scrapeQueue.process('compare', 2, async (job) => {
  const { input } = job.data;
  const [amazon, flipkart] = await Promise.allSettled([
    AmazonScraper.scrapeExchangeOffers(input),
    FlipkartScraper.scrapeExchangeOffers(input),
  ]);
  return {
    amazon: amazon.status === 'fulfilled' ? amazon.value : [],
    flipkart: flipkart.status === 'fulfilled' ? flipkart.value : [],
  };
});

scrapeQueue.on('completed', (job, result) => console.log(`Job ${job.id} done`));
scrapeQueue.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err.message));

export { scrapeQueue };
console.log('🤖 Scraper worker started and listening for jobs...');
