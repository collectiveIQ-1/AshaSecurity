import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

function cx(...p) { return p.filter(Boolean).join(" "); }

export default function SignUp() {
  const { isDark } = useTheme();
  const auth = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const ui = useMemo(() => ({
    title: isDark ? "text-white" : "text-slate-900",
    muted: isDark ? "text-white/70" : "text-slate-600",
    card: isDark ? "bg-white/10 border-white/15" : "bg-white/70 border-slate-200",
    input: isDark ? "bg-black/20 border-white/15 text-white placeholder:text-white/40" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400",
    inputError: isDark ? "border-rose-400/70 focus:ring-rose-300/30" : "border-rose-400 focus:ring-rose-200",
    btn: isDark ? "bg-white text-slate-900 hover:bg-white/90" : "bg-slate-900 text-white hover:bg-slate-800",
    link: isDark ? "text-white/80 hover:text-white" : "text-slate-700 hover:text-slate-900",
    error: isDark ? "text-rose-200" : "text-rose-600",
    hint: isDark ? "text-emerald-200" : "text-emerald-600",
  }), [isDark]);

  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (password !== confirmPassword) {
      setErr("Password and Confirm Password must match.");
      return;
    }

    setBusy(true);
    try {
      await auth.signup({ name, email, password, confirmPassword, tel });
      nav("/portal", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageBackground variant="video">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className={cx("w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl", ui.card)}>
          <div className="p-7 sm:p-8">
            <div className={cx("text-2xl font-extrabold", ui.title)}>Create Account</div>
            <div className={cx("mt-1 text-sm", ui.muted)}>Email will be your username.</div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>Name</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none transition focus:ring-2 focus:ring-white/20", ui.input)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>Telephone</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none transition focus:ring-2 focus:ring-white/20", ui.input)}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>Email</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none transition focus:ring-2 focus:ring-white/20", ui.input)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="abc@example.com"
                  required
                />
              </div>
              <div>
                <label className={cx("text-xs font-semibold", ui.muted)}>Password</label>
                <input
                  className={cx("mt-1 w-full rounded-xl border px-3 py-3 outline-none transition focus:ring-2 focus:ring-white/20", ui.input)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className={cx("text-xs font-semibold", ui.muted)}>Confirm Password</label>
                  {confirmPassword ? (
                    <span className={cx("text-[11px] font-semibold", passwordsMatch ? ui.hint : ui.error)}>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  ) : null}
                </div>
                <input
                  className={cx(
                    "mt-1 w-full rounded-xl border px-3 py-3 outline-none transition focus:ring-2",
                    ui.input,
                    !passwordsMatch && ui.inputError
                  )}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (err) setErr("");
                  }}
                  type="password"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {err ? <div className={cx("text-sm font-semibold", ui.error)}>{err}</div> : null}

              <button
                disabled={busy || !passwordsMatch}
                className={cx("w-full rounded-xl px-4 py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed", ui.btn)}
                type="submit"
              >
                {busy ? "Creating..." : "Sign Up"}
              </button>

              <div className={cx("text-sm", ui.muted)}>
                Already have an account?{" "}
                <Link to="/signin" className={cx("font-semibold", ui.link)}>Sign In</Link>
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
