"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "high-contrast" | "color-blind";

const THEME_CLASSES: Theme[] = ["dark", "high-contrast", "color-blind"];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("uigen-theme") as Theme | null;
    if (stored && ["light", "dark", "high-contrast", "color-blind"].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    THEME_CLASSES.forEach((cls) => root.classList.remove(cls));
    if (theme !== "light") {
      root.classList.add(theme);
    }
    localStorage.setItem("uigen-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}
