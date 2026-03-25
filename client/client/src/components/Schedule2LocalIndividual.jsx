// src/components/Schedule2LocalIndividual.jsx
import { Input } from "./Input.jsx";

function LineInput({ value, onChange, placeholder, disabled, className = "" }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={
        "w-full bg-transparent px-1 py-1 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none " +
        "border-b border-zinc-900/60 focus:border-zinc-900 focus:ring-0 " +
        "dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-200/60 dark:focus:border-zinc-200 " +
        (disabled ? " opacity-60 cursor-not-allowed" : "") +
        " " + className
      }
    />
  );
}

function RadioRow({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={
        "w-full text-left flex items-start gap-3 rounded-2xl border p-4 shadow-soft transition " +
        (checked
          ? "border-zinc-300 bg-white/90 dark:border-zinc-700 dark:bg-zinc-950/25"
          : "border-zinc-300 bg-white/90 dark:border-zinc-700 dark:bg-zinc-950/25") +
        (disabled ? " opacity-60 cursor-not-allowed" : " hover:bg-white dark:hover:bg-zinc-950/35")
      }
    >
      <span className={"mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 " + (checked ? "border-zinc-700 bg-white dark:border-zinc-200 dark:bg-zinc-950" : "border-zinc-500 bg-white dark:border-zinc-500 dark:bg-zinc-950")} aria-hidden="true">
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 dark:bg-zinc-200" /> : null}
      </span>
      <span className="text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200/90">{label}</span>
    </button>
  );
}

export default function Schedule2LocalIndividual({ form, update, busy }) {
  const s2 = form?.schedule2 || {};
  const set = (path, v) => update(`schedule2.${path}`, v);
  const option = String(s2.settlementOption || "");

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="flex flex-col gap-1">
          <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Schedule 2</div>
          <div className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">ACKNOWLEDGEMENT</div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-zinc-800 dark:text-zinc-200/90">
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,auto,1fr] gap-3 items-end">
            <div className="font-medium">I/We, (1)</div><LineInput value={s2.party1Name} onChange={(v) => set("party1Name", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">[bearing National Identity Card No./Company registration No</div><LineInput value={s2.party1Id} onChange={(v) => set("party1Id", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">of</div><LineInput value={s2.party1Add} onChange={(v) => set("party1Add", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">] ,</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,auto,1fr] gap-3 items-end">
            <div className="font-medium">(2)</div><LineInput value={s2.party2Name} onChange={(v) => set("party2Name", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">[bearing National Identity Card No./Company registration No</div><LineInput value={s2.party2Id} onChange={(v) => set("party2Id", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">of</div><LineInput value={s2.party2Add} onChange={(v) => set("party2Add", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">] ,</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,auto,1fr] gap-3 items-end">
            <div className="font-medium">(3)</div><LineInput value={s2.party3Name} onChange={(v) => set("party3Name", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">[bearing National Identity Card No./Company registration No</div><LineInput value={s2.party3Id} onChange={(v) => set("party3Id", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">of</div><LineInput value={s2.party3Add} onChange={(v) => set("party3Add", v)} placeholder="" disabled={busy} /><div className="text-xs sm:text-sm">] ,</div>
          </div>
        </div>

        <div className="mt-6 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200/90">Dear Sir/ Madam,</div>
        <div className="mt-3 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200/90">I/We hereby authorize Asha Securities Limited.</div>

        <div className="mt-6 space-y-4">
          <RadioRow checked={option === "hold_credit"} onChange={() => set("settlementOption", "hold_credit")} disabled={busy} label="To hold any credit balances in my account and to recover future payments for stocks purchased on my behalf from such credit balances." />
          <RadioRow checked={option === "settle_due"} onChange={() => set("settlementOption", "settle_due")} disabled={busy} label="Prepare the sale proceeds and purchase consideration would be settled on the due date." />
          <RadioRow checked={option === "normal"} onChange={() => set("settlementOption", "normal")} disabled={busy} label="Normal Settlement. Unless otherwise specific instructions are given by me." />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Name</div><LineInput value={s2.signatureName} onChange={(v) => set("signatureName", v)} placeholder="" disabled={busy} /></div> */}
          <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Date</div><Input type="date" value={s2.date || ""} onChange={(e) => set("date", e.target.value)} disabled={busy} placeholder="DD / MM / YYYY" className="bg-white/90 dark:bg-zinc-950/40" /></div>
        </div>
      </div>
    </div>
  );
}
