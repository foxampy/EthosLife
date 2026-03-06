/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: '#e4dfd5',
          dark: '#c2b8a9',
        },
        ink: {
          DEFAULT: '#2d2418',
          light: '#4a3e32',
        },
        sand: '#dcd3c6',
        clay: '#8c7a6b',
        stone: '#5c5243',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neu': '8px 8px 16px #b8ae9f, -8px -8px 16px #ffffff',
        'neu-inset': 'inset 3px 3px 6px #b8ae9f, inset -2px -2px 4px rgba(255,255,255,0.6)',
        'neu-dark': '6px 6px 12px #a8a093, -6px -6px 12px #ffffff',
      },
    },
  },
  plugins: [],
}
