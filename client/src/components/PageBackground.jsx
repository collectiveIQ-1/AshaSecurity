import { useTheme } from "../theme/ThemeContext.jsx";

/**
 * PageBackground
 * - Default: static image background (fast + safe)
 * - variant="video": full-screen video background with eye-catchy overlays
 */
export default function PageBackground({ children, variant = "image" }) {
  const { isDark } = useTheme();

  const overlayBase = isDark ? "bg-black/65" : "bg-slate-900/45";
  const overlayBlur = "backdrop-blur-sm";

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background */}
      {variant === "video" ? (
        <>
          {/* Fallback poster is handled by the video tag + we also keep a base image behind */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/landingBI.png')" }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/landingBI.png"
          >
            <source src="/videos/stoxiq.mp4" type="video/mp4" />
          </video>

          {/* Eye-catchy overlays */}
          {/* 1) Dark/Light tint + subtle blur */}
          <div className={`absolute inset-0 ${overlayBase} ${overlayBlur}`} />
          {/* 2) Gradient glow (adds depth) */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(1200px 600px at 20% 25%, rgba(245,73,39,0.35), transparent 60%)," +
                "radial-gradient(900px 500px at 85% 70%, rgba(59,130,246,0.22), transparent 55%)," +
                "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
            }}
            aria-hidden="true"
          />
          {/* 3) Vignette (focus to center) */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 140px rgba(0,0,0,0.65)",
            }}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/apply-bg.jpg')" }}
            aria-hidden="true"
          />
          <div className={`absolute inset-0 ${overlayBase} ${overlayBlur}`} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
