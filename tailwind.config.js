/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#7C3AED',
          500: '#6D28D9',
          600: '#5B21B6',
        },
        accent: {
          400: '#00A3FF',
          500: '#0090E0',
          600: '#007AC0',
        },
        dark: {
          900: '#0A0A0B',
          800: '#1F1F23',
          700: '#2C2C35',
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
        }
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}