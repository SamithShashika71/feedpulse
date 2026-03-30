/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080c14',
        'bg-secondary': '#0d1421',
        'bg-card': '#111827',
        'accent-cyan': '#00d4ff',
        'accent-green': '#00e5a0',
        'accent-red': '#ff4d6d',
        'accent-yellow': '#ffd166',
        'text-primary': '#f0f4ff',
        'text-secondary': '#8a9bb5',
        'border-dark': '#1e2d42',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};