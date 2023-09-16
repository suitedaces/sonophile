/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '@keyframes gradient-x': {
          '0%': {
            'background-position': '100% 0',
          },
          '100%': {
            'background-position': '0% 0',
          },
        },
      };
      const textOutlineUtilities = {
        '.text-outline': {
          '-webkit-text-stroke': '1.5px black',
          '-webkit-text-fill-color': '#1ED760'
        },
        '.text-outline-white': {
          '-webkit-text-stroke-color': 'white',
        },
      };
      addUtilities(textOutlineUtilities, newUtilities, ['responsive', 'hover']);
    },
  ],
};