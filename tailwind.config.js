/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc',
        surface: '#ffffff',
        obsidian: {
          DEFAULT: '#090a0f',
          subtle: '#0f1118',
          card: '#141721',
          elevated: '#1a1e2b',
          hover: '#222738',
          active: '#292f44',
        },
        slate: {
          crisp: '#f8fafc',
        },
        vx: {
          canvas: 'var(--vx-canvas)',
          subtle: 'var(--vx-surface-subtle)',
          card: 'var(--vx-surface-card)',
          elevated: 'var(--vx-surface-elevated)',
          hover: 'var(--vx-surface-hover)',
          active: 'var(--vx-surface-active)',
          brand: 'var(--vx-brand)',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.025em',
        tighter: '-0.02em',
        tight: '-0.015em',
        snug: '-0.01em',
        normal: '-0.006em',
      },
      boxShadow: {
        'micro': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'float': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'hud': '0 20px 48px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [],
};
