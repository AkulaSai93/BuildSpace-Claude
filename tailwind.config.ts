import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#065f46",
          light: "#ecfdf5",
        },
        ink: {
          DEFAULT: "#111110",
          muted: "#78716c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
