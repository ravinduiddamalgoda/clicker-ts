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
        mediumGreen: '#00b570',
        background: "#121212", // Custom dark background color
        card: "#1F1F1F", // Darker shade for cards
        primary: "#3B82F6", // Tailwind's blue-500 for buttons
        textPrimary: "#E2E8F0", // Light gray for primary text
        textSecondary: "#94A3B8", // Dim gray for secondary text
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
      textShadow: {
        blackOutline: '1px 1px 2px #000000', 
      },
    },
  },
  plugins: [],
};
