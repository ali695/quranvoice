import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0e1a',
          950: '#070a13',
          900: '#0a0e1a',
          850: '#0d1220',
          800: '#111729',
          750: '#161c30',
          700: '#1c2238',
          600: '#252b44',
          500: '#323a55',
        },
        gold: {
          DEFAULT: '#d4a574',
          50: '#fdf8f1',
          100: '#faeed9',
          200: '#f3dab0',
          300: '#e9c188',
          400: '#dfae6e',
          500: '#d4a574',
          600: '#bd8a52',
          700: '#9a6f43',
          800: '#785738',
          900: '#5e4530',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          50: '#fdfcf9',
          100: '#f9f5ee',
          200: '#f5f0e8',
          300: '#ebe2d2',
          400: '#d9cbb1',
        },
        sage: {
          DEFAULT: '#7a8b7e',
          400: '#9aa8a0',
          500: '#7a8b7e',
          600: '#5d6e64',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'serif'],
        arabic: ['var(--font-amiri)', 'Amiri', 'Scheherazade New', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -8px rgba(0, 0, 0, 0.3)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 32px -8px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 32px -8px rgba(212, 165, 116, 0.25)',
      },
      backgroundImage: {
        'islamic-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'gold-gradient': 'linear-gradient(135deg, #d4a574 0%, #e9c188 50%, #d4a574 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
