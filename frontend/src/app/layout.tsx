import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExchangeDeal AI – Best Phone Exchange Offers in India',
  description: 'Compare Amazon & Flipkart exchange offers for smartphones. Get AI-powered recommendations, price history, and instant alerts.',
  keywords: 'phone exchange, smartphone exchange, amazon exchange offer, flipkart exchange, best exchange value india',
  openGraph: {
    title: 'ExchangeDeal AI',
    description: 'India\'s smartest phone exchange comparison platform',
    url: 'https://exchangedeal.ai',
    siteName: 'ExchangeDeal AI',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
