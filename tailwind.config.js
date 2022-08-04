/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        checked: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      animation: {
        checked: "checked 3s linear forwards",
      },
    },
  },
  plugins: [],
};
