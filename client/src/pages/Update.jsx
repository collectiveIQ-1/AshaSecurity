import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchApplicationForEdit } from "../lib/api.js";

export default function Update() {
  const location = useLocation();
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // If the update link contains ?id=<submissionId>, auto-open without asking user to type it.
  useEffect(() => {
    const sp = new URLSearchParams(location.search || "");
    const qid = (sp.get("id") || "").trim();
    if (!qid) return;
    setId(qid);

    // Auto-submit once (only when not already busy)
    (async () => {
      setError("");
      setBusy(true);
      try {
        const res = await fetchApplicationForEdit({ id: qid });
        nav(
          `/apply/${encodeURIComponent(res.region)}/${encodeURIComponent(res.applicantType)}?edit=${encodeURIComponent(
            res.id
          )}`
        );
      } catch (err) {
        setError(err?.message || "Failed to open application");
        setBusy(false);
      }
    })();
  }, [location.search]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetchApplicationForEdit({ id: id.trim() });
      // server response contains region + applicantType
      nav(
        `/apply/${encodeURIComponent(res.region)}/${encodeURIComponent(res.applicantType)}?edit=${encodeURIComponent(
          res.id
        )}`
      );
    } catch (err) {
      setError(err?.message || "Failed to open application");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
          <h1 className="text-3xl font-semibold tracking-tight">Update Application</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            To open your application, enter the <span className="font-medium">Submission ID</span>.
            <br />
            
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Submission ID</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Submission ID"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-white"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {busy ? "Opening..." : "Open Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
