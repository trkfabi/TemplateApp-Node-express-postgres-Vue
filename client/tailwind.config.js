import colors from 'tailwindcss/colors'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
      },
    },
  },
  plugins: [],
}
