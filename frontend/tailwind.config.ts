import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        imo: {
          dark:  "#0a2a1a",
          green: {
            DEFAULT: "#1dbd82",
            50:  "#e8fbf4",
            100: "#c7f5e3",
            200: "#93ebca",
            300: "#5dddaf",
            400: "#2ecb93",
            500: "#1dbd82",
            600: "#139a69",
            700: "#117856",
            800: "#105f46",
            900: "#0e4e3a",
            950: "#062a20",
          },
          yellow: {
            DEFAULT: "#ffd100",
            light: "#ffe066",
            dark:  "#cc9f00",
          },
          light:  "#f8fafc",
          gray: {
            DEFAULT: "#e2e8f0",
            light:   "#f1f5f9",
            dark:    "#cbd5e1",
          },
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg:      "12px",
        xl:      "16px",
      },
      boxShadow: {
        card:  "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        pop:   "0 10px 30px -10px rgb(10 42 26 / 0.25)",
        glow:  "0 0 0 3px rgb(29 189 130 / 0.25)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;