/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magentaPurple: '#bf04c2',
        goldenYellow: '#c2bf04',
        violetPurple: '#7c04c2',
      },
      boxShadow: {
        glow: '0 0 30px #bf04c2',
      },
      fontFamily: {
        roadrage: ['Road Rage', 'sans-serif'],
        spicyrice: ['Spicy Rice', 'serif'],
      },
    },
  },
  plugins: [],
};
