import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";


import { useAuth } from "../auth/AuthContext.jsx";
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function IconMenu({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-6 w-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function IconChevron({ open, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-5 w-5 transition-transform", open ? "rotate-180" : "", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconLogout({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cx("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 16l-4-4 4-4" />
      <path d="M6 12h10" />
      <path d="M16 19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2" />
    </svg>
  );
}

function IconHome({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function IconGlobe({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function IconId({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <path d="M8 11h8" />
      <path d="M8 15h6" />
    </svg>
  );
}

function IconBuilding({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18" />
      <path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
      <path d="M9 9h1" />
      <path d="M9 12h1" />
      <path d="M9 15h1" />
      <path d="M14 9h1" />
      <path d="M14 12h1" />
      <path d="M14 15h1" />
    </svg>
  );
}

function NavItem({ to, icon, label, active, onClick, depth = 0 }) {
  const pad = depth === 0 ? "" : depth === 1 ? "pl-10" : "pl-14";
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cx(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        pad,
        active
          ? "bg-black/5 text-zinc-900 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-white/10 dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          : "text-zinc-700 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
      )}
    >
      <span
        className={cx(
          "grid h-9 w-9 place-items-center rounded-2xl transition",
          active
            ? "bg-gradient-to-br from-indigo-400/20 via-sky-400/10 to-emerald-400/10"
            : "bg-black/5 group-hover:bg-black/10 dark:bg-white/5 dark:group-hover:bg-white/10"
        )}
      >
        {icon}
      </span>
      <span className="leading-tight">{label}</span>

      {/* active glow */}
      {active ? (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10" />
      ) : null}
    </Link>
  );
}

function Group({ icon, label, open, onToggle, children }) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={cx(
          "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
          "text-zinc-900 hover:bg-black/5 dark:text-zinc-100 dark:hover:bg-white/5"
        )}
      >
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-black/5 dark:bg-white/5">
          {icon}
        </span>
        <span className="flex-1 text-left">{label}</span>
        <IconChevron open={open} className="text-zinc-500 dark:text-zinc-300" />
      </button>
      <div
        className={cx(
          "grid transition-[grid-template-rows,opacity] duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function NavigationDrawer() {
  const { theme } = useTheme();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navg = useNavigate();
  const panelRef = useRef(null);

  // Compact title shown next to the menu icon (saves vertical space in forms)
  const appTitle = useMemo(() => {
    const p = loc.pathname || "/";
    // Landing page: show only the menu icon (no "Application Portal" text)
    if (p === "/") return "";
    if (p.startsWith("/apply/local/individual")) return "Local Individual Application";
    if (p.startsWith("/apply/local/corporate")) return "Local Corporate Application";
    if (p.startsWith("/apply/foreign/individual")) return "Foreign Individual Application";
    if (p.startsWith("/apply/foreign/corporate")) return "Foreign Corporate Application";

    // ✅ Hide titles for the applicant-type selection pages
    if (p === "/apply/local" || p === "/apply/foreign") return "";

    // (Optional) if you ever want a title for other /apply pages, keep these.
    // For your request, we should NOT show them, so we return empty for these roots.
    if (p.startsWith("/apply/local")) return "";
    if (p.startsWith("/apply/foreign")) return "";

    return "";

  }, [loc.pathname]);

  const routes = useMemo(
    () => ({
      portal: "/portal",
    }),
    []
  );

  // click outside to close
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (path) => loc.pathname === path;
  const close = () => setOpen(false);

  function doLogout() {
    // Clear auth token and go back to landing page
    try { auth?.signout?.(); } catch {}
    close();
    // replace avoids back button returning to protected pages
    navg("/", { replace: true });
  }


  return (
    <>
      {/* Floating menu button + current application title (compact header) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open navigation"
        className={cx(
          // Smaller + tighter on mobile so the header doesn't collapse/overlap
          "fixed left-2 top-2 sm:left-4 sm:top-4 z-50",
          "flex items-center gap-2 sm:gap-3",
          // Mobile: allow this pill to grow taller if the title wraps (so the full title can be shown)
          "min-h-10 sm:h-12 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] py-2",
          "rounded-2xl px-2 sm:px-3",
          theme === "dark"
            ? "bg-gradient-to-br from-zinc-950/80 via-zinc-950/60 to-zinc-950/40 ring-1 ring-white/10 hover:ring-white/20"
            : "bg-white/80 ring-1 ring-black/10 hover:ring-black/20",
          "backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition"
        )}
      >
        <span
          className={cx(
            "grid h-8 w-8 sm:h-10 sm:w-10 flex-none place-items-center rounded-xl",
            theme === "dark"
              ? "bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-emerald-500/10"
              : "bg-black/5"
          )}
        >
          <IconMenu className={theme === "dark" ? "text-white" : "text-zinc-900"} />
        </span>
        {appTitle ? (
          <span
            className={cx(
              // Mobile: show the FULL title (no truncation). Allow wrapping to 2 lines if needed.
              // We still keep some space on the right for the theme toggle/step badge.
              "min-w-0 max-w-[calc(100vw-9.5rem)] sm:max-w-none text-[12px] sm:text-xl lg:text-2xl font-semibold whitespace-normal break-words leading-tight sm:tracking-wide",
              theme === "dark" ? "text-white" : "text-zinc-900"
            )}
          >
            {appTitle}
          </span>
        ) : null}
      </button>

      {/* Backdrop */}
      <div
        className={cx(
          "fixed inset-0 z-40 transition",
          open
            ? "bg-black/25 backdrop-blur-[2px] dark:bg-black/35"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside
        ref={panelRef}
        className={cx(
          "fixed left-0 top-0 z-50 h-full w-[86vw] max-w-[320px] sm:w-[320px]",
          "transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className={cx(
            "h-full p-5",
            theme === "dark"
              ? "bg-zinc-950/75 border-r border-white/10"
              : "bg-white/85 border-r border-black/10",
            "backdrop-blur-xl",
            "shadow-[30px_0_80px_rgba(0,0,0,0.25)]"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-white font-semibold text-lg tracking-wide">
                
              </div>
              <div className="text-xs text-zinc-300">
                
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/5"
            >
              Close
            </button>
          </div>

          {/* Accent line */}
          <div className="mt-4 h-px w-full bg-gradient-to-r from-indigo-500/40 via-sky-500/30 to-emerald-500/40" />

          {/* Nav */}
          <nav className="mt-5 space-y-3">
            <NavItem
              to={routes.portal}
              icon={<IconHome className="text-zinc-900 dark:text-zinc-100" />}
              label="Application Portal"
              active={isActive(routes.portal)}
              onClick={close}
            />

            {/*
              Navigation simplified (as requested):
              - Keep only "Application Portal" + "Sign out"
              - Removed: Update Application / Local Application / Foreign Application
            */}
                        <div className="mt-3 border-t border-black/10 pt-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={doLogout}
                  className={cx(
                    "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    "text-zinc-900 hover:bg-black/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  )}
                >
                  <IconLogout className="text-zinc-900 dark:text-zinc-100" />
                  <span>Sign out</span>
                </button>
              </div>

</nav>

          {/* Footer */}
          {/* <div className="absolute bottom-5 left-5 right-5">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs text-zinc-200 font-semibold">
                
              </div>
              <div className="mt-1 text-xs text-zinc-300">
                Press <span className="text-zinc-100 font-semibold">Esc</span> to close the menu.
              </div>
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
}
