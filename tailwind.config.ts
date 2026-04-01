import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slot-spin": "slotSpin 0.1s linear infinite",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        slotSpin: {
          "0%": { transform: "translateY(-10%)", opacity: "0.7" },
          "50%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(10%)", opacity: "0.7" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
