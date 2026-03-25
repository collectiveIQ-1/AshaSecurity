import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";
import PageBackground from "../components/PageBackground.jsx";

function cx(...p) { return p.filter(Boolean).join(" "); }

export default function Landing() {
  const nav = useNavigate();
  const { isDark } = useTheme();

  const title = isDark ? "text-white" : "text-slate-900";
  const muted = isDark ? "text-white/70" : "text-slate-600";
  const card = isDark ? "bg-white/10 border-white/15" : "bg-white/70 border-slate-200";
  const btnPrimary = isDark
    ? "bg-white text-slate-900 hover:bg-white/90"
    : "bg-slate-900 text-white hover:bg-slate-800";
  const btnGhost = isDark
    ? "bg-white/10 text-white hover:bg-white/15 border border-white/15"
    : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200";

  return (
    <PageBackground variant="video">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className={cx("w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden", card)}>
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between gap-4">
              <div>
  <h1
    className={cx(
      "text-4xl sm:text-6xl font-extrabold tracking-tight",
      title
    )}
  >
    StoxIQ
  </h1>

  <p className={cx("mt-3 max-w-2xl leading-relaxed", muted)}>
    Tytech PTY LTD operates as a proud subsidiary of Venturecorp, a diversified
    group based in Sri Lanka.
  </p>

  {/* Bullet Points */}
  <ul className={cx("mt-4 max-w-2xl space-y-3", muted)}>
  <li className="flex gap-3">
    <span className="mt-2 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
    <span>Being part of Venturecorp enables Tytech to leverage a strong foundation
      in innovation, corporate governance, and cross-industry expertise.</span>
  </li>

  <li className="flex gap-3">
    <span className="mt-2 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
    <span>Venturecorp is recognized for driving excellence across multiple sectors,
      supporting companies like Tytech in global expansion, financial stability,
      and strategic growth.</span>
  </li>
</ul>

</div>


              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => nav("/signin")}
                  className={cx("px-5 py-3 rounded-xl font-semibold transition", btnGhost)}
                >
                  Sign in
                </button>
                <button
                  onClick={() => nav("/signup")}
                  className={cx("px-5 py-3 rounded-xl font-semibold transition", btnPrimary)}
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className={cx("rounded-2xl border p-5", isDark ? "border-white/15 bg-black/10" : "border-slate-200 bg-white/60")}>
                <div className={cx("text-sm font-semibold", title)}>Secure access</div>
                <div className={cx("mt-2 text-sm", muted)}>Sign in with your email (username) & password. Optional “Remember me”.</div>
              </div>
              <div className={cx("rounded-2xl border p-5", isDark ? "border-white/15 bg-black/10" : "border-slate-200 bg-white/60")}>
                <div className={cx("text-sm font-semibold", title)}>Fast onboarding</div>
                <div className={cx("mt-2 text-sm", muted)}>Start applications, upload documents, and track status in one portal.</div>
              </div>
              <div className={cx("rounded-2xl border p-5", isDark ? "border-white/15 bg-black/10" : "border-slate-200 bg-white/60")}>
                <div className={cx("text-sm font-semibold", title)}>Smart dashboards</div>
                <div className={cx("mt-2 text-sm", muted)}>View KPIs and reports with a clean, modern UI.</div>
              </div>
            </div> */}

            <div className="mt-8 flex sm:hidden items-center gap-2">
              <button onClick={() => nav("/signin")} className={cx("flex-1 px-5 py-3 rounded-xl font-semibold transition", btnGhost)}>
                Sign in
              </button>
              <button onClick={() => nav("/signup")} className={cx("flex-1 px-5 py-3 rounded-xl font-semibold transition", btnPrimary)}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
