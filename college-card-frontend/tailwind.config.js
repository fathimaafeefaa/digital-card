export default {
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        eau: {
          navy: "#1a3a5c",
          gold: "#c8a84b",
          white: "#ffffff",
          light: "#f0f4f8",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(200, 168, 75, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(200, 168, 75, 0.8)" },
        },
        "card-flip": {
          "0%": { transform: "rotateY(90deg)", opacity: 0 },
          "100%": { transform: "rotateY(0deg)", opacity: 1 },
        },
        "shine-sweep": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "card-flip": "card-flip 0.6s ease-out",
        "shine-sweep": "shine-sweep 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
