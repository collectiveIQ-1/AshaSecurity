import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageBackground from "../components/PageBackground.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

function cx(...p) { return p.filter(Boolean).join(" "); }

export default function SignIn() {
  const { isDark } = useTheme();
  const auth = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const ui = useMemo(() => ({
    title: isDark ? "text-white" : "text-slate-900",
    muted: isDark ? "text-white/70" : "text-slate-600",
    card: isDark ? "bg-white/10 border-white/15" : "bg-white/70 border-slate-200",
    input: isDark ? "bg-black/20 border-white/15 text-white placeholder:text-white/40" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400",
    btn: isDark ? "bg-white text-slate-900 hover:bg-white/90" : "bg-slate-900 text-white hover:bg-slate-800",
    link: isDark ? "text-white/80 hover:text-white" : "text-slate-700 hover:text-slate-900",
    error: isDark ? "text-rose-200" : "text-rose-600",
  }), [isDark]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await auth.signin({ email, password, remember });
      const rt = sp.get("returnTo");
      nav(rt ? decodeURIComponent(rt) : "/portal", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageBackground variant="video">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className={cx("w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden", ui.card)}>
          <div className="p-7 sm:p-8">
            <div className={cx("text-2xl font-extrabold", ui.title)}>Welcome Back</div>
            <div className={cx("mt-1 text-sm", ui.muted)}>Sign in to continue to the portal.</div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>User Name (Enter the Email Address)</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none focus:ring-2 focus:ring-white/20", ui.input)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@example.com"
                  type="email"
                  required
                />
              </div>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>Password</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none focus:ring-2 focus:ring-white/20", ui.input)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className={cx("flex items-center gap-2 text-sm", ui.muted)}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <Link to="/forgot-password" className={cx("text-sm font-semibold", ui.link)}>
                  Forgot Password?
                </Link>
              </div>

              {err ? <div className={cx("text-sm font-semibold", ui.error)}>{err}</div> : null}

              <button
                disabled={busy}
                className={cx("w-full rounded-xl px-4 py-3 font-semibold transition disabled:opacity-60", ui.btn)}
                type="submit"
              >
                {busy ? "Signing in..." : "Sign In"}
              </button>

              <div className={cx("text-sm", ui.muted)}>
                New Here?{" "}
                <Link to="/signup" className={cx("font-semibold", ui.link)}>
                  Create an Account
                </Link>
              </div>

              <div className="pt-2">
                <Link to="/" className={cx("text-sm", ui.link)}>← Back to StoxIQ</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
