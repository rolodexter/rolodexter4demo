/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include root layout and page files
    './src/app/layout.tsx',
    './src/app/page.tsx',
    // Include any string templates or dynamic classes
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '80': '0.8',
        '90': '0.9',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'circuit-scan': 'circuit-scan 4s linear infinite',
        'glitch': 'glitch 0.2s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 20px var(--accent-glow)',
        'glow-lg': '0 0 30px var(--accent-glow)',
      },
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: theme('colors.foreground', 'currentColor'),
      }),
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
    },
  },
  plugins: [],
  // Enable verbose logging for debugging
  log: {
    debug: true,
    warn: true,
    error: true,
  },
  // Enable all opacity variants for colors and safelist dynamic classes
  safelist: [
    {
      pattern: /^(bg|border|text)-(background|foreground|accent)/,
      variants: ['hover', 'focus', 'disabled', 'opacity'],
    },
    // Safelist specific utility classes used in dynamic content
    'opacity-10',
    'opacity-20',
    'opacity-30',
    'opacity-40',
    'opacity-80',
    'opacity-90',
    'bg-opacity-10',
    'bg-opacity-20',
    'bg-opacity-30',
    'bg-opacity-40',
    'bg-opacity-80',
    'bg-opacity-90',
    'border-opacity-10',
    'border-opacity-20',
    'backdrop-blur-sm',
    'animate-pulse-glow',
    'animate-circuit-scan',
    'animate-glitch',
    'shadow-glow',
    'shadow-glow-lg',
  ],
} 