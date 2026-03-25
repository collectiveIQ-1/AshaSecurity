import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";
import Card from "../components/Card.jsx";

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21a8 8 0 10-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 13a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Choose() {
  const { theme } = useTheme();
  const { region } = useParams();
  const nav = useNavigate();

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${theme === 'dark' ? '/images/inCor.png' : '/images/inCorLight.png'}')` }}
    >
      {/* ✅ Overlay for readability + modern blur (theme aware) */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-sm dark:bg-black/70" />

      {/* ✅ Content above overlay */}
      <div className="relative z-10 min-h-screen">
        <div className="w-full px-6 py-14">
          {/* Header */}
          <div className="mb-10">
            <br></br>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Select Applicant Type
            </h1>
            <p className="mt-2 text-zinc-700/70 dark:text-zinc-200">
              {" "}
              <span className="font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                {region}
              </span>
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Applicant type"
              desc="Individual"
              icon={<IconUser />}
              onClick={() => nav(`/apply/${region}/individual`)}
            />
            <Card
              title="Applicant type"
              desc="Corporate"
              icon={<IconBuilding />}
              onClick={() => nav(`/apply/${region}/corporate`)}
            />
          </div>

          {/* Optional subtle hint bar (modern) */}
          {/* <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 text-sm dark:text-zinc-200 text-zinc-700/80">
            Tip: Select your applicant type to continue the onboarding process.
          </div> */}
        </div>
      </div>
    </div>
  );
}
