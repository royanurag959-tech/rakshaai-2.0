/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#070c18',
          800: '#0d1527',
          700: '#14203d',
          600: '#1c2d54',
          500: '#273f73',
          card: '#0f1a30',
          border: '#1e3156'
        },
        shield: {
          blue: '#1a73e8',
          cyan: '#00d2ff',
          green: '#10b981',
          yellow: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
