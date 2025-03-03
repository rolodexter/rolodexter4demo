/**
 * PostCSS Configuration
 * 
 * Technical Implementation:
 * - Configures PostCSS for processing TailwindCSS
 * - Implements autoprefixer for cross-browser compatibility
 * - Optimizes CSS output for production
 * 
 * Dependencies:
 * - tailwindcss: For utility-first CSS framework
 * - autoprefixer: For vendor prefix management
 */

module.exports = {
  /**
   * Plugin Configuration
   * 
   * Technical Implementation:
   * - Uses TailwindCSS as the primary processor
   * - Applies autoprefixer for browser compatibility
   * - Maintains order of operations for optimal output
   */
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} 