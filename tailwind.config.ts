import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": ["Noto Sans Vithkuqi", "sans-serif"],
      },
      colors: {
        "background-primary": "#28252C",
        "background-secondary": "#3C3843",
        "main-primary": "#DDD92A",
        "main-secondary": "#EEEFA8",
        "text-primary": "#FAFDF6",
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        "2/3": ".3fr repeat(2, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
} satisfies Config;
