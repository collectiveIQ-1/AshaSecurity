// src/components/Schedule1LocalIndividual.jsx
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
        " " +
        className
      }
    />
  );
}

export default function Schedule1LocalIndividual({ form, update, busy }) {
  const s1 = form?.schedule1 || {};
  const set = (path, v) => update(`schedule1.${path}`, v);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="flex flex-col gap-1">
          <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">SCHEDULE 1</div>
          <div className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">DECLARATION</div>
        </div>

        <div className="mt-6 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200/90">
          <span className="font-medium">I,</span>
          <span className="inline-block align-middle w-[18rem] max-w-full mx-2">
            <LineInput value={s1.authorizedPersonFullName} onChange={(v) => set("authorizedPersonFullName", v)} placeholder="Enter Full Name" disabled={busy} />
          </span>
          <span>(Full name of the authorized person in block letters) an employee of Asha Securities Ltd ("Stockbroker Firm"), who is duly authorized by the Board of Directors of the Stockbroker Firm to make declarations on its behalf hereby confirm that the following risks involved in investing/trading in securities listed on the Colombo Stock Exchange ("Risk Disclosure Statements") were clearly explained by me to</span>
          <span className="inline-block align-middle w-[22rem] max-w-full mx-2">
            <LineInput value={s1.clientNames} onChange={(v) => set("clientNames", v)} placeholder="Enter Name(s) of Client(s)" disabled={busy} />
          </span>
          <span>(Names of the client/s) (the Client/s) and invited the Client/s to read the below mentioned Risk Disclosure Statements, ask questions and take independent advice if the Client/s wishes to:</span>
        </div>

        <div className="mt-5 space-y-3 text-sm text-zinc-800 dark:text-zinc-200/90">
          <div className="flex gap-2"><div className="w-6 shrink-0 font-semibold">a)</div><div>The prices of securities fluctuate, sometimes drastically and the price of a security may depreciate in value and may even become valueless.</div></div>
          <div className="flex gap-2"><div className="w-6 shrink-0 font-semibold">b)</div><div>It is possible that losses may be incurred rather than profits made as a result of transacting in securities.</div></div>
          <div className="flex gap-2"><div className="w-6 shrink-0 font-semibold">c)</div><div>It is advisable to invest funds that are not required in the short term to reduce the risk of investing.</div></div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/25">
          <div className="text-sm text-zinc-800 dark:text-zinc-200/90">Signed on behalf of the Stockbroker Firm by (Name of the authorized person)</div>
          <div className="mt-2">
            <LineInput value={s1.signedBy} onChange={(v) => set("signedBy", v)} placeholder="" disabled={busy} />
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-sm text-zinc-800 dark:text-zinc-200/90"><b>Stockbroker Firm,</b></div>
            <br></br>
            <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Name</div><LineInput value={s1.name} onChange={(v) => set("name", v)} placeholder="" disabled={busy} /></div>
            <br></br>
            <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Designation</div><LineInput value={s1.designation} onChange={(v) => set("designation", v)} placeholder="" disabled={busy} /></div>
            <br></br>
            <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Date</div><Input type="date" value={s1.date || ""} onChange={(e) => set("date", e.target.value)} disabled={busy} placeholder="DD / MM / YYYY" className="bg-white/90 dark:bg-zinc-950/40" /></div>
            <br></br>
            <div><div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">NIC No</div><LineInput value={s1.nicNo} onChange={(v) => set("nicNo", v)} placeholder="" disabled={busy} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
