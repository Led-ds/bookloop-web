/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f3", 100: "#d4ebe0", 200: "#aedac6", 300: "#7fc3a4",
          400: "#4eaa83", 500: "#1f9d6b", 600: "#188257", 700: "#136846",
          800: "#0f5238", 900: "#0c3d29",
        },
      },
    },
  },
  plugins: [],
};
