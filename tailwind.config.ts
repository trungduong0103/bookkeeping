import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      black: "#000000",
      lightBlue: "#2264E5",
      darkBlue: "#14213d",
      darkYellow: "#fca311",
      grey: "#e5e5e5",
      white: "#ffffff",
      red: "#d62828",
    },
  },
  plugins: [typography],
};
export default config;
