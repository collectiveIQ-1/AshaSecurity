export default function Stepper({ steps, current, onStepClick }) {
  const canClick = typeof onStepClick === "function";

  return (
    <div className="space-y-2">
      {steps.map((s, idx) => {
        const n = idx + 1;
        const active = n === current;
        const done = n < current;

        const base =
          "w-full flex items-center justify-between rounded-2xl border transition";
        const pad = "px-3 py-2"; // compact, as requested
        const tone = active
          ? "border-zinc-900/20 bg-white/70 dark:border-white/30 dark:bg-white/10"
          : "border-zinc-200 bg-white/55 hover:bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-950/50";
        const cursor = canClick ? "cursor-pointer" : "cursor-default";

        const Wrap = canClick ? "button" : "div";
        const wrapProps = canClick
          ? {
              type: "button",
              onClick: () => onStepClick(n),
              className: [base, pad, tone, cursor, "text-left"].join(" "),
            }
          : { className: [base, pad, tone, cursor].join(" ") };

        return (
          <Wrap key={s} {...wrapProps}>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={[
                  "h-7 w-7 rounded-full grid place-items-center text-xs font-semibold shrink-0",
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : done
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-200 dark:text-black"
                    : "bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
                ].join(" ")}
              >
                {done ? "✓" : n}
              </div>

              {/*
                IMPORTANT: show full step title (no ellipsis)
                - keep Steps panel compact
                - allow wrapping to multiple lines
              */}
              <div
                className={[
                  "text-xs leading-snug whitespace-normal break-words",
                  active
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-700 dark:text-zinc-300",
                ].join(" ")}
              >
                {s}
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 dark:text-zinc-500 shrink-0">
              {active ? "Current" : ""}
            </div>
          </Wrap>
        );
      })}
    </div>
  );
}
