/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        purple: '#9b59b6',
        pink: '#e84393',
        grey: '#ecf0f1',
        darkgrey: '#7f8c8d',
        // also add pastel variants if you want (optional)
        'pink-light': '#ffe0f0',
        'purple-light': '#f0e6ff',
      },
    },
  },
  plugins: [],
};