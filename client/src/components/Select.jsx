import { useFormErrors } from "../forms/FormErrorContext.jsx";

export function Select(props) {
  const errors = useFormErrors();
  const { className = "", path: pathProp, ...rest } = props;
  const path = pathProp || rest.name;
  const hasError = !!(path && errors && errors[path]);

  const wrapperClass = [
    "w-full",
    // rounded error highlight container (requested)
    hasError
      ? "rounded-2xl border-2 border-orange-500/80 bg-orange-50/60 p-1 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] transition"
      : "",
    // dark mode tweak
    hasError ? "dark:bg-orange-500/10 dark:border-orange-400/70" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectClass = [
    // Theme-aware select (light + dark)
    "w-full text-[13px] sm:text-sm rounded-2xl border px-3 py-2 outline-none transition",
    "border-zinc-300 bg-white/80 text-zinc-900",
    // When wrapper is highlighted, keep the inner border calm to avoid double-borders
    hasError ? "border-transparent bg-transparent" : "",
    "focus:border-zinc-400 focus:ring-2 focus:ring-black/10",
    "dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100",
    "dark:focus:border-white/30 dark:focus:ring-white/10",
    className,
  ].join(" ");

  return (
    <div className={wrapperClass}>
      <select {...rest} data-path={path || undefined} className={selectClass} />
    </div>
  );
}
