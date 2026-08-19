/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'ui-sans-serif', 'system-ui'] },
      colors: {
        background: '#0a001e',
        glass: 'rgba(255,255,255,0.06)'
      },
      boxShadow: { glow: '0 0 25px #f472b6' },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } }
      },
      animation: { 'fade-in': 'fadeIn 0.6s ease-out' }
    },
  },
  plugins: [],
};
