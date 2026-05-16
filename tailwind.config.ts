import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["right-2", "top-2"],
  theme: {
    fontSize: {
      xxs: ["0.625rem", { lineHeight: "0.75rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "1.5xl": ["1.375rem", { lineHeight: "1.875rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "2.5xl": ["1.75rem", { lineHeight: "2.25rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "3.5xl": ["2rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "4.5xl": ["2.5rem", { lineHeight: "2.75rem" }],
      "5xl": ["2.75rem", { lineHeight: "3.625rem" }],
      "5.5xl": ["3rem", { lineHeight: "1.17" }],
      "6xl": ["3.5rem", { lineHeight: "1.14" }],
      "7xl": ["4.5rem", { lineHeight: "1.11" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Source Code Pro"', 'monospace'],
      },
      colors: {
        brand: {
          neutral: {
            50: "#d8d8d8",
            100: "#bcccdc",
            200: "#c9d3ee",
            300: "#a2a9be",
            500: "#717da3",
            600: "#363944",
            700: "#1a1d2a",
            800: "#030418",
            900: "#0b0c10",
          },
          blue: {
            500: "#4177fd",
            800: "#22242b",
            900: "#13151d",
          },
          lavender: {
            300: "#cdb3ff",
            500: "#ab83ff",
            600: "#8b5cf6",
          },
          green: "#31ee8b",
          amber: "#ffbe2f",
          red: "#ff4545",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-lavender":
          "linear-gradient(96deg, #ab83ff 0%, #4177fd 75%)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
