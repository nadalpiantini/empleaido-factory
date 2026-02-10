/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack (Next.js 16 default)
  turbopack: {},

  // Ignore TS errors temporarily for validation
  typescript: {
    ignoreBuildErrors: true,
  },

  // External packages for server components (NO phaser - client only)
  serverExternalPackages: ['@supabase/supabase-js'],

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

  // Transpile Phaser for client-side usage only
  transpilePackages: ['phaser'],
};

export default nextConfig;
