import { useEffect, useMemo, useState } from "react";
import { listApplications } from "../lib/api.js";

const CATEGORIES = [
  { key: "localIndividual", label: "Local Individual" },
  { key: "localCorporate", label: "Local Corporate" },
  { key: "foreignIndividual", label: "Foreign Individual" },
  { key: "foreignCorporate", label: "Foreign Corporate" },
];

function fmt(d) {
  try {
    if (!d) return "";
    const x = new Date(d);
    if (Number.isNaN(x.getTime())) return "";
    return x.toLocaleString();
  } catch {
    return "";
  }
}

export default function Dashboard() {
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await listApplications(cat, { limit: 200 });
      setRows(res?.rows || []);
    } catch (e) {
      setError(e?.message || "Failed to load");
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const header = useMemo(() => CATEGORIES.find((c) => c.key === cat)?.label || "", [cat]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Applications Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Saved applications are now stored in 4 separate collections (tables) and shown below in grid format.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium border transition
                  ${
                    cat === c.key
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                      : "bg-white/70 text-zinc-900 border-zinc-200 hover:bg-white dark:bg-zinc-950/40 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                  }`}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={load}
              className="rounded-2xl px-4 py-2 text-sm font-medium border border-zinc-200 bg-white/70 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/60"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between gap-3">
            <div className="text-base font-semibold">{header}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              {busy ? "Loading..." : `${rows.length} row(s)`}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-4 overflow-auto">
            <table className="min-w-[640px] sm:min-w-[720px] md:min-w-[900px] w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-600 dark:text-zinc-300">
                  <th className="py-2 px-3">Submission ID</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3">Updated</th>
                  <th className="py-2 px-3">Edit Until</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-zinc-200/60 hover:bg-black/5 dark:border-zinc-800/60 dark:hover:bg-white/5"
                  >
                    <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                    <td className="py-2 px-3">{r.name || "-"}</td>
                    <td className="py-2 px-3">{r.email || "-"}</td>
                    <td className="py-2 px-3">{r.phone || "-"}</td>
                    <td className="py-2 px-3">{fmt(r.createdAt)}</td>
                    <td className="py-2 px-3">{fmt(r.updatedAt)}</td>
                    <td className="py-2 px-3">{fmt(r.editUntil)}</td>
                  </tr>
                ))}
                {!busy && rows.length === 0 ? (
                  <tr>
                    <td className="py-6 px-3 text-zinc-600 dark:text-zinc-400" colSpan={7}>
                      No applications found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
