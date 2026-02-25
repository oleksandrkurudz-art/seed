import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clean: "#22c55e",
        relapse: "#ef4444",
        neutral: "#94a3b8",
        accent: "#06b6d4"
      },
      animation: {
        "fade-in": "fadeIn .35s ease-out",
        "pop-in": "popIn .35s ease-out",
        confetti: "confetti 1.8s ease-out forwards",
        glow: "glow 2.2s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        popIn: {
          from: { opacity: "0", transform: "scale(.95)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        confetti: {
          "0%": { opacity: "1", transform: "translateY(-12px) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(70vh) rotate(420deg)" }
        },
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 4px rgba(8, 145, 178, .35))" },
          "50%": { filter: "drop-shadow(0 0 16px rgba(34, 197, 94, .45))" }
        }
      }
    }
  },
  plugins: []
};

export default config;
