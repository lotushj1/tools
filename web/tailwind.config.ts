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
        clay: "inset -2px -2px 8px rgba(255, 255, 255, 0.7), 4px 4px 12px rgba(249, 115, 22, 0.15)",
        "clay-hover": "inset -2px -2px 8px rgba(255, 255, 255, 0.7), 6px 6px 16px rgba(249, 115, 22, 0.25)",
        "clay-pressed": "inset 2px 2px 8px rgba(249, 115, 22, 0.15), 2px 2px 6px rgba(249, 115, 22, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
