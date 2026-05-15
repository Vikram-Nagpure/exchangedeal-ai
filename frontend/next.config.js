/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'm.media-amazon.com',
      'rukminim2.flixcart.com',
      'images.unsplash.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;