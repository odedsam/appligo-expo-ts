/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#1E1E1E',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        xl: 16,
        '2xl': 24,
      },
    },
  },
  plugins: [],
};
