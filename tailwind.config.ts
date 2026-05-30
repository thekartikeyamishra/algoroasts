import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  // Class strategy: theme is controlled by a `.dark` class on <html> (see ThemeProvider).
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand palette — identical in both themes.
        brand: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#06B6D4',
          400: '#22D3EE',
          500: '#06B6D4',
          700: '#0E7490',
        },
        // Semantic tokens — driven by CSS variables that flip in `.dark` (see globals.css).
        // This is what makes the entire UI theme-aware with near-zero per-component churn.
        ink: 'rgb(var(--c-ink) / <alpha-value>)',         // primary text / headings
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',   // page background
        surface: 'rgb(var(--c-surface) / <alpha-value>)', // card / panel background
        muted: 'rgb(var(--c-muted) / <alpha-value>)',     // secondary text
        faint: 'rgb(var(--c-faint) / <alpha-value>)',     // tertiary / meta text
        line: 'rgb(var(--c-line) / <alpha-value>)',       // borders / dividers
      },
      maxWidth: {
        prose: '46rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
      },
      transitionDuration: { 250: '250ms' },
    },
  },
  plugins: [typography],
};

export default config;
