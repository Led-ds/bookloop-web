/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system portado do template (verde-floresta + creme/bege).
        background: "#FCFAF1",
        foreground: "#101F13",
        card: "#FFFFFF",
        "card-foreground": "#101F13",
        popover: "#FFFFFF",
        "popover-foreground": "#101F13",
        primary: "#20462F",
        "primary-foreground": "#FBF9F0",
        secondary: "#F3E6D2",
        "secondary-foreground": "#1A3520",
        muted: "#F5EEE0",
        "muted-foreground": "#556252",
        accent: "#E3BD8A",
        "accent-foreground": "#132717",
        destructive: "#D73431",
        "destructive-foreground": "#F8F8F8",
        success: "#429C5A",
        warning: "#E49E22",
        border: "#E1DACC",
        input: "#EBE4D6",
        ring: "#336144",
        // Escala legada (componentes existentes continuam funcionando).
        brand: {
          50: "#eef7f3", 100: "#d4ebe0", 200: "#aedac6", 300: "#7fc3a4",
          400: "#4eaa83", 500: "#1f9d6b", 600: "#188257", 700: "#136846",
          800: "#0f5238", 900: "#0c3d29",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
