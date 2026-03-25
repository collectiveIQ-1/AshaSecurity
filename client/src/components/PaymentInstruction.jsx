import FileUpload from "../components/FileUpload.jsx";

const dmyToIso = (v) => {
  const s = String(v || "");
  const m = s.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
  if (!m) return v;
  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  const yyyy = m[3];
  return `${yyyy}-${mm}-${dd}`;
};

const isoToDmy = (v) => {
  const s = String(v || "");
  const m = s.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);
  if (!m) return v;
  return `${m[3]}/${m[2]}/${m[1]}`;
};


function InlineInput({ value, onChange, placeholder, className = "", disabled, type = "text" }) {
  return (
    <input
      type={type}
      value={type === "date" ? (dmyToIso(value) || "") : (value || "")}
      onChange={(e) => onChange(type === "date" ? isoToDmy(e.target.value) : e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={
        "h-10 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-white/10 " +
        className
      }
    />
  );
}

function normalizeDateValue(v) {
  // We store paymentInstruction.date as a string (YYYY-MM-DD) for <input type="date" />.
  // But if old drafts stored an object or Date, convert safely.
  if (!v) return "";
  if (typeof v === "string") return v;

  // JS Date
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    const yyyy = v.getFullYear();
    const mm = String(v.getMonth() + 1).padStart(2, "0");
    const dd = String(v.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // { day, month, year } object
  if (typeof v === "object") {
    const day = v.day ?? v.dd ?? v.date ?? "";
    const month = v.month ?? v.mm ?? "";
    const year = v.year ?? v.yyyy ?? "";
    if (year && month && day) {
      const yyyy = String(year).padStart(4, "0");
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  return "";
}


export default function PaymentInstruction({
  form,
  update,
  busy,
  onPrev,
  onNext,

  piPrincipalSig,
  setPiPrincipalSig,
  piJointSig,
  setPiJointSig,
  piWitnessSig,
  setPiWitnessSig,
}) {
  const pi = form?.paymentInstruction || {};
  const date = pi?.date || "";

  const principal = pi?.principal || { name: "", idNo: "" };
  const joint = pi?.joint || { name: "", idNo: "" };
  const witness = pi?.witness || { name: "", idNo: "" };

  const option = pi?.option || "";

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="text-sm text-zinc-300">
          <InlineInput
            type="date"
            value={normalizeDateValue(date)}
            onChange={(v) => update("paymentInstruction.date", v)}
            placeholder="mm/dd/yyyy"
            disabled={busy}
            className="w-48"
          />
        </div>

        <div className="mt-6 text-xs text-zinc-300/90 leading-relaxed">
          Accountant,<br />
          Asha Securities Limited,<br />
          No.60, 5<sup>th</sup> Lane, Colombo - 03
        </div>

        <div className="mt-6 text-xs text-zinc-300/90">Dear Sir/Madam,</div>

        <div className="mt-6 text-xs text-zinc-300/90">
          I / we hereby authorise Asha Securities Limited :
        </div>

        <div className="mt-2 text-xs text-zinc-400">
          ( Please choose just one option from the following three choices. )
        </div>

        <div className="mt-4 space-y-3 text-xs text-zinc-300/90">
          <label className="flex gap-2 items-start">
            <input
              type="radio"
              checked={option === "hold_credit"}
              onChange={() => update("paymentInstruction.option", "hold_credit")}
              disabled={busy}
            />
            <span>
              To hold any credit balances in my account and to recover future payments for stocks
              purchased on my behalf from such balances.
            </span>
          </label>

          <label className="flex gap-2 items-start">
            <input
              type="radio"
              checked={option === "settle_due"}
              onChange={() => update("paymentInstruction.option", "settle_due")}
              disabled={busy}
            />
            <span>
              Prepare the sale proceed and purchase consideration would be settled on the due date.
            </span>
          </label>

          <label className="flex gap-2 items-start">
            <input
              type="radio"
              checked={option === "normal"}
              onChange={() => update("paymentInstruction.option", "normal")}
              disabled={busy}
            />
            <span>
              Normal Settlement ( Unless otherwise specific instructions are given by me ).
            </span>
          </label>
        </div>

        <div className="mt-6 text-xs text-zinc-300/90">Thank you.</div>
        <div className="mt-2 text-xs text-zinc-300/90">Yours faithfully,</div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-zinc-300 mb-2">Signature of Principal Applicant</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={piPrincipalSig}
              setFile={setPiPrincipalSig}
            />
            <div className="mt-3">
              <InlineInput
                value={principal.name}
                onChange={(v) => update("paymentInstruction.principal.name", v)}
                placeholder="Name of the Principal Applicant"
                disabled={busy}
                className="w-full"
              />
            </div>
            <div className="mt-3">
              <InlineInput
                value={principal.idNo}
                onChange={(v) => update("paymentInstruction.principal.idNo", v)}
                placeholder="ID.No / CDS A/C No."
                disabled={busy}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-300 mb-2">Signature of Joint Applicant</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={piJointSig}
              setFile={setPiJointSig}
            />
            <div className="mt-3">
              <InlineInput
                value={joint.name}
                onChange={(v) => update("paymentInstruction.joint.name", v)}
                placeholder="Name of the Joint Applicant"
                disabled={busy}
                className="w-full"
              />
            </div>
            <div className="mt-3">
              <InlineInput
                value={joint.idNo}
                onChange={(v) => update("paymentInstruction.joint.idNo", v)}
                placeholder="ID.No / CDS A/C No."
                disabled={busy}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6">
          <div className="text-xs text-zinc-300 mb-2">Signature of Witness / Advisor</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={piWitnessSig}
              setFile={setPiWitnessSig}
            />

            <InlineInput
              value={witness.name}
              onChange={(v) => update("paymentInstruction.witness.name", v)}
              placeholder="Name of Witness / Advisor"
              disabled={busy}
            />

            <InlineInput
              value={witness.idNo}
              onChange={(v) => update("paymentInstruction.witness.idNo", v)}
              placeholder="ID.No of Witness / Advisor"
              disabled={busy}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={busy}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 disabled:opacity-40"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={busy}
          className="rounded-2xl bg-white text-black px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
