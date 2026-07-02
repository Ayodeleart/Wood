"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ night: false, toggleNight: () => {} });

export function ThemeProvider({ children }) {
  const [night, setNight] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ow_theme_night");
    if (stored === "1") setNight(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("ow_theme_night", night ? "1" : "0");
  }, [night, hydrated]);

  return (
    <ThemeContext.Provider value={{ night, toggleNight: () => setNight((v) => !v) }}>
      {/* display:contents so this wrapper doesn't affect the body's flex layout —
          it only exists to cascade the theme CSS variables to everything inside. */}
      <div className={`contents ${night ? "theme-night" : ""}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
