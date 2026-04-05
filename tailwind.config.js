/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8edf4',
          100: '#c5d0e0',
          200: '#8fa2c1',
          300: '#5975a2',
          400: '#2d4d83',
          500: '#0b1829',
          600: '#091422',
          700: '#07101b',
          800: '#050c14',
          900: '#03080d',
          950: '#020508',
        },
        gold: {
          300: '#f0d980',
          400: '#e8c97a',
          500: '#c9a84c',
          600: '#a8863a',
          700: '#87642a',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(90deg, #c9a84c, #f0d980, #c9a84c)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        shimmer: 'shimmer 3s linear infinite',
        'slide-right': 'slideRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        gold: '0 0 30px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 60px rgba(201, 168, 76, 0.2)',
        luxury: '0 25px 80px rgba(0,0,0,0.6)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
