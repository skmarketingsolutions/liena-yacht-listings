/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true, // enables instrumentation.ts auto-run on startup
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.lienayperez.com' },
    ],
  },
};

module.exports = nextConfig;
