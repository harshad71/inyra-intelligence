/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080A", // Canvas background matching Fintrixity
        canvas: "#0B0B0E",
        sidebar: "#0D0E11",
        surface: {
          DEFAULT: "#121316", // Primary card surface
          elevated: "#17181D", // Input & nested container surface
          hover: "#1C1D23",
          subtle: "#15161B",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          subtle: "rgba(255, 255, 255, 0.03)",
          highlight: "rgba(255, 255, 255, 0.08)",
          focus: "#FF4500",
        },
        foreground: {
          DEFAULT: "#EDEDEF",
          muted: "#8A8D9A",
          subtle: "#5C5F6D",
          dim: "#3E414D",
        },
        brand: {
          orange: "#FF5E2A",
          orangeVibrant: "#FF4500",
          orangeDark: "#E63900",
          accent: "#FF4500", // Signature vibrant accent matching Fintrixity
          accentHover: "#E63900",
          iris: "#7C5CFF",
        },
      },
      boxShadow: {
        "fintrixity-card": "0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "hero-glow": "0 20px 40px -15px rgba(255, 69, 0, 0.45)",
        "subtle-card": "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
        "drawer-deep": "0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.06)",
      },
      borderRadius: {
        "3xl": "24px",
        "2xl": "20px",
        "xl": "14px",
        "lg": "12px",
        "md": "10px",
        "sm": "8px",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        "shimmer": "shimmer 2.4s infinite linear",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
