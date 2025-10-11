/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'key-blue': '#1a6cff',
        'key-dark': '#0f1020',
        'key-purple': '#18194a',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Evita conflictos con CSS existente
  },
}
