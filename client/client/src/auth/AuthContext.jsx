import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// In dev we usually proxy `/api` from Vite -> backend.
// In production (client hosted separately) set VITE_API_BASE to your backend URL.
const API_BASE = import.meta.env.VITE_API_BASE || "";

const AuthContext = createContext(null);

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function storageDel(key) {
  try { localStorage.removeItem(key); } catch {}
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storageGet("stoxiq_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  async function fetchMe(tk) {
    if (!tk) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = await res.json();
      setUser(data.user || null);
    } catch (e) {
      storageDel("stoxiq_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthed: !!token && !!user,
    async signin({ email, password, remember }) {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      storageSet("stoxiq_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    },
    async signup({ name, email, password, confirmPassword, tel }) {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, tel }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      storageSet("stoxiq_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    },
    signout() {
      storageDel("stoxiq_token");
      setToken(null);
      setUser(null);
    },
    async forgotPassword(email) {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    async resetPassword({ token: resetToken, password }) {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Reset failed");
      return data;
    },
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
