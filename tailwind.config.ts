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
        obsidian: "#111318",
        ivory: "#F7F6F2",
        periwinkle: "#8291EA",
        slate: "#777777",
        navy: "#142B52",
        "brand-blue": "#245BDB",
        "soft-blue": "#E9EEF7",
        "ink-body": "#4A5870",
        "line-border": "#D8DFEC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-manrope)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        editorial: "-0.025em",
      },
    },
  },
  plugins: [],
};

export default config;
