/**
 * Next.js Configuration
 * 
 * Technical Implementation:
 * - Configures Next.js for optimal performance
 * - Implements image optimization
 * - Sets up experimental features
 * - Configures build output
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * React Strict Mode
   * 
   * Technical Implementation:
   * - Enables strict mode for better development experience
   * - Helps identify potential problems
   * - Prepares for future React features
   */
  reactStrictMode: true,

  /**
   * Image Optimization
   * 
   * Technical Implementation:
   * - Configures image domains for external sources
   * - Optimizes image loading and delivery
   * - Implements responsive image sizing
   */
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /**
   * Experimental Features
   * 
   * Technical Implementation:
   * - Enables modern React features
   * - Implements server components
   * - Optimizes build performance
   */
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['gsap'],
  },

  /**
   * Build Configuration
   * 
   * Technical Implementation:
   * - Optimizes production builds
   * - Implements source maps for debugging
   * - Configures output format
   */
  output: 'standalone',
  productionBrowserSourceMaps: true,

  /**
   * Webpack Configuration
   * 
   * Technical Implementation:
   * - Optimizes bundle size
   * - Implements code splitting
   * - Configures module resolution
   */
  webpack: (config, { dev, isServer }) => {
    // Optimize GSAP for production
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  swcMinify: true,
}

module.exports = nextConfig 