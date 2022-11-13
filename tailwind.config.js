/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./app/**/*.{html,js,ts,jsx,tsx}",
    "./stories/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    ({ addComponents }) => {
      addComponents({
        ".container": {
          maxWidth: "none",
        },
      });
    },
  ],
};
