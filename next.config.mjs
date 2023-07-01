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
  experimental: {
    appDir: true,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false, lokijs: false, "coffee-script": false, "pino-pretty": false };
    return config;
  },
}

export default nextConfig
