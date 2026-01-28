// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Add image configuration for external domains
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: 'xirsuujhzwepcghycsbf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Google (for Google sign-in avatars)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // GitHub (for GitHub avatars)
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      // Firebase
      {
        protocol: 'https',
        hostname: '**.firebaseapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.app',
      },
      // Allow any secure image for development
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optional: Configure image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optional: Add other config options
  experimental: {
    // If you're using app router features
    serverActions: {
      allowedOrigins: ['localhost:3000', 'cogniprep.vercel.app']
    }
  }
};

export default nextConfig;