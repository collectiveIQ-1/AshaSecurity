import { useMemo } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Select } from "./Select.jsx";
import { useFormErrors } from "../forms/FormErrorContext.jsx";
import { Input } from "./Input.jsx";
import rawCountries from "../data/CountryCodes.json";

const digitsOnly = (v) => String(v ?? "").replace(/\D+/g, "");

function normalizeDialCode(dialCode) {
  const s = String(dialCode || "").trim().replace(/\s+/g, "");
  if (!s) return "";
  return s.startsWith("+") ? s : `+${s}`;
}

function buildCountries(list) {
  const out = [];
  for (const c of list || []) {
    const dial = normalizeDialCode(c?.dial_code);
    const iso = String(c?.code || "").trim().toUpperCase();
    const name = String(c?.name || "").trim();
    if (!dial || !iso || !name) continue;
    out.push({ iso, dial, name });
  }
  // Sort by name for dropdown
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function findCountryByDial(countries, dial) {
  if (!dial) return null;
  return countries.find((c) => c.dial === dial) || null;
}

function findBestDialPrefix(countries, valueStartingWithPlus) {
  // Find the longest matching dial prefix from our list
  const raw = String(valueStartingWithPlus || "").trim();
  const compact = raw.replace(/\s+/g, "");
  // Keep only + and digits
  const cleaned = "+" + digitsOnly(compact);

  let best = "";
  for (const c of countries) {
    if (cleaned.startsWith(c.dial) && c.dial.length > best.length) best = c.dial;
  }
  return best || "";
}

function parsePhone(value, countries, defaultDial = "+94") {
  const raw = String(value || "").trim();
  const safeDefaultDial = normalizeDialCode(defaultDial) || "+94";
  const defaultCountry = findCountryByDial(countries, safeDefaultDial);

  if (!raw) {
    return {
      dial: safeDefaultDial,
      iso: defaultCountry?.iso || "LK",
      name: defaultCountry?.name || "Sri Lanka",
      number: "",
    };
  }

  // If it starts with +, try to parse dial code (handles both "+94 77..." and "+9477...")
  if (raw.startsWith("+")) {
    // If there is a space, the first token is dial code
    const parts = raw.split(/\s+/);
    const first = normalizeDialCode(parts[0]);

    // Prefer exact match; otherwise try longest prefix match
    const dial = findCountryByDial(countries, first)
      ? first
      : findBestDialPrefix(countries, raw) || first || safeDefaultDial;

    // Remove dial from the compact string and keep the rest as digits
    const compact = raw.replace(/\s+/g, "");
    const rest = compact.startsWith(dial) ? compact.slice(dial.length) : parts.slice(1).join("");
    const number = digitsOnly(rest);

    const c = findCountryByDial(countries, dial);
    return {
      dial,
      iso: c?.iso || defaultCountry?.iso || "LK",
      name: c?.name || defaultCountry?.name || "Sri Lanka",
      number,
    };
  }

  // Legacy: just digits
  const number = digitsOnly(raw);
  return {
    dial: safeDefaultDial,
    iso: defaultCountry?.iso || "LK",
    name: defaultCountry?.name || "Sri Lanka",
    number,
  };
}

function getLiveError(dial, iso, number, countryName) {
  const digits = digitsOnly(number);
  if (!digits) return "";

  // Avoid showing scary errors while user typed only a few digits
  if (digits.length < 4) return "";

  // Prefer parsing as a national number for the selected country.
  // This fixes cases like Sri Lanka numbers typed as 0771234567 while +94 is selected.
  const nationalPhone = iso ? parsePhoneNumberFromString(digits, iso) : null;
  if (nationalPhone?.isPossible()) return "";

  const intlCompact = `${dial}${digits}`.replace(/\s+/g, "");
  const intlPhone = parsePhoneNumberFromString(intlCompact);
  if (!intlPhone) return `Invalid phone number for ${countryName}.`;

  // During typing: "possible" is a nice check (length-based + basic rules)
  if (!intlPhone.isPossible()) return `Invalid phone number for ${countryName}.`;

  return "";
}

export default function PhoneInput({
  value,
  onChange,
  defaultCode = "+94",
  placeholder = "",
  path,
  disabled = false,
}) {
  const errors = useFormErrors();
  const hasError = !!(path && errors && errors[path]);
  const countries = useMemo(() => buildCountries(rawCountries), []);
  const parsed = useMemo(() => parsePhone(value, countries, defaultCode), [value, countries, defaultCode]);

  const setDial = (dial) => {
    const next = parsed.number ? `${dial} ${parsed.number}` : `${dial}`;
    onChange?.(next);
};

  const setNumber = (raw) => {
    const digits = digitsOnly(raw);
    const next = digits ? `${parsed.dial} ${digits}` : "";
    onChange?.(next);
  };

  const liveError = useMemo(
    () => getLiveError(parsed.dial, parsed.iso, parsed.number, parsed.name),
    [parsed.dial, parsed.iso, parsed.number, parsed.name]
  );

  return (
    <div
      className={[
        "w-full",
        hasError
          ? "rounded-2xl border-2 border-orange-500/80 bg-orange-50/60 p-2 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] transition dark:bg-orange-500/10 dark:border-orange-400/70"
          : "",
      ].join(" ")}
      data-path={path || undefined}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:items-center">
        <Select
          className="w-full min-w-0 bg-white/90 font-medium dark:bg-zinc-900/80"
          value={parsed.dial}
          onChange={(e) => setDial(e.target.value)}
          disabled={disabled}
        >
          {countries.map((c) => (
            <option key={`${c.iso}-${c.dial}`} value={c.dial}>
              {c.name} ({c.dial})
            </option>
          ))}
        </Select>
        <Input
          value={parsed.number}
          inputMode="numeric"
          placeholder={placeholder}
          onChange={(e) => setNumber(e.target.value)}
          disabled={disabled}
          className={[
            "w-full min-w-0 bg-white/90 dark:bg-zinc-900/80",
            liveError ? "border-red-500 focus:border-red-400" : "",
          ].join(" ")}
        />
      </div>
      {liveError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{liveError}</div> : null}
    </div>
  );
}
