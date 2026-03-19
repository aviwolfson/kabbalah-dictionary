/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hebrew: ["Frank Ruhl Libre", "serif"],
      },
      colors: {
        parchment: "#f5f0e8",
        ink: "#2c1810",
        "ink-light": "#5c3d2e",
        gold: "#8b6914",
        "gold-light": "#c9a84c",
        border: "#d4c4a8",
        selected: "#e8dcc8",
      },
    },
  },
  plugins: [],
}