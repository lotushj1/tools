import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",
        secondary: "#FB923C",
        cta: "#2563EB",
        background: "#FFF7ED",
        text: "#9A3412",
        accent: {
          light: "#FFEDD5",
          gold: "#FBBF24",
          deep: "#EA580C",
        },
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        clay: "20px",
      },
      boxShadow: {
        clay: "4px 4px 0 #000000",
        "clay-hover": "4px 4px 0 #000000",
        "clay-pressed": "2px 2px 0 #000000",
      },
    },
  },
  plugins: [],
};

export default config;
