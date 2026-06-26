/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10131A",
        surface: "#0F1115",
        panel: "#171A21",
        panel2: "#1E222B",
        line: "#2A2F3A",
        muted: "#8A8F9C",
        accent: "#FF6B35",
        accent2: "#FFB000",
        blue: "#4F8FE0",
        green: "#34C788",
        yellow: "#FFC640",
        red: "#FF5A5F",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,107,53,0.25), 0 8px 24px -8px rgba(255,107,53,0.35)",
        card: "0 1px 2px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top left, rgba(255,107,53,0.10), transparent 45%), radial-gradient(circle at bottom right, rgba(79,143,224,0.10), transparent 45%)",
      },
    },
  },
  plugins: [],
};
