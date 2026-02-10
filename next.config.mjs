/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for Turbopack root directory issue
  turbopack: {
    root: process.cwd(),
  },

  // TypeScript: ignore build errors set to false for strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js', 'phaser'],

  // Image optimization for remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'im.runware.ai',
        pathname: '/image/**',
      },
    ],
  },

  // Transpile Phaser for client-side usage
  transpilePackages: ['phaser'],

  // Webpack configuration for Phaser
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
