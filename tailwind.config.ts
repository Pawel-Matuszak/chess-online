import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": ["Noto Sans Vithkuqi", "sans-serif"],
      },
      colors: {
        "background-primary": "#1E1C21",
        "background-secondary": "#3C3843",
        // "background-dialog": "#1A4760",
        "background-dialog": "#2D2833",
        "main-primary": "#DDD92A",
        "main-secondary": "#EEEFA8",
        "text-primary": "#FAFDF6",
        hover: "#1A4760",
        "text-hover": "",
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        "2/3": ".3fr repeat(2, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
} satisfies Config;
