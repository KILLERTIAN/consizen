import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MetaMask Orange Theme
        metamask: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f7931a", // Primary MetaMask orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        sustainability: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        carbon: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 8s linear infinite",
        "card-rotate": "cardRotate 20s linear infinite",
        "sustainability-pulse": "sustainabilityPulse 2s ease-in-out infinite",
        "glass-shimmer": "glassShimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { 
            boxShadow: "0 0 20px rgba(247, 147, 26, 0.3)",
            filter: "brightness(1.1)",
          },
          to: { 
            boxShadow: "0 0 30px rgba(247, 147, 26, 0.5), 0 0 40px rgba(247, 147, 26, 0.3)",
            filter: "brightness(1.2)",
          },
        },
        slideUp: {
          from: { 
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: { 
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        cardRotate: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        sustainabilityPulse: {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            transform: "scale(1)",
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.6)",
            transform: "scale(1.05)",
          },
        },
        glassShimmer: {
          "0%, 100%": { 
            backgroundPosition: "0% 50%",
            opacity: "0.8",
          },
          "50%": { 
            backgroundPosition: "100% 50%",
            opacity: "1",
          },
        },
      },
    },
  },
} satisfies Config;
