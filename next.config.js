/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/d/**',
      },
    ],
  },
  // Add these configurations
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
}

module.exports = nextConfig