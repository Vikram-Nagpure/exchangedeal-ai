import mongoose from 'mongoose';

const PhoneSchema = new mongoose.Schema({
  brand: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  variants: [{ storage: String, ram: String, color: String }],
  image: { type: String, default: '' },
  category: { type: String, enum: ['flagship', 'midrange', 'budget'], default: 'midrange' },
  launchYear: Number,
}, { timestamps: true });

const OfferSchema = new mongoose.Schema({
  platform: { type: String, enum: ['amazon', 'flipkart'], required: true },
  phoneName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  exchangeValue: { type: Number, default: 0 },
  bankDiscount: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  finalPayable: { type: Number, required: true },
  productUrl: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  scrapedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneModel: { type: String, required: true },
  platform: { type: String, enum: ['amazon', 'flipkart', 'both'], default: 'both' },
  type: { type: String, enum: ['price_drop', 'exchange_rise'], required: true },
  targetPrice: { type: Number, required: true },
  active: { type: Boolean, default: true },
  notifyVia: [{ type: String, enum: ['email', 'telegram', 'push'] }],
}, { timestamps: true });

const ScrapeLogSchema = new mongoose.Schema({
  platform: { type: String, enum: ['amazon', 'flipkart'] },
  status: { type: String, enum: ['success', 'failed', 'partial'] },
  phonesScraped: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  errors: [String],
  triggeredBy: { type: String, enum: ['cron', 'manual', 'user_request'], default: 'cron' },
}, { timestamps: true });

const PriceHistorySchema = new mongoose.Schema({
  phoneName: { type: String, required: true, index: true },
  platform: { type: String, enum: ['amazon', 'flipkart'] },
  price: Number,
  exchangeValue: Number,
  finalPayable: Number,
  recordedAt: { type: Date, default: Date.now, index: true },
});

export const Phone       = mongoose.models.Phone        || mongoose.model('Phone', PhoneSchema);
export const Offer       = mongoose.models.Offer        || mongoose.model('Offer', OfferSchema);
export const Alert       = mongoose.models.Alert        || mongoose.model('Alert', AlertSchema);
export const ScrapeLog   = mongoose.models.ScrapeLog    || mongoose.model('ScrapeLog', ScrapeLogSchema);
export const PriceHistory= mongoose.models.PriceHistory || mongoose.model('PriceHistory', PriceHistorySchema);
