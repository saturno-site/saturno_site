import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saturno: {
          50: "#f6f5ff",
          100: "#edebff",
          200: "#dbd6ff",
          300: "#b7a9ff",
          400: "#8a70ff",
          500: "#6b4ef5",
          600: "#5939d2",
          700: "#46309d",
          800: "#373070",
          900: "#2d2357",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
