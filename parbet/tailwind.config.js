/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FFFFFF',
          panel: '#F8F9FA',
          primary: '#114C2A', // Viagogo Dark Green
          primaryLight: '#E6F2D9', // Viagogo Soft Green Background
          accent: '#458731', // Viagogo Button Green
          text: '#212529',
          muted: '#6C757D',
          border: '#DEE2E6',
          red: '#DC3545'
        }
      },
      fontFamily: { sans: ['"Inter"', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-out' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } }
    },
  },
  plugins: [],
}