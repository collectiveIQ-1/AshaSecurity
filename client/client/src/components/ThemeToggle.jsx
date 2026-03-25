import { useTheme } from "../theme/ThemeContext.jsx";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function SunIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("h-5 w-5", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("h-5 w-5", className)}
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

/**
 * Eye-catchy theme switch (no text label)
 * - Dark mode: right side active (blue circle + moon), dark pill background
 * - Light mode: left side active (blue circle + sun), light pill background
 */
export default function ThemeToggle({ className = "", label = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  return (
    <div className={cx("inline-flex items-center", className)}>
      {/* label intentionally hidden (user request) */}
      {label ? (
        <span className="mr-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {label}
        </span>
      ) : null}

      <div
        className={cx(
          "relative h-10 w-20 rounded-full p-1",
          "transition-all duration-300",
          "shadow-[0_10px_25px_-18px_rgba(0,0,0,0.45)]",
          "ring-1 ring-black/10 hover:ring-black/20",
          "dark:ring-white/15 dark:hover:ring-white/25",
          isDark ? "bg-zinc-900" : "bg-white"
        )}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
      >
        <div className="grid h-full w-full grid-cols-2 gap-1">
          {/* LIGHT */}
          <button
            type="button"
            onClick={setLight}
            className={cx(
              "group grid place-items-center rounded-full transition-all duration-300",
              !isDark
                ? "bg-blue-600 shadow-[0_10px_20px_-12px_rgba(37,99,235,0.85)]"
                : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
            )}
            aria-label="Switch to light mode"
          >
            <SunIcon
              className={cx(
                "transition-colors duration-300",
                !isDark ? "text-white" : "text-zinc-500 dark:text-zinc-400"
              )}
            />
          </button>

          {/* DARK */}
          <button
            type="button"
            onClick={setDark}
            className={cx(
              "group grid place-items-center rounded-full transition-all duration-300",
              isDark
                ? "bg-blue-600 shadow-[0_10px_20px_-12px_rgba(37,99,235,0.85)]"
                : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
            )}
            aria-label="Switch to dark mode"
          >
            <MoonIcon
              className={cx(
                "transition-colors duration-300",
                isDark ? "text-white" : "text-zinc-500 dark:text-zinc-400"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
