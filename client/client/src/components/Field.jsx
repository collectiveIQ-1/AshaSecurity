import { Children, isValidElement } from "react";
import { useFormErrors } from "../forms/FormErrorContext.jsx";

function findPathFromChildren(children) {
  const list = Children.toArray(children);
  for (const child of list) {
    if (!isValidElement(child)) continue;
    const directPath = child?.props?.path || child?.props?.name || child?.props?.["data-path"];
    if (directPath) return directPath;

    const nested = child?.props?.children;
    if (nested) {
      const nestedPath = findPathFromChildren(nested);
      if (nestedPath) return nestedPath;
    }
  }
  return "";
}

export function Field({ label, hint, error, path, children }) {
  const errors = useFormErrors();
  const resolvedPath = path || findPathFromChildren(children);
  const resolvedError = error || (resolvedPath ? errors?.[resolvedPath] : "") || "";
  const hasError = !!resolvedError;

  return (
    <label
      className={[
        "block rounded-2xl transition",
        hasError ? "bg-red-50/70 p-2 shadow-[0_0_0_2px_rgba(239,68,68,0.08)] dark:bg-red-950/20" : "",
      ].join(" ")}
      data-path={resolvedPath || undefined}
    >
      <div className="flex items-end justify-between gap-3">
        <div className={[
          "text-xs",
          hasError ? "font-semibold text-red-700 dark:text-red-300" : "text-zinc-700 dark:text-zinc-300",
        ].join(" ")}>{label}</div>
        {hint ? <div className="text-xs text-zinc-500 dark:text-zinc-500">{hint}</div> : null}
      </div>
      <div className="mt-1">{children}</div>
      {resolvedError ? <div className="mt-2 text-xs font-medium text-red-600 dark:text-red-300">{resolvedError}</div> : null}
    </label>
  );
}
