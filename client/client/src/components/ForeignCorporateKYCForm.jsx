import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import PhoneInput from "./PhoneInput.jsx";
import FileUpload from "./FileUpload.jsx";

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
      </div>
      <div className="mt-5 space-y-6">{children}</div>
    </div>
  );
}

function Grid2({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function ColSpan2({ children }) {
  return <div className="md:col-span-2">{children}</div>;
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{subtitle}</div> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChoiceGrid({ options, value, onChange, multi = false }) {
  const isActive = (opt) => (multi ? (value || []).includes(opt) : value === opt);

  const toggle = (opt) => {
    if (!multi) return onChange(opt);
    const cur = Array.isArray(value) ? value : [];
    if (cur.includes(opt)) onChange(cur.filter((x) => x !== opt));
    else onChange([...cur, opt]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={[
            "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
            isActive(opt)
              ? "border-zinc-300 bg-white text-zinc-900 dark:border-white/20 dark:bg-white/10 dark:text-white"
              : "border-zinc-200 bg-white/70 text-zinc-800 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300 dark:hover:bg-white/5",
          ].join(" ")}
        >
          <span
            className={[
              // Light-mode: show a clear tick mark (no filled color)
              "relative h-4 w-4 rounded-md border flex items-center justify-center",
              isActive(opt)
                ? "border-zinc-500 bg-transparent dark:border-white/30 dark:bg-transparent"
                : "border-zinc-400 bg-transparent dark:border-zinc-700",
            ].join(" ")}
            aria-hidden="true"
          >
            {isActive(opt) ? (
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-zinc-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : null}
          </span>
          <span className="leading-snug">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function YesNo({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      {["Yes", "No"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={[
            "rounded-2xl border px-4 py-2 text-sm transition",
            value === v
              ? "border-zinc-500 bg-zinc-100 text-zinc-900 ring-2 ring-black/10 dark:border-white/30 dark:bg-white/15 dark:text-white dark:ring-white/10"
              : "border-zinc-200 bg-white/70 text-zinc-800 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300 dark:hover:bg-white/5",
          ].join(" ")}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export default function ForeignCorporateKYCForm({
  form,
  update,
  busy,

  // OPTIONAL: old upload (keep if you still want it)
  kycDocs,
  setKycDocs,

  // NEW uploads (as per Word)
  authorizedSignatorySig,
  setAuthorizedSignatorySig,
  certifyingOfficerSig,
  setCertifyingOfficerSig,
  investmentAdvisorSig,
  setInvestmentAdvisorSig,
}) {
  const reg = form?.fcClientRegistration || {};
  const data = form?.fcKyc || {};

  const cds = data.cds || { prefix: "MSB", number: "" };
  const auth = data.authorizedPerson || {};

  const investmentOptions = [
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

  const sourceOptions = [
    "Business Ownership",
    "Business Turnover",
    "Investments",
    "Contract Proceeds",
    "Investment Proceeds / Savings",
    "Sale of Property/ Assets",
    "Gifts",
    "Donations / Charities (Local / Foreign)",
    "Commission Income",
    "Export proceeds",
    "Profits",
    "Others (Specify)",
  ];

  return (
    <div className="space-y-8">
      <Card title="KNOW YOUR CUSTOMER (KYC) PROFILE">
        {/* Top row (Name + CDS) */}
        <Section title="Basic Information">
          <Grid2>
            <Field label="Name Of the Company">
              <Input
                    path={"fcClientRegistration.companyName"}
                value={reg.companyName || ""}
                onChange={(e) => update("fcClientRegistration.companyName", e.target.value)}
                disabled={busy}
                placeholder="Enter Name Of the Company"
              />
            </Field>

            <div>
              <div className="text-xs font-medium text-zinc-700 mb-2 dark:text-zinc-300">CDS A/C No</div>
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <Input
                    path={"fcKyc.cds.prefix"}
                  value={cds.prefix || "MSB"}
                  onChange={(e) => update("fcKyc.cds.prefix", e.target.value)}
                  disabled={busy}
                  placeholder="MSB"
                />
                <Input
                    path={"fcKyc.cds.number"}
                  value={cds.number || ""}
                  onChange={(e) => update("fcKyc.cds.number", e.target.value)}
                  disabled={busy}
                  placeholder="Enter CDS A/C No"
                />
              </div>
            </div>

            <ColSpan2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                In instances where the Securities Account will be maintained through a Custodian Bank,
                it is not mandatory to complete this Form 2A.
              </p>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                We declare that the information set out below is true and accurate and our investments
                will be in accordance with such information.
              </p>
            </ColSpan2>
          </Grid2>
        </Section>

        {/* 1 Nature */}
        <Section title="1. Nature of the Business (Product / Service provided)">
          <Field label="">
            <Input
                    path={"fcKyc.natureOfBusiness"}
              value={data.natureOfBusiness || ""}
              onChange={(e) => update("fcKyc.natureOfBusiness", e.target.value)}
              disabled={busy}
              placeholder="Enter Nature of the Business (Product/ Service provided)"
            />
          </Field>
        </Section>

        {/* 2 Investment value */}
        <Section title="2. Expected value of Investment per annum">
          <ChoiceGrid
            options={investmentOptions}
            value={data.expectedInvestmentPerAnnum || ""}
            onChange={(v) => update("fcKyc.expectedInvestmentPerAnnum", v)}
          />
        </Section>

        {/* 3 Source of funds */}
        <Section title="3. Source of funds">
          <ChoiceGrid
            options={sourceOptions}
            value={data.sourceOfFunds || []}
            onChange={(v) => update("fcKyc.sourceOfFunds", v)}
            multi
          />

          {(data.sourceOfFunds || []).includes("Others (Specify)") ? (
            <div className="mt-4">
              <Field label="Others (Specify)">
                <Input
                    path={"fcKyc.sourceOfFundsOther"}
                  value={data.sourceOfFundsOther || ""}
                  onChange={(e) => update("fcKyc.sourceOfFundsOther", e.target.value)}
                  disabled={busy}
                  placeholder="Specify other source of funds"
                />
              </Field>
            </div>
          ) : null}
        </Section>

        {/* 4 FATCA */}
        <Section title="4. Are you a US Person in terms of FATCA of the US?">
          <Grid2>
            <div>
              <div className="text-xs font-medium text-zinc-700 mb-2 dark:text-zinc-300">Select</div>
              <YesNo
                value={data.fatcaUsPerson || ""}
                onChange={(v) => update("fcKyc.fatcaUsPerson", v)}
              />
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If yes, FATCA declaration has to be submitted along with application form. If No, in the
              event if/We become a US person under FATCA of US, I/We do hereby undertake to inform the
              said fact to the Participant immediately.
            </div>

            {data.fatcaUsPerson === "Yes" ? (
              <ColSpan2>
                <Field label="If 'Yes' please clarify">
                  <textarea
                    className="w-full rounded-2xl border px-3 py-2 text-sm outline-none transition min-h-[100px] border-zinc-300 bg-white/80 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/10"
                    value={data.fatcaClarify || ""}
                    onChange={(e) => update("fcKyc.fatcaClarify", e.target.value)}
                    disabled={busy}
                    placeholder="Clarify FATCA details..."
                  />
                </Field>
              </ColSpan2>
            ) : null}
          </Grid2>
        </Section>

        {/* 5 PEP */}
        <Section title="5. Politically Exposed Persons (PEPs)">
          <Grid2>
            <div>
              <div className="text-xs font-medium text-zinc-700 mb-2 dark:text-zinc-300">Select</div>
              <YesNo value={data.pep || ""} onChange={(v) => update("fcKyc.pep", v)} />
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Do you have persons who are or have been entrusted domestically / internationally with a
              prominent public function (Heads of State/government, senior politicians, senior govt,
              judicial/military officials, senior executives of SOEs, party officials), or equivalent
              functions?
            </div>

            {data.pep === "Yes" ? (
              <ColSpan2>
                <Field label="If 'Yes' please clarify">
                  <textarea
                    className="w-full rounded-2xl border px-3 py-2 text-sm outline-none transition min-h-[100px] border-zinc-300 bg-white/80 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/10"
                    value={data.pepClarify || ""}
                    onChange={(e) => update("fcKyc.pepClarify", e.target.value)}
                    disabled={busy}
                    placeholder="Clarify PEP details..."
                  />
                </Field>
              </ColSpan2>
            ) : null}
          </Grid2>
        </Section>

        {/* 6 Connected businesses */}
        <Section title="6. Any other connected Businesses / Professional activities">
          <Field label="">
            <Input
                    path={"fcKyc.connectedBusinesses"}
              value={data.connectedBusinesses || ""}
              onChange={(e) => update("fcKyc.connectedBusinesses", e.target.value)}
              disabled={busy}
              placeholder="Enter details"
            />
          </Field>
        </Section>

        {/* 7 Authorized person */}
        <Section title="7. Person(s) authorized to give instructions to the Participant (Stockbroker/Custodian Bank)">
          <Grid2>
            <Field label="Name/s">
              <Input
                    path={"fcKyc.authorizedPerson.names"}
                value={auth.names || ""}
                onChange={(e) => update("fcKyc.authorizedPerson.names", e.target.value)}
                disabled={busy}
                placeholder="Enter Names"
              />
            </Field>

            <Field label="Designation">
              <Input
                    path={"fcKyc.authorizedPerson.designation"}
                value={auth.designation || ""}
                onChange={(e) => update("fcKyc.authorizedPerson.designation", e.target.value)}
                disabled={busy}
                placeholder="Enter Designation"
              />
            </Field>

            <Field label="Telephone">
              <PhoneInput
                    path={"fcKyc.authorizedPerson.telephone"} value={auth.telephone || ""} onChange={(v) => update("fcKyc.authorizedPerson.telephone", v)} />
            </Field>

            <Field label="Fax">
              <Input
                    path={"fcKyc.authorizedPerson.fax"}
                value={auth.fax || ""}
                onChange={(e) => update("fcKyc.authorizedPerson.fax", e.target.value)}
                disabled={busy}
                placeholder="Enter Fax"
              />
            </Field>

            <Field label="Mobile/s">
              <PhoneInput
                    path={"fcKyc.authorizedPerson.mobiles"} value={auth.mobiles || ""} onChange={(v) => update("fcKyc.authorizedPerson.mobiles", v)} />
            </Field>

            <Field label="Email">
              <Input
                    path={"fcKyc.authorizedPerson.email"}
                type="email"
                value={auth.email || ""}
                onChange={(e) => update("fcKyc.authorizedPerson.email", e.target.value)}
                disabled={busy}
                placeholder="Enter Email"
              />
            </Field>
          </Grid2>
        </Section>

        {/* 8 Remarks */}
        <Section title="8. Other remarks / notes (if any)">
          <textarea
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/30 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20 min-h-[100px]"
            value={data.remarks || ""}
            onChange={(e) => update("fcKyc.remarks", e.target.value)}
            disabled={busy}
            placeholder="Enter remarks / notes"
          />
        </Section>

        {/* Bottom signatures */}
        <Section title="Signatures">
          <Grid2>
            <Field label="Authorized Signatory">
              <FileUpload
                label="Choose File"
                file={authorizedSignatorySig}
                setFile={setAuthorizedSignatorySig}
              />
            </Field>

            <Field label="Signature of the Certifying Officer">
              <FileUpload
                label="Choose File"
                file={certifyingOfficerSig}
                setFile={setCertifyingOfficerSig}
              />
            </Field>

            <Field label="Signature of the Investment Advisor">
              <FileUpload
                label="Choose File"
                file={investmentAdvisorSig}
                setFile={setInvestmentAdvisorSig}
              />
            </Field>

            {/* OPTIONAL: keep your previous upload slot if you still want */}
            {/* {setKycDocs ? (
              <ColSpan2>
                <div className="mt-2 rounded-2xl border border-zinc-800/80 bg-zinc-950/20 p-5">
                  <div className="text-sm font-semibold text-zinc-100">Upload - Supporting KYC Documents (Optional)</div>
                  <div className="mt-4">
                    <FileUpload label="Upload file" file={kycDocs} setFile={setKycDocs} />
                    <p className="mt-2 text-xs text-zinc-400">
                      Attach any additional supporting documents if needed.
                    </p>
                  </div>
                </div>
              </ColSpan2>
            ) : null} */}
          </Grid2>
        </Section>
      </Card>
    </div>
  );
}
