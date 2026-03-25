export default function Card({ title, desc, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-soft hover:bg-white transition text-zinc-900 dark:text-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:bg-zinc-900/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{title}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{desc}</div>
        </div>
        <div className="h-10 w-10 rounded-2xl grid place-items-center border border-zinc-200 bg-white/60 group-hover:bg-white text-zinc-900 dark:text-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:group-hover:bg-zinc-900/70">
          {icon}
        </div>
      </div>
      <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Click to continue →
      </div>
    </button>
  );
}
