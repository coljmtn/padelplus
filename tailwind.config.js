/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        green: {
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease both',
        slideUp: 'slideUp 0.6s ease both',
        scaleIn: 'scaleIn 0.3s ease both',
      },
    },
  },
  plugins: [],
}
