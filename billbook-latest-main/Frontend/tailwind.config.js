/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  mode: "jit",
  theme: {
    extend: {
      screens: {
        "1200": "1200px",
        "900": "900px",
        "700": "768px",
        "300": "300px"
      },
    },
  },
  plugins: [],
}

