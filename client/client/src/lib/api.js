// Prefer same-origin requests so the Vite dev server can proxy `/api` to the backend.
// This avoids CORS + port mismatch issues (a common cause of "Failed to fetch").
// You can still override with VITE_API_BASE for production deployments.
const API_BASE = import.meta.env.VITE_API_BASE || "";

function getAuthToken() {
  try { return localStorage.getItem("stoxiq_token"); } catch { return null; }
}

function authHeaders(extra = {}) {
  const t = getAuthToken();
  return t ? { ...extra, Authorization: `Bearer ${t}` } : extra;
}


function normalizeFileEntry(v) {
  // We currently store raw File objects in state, but keep this future-proof.
  if (!v) return null;
  if (v instanceof File) return v;
  if (typeof v === "object" && v.file instanceof File) return v.file;
  return null;
}

export async function submitApplication({ data, files }) {
  const fd = new FormData();
  fd.append("data", JSON.stringify(data));

  for (const [key, value] of Object.entries(files || {})) {
    const file = normalizeFileEntry(value);
    if (!file) continue;

    // If FileUpload attached a server filename, send it as the upload filename.
    // (Most backends will use this as `originalname`.)
    const serverFilename = file?._serverFilename;
    if (serverFilename) fd.append(key, file, serverFilename);
    else fd.append(key, file);
  }

  const res = await fetch(`${API_BASE}/api/applications`, {
    headers: authHeaders(),
    method: "POST",
    body: fd,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Submit failed");
  return json;
}


export async function fetchApplicationForEdit({ id }) {
  if (!id) throw new Error("Missing id");

  const res = await fetch(`${API_BASE}/api/applications/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || json?.error || "Failed to load application");
  return json;
}

export async function updateApplication({ id, data, files }) {
  if (!id) throw new Error("Missing id");

  const fd = new FormData();
  fd.append("data", JSON.stringify(data));

  for (const [key, value] of Object.entries(files || {})) {
    const file = normalizeFileEntry(value);
    if (!file) continue;

    const serverFilename = file?._serverFilename;
    if (serverFilename) fd.append(key, file, serverFilename);
    else fd.append(key, file);
  }

  const res = await fetch(`${API_BASE}/api/applications/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
    method: "PUT",
    body: fd,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || json?.error || "Update failed");
  return json;
}


export async function listApplications(category, { limit = 200 } = {}) {
  if (!category) throw new Error("Missing category");
  const res = await fetch(`${API_BASE}/api/applications/admin/${encodeURIComponent(category)}?limit=${encodeURIComponent(limit)}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to load applications");
  return json;
}
