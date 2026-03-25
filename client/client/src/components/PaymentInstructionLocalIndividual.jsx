import { useEffect } from "react";
import FileUpload from "../components/FileUpload.jsx";
import { Input } from "../components/Input.jsx";


function InlineInput({ value, onChange, placeholder, className = "", disabled, type = "text" }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={
        "h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2 " +
        // Dark mode readability: ensure input text + placeholders are clearly visible
        "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-zinc-200/60 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-300 dark:focus:border-zinc-500 dark:focus:ring-white/10 " +
        className
      }
    />
  );
}


function normalizeDmyDate(v) {
  if (!v) return "";
  if (typeof v === "string") {
    // ISO -> dd/MM/yyyy
    const m = v.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return v; // already dd/MM/yyyy
  }

  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    const dd = String(v.getDate()).padStart(2, "0");
    const mm = String(v.getMonth() + 1).padStart(2, "0");
    const yyyy = String(v.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
  }

  if (typeof v === "object") {
    const day = v.day ?? v.dd ?? v.date ?? "";
    const month = v.month ?? v.mm ?? "";
    const year = v.year ?? v.yyyy ?? "";
    if (year && month && day) {
      const dd = String(day).padStart(2, "0");
      const mm = String(month).padStart(2, "0");
      const yyyy = String(year).padStart(4, "0");
      return `${dd}/${mm}/${yyyy}`;
    }
  }

  return "";
}



/**
 * Try to extract joint holder name(s) from clientRegistration in a safe + flexible way.
 * This supports different storage styles, without crashing if keys don’t exist.
 */
function getJointNamesFromClientRegistration(clientRegistration) {
  const cr = clientRegistration || {};

  // 1) If registration stores a single joint object
  //    ex: clientRegistration.joint = { initials/name/fullName: "..." }
  if (cr.joint && typeof cr.joint === "object") {
    const v =
      (cr.joint.fullName || cr.joint.name || cr.joint.initials || "").toString().trim();
    if (v) return v;
  }

  // 2) If registration stores joint holders as an array
  //    ex: clientRegistration.jointApplicants = [{ fullName: "A" }, { fullName: "B" }]
  const arraysToTry = ["jointApplicants", "jointHolders", "jointHolderList"];
  for (const key of arraysToTry) {
    if (Array.isArray(cr[key]) && cr[key].length) {
      const names = cr[key]
        .map((j) => (j?.fullName || j?.name || j?.initials || "").toString().trim())
        .filter(Boolean);
      if (names.length) return names.join(" / ");
    }
  }

  // 3) If registration stores joint names directly as a string
  //    ex: clientRegistration.jointHolderNames = "A / B"
  const stringsToTry = ["jointHolderNames", "jointNames", "jointApplicantsNames"];
  for (const key of stringsToTry) {
    if (typeof cr[key] === "string" && cr[key].trim()) return cr[key].trim();
  }

  // 4) If registration stores Joint1/Joint2
  //    ex: joint1Name, joint2Name OR joint1Initials, joint2Initials
  const j1 =
    (cr.joint1Name || cr.joint1FullName || cr.joint1Initials || "").toString().trim();
  const j2 =
    (cr.joint2Name || cr.joint2FullName || cr.joint2Initials || "").toString().trim();
  const list = [j1, j2].filter(Boolean);
  if (list.length) return list.join(" / ");

  return "";
}

export default function PaymentInstructionLocalIndividual({
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

  // NOTE: These must be declared BEFORE hooks that reference them.
  const principal = pi?.principal || { name: "", idNo: "" };
  const joint = pi?.joint || { name: "", idNo: "" };
  const witness = pi?.witness || { name: "", idNo: "" };

  // Client Registration data
  const cr = form?.clientRegistration || {};
  const crPrincipal = cr?.principal || {};

  // Principal values from registration
  const crInitials = (crPrincipal?.initials || "").toString().trim();
  const crCdsPrefix = (crPrincipal?.cds?.prefix || "").toString().trim();
  const crCdsNumber = (crPrincipal?.cds?.number || "").toString().trim();

  const crCdsValue =
    crCdsPrefix && crCdsNumber ? `${crCdsPrefix}${crCdsNumber}` : crCdsNumber || "";

  // ✅ Joint name(s) from registration (robust)
  const crJointNames = getJointNamesFromClientRegistration(cr);

  // 1) Auto-fill Principal Name (only if empty)
  useEffect(() => {
    if (!principal?.name && crInitials) {
      update("paymentInstruction.principal.name", crInitials);
    }
  }, [crInitials, principal?.name, update]);

  // 2) Auto-fill Principal ID/ CDS (only if empty)
  useEffect(() => {
    if (!principal?.idNo && crCdsValue) {
      update("paymentInstruction.principal.idNo", crCdsValue);
    }
  }, [crCdsValue, principal?.idNo, update]);

  // ✅ 3) Auto-fill Joint Holder/s Name (only if empty)
  useEffect(() => {
    if (!joint?.name && crJointNames) {
      update("paymentInstruction.joint.name", crJointNames);
    }
  }, [crJointNames, joint?.name, update]);

  const date = pi?.date || "";
  const option = pi?.option || "";

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="text-sm text-zinc-700 dark:text-zinc-200/90">
          <div className="w-48">
            <Input
              type="date"
              name="paymentInstructionDate"
              value={normalizeDmyDate(date)}
              onChange={(e) => update("paymentInstruction.date", e.target.value)}
              disabled={busy}
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-700 dark:text-zinc-200/90 leading-relaxed">
          Accountant,<br />
          Asha Securities Limited,<br />
          No.60, 5<sup>th</sup> Lane, Colombo - 03
        </div>

        <div className="mt-6 text-xs text-zinc-700 dark:text-zinc-200/90">Dear Sir/Madam,</div>

        <div className="mt-6 text-xs text-zinc-700 dark:text-zinc-200/90">
          I / we hereby authorise Asha Securities Limited :
        </div>

        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-300">
          ( Please choose just one option from the following three choices. )
        </div>

        <div className="mt-4 space-y-3 text-xs text-zinc-700 dark:text-zinc-200/90">
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

        <div className="mt-6 text-xs text-zinc-700 dark:text-zinc-200/90">Thank you.</div>
        <div className="mt-2 text-xs text-zinc-700 dark:text-zinc-200/90">Yours faithfully,</div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Signature of Principal Applicant</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={piPrincipalSig}
              setFile={setPiPrincipalSig}
            />
            <div className="mt-3">
              <InlineInput
                // value={principal.name}
                // onChange={(v) => update("paymentInstruction.principal.name", v)}
                value={form.clientRegistration.principal.initials}
                onChange={(v) => update("clientRegistration.principal.initials", v)}
                placeholder="Name of the Principal Applicant"
                disabled={busy}
                className="w-full"
              />
            </div>
            <div className="mt-3">
              <InlineInput
                // value={principal.idNo}
                // onChange={(v) => update("paymentInstruction.principal.idNo", v)}
                value={form.clientRegistration.principal.cds.number}
                onChange={(v) => update("clientRegistration.principal.cds.number", v)}
                placeholder="ID.No / CDS A/C No."
                disabled={busy}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Signature of Joint Applicant</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={piJointSig}
              setFile={setPiJointSig}
            />
            <div className="mt-3">
              <InlineInput
                // value={joint.name}
                value={form.clientRegistration.jointCdsInstructions.authorizeJointName}
                // onChange={(v) => update("paymentInstruction.joint.name", v)}
                onChange={(v) => update("clientRegistration.jointCdsInstructions.authorizeJointName", v)}
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
          <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Signature of Witness / Advisor</div>
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

      {/* Buttons currently commented out in your file */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={busy}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-900 dark:text-zinc-100 disabled:opacity-40"
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