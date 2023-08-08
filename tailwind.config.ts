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
    },
  },
  plugins: [],
} satisfies Config;
