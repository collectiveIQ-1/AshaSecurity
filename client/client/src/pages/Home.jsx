import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function IconChevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-open:rotate-90"
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActionCard({ subtitle, title, desc, icon, onClick, isDark }) {
  const textTitle = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-white/70" : "text-slate-700";
  const iconFg = isDark ? "text-white" : "text-slate-900";
  const iconBg = isDark ? "bg-white/10 border border-white/15" : "bg-black/5 border border-black/10";
  const cardBg = isDark ? "bg-white/10 border border-white/15 hover:bg-white/14 hover:border-white/25" : "bg-white/75 border border-black/10 hover:bg-white/85 hover:border-black/20";
  const arrowBg = isDark ? "bg-white/10 border border-white/15 group-hover:bg-white/15" : "bg-white/70 border border-black/10 group-hover:bg-white/85";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group text-left w-full rounded-3xl p-5 sm:p-6",
        "backdrop-blur-xl",
        cardBg,
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        "transition-all duration-300 hover:-translate-y-1"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cx("h-12 w-12 rounded-2xl flex items-center justify-center", iconBg, iconFg)}>
            {icon}
          </div>

          <div>
            <p className={cx("text-sm", textMuted)}>{subtitle}</p>
            <h3 className={cx("text-2xl font-semibold mt-1", textTitle)}>{title}</h3>
            <p className={cx("text-sm mt-2 leading-relaxed max-w-md", textMuted)}>
              {desc}
            </p>
          </div>
        </div>

        <div className={cx(
          "h-11 w-11 rounded-full flex items-center justify-center transition",
          isDark ? "text-white/90" : "text-slate-900/90",
          arrowBg
        )}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className={cx(
          "mt-5 h-[2px] w-full rounded-full",
          isDark
            ? "bg-gradient-to-r from-white/40 via-white/10 to-transparent"
            : "bg-gradient-to-r from-black/25 via-black/10 to-transparent"
        )}
      />
    </button>
  );
}

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a5 5 0 100-10 5 5 0 000 10z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 22a8 8 0 10-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h8l4 4v16H6V2z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const guidelines = useMemo(
    () => [
      // "Use Google Chrome if possible for the best experience.",
      // "We recommend using a laptop or desktop device.",
      "All required fields must be completed before submission.",
      // "This system does not auto-save. Please complete in one session.",
      "Upload a clear digital signature where required.",
      "Corporate applicants may need to upload a company seal.",
      "The submission ID must be provided for further updates to the application.",
    ],
    []
  );

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${
          theme === "dark"
            ? "/images/landingBI.png"
            : "/images/landingLight.png"
        }')`,
      }}
    >
      {/* Overlay */}
      <div
        className={cx(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-b from-black/35 via-black/35 to-black/70"
            : "bg-gradient-to-b from-white/55 via-white/35 to-white/65"
        )}
      />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pt-16 sm:pt-14">

        {/* ===== TITLE ===== */}
        <div className="text-center mb-10">
          <h1 className={cx(
            "text-4xl md:text-5xl font-bold tracking-tight",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Client Application Portal
          </h1>
          <p className={cx(
            "mt-3 text-base md:text-lg",
            isDark ? "text-white/70" : "text-slate-700"
          )}>
            {/* Secure online onboarding for Asha Securities clients */}
          </p>
        </div>

        {/* ===== ACTION CARDS ===== */}
        <div className="space-y-5">
          <ActionCard
            subtitle="Start Apply"
            title="Local Application"
            // desc="For Sri Lankan residents. Create a new Local Individual or Local Corporate application."
            icon={<IconPerson />}
            isDark={isDark}
            onClick={() => navigate("/apply/local")}
          />

          <ActionCard
            subtitle="Start Apply"
            title="Foreign Application"
            // desc="For international applicants. Create a new Foreign Individual or Foreign Corporate application."
            icon={<IconPin />}
            isDark={isDark}
            onClick={() => navigate("/apply/foreign")}
          />

          <ActionCard
            subtitle="Update"
            title="Open an Existing Application"
            desc="Edit using your Submission ID and Edit Token."
            icon={<IconDoc />}
            isDark={isDark}
            onClick={() => navigate("/update")}
          />
        </div>

        {/* ===== GUIDELINES ===== */}
        <details className="group mt-8">
          <summary
            className={cx(
              "cursor-pointer rounded-full px-6 py-4",
              "backdrop-blur-xl",
              isDark
                ? "bg-white/8 border border-white/15"
                : "bg-white/70 border border-black/10",
              "shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
              "font-semibold flex items-center justify-between transition",
              isDark ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-white/85"
            )}
          >
            <span className="flex items-center gap-3">
              <IconChevron />
              Guidelines 
            </span>
            {/* <span className={cx("text-sm", isDark ? "text-white/70" : "text-slate-700")}>
              {guidelines.length} items 
            </span> */}
          </summary>

          <div
            className={cx(
              "mt-4 rounded-3xl backdrop-blur-xl p-6",
              isDark ? "bg-white/8 border border-white/12" : "bg-white/70 border border-black/10"
            )}
          >
            <div className={cx("text-sm leading-relaxed space-y-2", isDark ? "text-white/80" : "text-slate-800")}>
              {guidelines.map((g, i) => (
                <p key={i}>• {g}</p>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
