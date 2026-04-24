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
        cream: "#FAF7F2",
        beige: "#F0EBE0",
        "warm-brown": "#8B6651",
        "deep-brown": "#4A2F1A",
        "soft-brown": "#C4A882",
      },
      fontFamily: {
        serif: ["Pretendard Variable", "Pretendard", "sans-serif"],
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(74, 47, 26, 0.08)",
        card: "0 2px 12px rgba(74, 47, 26, 0.06)",
        hover: "0 8px 32px rgba(74, 47, 26, 0.12)",
      },
      backgroundImage: {
        "grain-texture":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
