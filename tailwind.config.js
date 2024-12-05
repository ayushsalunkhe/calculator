/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 15px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 20px rgba(59, 130, 246, 0.5)',
        'calculator-dark': '0 0 50px rgba(250, 204, 21, 0.15)',
        'neon-yellow-sm': '0 0 10px rgba(250, 204, 21, 0.3)',
        'neon-yellow-md': '0 0 20px rgba(250, 204, 21, 0.4)',
        'neon-yellow-lg': '0 0 30px rgba(250, 204, 21, 0.5)',
      },
      colors: {
        'neon-yellow': '#fbbf24',
      }
    },
  },
  plugins: [],
}