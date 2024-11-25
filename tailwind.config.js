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
        royalBlue: '#1700ad',
        charcoalGray: '#616063',
        vividGreen: '#129900',
      },
      boxShadow: {
        glow: '0 0 30px #bf04c2',
        goldenGlow: '0 0 30px #c2bf04',
        royalBlueGlow: '0 0 30px #1700ad',
        charcoalGrayGlow: '0 0 30px #616063',
        vividGreenGlow: '0 0 30px #129900',
      },
      fontFamily: {
        roadrage: ['Road Rage', 'sans-serif'],
        spicyrice: ['Spicy Rice', 'serif'],
      },
    },
  },
  plugins: [],
};
