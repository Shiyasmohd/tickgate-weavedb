/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ['@lens-protocol'],
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false, lokijs: false };
    return config;
  },
}

module.exports = nextConfig
