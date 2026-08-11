import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lip-theme";

/** Theme toggle: applies `dark` / `light` class on <html>. */
export function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setTheme(stored === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return { theme, isDark: theme === "dark", toggle, setTheme };
}
