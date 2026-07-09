/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        smoke: "var(--smoke)",
        line: "var(--line)",
        mute: "var(--mute)",
        accent: "var(--accent)",
        "shop-bg": "var(--shop-bg)",
        "shop-surface": "var(--shop-surface)",
        "shop-line": "var(--shop-line)",
        "shop-text": "var(--shop-text)",
        "shop-mute": "var(--shop-mute)",
        "shop-tile": "var(--shop-tile)",
        "shop-accent": "var(--shop-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        ui: ["var(--font-ui)"],
        wordmark: ["var(--font-wordmark)"],
      },
    },
  },
  plugins: [],
};
