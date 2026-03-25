import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import PhoneInput from "./PhoneInput.jsx";
import { Select } from "./Select.jsx";
import FileUpload from "./FileUpload.jsx";
import { useEffect } from "react";


function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition border";
  const styles =
    variant === "ghost"
      ? "border-zinc-800 bg-transparent hover:bg-white/5 text-zinc-200"
      : "border-white/10 bg-white/10 hover:bg-white/15 text-white";
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles} ${disabled ? "opacity-60" : ""}`}
    >
      {children}
    </button>
  );
}

// simple checkbox row (matches your UI look)
function CheckRow({ label, checked, onChange, disabled }) {
  return (
    <label className="flex items-center gap-3 py-2 border-b border-white/10">
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="text-sm text-zinc-200">{label}</span>
    </label>
  );
}

// radio yes/no row
function YesNoRow({ value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-end gap-6">
      <label className="flex items-center gap-2 text-sm text-zinc-200">
        <input
          type="radio"
          name="yesno"
          checked={value === "Yes"}
          onChange={() => onChange("Yes")}
          disabled={disabled}
        />
        Yes
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-200">
        <input
          type="radio"
          name="yesno"
          checked={value === "No"}
          onChange={() => onChange("No")}
          disabled={disabled}
        />
        No
      </label>
    </div>
  );
}

export default function KYCForm({
  form,
  update,
  busy,
  onPrev,
  onNext,

  // We will use this prop as "Authorized Signatory" upload (per KYC doc)
  kycDocs,
  setKycDocs,
}) {
  const data = form?.kyc || {};
  const regCompanyName = form?.clientRegistration?.companyName || "";

  // auto-fill when KYC opens (or when registration name changes)
  useEffect(() => {
    if (!data.companyName && regCompanyName) {
      update("kyc.companyName", regCompanyName);
    }
  }, [regCompanyName]); // <-- intentionally only depends on registration value

  const expectedInvestment = Array.isArray(data.expectedInvestment)
    ? data.expectedInvestment
    : [];
  const sourceOfFunds = Array.isArray(data.sourceOfFunds) ? data.sourceOfFunds : [];

  const toggleArrayValue = (path, arr, value, on) => {
    const next = on
      ? Array.from(new Set([...arr, value]))
      : arr.filter((x) => x !== value);
    update(path, next);
  };

  // Options exactly like the document screenshot
  const expectedInvestmentOptions = [
    "Less than Rs. 100,000",
    "Rs 100,000 to Rs 500,000",
    "Rs 500,000 to Rs 1,000,000",
    "Rs 1,000,000 to Rs 2,000,000",
    "Rs 2,000,000 to Rs 3,000,000",
    "Rs 3,000,000 to Rs 4,000,000",
    "Rs 4,000,000 to Rs 5,000,000",
    "Rs 5,000,000 to Rs 10,000,000",
    "Over Rs 10,000,000",
  ];

  const sourceOfFundsOptions = [
    "Business Ownership",
    "Business Turnover",
    "Investments",
    "Contract Proceeds",
    "Investment Proceeds/ Savings",
    "Sale of Property/ Assets",
    "Gifts",
    "Donations / Charities ( Local / Foreign )",
    "Commission Income",
    "Export proceeds",
    "Profits",
    "Others ( Specify )",
  ];

  const auth = data.authorizedPersons || {};

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-6">
        <div className="text-center text-lg font-semibold">
          KNOW YOUR CUSTOMER (KYC) PROFILE
        </div>

        {/* Top: Name of Company + CDS A/C */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name Of the Company">
            <Input
                    path={"kyc.companyName"}
              value={data.companyName || ""}
              onChange={(e) => update("kyc.companyName", e.target.value)}
              placeholder="Enter Name Of the Company"
              disabled={busy}
            />
          </Field>

          <div>
            <Field label="CDS A/C No">
              <div className="flex gap-3">
                <div className="w-28">
                  <Select
                    path={"kyc.cdsPrefix"}
                    value={data.cdsPrefix || "MSB"}
                    onChange={(e) => update("kyc.cdsPrefix", e.target.value)}
                    disabled={busy}
                  >
                    <option>MSB</option>
                    <option>CDS</option>
                    <option>NB</option>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    path={"kyc.cdsAccountNo"}
                    value={data.cdsAccountNo || ""}
                    onChange={(e) => update("kyc.cdsAccountNo", e.target.value)}
                    placeholder="Enter CDS A/C No"
                    disabled={busy}
                  />
                </div>
              </div>
            </Field>
          </div>
        </div>

        {/* Doc notes */}
        <div className="mt-4 text-xs text-zinc-400 leading-5">
          In instances where the Securities Account will be maintained through a Custodian Bank,
          it is not mandatory to complete this Form 2A.
        </div>
        <div className="mt-2 text-xs text-zinc-400 leading-5">
          We declare that the information set out below is true and accurate and our investments
          will be in accordance with such information.
        </div>

        {/* 1. Nature of Business */}
        <div className="mt-8">
          <Field label="1. Nature of the Business (Product/ Service provided)">
            <Input
                    path={"kyc.natureOfBusiness"}
              value={data.natureOfBusiness || ""}
              onChange={(e) => update("kyc.natureOfBusiness", e.target.value)}
              placeholder="Enter Nature of the Business (Product/ Service provided)"
              disabled={busy}
            />
          </Field>
        </div>

        {/* 2. Expected value */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-200">
            2. Expected value of Investment per annum
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6">
            {expectedInvestmentOptions.map((opt) => (
              <CheckRow
                key={opt}
                label={opt}
                checked={expectedInvestment.includes(opt)}
                disabled={busy}
                onChange={(on) =>
                  toggleArrayValue("kyc.expectedInvestment", expectedInvestment, opt, on)
                }
              />
            ))}
          </div>
        </div>

        {/* 3. Source of funds */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-200">3. Source of funds</div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6">
            {sourceOfFundsOptions.map((opt) => (
              <CheckRow
                key={opt}
                label={opt}
                checked={sourceOfFunds.includes(opt)}
                disabled={busy}
                onChange={(on) =>
                  toggleArrayValue("kyc.sourceOfFunds", sourceOfFunds, opt, on)
                }
              />
            ))}
          </div>

          {sourceOfFunds.includes("Others (Specify)") ? (
            <div className="mt-4">
              <Field label="Others (Specify)">
                <Input
                    path={"kyc.sourceOfFundsOther"}
                  value={data.sourceOfFundsOther || ""}
                  onChange={(e) => update("kyc.sourceOfFundsOther", e.target.value)}
                  placeholder="Specify other source of funds"
                  disabled={busy}
                />
              </Field>
            </div>
          ) : null}
        </div>

        {/* 4. FATCA */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-zinc-200">
              4. Are you a US Person in terms of the Foreign Account Tax Compliance Act (FATCA) of the US?
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={(data.usPerson || "No") === "Yes"}
                  onChange={() => update("kyc.usPerson", "Yes")}
                  disabled={busy}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={(data.usPerson || "No") === "No"}
                  onChange={() => update("kyc.usPerson", "No")}
                  disabled={busy}
                />
                No
              </label>
            </div>
          </div>

          <div className="mt-2 text-xs text-zinc-400 leading-5">
            If yes, FATCA declaration has to be submitted along with application form.
            If No, in the event if I/We become a US person under FATCA of US, I/We do hereby undertake
            to inform the said fact to the Participant immediately.
          </div>
        </div>

        {/* 5. PEP */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-zinc-200">
              5. Politically Exposed Persons (PEPs)
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={(data.pep || "No") === "Yes"}
                  onChange={() => update("kyc.pep", "Yes")}
                  disabled={busy}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={(data.pep || "No") === "No"}
                  onChange={() => update("kyc.pep", "No")}
                  disabled={busy}
                />
                No
              </label>
            </div>
          </div>

          <div className="mt-2 text-xs text-zinc-400 leading-5">
            Do you have persons who are or have been entrusted domestically/ Internationally with a prominent public
            function ( for example Heads of State or of government, senior politicians, senior government, judicial or
            military officials, senior executives of state owned corporations, important political party officials ), as
            members of senior management or individuals who have been entrusted with equivalent functions, i.e. directors,
            deputy directors and members of the board or equivalent functions.
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-zinc-200">If "Yes" please clarify</div>
            <textarea
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950/30 p-3 text-sm text-zinc-200 outline-none"
              rows={3}
              value={data.pepClarify || ""}
              onChange={(e) => update("kyc.pepClarify", e.target.value)}
              disabled={busy || (data.pep || "No") !== "Yes"}
              placeholder="Enter clarification"
            />
          </div>
        </div>

        {/* 6. Other connected businesses */}
        <div className="mt-8">
          <Field label="6. Any other connected Businesses/ Professional activities">
            <Input
                    path={"kyc.connectedBusinesses"}
              value={data.connectedBusinesses || ""}
              onChange={(e) => update("kyc.connectedBusinesses", e.target.value)}
              disabled={busy}
            />
          </Field>
        </div>

        {/* 7. Authorized persons */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-200">
            7. Person(s) authorized to give instructions to the Participant ( Stockbroker/ Custodian Bank )
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name/s">
              <Input
                    path={"kyc.authorizedPersons.names"}
                value={auth.names || ""}
                onChange={(e) => update("kyc.authorizedPersons.names", e.target.value)}
                placeholder="Enter Names"
                disabled={busy}
              />
            </Field>

            <Field label="Designation">
              <Input
                    path={"kyc.authorizedPersons.designation"}
                value={auth.designation || ""}
                onChange={(e) => update("kyc.authorizedPersons.designation", e.target.value)}
                placeholder="Enter Designation"
                disabled={busy}
              />
            </Field>

            <Field label="Telephone">
              <PhoneInput
                    path={"kyc.authorizedPersons.telephone"} value={auth.telephone || ""} onChange={(v) => update("kyc.authorizedPersons.telephone", v)} />
            </Field>

            <Field label="Fax">
              <Input
                    path={"kyc.authorizedPersons.fax"}
                value={auth.fax || ""}
                onChange={(e) => update("kyc.authorizedPersons.fax", e.target.value)}
                placeholder="Enter Fax"
                disabled={busy}
              />
            </Field>

            <Field label="Mobile/s">
              <PhoneInput
                    path={"kyc.authorizedPersons.mobiles"} value={auth.mobiles || ""} onChange={(v) => update("kyc.authorizedPersons.mobiles", v)} />
            </Field>

            <Field label="Email">
              <Input
                    path={"kyc.authorizedPersons.email"}
                type="email"
                value={auth.email || ""}
                onChange={(e) => update("kyc.authorizedPersons.email", e.target.value)}
                placeholder="Enter Email"
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        {/* 8. Other remarks */}
        <div className="mt-8">
          <Field label="8. Other remarks / notes ( if any )">
            <Input
                    path={"kyc.remarks"}
              value={data.remarks || ""}
              onChange={(e) => update("kyc.remarks", e.target.value)}
              disabled={busy}
            />
          </Field>
        </div>

        {/* Bottom signatures */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FileUpload
            label="Authorized Signatory"
            accept=".pdf,.png,.jpg,.jpeg"
            file={kycDocs}
            setFile={setKycDocs}
          />

          <Field label="Signature of the Certifying Officer">
            <Input path="kyc.certifyingOfficerSignature"
              value={data.certifyingOfficerSignature || ""}
              onChange={(e) =>
                update("kyc.certifyingOfficerSignature", e.target.value)
              }
              disabled={busy}
              placeholder=""
            />
          </Field>

          <Field label="Signature of the Investment Advisor">
            <Input path="kyc.investmentAdvisorSignature"
              value={data.investmentAdvisorSignature || ""}
              onChange={(e) =>
                update("kyc.investmentAdvisorSignature", e.target.value)
              }
              disabled={busy}
              placeholder=""
            />
          </Field>
        </div>
      </div>

      {/* <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onPrev} disabled={busy}>
          previous
        </Button>
        <Button onClick={onNext} disabled={busy}>
          Next
        </Button>
      </div> */}
    </div>
  );
}
