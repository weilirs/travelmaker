import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "rgba(65, 65, 65, 0.308)",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        "custom-gray": "rgb(248, 242, 242)",
      }),
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        240: "48rem", // TODO: use pixel
        "220": "220px",
      },
      height: {
        "250": "250px", // Custom height 250px
      },
    },
  },
  plugins: [],
};
export default config;
