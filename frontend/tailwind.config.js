import { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c0d9ff',
          300: '#91bcff',
          400: '#5c95ff',
          500: '#3366ff',
          600: '#1940ff',
          700: '#0f2ee6',
          800: '#1227bf',
          900: '#162699',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config