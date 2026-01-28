/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // ← ADD THIS LINE
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d2d2d',
        },
        purple: {
          950: '#1a0b2e',
        },
        indigo: {
          950: '#1a0b2e',
        },
      },
    },
  },
  plugins: [],
}