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
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyan: {
          400: '#4db8c7',
          500: '#3d9aa8',
        },
        magenta: {
          400: '#b86fc4',
          500: '#9a5aa5',
        },
        copper: {
          DEFAULT: '#b87333',
          bright: '#c9884a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
