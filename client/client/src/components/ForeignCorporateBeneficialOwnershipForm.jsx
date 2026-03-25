import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";
import { useFormErrors } from "../forms/FormErrorContext.jsx";

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
          {/* <p className="mt-1 text-xs text-zinc-400">
            Please complete all relevant sections. Add additional beneficial owners if needed.
          </p> */}
        </div>
        {/* <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-200">
          BOF
        </span> */}
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

function OptionButtons({ value, onChange, options, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={[
            "rounded-2xl border px-3 py-2 text-sm transition",
            value === opt
              // Light mode: make selected state clearly visible (soft highlight + subtle ring)
              ? "border-zinc-400 bg-zinc-100 text-zinc-900 ring-2 ring-zinc-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:ring-0"
              : "border-zinc-200 bg-white/70 text-zinc-800 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300 dark:hover:bg-white/5",
            disabled ? "opacity-60" : "",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const emptyOwner = () => ({
  name: "",
  nicOrPassport: "",
  dob: "",
  currentAddress: "",
  sourceOfBeneficialOwnership: "",
  pep: "", // Yes / No
});

export default function ForeignCorporateBeneficialOwnershipForm({
  form,
  update,
  busy,

  // uploads
  boDocs,
  setBoDocs,

  authorizedPersonSig,
  setAuthorizedPersonSig,

  afiSignatureSeal,
  setAfiSignatureSeal,
}) {
  const errors = useFormErrors();
  const data = form?.fcBeneficialOwnership || {};

  const owners = Array.isArray(data.owners) && data.owners.length ? data.owners : [emptyOwner()];

  const auth = data.authorizedCustomer || {};
  const afi = data.afiOfficial || {};
  const appendix = data.appendix || {};

  const setOwner = (idx, key, value) => {
    update(`fcBeneficialOwnership.owners.${idx}.${key}`, value);
  };

  const addOwner = () => update("fcBeneficialOwnership.owners", [...owners, emptyOwner()]);
  const removeOwner = (idx) => {
    const next = owners.filter((_, i) => i !== idx);
    update("fcBeneficialOwnership.owners", next.length ? next : [emptyOwner()]);
  };

  return (
    <div className="space-y-8">
      <Card title="BENEFICIAL OWNERSHIP FORM">
        {/* Beneficial Owners (repeating blocks) */}
        <Section
          title="Beneficial Owners"
          subtitle="Fill details for each beneficial owner. Add more if required."
        >
          <div className="space-y-6">
            {owners.map((o, idx) => (
              <div key={idx} className="rounded-3xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Beneficial Owner #{idx + 1}
                  </div>
                  <button
                    type="button"
                    disabled={busy || owners.length <= 1}
                    onClick={() => removeOwner(idx)}
                    className="rounded-2xl border border-zinc-300 bg-white/70 px-3 py-1 text-xs text-zinc-900 hover:bg-white disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:bg-white/5"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4">
                  <Grid2>
                    <Field label="Name">
                      <Input
                        value={o.name || ""}
                        onChange={(e) => setOwner(idx, "name", e.target.value)}
                        disabled={busy}
                        placeholder="Enter Name"
                      />
                    </Field>

                    <Field label="NIC or Passport (Country of Issue/Country of Citizenship)">
                      <Input
                        value={o.nicOrPassport || ""}
                        onChange={(e) => setOwner(idx, "nicOrPassport", e.target.value)}
                        disabled={busy}
                        placeholder="Enter NIC or Passport"
                      />
                    </Field>

                    <Field label="DOB">
                      <Input
                        type="date"
                        value={o.dob || ""}
                        onChange={(e) => setOwner(idx, "dob", e.target.value)}
                        disabled={busy}
                      />
                    </Field>

                    <Field label="Current Address">
                      <Input
                        value={o.currentAddress || ""}
                        onChange={(e) => setOwner(idx, "currentAddress", e.target.value)}
                        disabled={busy}
                        placeholder="Enter Current Address"
                      />
                    </Field>

                    <ColSpan2>
                      <Field label="Source of Beneficial Ownership (1 - Equity indicate%)(2 - Effective Control)(3 - Person on whose behalf account is operated)">
                        <Input
                          value={o.sourceOfBeneficialOwnership || ""}
                          onChange={(e) =>
                            setOwner(idx, "sourceOfBeneficialOwnership", e.target.value)
                          }
                          disabled={busy}
                          placeholder="Enter Source of Beneficial Ownership"
                        />
                      </Field>
                    </ColSpan2>

                    <ColSpan2>
                      <div>
                        <div className="text-xs font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                          Select Yes or No if Politically Exposed Person (PEP) *
                        </div>
                        <OptionButtons
                          value={o.pep || ""}
                          onChange={(v) => setOwner(idx, "pep", v)}
                          disabled={busy}
                          options={["Yes", "No"]}
                        />
                      </div>
                    </ColSpan2>
                  </Grid2>
                </div>
              </div>
            ))}

            <button
              type="button"
              disabled={busy}
              onClick={addOwner}
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              + Add another Beneficial Owner
            </button>
          </div>
        </Section>

        {/* Supporting docs */}
        {/* <Section title="Supporting Documents" subtitle="Upload Beneficial Ownership supporting documents (if any).">
        </Section> */}

        {/* Authorized customer */}
        <Section title="Details of the Customer Authorized to Act on Behalf of Entity">
          <Grid2>
            <Field label="Name">
              <Input
                    path={"fcBeneficialOwnership.authorizedCustomer.name"}
                value={auth.name || ""}
                onChange={(e) => update("fcBeneficialOwnership.authorizedCustomer.name", e.target.value)}
                disabled={busy}
                placeholder="Enter Name"
              />
            </Field>

            <Field label="NIC/Passport">
              <Input path="fcBeneficialOwnership.authorizedCustomer.nicPassport"
                value={auth.nicPassport || ""}
                onChange={(e) =>
                  update("fcBeneficialOwnership.authorizedCustomer.nicPassport", e.target.value)
                }
                disabled={busy}
                placeholder="Enter NIC/Passport"
              />
            </Field>

            <Field label="Date of Birth">
              <Input
                    path={"fcBeneficialOwnership.authorizedCustomer.dob"}
                type="date"
                value={auth.dob || ""}
                onChange={(e) => update("fcBeneficialOwnership.authorizedCustomer.dob", e.target.value)}
                disabled={busy}
              />
            </Field>

            <Field label="Signature">
              <FileUpload
                label="Choose File"
                accept="image/*,.pdf"
                file={authorizedPersonSig}
                setFile={setAuthorizedPersonSig}
              />
            </Field>

            <ColSpan2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                ( By signing you attest to the veracity of all information contained herein and you acknowledge and understand the above warning )
              </p>
            </ColSpan2>
          </Grid2>
        </Section>

        {/* Verification textarea */}
        <Section title="Verification of Beneficial Ownership">
          <textarea
            className="w-full rounded-2xl border px-3 py-2 text-sm outline-none transition min-h-[110px] border-zinc-300 bg-white/80 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/10"
            value={data.verificationText || ""}
            onChange={(e) => update("fcBeneficialOwnership.verificationText", e.target.value)}
            disabled={busy}
            placeholder="Enter verification details"
          />
          <p className="text-sm text-zinc-700 dark:text-zinc-200">Authorized Financial Institution Official</p>
        </Section>

        {/* AFI official */}
        <Section title="">
          <Grid2>
            <Field label="Name">
              <Input
                    path={"fcBeneficialOwnership.afiOfficial.name"}
                value={afi.name || ""}
                onChange={(e) => update("fcBeneficialOwnership.afiOfficial.name", e.target.value)}
                disabled={busy}
                placeholder="Enter Name"
              />
            </Field>

            <Field label="NIC/Passport">
              <Input
                    path={"fcBeneficialOwnership.afiOfficial.nicPassport"}
                value={afi.nicPassport || ""}
                onChange={(e) => update("fcBeneficialOwnership.afiOfficial.nicPassport", e.target.value)}
                disabled={busy}
                placeholder="Enter NIC/Passport"
              />
            </Field>

            <Field label="Date of Birth">
              <Input
                    path={"fcBeneficialOwnership.afiOfficial.dob"}
                type="date"
                value={afi.dob || ""}
                onChange={(e) => update("fcBeneficialOwnership.afiOfficial.dob", e.target.value)}
                disabled={busy}
              />
            </Field>

            <Field label="Signature and Seal">
              <FileUpload
                label="Choose File"
                accept="image/*,.pdf"
                file={afiSignatureSeal}
                setFile={setAfiSignatureSeal}
              />
            </Field>

            <ColSpan2>
              <p className="text-xs text-zinc-400">
                ( By signing, you attest that you have identified the Customer whose signature is on this form and have witnessed said signature )
              </p>
            </ColSpan2>
          </Grid2>
        </Section>

        {/* Appendix I */}
        <Section
          title="APPENDIX I - Beneficial Ownership Form"
          // subtitle="Customer Identification & Declaration"
        >
          <center><h2>Declaration of Beneficial Ownership</h2></center>
          <br></br>
          <p className="text-xs text-zinc-400 mb-2">
            This form has been issued under the Customer Due Diligence Rue No 1 of 2016 issued in terms of the Section 23) of the Financial Transactions Reporting Act of 2006. This form or an approved equivalent is required to be completed by all customers of financial institutions designated under the Acts to the best of their knowledge. The original completed and signed and witnessed version of this form must be retained by the financial institution and available to the competent authorities upon request
          </p>
          <br></br>
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-zinc-200 mb-3">Customer Identification</div>

              <div className="text-xs text-zinc-400 mb-2">Name and Designation of Natural Person Opening Account</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    path={"fcBeneficialOwnership.appendix.naturalPersonName"}
                  value={appendix.naturalPersonName || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.naturalPersonName", e.target.value)}
                  disabled={busy}
                  placeholder="Name"
                />
                <Input path="fcBeneficialOwnership.appendix.naturalPersonDesignation"
                  value={appendix.naturalPersonDesignation || ""}
                  onChange={(e) =>
                    update("fcBeneficialOwnership.appendix.naturalPersonDesignation", e.target.value)
                  }
                  disabled={busy}
                  placeholder="Designation"
                />
              </div>

              <div className="mt-5 text-xs text-zinc-400 mb-2">
                Name, Reg. No, and Address of Legal person for Which the Account is Being Opened
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    path={"fcBeneficialOwnership.appendix.legalPersonName"}
                  value={appendix.legalPersonName || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.legalPersonName", e.target.value)}
                  disabled={busy}
                  placeholder="Name"
                />
                <Input
                    path={"fcBeneficialOwnership.appendix.legalPersonRegNo"}
                  value={appendix.legalPersonRegNo || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.legalPersonRegNo", e.target.value)}
                  disabled={busy}
                  placeholder="Reg. No"
                />
                <Input
                    path={"fcBeneficialOwnership.appendix.legalPersonAddress"}
                  value={appendix.legalPersonAddress || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.legalPersonAddress", e.target.value)}
                  disabled={busy}
                  placeholder="Address"
                />
              </div>

              <div className="mt-5 text-xs text-zinc-400 mb-2">
                Name, Deed No., Trustee and Address of legal arrangement for Which the Account is Being Opened
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    path={"fcBeneficialOwnership.appendix.arrangementName"}
                  value={appendix.arrangementName || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.arrangementName", e.target.value)}
                  disabled={busy}
                  placeholder="Name"
                />
                <Input
                    path={"fcBeneficialOwnership.appendix.arrangementDeedNo"}
                  value={appendix.arrangementDeedNo || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.arrangementDeedNo", e.target.value)}
                  disabled={busy}
                  placeholder="Deed No."
                />
                <Input
                    path={"fcBeneficialOwnership.appendix.arrangementTrustee"}
                  value={appendix.arrangementTrustee || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.arrangementTrustee", e.target.value)}
                  disabled={busy}
                  placeholder="Trustee"
                />
                <Input
                    path={"fcBeneficialOwnership.appendix.arrangementAddress"}
                  value={appendix.arrangementAddress || ""}
                  onChange={(e) => update("fcBeneficialOwnership.appendix.arrangementAddress", e.target.value)}
                  disabled={busy}
                  placeholder="Address"
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-200 mb-2">I declare that I</div>

              <div className="space-y-2">
                <label
                  className={[
                    "flex items-start gap-3 text-sm rounded-2xl px-3 py-2 border",
                    errors?.["fcBeneficialOwnership.appendix.isBeneficialOwner"]
                      ? "border-2 border-orange-500/80 bg-orange-50/60 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:bg-orange-500/10 dark:border-orange-400/70"
                      : "border-transparent text-zinc-300",
                  ].join(" ")}
                  data-path={"fcBeneficialOwnership.appendix.isBeneficialOwner"}
                >
                  <input
                    type="checkbox"
                    name="bofDeclare"
                    checked={!!appendix.isBeneficialOwner}
                    onChange={() => update("fcBeneficialOwnership.appendix.isBeneficialOwner", !appendix.isBeneficialOwner)}
                    disabled={busy}
                  />
                  <span>I am the beneficial owner of the customer for this account.</span>
                </label>

                <label
                  className={[
                    "flex items-start gap-3 text-sm rounded-2xl px-3 py-2 border",
                    errors?.["fcBeneficialOwnership.appendix.isNotBeneficialOwner"]
                      ? "border-2 border-orange-500/80 bg-orange-50/60 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:bg-orange-500/10 dark:border-orange-400/70"
                      : "border-transparent text-zinc-300",
                  ].join(" ")}
                  data-path={"fcBeneficialOwnership.appendix.isNotBeneficialOwner"}
                >
                  <input
                    type="checkbox"
                    name="bofDeclare"
                    checked={!!appendix.isNotBeneficialOwner}
                    onChange={() => update("fcBeneficialOwnership.appendix.isNotBeneficialOwner", !appendix.isNotBeneficialOwner)}
                    disabled={busy}
                  />
                  <span>
                    am not the beneficial owner ** of the customer of this account. Complete identifying information for all beneficial owners that own or control 10% or more of the customer's equity, beneficial owners on whose behall the account is being operated, and at least one person who exercises effective control of the legal entity regardless of whether such person is already listed.
                  </span>
                </label>
                <br></br>
                <span className="text-xs text-zinc-400 mb-2">
                  * politically exposed person" means an individual who is entrusted with prominent public functions either domestically or by a foreign country, or in an international organization and includes a Head of a State or a Government, a politician, a senior government officer, judicial officer or military officer, a senior executive of a State owned Corporation, Government or autonomous body but does not include middle rank or junior rank individuals
                </span>
                <br></br>
                <span className="text-xs text-zinc-400 mb-2">
                  ** beneficial owner as "a natural person who ultimately owns or controls a customer or the person on whose behalf a transaction is being conducted and includes the person who exercises ultimate effective control over a person or a legal arrangement"
                </span>
              </div>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}