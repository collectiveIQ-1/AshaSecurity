import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

/**
 * ThemeProvider
 * - Uses Tailwind dark mode via 'class' on <html>
 * - ALWAYS follows the browser/OS preference (prefers-color-scheme)
 *   • If browser is dark → app opens in dark
 *   • If browser is light → app opens in light
 * - If the user toggles manually, we still update the UI immediately,
 *   but we DO NOT persist the choice (so next reload follows browser again).
 */
export function ThemeProvider({ children }) {
  const getSystemTheme = () => {
    if (typeof window === "undefined" || !window.matchMedia) return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // theme can be: "light" | "dark"
  const [theme, setTheme] = useState(() => getSystemTheme());

  // Keep theme synced with browser/OS preference changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setTheme(media.matches ? "dark" : "light");
    };

    // Set immediately on mount (covers any early mismatch)
    handleChange();

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    // Fallback (older Safari)
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  // Apply to <html> for Tailwind dark: classes.
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.dataset.theme = theme;
    // Helps native controls match the theme
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      isDark: theme === "dark",
      isLight: theme === "light",
      setTheme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
