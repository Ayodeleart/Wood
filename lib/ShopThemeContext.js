"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ShopThemeContext = createContext({ theme: "light", setTheme: () => {} });

export function ShopThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("shopTheme");
    if (saved === "dark" || saved === "light") setThemeState(saved);
  }, []);

  function setTheme(next) {
    setThemeState(next);
    localStorage.setItem("shopTheme", next);
  }

  return <ShopThemeContext.Provider value={{ theme, setTheme }}>{children}</ShopThemeContext.Provider>;
}

export function useShopTheme() {
  return useContext(ShopThemeContext);
}
