/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mmo: ['MMO', 'sans-serif'], 
      },
      colors: {
        accent: "#8FA004",
      }
    },
  },
  plugins: [],
}

