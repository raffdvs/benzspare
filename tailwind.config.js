/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pri: 'rgba(204, 0, 35, 1)',
        sec: 'rgba(2, 0, 3, 1)',
      },
    }
  },
  plugins: [],
}
