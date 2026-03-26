import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales MasterConnect
        primary: {
          50:  "#EBF0F7",
          100: "#D6E1EF",
          200: "#ADC3DF",
          300: "#85A5CF",
          400: "#5C87BF",
          500: "#2E5F99",  // Bleu principal
          600: "#254D7A",
          700: "#1B3A5C",  // Bleu foncé (header/navbar)
          800: "#12273D",
          900: "#09131F",
        },
        accent: {
          50:  "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#C53030",  // Rouge accent (boutons CTA)
          600: "#9B2C2C",
        },
        // Statuts campagne
        status: {
          open:    "#38A169", // Vert : OUVERTE
          locked:  "#D69E2E", // Jaune : VERROUILLÉE
          published: "#3182CE", // Bleu : PUBLIÉE
        },
        // Neutres
        surface: {
          50:  "#FAFBFC",
          100: "#F4F6F8",
          200: "#E9ECF0",
          300: "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)",
        modal: "0 20px 60px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;