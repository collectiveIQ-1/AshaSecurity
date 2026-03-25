const key = (region, type) => `smartportal:draft:${region}:${type}`;

export function loadDraft(region, type) {
  try {
    const raw = localStorage.getItem(key(region, type));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(region, type, data) {
  try {
    localStorage.setItem(key(region, type), JSON.stringify(data));
  } catch {}
}

export function clearDraft(region, type) {
  try {
    localStorage.removeItem(key(region, type));
  } catch {}
}
