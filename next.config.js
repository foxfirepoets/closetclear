/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.trycloudflare.com',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.pockethost.io',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://plan-computing-manuals-finds.trycloudflare.com',
  },
}

module.exports = nextConfig