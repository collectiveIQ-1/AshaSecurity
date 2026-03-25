import { useMemo, useRef } from "react";
import { useFormErrors } from "../forms/FormErrorContext.jsx";

function extFromFile(file) {
  if (!file) return "";
  const name = file?.name || "";
  const dot = name.lastIndexOf(".");
  if (dot >= 0 && dot < name.length - 1) return name.slice(dot);
  // fallback by mime type
  if (file?.type) {
    if (file.type === "image/png") return ".png";
    if (file.type === "image/jpeg") return ".jpg";
    if (file.type === "image/webp") return ".webp";
    if (file.type === "application/pdf") return ".pdf";
  }
  return "";
}

function makeClientId() {
  try {
    // Example: "indskjcoijsoid152" style
    const base = (crypto?.randomUUID?.() || "").replace(/-/g, "");
    if (base) return "ind" + base.slice(0, 12) + String(Math.floor(Math.random() * 900 + 100));
  } catch {}
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "ind";
  for (let i = 0; i < 12; i++) s += chars[Math.floor(Math.random() * chars.length)];
  s += String(Math.floor(Math.random() * 900 + 100));
  return s;
}

/**
 * FileUpload
 * - Hides the browser's default "No file chosen" UI (we use our own button + name).
 * - Optional: show a random client-side file id (clientNameMode="random").
 * - Optional: send a renamed filename to the server via file._serverFilename (serverName prop).
 */
export default function FileUpload({
  label,
  accept,
  file,
  setFile,
  value, // backward-compatible alias used in some legacy components
  setValue, // backward-compatible alias used in some legacy components
  disabled = false,
  hint,
  clientNameMode = "original", // "original" | "random"
  serverName, // e.g. "Signature of Principal Applicant"
  path,
}) {
  const errors = useFormErrors();
  const hasError = !!(path && errors && errors[path]);
  const inputRef = useRef(null);

  const resolvedFile = file ?? value ?? null;
  const resolvedSetFile = setFile ?? setValue;

  const fileDisplayName =
    typeof resolvedFile === "string"
      ? resolvedFile
      : resolvedFile?._clientDisplayName || resolvedFile?.name || resolvedFile?.originalName || resolvedFile?.filename || "";

  const preview = useMemo(() => {
    if (!resolvedFile || typeof resolvedFile === "string") return null;
    try {
      if (resolvedFile.type?.startsWith("image/")) return { kind: "image", url: URL.createObjectURL(resolvedFile) };
      if (resolvedFile.type === "application/pdf") return { kind: "pdf", url: URL.createObjectURL(resolvedFile) };
    } catch {}
    return null;
  }, [resolvedFile]);

  return (
    <div
      className={[
        "rounded-3xl border bg-white/70 p-5 text-zinc-900 shadow-soft dark:bg-zinc-950/30 dark:text-zinc-100",
        hasError
          ? "border-orange-500/80 bg-orange-50/60 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:bg-orange-500/10 dark:border-orange-400/70"
          : "border-zinc-200 dark:border-zinc-800",
      ].join(" ")}
      data-path={path || undefined}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">{label}</div>
        {hint ? <div className="text-xs text-zinc-500 dark:text-zinc-500">{hint}</div> : null}
      </div>

      {/* Hidden native input to avoid browser 'No file chosen' text */}
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={accept}
        onChange={(e) => {
          const picked = e.target.files?.[0] || null;

          if (!picked) {
            resolvedSetFile?.(null);
            return;
          }

          // Attach client-side display id if requested
          if (clientNameMode === "random") {
            picked._clientDisplayName = makeClientId();
          } else {
            // keep a stable display name (so it doesn't look blank)
            picked._clientDisplayName = picked?.name || "";
          }

          // Attach server-side rename if provided
          if (serverName) {
            const ext = extFromFile(picked);
            picked._serverFilename = `${serverName}${ext}`;
          }

          resolvedSetFile?.(picked);

          // reset input so selecting the SAME file again triggers onChange
          e.target.value = "";
        }}
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          className={["rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200", disabled ? "cursor-not-allowed opacity-60" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"].join(" ")}
          disabled={disabled}
        >
          {fileDisplayName ? "Replace file" : "Choose file"}
        </button>

        <div className="min-w-0 flex-1">
          {fileDisplayName ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-sm text-zinc-800 dark:text-zinc-200">{fileDisplayName}</span>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Uploaded ✓</span>
            </div>
          ) : (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">No file selected</div>
          )}
        </div>

        {preview ? (
          <a
            href={preview.url}
            target="_blank"
            rel="noreferrer"
            className={["rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300", disabled ? "cursor-not-allowed opacity-60" : "hover:bg-zinc-50 dark:hover:bg-zinc-950"].join(" ")}
          >
            View
          </a>
        ) : null}

        {fileDisplayName ? (
          <button
            type="button"
            onClick={() => resolvedSetFile?.(null)}
            className={["rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300", disabled ? "cursor-not-allowed opacity-60" : "hover:bg-zinc-50 dark:hover:bg-zinc-950"].join(" ")}
            disabled={disabled}
          >
            Remove
          </button>
        ) : null}
      </div>

      {preview?.kind === "image" ? (
        <img
          src={preview.url}
          alt="preview"
          className="mt-4 max-h-56 w-full rounded-2xl border border-zinc-200 object-contain dark:border-zinc-800"
        />
      ) : preview?.kind === "pdf" ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <iframe
            title="pdf-preview"
            src={preview.url}
            className="h-56 w-full bg-white dark:bg-zinc-950"
          />
        </div>
      ) : null}
    </div>
  );
}
