"use client";

import { createContext, useContext, useState } from "react";

const ShopThemeContext = createContext({ theme: "light", setTheme: () => {} });

export function ShopThemeProvider({ children, initialTheme = "light" }) {
  const [theme, setThemeState] = useState(initialTheme);

  function setTheme(next) {
    setThemeState(next);
    document.cookie = `shopTheme=${next}; path=/; max-age=31536000`;
    localStorage.setItem("shopTheme", next);
  }

  return <ShopThemeContext.Provider value={{ theme, setTheme }}>{children}</ShopThemeContext.Provider>;
}

export function useShopTheme() {
  return useContext(ShopThemeContext);
}
