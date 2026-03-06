/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Courier Prime', 'monospace'],
      },
      boxShadow: {
        'neu': '8px 8px 16px #a8a093, -8px -8px 16px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #a8a093, inset -4px -4px 8px #ffffff',
        'neu-sm': '4px 4px 8px #a8a093, -4px -4px 8px #ffffff',
        'deep-bay': 'inset 12px 12px 24px #b8ae9f, inset -12px -12px 24px #e8decf',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
