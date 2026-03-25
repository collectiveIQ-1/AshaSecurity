import { useFormErrors } from "../forms/FormErrorContext.jsx";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";

const isoToDmy = (v) => {
  const s = String(v || "");
  const m = s.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);
  if (!m) return v;
  const yyyy = m[1];
  const mm = m[2];
  const dd = m[3];
  return `${dd}/${mm}/${yyyy}`;
};

const dmyToDate = (v) => {
  const s = String(v || "").trim();
  // dd/MM/yyyy
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }
  // yyyy-MM-dd (ISO)
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const yyyy = Number(m[1]);
    const mm = Number(m[2]);
    const dd = Number(m[3]);
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const formatDmy = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime())) return "";
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dateObj.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
};

const CalendarIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DateTextInput = forwardRef(function DateTextInput(
  { value, onClick, onChange, placeholder, disabled, className, name, "data-path": dataPath },
  ref
) {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        name={name}
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        placeholder={placeholder}
        data-path={dataPath}
        className={className + " pr-10"}
      />
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        aria-label="Open calendar"
        tabIndex={-1}
      >
        <CalendarIcon className="h-4 w-4" />
      </button>
    </div>
  );
});

export function Input(props) {
  const errors = useFormErrors();
  const { className = "", path: pathProp, ...rest } = props;
  const path = pathProp || rest.name;
  const hasError = !!(path && errors && errors[path]);

  const wrapperClass = [
    "w-full",
    hasError
      ? "rounded-2xl border-2 border-orange-500/80 bg-orange-50/60 p-1 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] transition"
      : "",
    hasError ? "dark:bg-orange-500/10 dark:border-orange-400/70" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClass = [
    "w-full text-[13px] sm:text-sm rounded-2xl border px-3 py-2 outline-none transition",
    "border-zinc-300 bg-white/80 text-zinc-900 placeholder:text-zinc-400",
    hasError ? "border-transparent bg-transparent" : "",
    "focus:border-zinc-500 focus:ring-2 focus:ring-black/20",
    "dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
    "dark:focus:border-white/30 dark:focus:ring-white/10",
    className,
  ].join(" ");

  const isDate = String(rest.type || "") === "date";

  // ✅ If it's a date field, show calendar picker + dd/MM/yyyy format
  if (isDate) {
    const rawValue = typeof rest.value === "string" ? rest.value : "";
    const displayValue = rawValue && /^\d{4}-\d{2}-\d{2}$/.test(rawValue) ? isoToDmy(rawValue) : rawValue;
    const selected = dmyToDate(displayValue);

    return (
      <div className={wrapperClass}>
        <DatePicker
          selected={selected}
          onChange={(d) => {
            const formatted = formatDmy(d);
            if (typeof rest.onChange === "function") {
              rest.onChange({ target: { name: rest.name, value: formatted } });
            }
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText={rest.placeholder || "dd/MM/yyyy"}
          disabled={!!rest.disabled}
          customInput={
            <DateTextInput
              className={inputClass}
              name={rest.name}
              data-path={path || undefined}
            />
          }
          // allow manual typing too (keeps your old behavior)
          onChangeRaw={(e) => {
            if (typeof rest.onChange === "function") {
              rest.onChange(e);
            }
          }}
          // keep the picker consistent
          showPopperArrow={false}
          popperPlacement="bottom-start"
        />
      </div>
    );
  }

  // Normal inputs (non-date)
  return (
    <div className={wrapperClass}>
      <input {...rest} data-path={path || undefined} className={inputClass} />
    </div>
  );
}
