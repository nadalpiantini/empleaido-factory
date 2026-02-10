import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['phaser'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'im.runware.ai',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
