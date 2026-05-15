// MongoDB initialization script
// Runs once when the container starts for the first time

db = db.getSiblingDB('exchangedeal');

// Create indexes
db.phones.createIndex({ brand: 1, model: 1 });
db.offers.createIndex({ platform: 1, phoneId: 1, scrapedAt: -1 });
db.exchange_values.createIndex({ brand: 1, model: 1, storage: 1, condition: 1 });
db.price_history.createIndex({ phoneId: 1, platform: 1, recordedAt: -1 });
db.alerts.createIndex({ userId: 1, active: 1 });

// Seed popular Indian phones
db.phones.insertMany([
  { brand: 'Apple', model: 'iPhone 15', storage: ['128GB','256GB','512GB'], ram: ['6GB'], category: 'flagship', launchYear: 2023, image: 'iphone15.jpg' },
  { brand: 'Apple', model: 'iPhone 15 Pro', storage: ['128GB','256GB','512GB','1TB'], ram: ['8GB'], category: 'flagship', launchYear: 2023 },
  { brand: 'Apple', model: 'iPhone 14', storage: ['128GB','256GB','512GB'], ram: ['6GB'], category: 'flagship', launchYear: 2022 },
  { brand: 'Apple', model: 'iPhone 13', storage: ['128GB','256GB','512GB'], ram: ['4GB'], category: 'flagship', launchYear: 2021 },
  { brand: 'Samsung', model: 'Galaxy S24', storage: ['128GB','256GB'], ram: ['8GB'], category: 'flagship', launchYear: 2024 },
  { brand: 'Samsung', model: 'Galaxy S24 Ultra', storage: ['256GB','512GB','1TB'], ram: ['12GB'], category: 'flagship', launchYear: 2024 },
  { brand: 'Samsung', model: 'Galaxy A54', storage: ['128GB','256GB'], ram: ['8GB'], category: 'midrange', launchYear: 2023 },
  { brand: 'OnePlus', model: 'OnePlus 12', storage: ['256GB','512GB'], ram: ['12GB','16GB'], category: 'flagship', launchYear: 2024 },
  { brand: 'OnePlus', model: 'OnePlus 11', storage: ['128GB','256GB'], ram: ['8GB','16GB'], category: 'flagship', launchYear: 2023 },
  { brand: 'Google', model: 'Pixel 8', storage: ['128GB','256GB'], ram: ['8GB'], category: 'flagship', launchYear: 2023 },
  { brand: 'Google', model: 'Pixel 8 Pro', storage: ['128GB','256GB','512GB','1TB'], ram: ['12GB'], category: 'flagship', launchYear: 2023 },
  { brand: 'Xiaomi', model: 'Xiaomi 14', storage: ['256GB','512GB'], ram: ['12GB'], category: 'flagship', launchYear: 2024 },
  { brand: 'Xiaomi', model: 'Redmi Note 13 Pro', storage: ['128GB','256GB'], ram: ['8GB','12GB'], category: 'midrange', launchYear: 2023 },
]);

print('✅ Database initialized with seed data');
