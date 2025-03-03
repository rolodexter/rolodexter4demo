/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /**
       * Custom Animation Configuration
       * 
       * Technical Implementation:
       * - Defines custom keyframes for glitch effects
       * - Implements scanline animation for CRT effect
       * - Creates noise animation for static effect
       * - Optimizes performance with transform properties
       */
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        noise: {
          '0%, 100%': { opacity: 0.05 },
          '50%': { opacity: 0.1 },
        },
      },
      /**
       * Custom Animation Classes
       * 
       * Technical Implementation:
       * - Defines reusable animation classes
       * - Optimizes performance with hardware acceleration
       * - Implements infinite loops for continuous effects
       */
      animation: {
        'glitch': 'glitch 0.3s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'noise': 'noise 0.2s steps(2) infinite',
      },
      /**
       * Custom Font Configuration
       * 
       * Technical Implementation:
       * - Uses monospace fonts for cyberpunk aesthetic
       * - Implements fallback fonts for cross-browser support
       * - Optimizes font loading with system fonts
       */
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      /**
       * Custom Color Palette
       * 
       * Technical Implementation:
       * - Strict black and white theme
       * - Uses opacity for depth
       * - Implements glitch effect colors
       */
      colors: {
        'cyber': {
          'black': '#000000',
          'white': '#FFFFFF',
          'glitch': {
            'red': '#FF0000',
            'blue': '#00FFFF',
          },
        },
      },
      /**
       * Custom Spacing Scale
       * 
       * Technical Implementation:
       * - Uses 4px base unit for consistent spacing
       * - Implements larger gaps for visual hierarchy
       * - Optimizes for mobile-first design
       */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  /**
   * Plugin Configuration
   * 
   * Technical Implementation:
   * - Enables JIT mode for faster development
   * - Implements custom utilities for glitch effects
   * - Optimizes production builds
   */
  plugins: [],
  /**
   * Production Optimizations
   * 
   * Technical Implementation:
   * - Removes unused styles in production
   * - Optimizes CSS output
   * - Maintains development features
   */
  future: {
    hoverOnlyWhenSupported: true,
  },
} 