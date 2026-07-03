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
