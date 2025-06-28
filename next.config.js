/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  // Removed output: 'export' to allow dynamic routes
  // This enables server-side rendering and dynamic routing
};

module.exports = nextConfig;