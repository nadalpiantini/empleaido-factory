import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* === COLORS — ADN VISUAL === */
      colors: {
        // Tri-tonal base
        shadow: '#0E3A41',
        mid: '#1A434F',
        light: '#F3E4C8',

        // Accent
        cyan: '#5ED3D0',
        'cyan-dim': 'var(--led-cyan-dim)',
        'cyan-glow': 'var(--led-cyan-glow)',

        // Empleaido.com colors
        'empleaido-jade': '#00A3A0',
        'empleaido-jade-dark': '#008B89',
        'empleaido-jade-light': '#00BCB9',

        // States
        success: 'var(--state-success)',
        warning: 'var(--state-warning)',
        error: 'var(--state-error)',

        // Semantic aliases
        background: 'var(--ink-shadow)',
        foreground: 'var(--ink-light)',
        primary: 'var(--led-cyan)',
        surface: 'var(--ink-mid)',
      },

      /* === SPACING === */
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },

      /* === BORDER RADIUS === */
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
      },

      /* === SHADOWS === */
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'card': 'var(--shadow-card)',
        'glow': 'var(--shadow-glow)',
        'glow-sm': 'var(--shadow-glow-sm)',
      },

      /* === TRANSITIONS === */
      transitionTimingFunction: {
        'ui': 'var(--ease-ui)',
        'bounce': 'var(--ease-bounce)',
      },
      transitionDuration: {
        'fast': 'var(--dur-fast)',
        'med': 'var(--dur-med)',
        'slow': 'var(--dur-slow)',
      },

      /* === TYPOGRAPHY (Retro 50s) === */
      fontFamily: {
        display: ['var(--font-display)'], // Bebas Neue - Headlines
        poppins: ['Poppins', 'sans-serif'], // Empleaido.com headings
        inter: ['Inter', 'sans-serif'],    // Empleaido.com body
        sans: ['var(--font-sans)'],       // IBM Plex Sans - Body
        mono: ['var(--font-mono)'],       // IBM Plex Mono
        ui: ['var(--font-sans)'],         // Default UI
      },
      fontSize: {
        'xs': ['var(--fs-xs)', { lineHeight: 'var(--lh-base)' }],
        'sm': ['var(--fs-sm)', { lineHeight: 'var(--lh-base)' }],
        'base': ['var(--fs-md)', { lineHeight: 'var(--lh-base)' }],
        'lg': ['var(--fs-lg)', { lineHeight: 'var(--lh-base)' }],
        'xl': ['var(--fs-xl)', { lineHeight: 'var(--lh-tight)' }],
        '2xl': ['var(--fs-2xl)', { lineHeight: 'var(--lh-tight)' }],
        '3xl': ['var(--fs-3xl)', { lineHeight: 'var(--lh-tight)' }],
      },
      fontWeight: {
        regular: 'var(--fw-regular)',
        medium: 'var(--fw-medium)',
        semibold: 'var(--fw-semibold)',
        bold: 'var(--fw-bold)',
      },

      /* === ANIMATIONS === */
      animation: {
        'led-pulse': 'led-pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
