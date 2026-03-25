import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function formatUntil(iso) {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function Success() {
  const { state } = useLocation();
  const [stored, setStored] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("smartportal:lastEdit");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setStored(parsed);
    } catch {}
  }, []);

  const editInfo = useMemo(() => {
    const s = state || {};
    if (s?.id && s?.region && s?.type) return s;
    // fallback to last stored (same browser)
    if (stored?.id && stored?.region && stored?.type) {
      return {
        id: stored.id,
        region: stored.region,
        type: stored.type,
        editUntil: stored.editUntil,
        editWindowDays: stored.editWindowDays,
      };
    }
    return null;
  }, [state, stored]);

  const editLink =
    editInfo?.id && editInfo?.region && editInfo?.type
      ? `/apply/${encodeURIComponent(editInfo.region)}/${encodeURIComponent(editInfo.type)}?edit=${encodeURIComponent(editInfo.id)}`
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
          <h1 className="text-3xl font-semibold tracking-tight">
            {state?.updated ? "Updated ✅" : "Submitted ✅"}
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            {state?.updated
              ? "Your changes were saved successfully."
              : "Your application was submitted successfully. Our team will review and contact you if needed."}
          </p>

          {state?.id ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
              Submission ID: <span className="font-medium text-zinc-900 dark:text-white">{state.id}</span>
            </div>
          ) : null}

          {editInfo?.editUntil ? (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              You can edit this application until{" "}
              <span className="font-medium text-zinc-900 dark:text-white">{formatUntil(editInfo.editUntil)}</span>.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-2xl bg-white text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-200 transition"
              to="/portal"
            >
              Back to Home
            </Link>

            {editLink ? (
              <Link
                className="rounded-2xl border border-zinc-300 bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-800/60"
                to={editLink}
              >
                Edit Within {editInfo?.editWindowDays || 7} Days
              </Link>
            ) : null}

            {/* <a
              className="rounded-2xl border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800/60 transition"
              href="mailto:support@example.com"
            >
              Contact support
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
