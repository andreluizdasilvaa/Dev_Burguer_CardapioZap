/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Roboto Condensed', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('../assets/bg.png')"
      }
    },
  },
  plugins: [],
}

