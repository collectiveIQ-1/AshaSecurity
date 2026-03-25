import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import { Select } from "./Select.jsx";
import FileUpload from "./FileUpload.jsx";
import { isValidSriLankaNIC } from "../lib/validateNic.js";
import { useFormErrors } from "../forms/FormErrorContext.jsx";



function Button({ children, onClick, disabled, variant = "primary", type = "button" }) {
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

function Divider() {
  return <div className="h-px bg-zinc-800 my-6" />;
}

function CheckRow({ checked, onChange, label, path }) {
  const errors = useFormErrors();
  const hasError = !!(path && errors && errors[path]);
  return (
    <label
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3",
        hasError
          ? "border-2 border-orange-500/80 bg-orange-50/60 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:bg-orange-500/10 dark:border-orange-400/70"
          : "border-zinc-800 bg-zinc-950/30",
      ].join(" ")}
      data-path={path || undefined}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-zinc-200 text-sm">{label}</span>
    </label>
  );
}

export default function BeneficialOwnershipForm({
  form,
  update,
  busy,
  onPrev,
  onNext,
  boDocs,
  setBoDocs,
  boFiSeal,
  setBoFiSeal,
}) {
  const data = form?.beneficialOwnership || {};
  const owners = Array.isArray(data.beneficialOwners) ? data.beneficialOwners : [];

  const addOwner = () =>
    update("beneficialOwnership.beneficialOwners", [
      ...owners,
      {
        name: "",
        nicOrPassport: "",
        dob: "",
        currentAddress: "",
        sourceOfBeneficialOwnership: "",
        pep: "",
      },
    ]);

  const removeOwner = (i) =>
    update(
      "beneficialOwnership.beneficialOwners",
      owners.filter((_, idx) => idx !== i)
    );

  const decl = data.declaration || {};
    const statusIs = !!decl.isBeneficialOwner;
    const statusIsNot = !!decl.isNotBeneficialOwner;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-6">
        <div className="text-xl font-semibold text-center">BENEFICIAL OWNERSHIP FORM</div>

        {/* ===== Beneficial Owners (repeat) ===== */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-base font-semibold">Beneficial Owner(s)</div>
          <Button disabled={busy} variant="ghost" onClick={addOwner}>
            + Add Beneficial Owner
          </Button>
        </div>

        <div className="mt-4 space-y-6">
          {owners.map((o, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-200">Beneficial Owner {i + 1}</div>
                {owners.length > 1 ? (
                  <button
                    type="button"
                    className="text-xs text-zinc-400 hover:text-white"
                    onClick={() => removeOwner(i)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Name">
                  <Input
                    path={`beneficialOwnership.beneficialOwners.${i}.name`}
                    value={o.name || ""}
                    onChange={(e) => update(`beneficialOwnership.beneficialOwners.${i}.name`, e.target.value)}
                    placeholder="Enter Name"
                    disabled={busy}
                  />
                </Field>

                <Field label="NIC or Passport (Country of Issue/Country of Citizenship)">
                  <Input
                    path={`beneficialOwnership.beneficialOwners.${i}.nicOrPassport`}
                    value={o.nicOrPassport || ""}
                    onChange={(e) => update(`beneficialOwnership.beneficialOwners.${i}.nicOrPassport`, e.target.value)}
                    placeholder="Enter NIC or Passport"
                    disabled={busy}
                  />
                </Field>

                <Field label="DOB">
                  <Input
                    path={`beneficialOwnership.beneficialOwners.${i}.dob`}
                    type="date"
                    value={o.dob || ""}
                    onChange={(e) => update(`beneficialOwnership.beneficialOwners.${i}.dob`, e.target.value)}
                    disabled={busy}
                  />
                </Field>

                <Field label="Current Address">
                  <Input
                    path={`beneficialOwnership.beneficialOwners.${i}.currentAddress`}
                    value={o.currentAddress || ""}
                    onChange={(e) => update(`beneficialOwnership.beneficialOwners.${i}.currentAddress`, e.target.value)}
                    placeholder="Enter Current Address"
                    disabled={busy}
                  />
                </Field>

                <Field
                  label="Source of Beneficial Ownership (1 - Equity indicate%) (2 - Effective Control) (3 - Person on whose behalf account is operated)"
                >
                  <Input
                    path={`beneficialOwnership.beneficialOwners.${i}.pep`}
                    value={o.sourceOfBeneficialOwnership || ""}
                    onChange={(e) =>
                      update(`beneficialOwnership.beneficialOwners.${i}.sourceOfBeneficialOwnership`, e.target.value)
                    }
                    placeholder="Enter Source of Beneficial Ownership"
                    disabled={busy}
                  />
                </Field>

                <Field label="Select Yes or No if Politically Exposed Person (PEP)*">
                  <Select
                    path={`beneficialOwnership.beneficialOwners.${i}.pep`}
                    value={o.pep || ""}
                    onChange={(e) => update(`beneficialOwnership.beneficialOwners.${i}.pep`, e.target.value)}
                    disabled={busy}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Select>
                </Field>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ===== Authorized customer to act ===== */}
        <div className="text-base font-semibold">Details of the Customer Authorized to Act on Behalf of Entity</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name">
            <Input
                    path={"beneficialOwnership.authorizedCustomer.name"}
              value={data.authorizedCustomer?.name || ""}
              onChange={(e) => update("beneficialOwnership.authorizedCustomer.name", e.target.value)}
              placeholder="Enter Name"
              disabled={busy}
            />
          </Field>

          <Field label="NIC/Passport">
            <Input
                    path={"beneficialOwnership.authorizedCustomer.nicOrPassport"}
              value={data.authorizedCustomer?.nicOrPassport || ""}
              onChange={(e) => update("beneficialOwnership.authorizedCustomer.nicOrPassport", e.target.value)}
              placeholder="Enter NIC/Passport"
              disabled={busy}
            />
          </Field>

          <Field label="Date of Birth">
            <Input
                    path={"beneficialOwnership.authorizedCustomer.dob"}
              type="date"
              value={data.authorizedCustomer?.dob || ""}
              onChange={(e) => update("beneficialOwnership.authorizedCustomer.dob", e.target.value)}
              disabled={busy}
            />
          </Field>

          <div className="md:col-span-1">
            <FileUpload
              label="Signature"
              accept="image/*,.pdf"
              file={boDocs}
              setFile={setBoDocs}
            />
          </div>
        </div>

        <div className="mt-2 text-xs text-zinc-400">
          ( By signing you attest to the veracity of all information contained herein and you acknowledge and understand the above warning )
        </div>

        <div className="mt-4">
          <Field label="Verification of Beneficial Ownership">
            <textarea
              className="w-full min-h-[90px] rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white dark:placeholder:text-zinc-500 dark:focus:ring-white/20"
              value={data.verificationText || ""}
              onChange={(e) => update("beneficialOwnership.verificationText", e.target.value)}
              placeholder=""
              disabled={busy}
            />
          </Field>
        </div>

        <Divider />

        {/* ===== Authorized Financial Institution Official ===== */}
        <div className="text-base font-semibold">Authorized Financial Institution Official</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name">
            <Input
                    path={"beneficialOwnership.afiOfficial.name"}
              value={data.afiOfficial?.name || ""}
              onChange={(e) => update("beneficialOwnership.afiOfficial.name", e.target.value)}
              placeholder="Enter Name"
              disabled={busy}
            />
          </Field>

          <Field label="NIC/Passport">
            <Input
                    path={"beneficialOwnership.afiOfficial.nicOrPassport"}
              value={data.afiOfficial?.nicOrPassport || ""}
              onChange={(e) => update("beneficialOwnership.afiOfficial.nicOrPassport", e.target.value)}
              placeholder="Enter NIC/Passport"
              disabled={busy}
            />
          </Field>

          <Field label="Date of Birth">
            <Input
                    path={"beneficialOwnership.afiOfficial.dob"}
              type="date"
              value={data.afiOfficial?.dob || ""}
              onChange={(e) => update("beneficialOwnership.afiOfficial.dob", e.target.value)}
              disabled={busy}
            />
          </Field>

          <div className="md:col-span-1">
            <FileUpload
              label="Signature and Seal"
              accept="image/*,.pdf"
              file={boFiSeal}
              setFile={setBoFiSeal}
            />
          </div>
        </div>

        <div className="mt-2 text-xs text-zinc-400">
          ( by signing, you attest that you have identified the Customer whose signature is on this form and have witnessed said signature )
        </div>

        <Divider />

        {/* ===== Declaration of Beneficial Ownership ===== */}
        <div className="text-sm text-zinc-400"><b>APPENDIX I - Beneficial Ownership Form</b></div><br></br>
        <div className="mt-2 text-lg font-semibold text-center">Declaration of Beneficial Ownership</div>

        <div className="mt-3 text-xs text-zinc-400 leading-relaxed">
          This form has been issued under the Customer Due Diligence Rule No 1 of 2016 issued in terms of the Section 23 of the Financial Transactions Reporting Act of 2006. This form or an approved equivalent is required to be completed by all customers of financial institutions designated under the Acts to the best of their knowledge. The original completed and signed and witnessed version of this form must be retained by the financial institution and available to the competent authorities upon request.
        </div>

        <div className="mt-5 text-sm font-semibold text-zinc-200">Customer Identification:</div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name (Natural Person Opening Account)">
            <Input
                    path={"beneficialOwnership.declaration.naturalPersonName"}
              value={data.declaration?.naturalPersonName || ""}
              onChange={(e) => update("beneficialOwnership.declaration.naturalPersonName", e.target.value)}
              disabled={busy}
            />
          </Field>

          <Field label="Designation (Natural Person Opening Account)">
            <Input
                    path={"beneficialOwnership.declaration.naturalPersonDesignation"}
              value={data.declaration?.naturalPersonDesignation || ""}
              onChange={(e) => update("beneficialOwnership.declaration.naturalPersonDesignation", e.target.value)}
              disabled={busy}
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Field label="Name of Legal person or Which the Account is Being Opened">
              <Input
                    path={"beneficialOwnership.declaration.legalPersonName"}
                value={data.declaration?.legalPersonName || ""}
                onChange={(e) => update("beneficialOwnership.declaration.legalPersonName", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field label="Reg. No.">
              <Input
                    path={"beneficialOwnership.declaration.legalPersonRegNo"}
                value={data.declaration?.legalPersonRegNo || ""}
                onChange={(e) => update("beneficialOwnership.declaration.legalPersonRegNo", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field label="Address">
              <Input
                    path={"beneficialOwnership.declaration.legalPersonAddress"}
                value={data.declaration?.legalPersonAddress || ""}
                onChange={(e) => update("beneficialOwnership.declaration.legalPersonAddress", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Field label="Name of legal arrangement for Which the Account is Being Opened">
              <Input
                    path={"beneficialOwnership.declaration.arrangementName"}
                value={data.declaration?.arrangementName || ""}
                onChange={(e) => update("beneficialOwnership.declaration.arrangementName", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
          <div className="md:col-span-3">
            <Field label="Deed No.">
              <Input
                    path={"beneficialOwnership.declaration.arrangementDeedNo"}
                value={data.declaration?.arrangementDeedNo || ""}
                onChange={(e) => update("beneficialOwnership.declaration.arrangementDeedNo", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
          <div className="md:col-span-3">
            <Field label="Trustee">
              <Input
                    path={"beneficialOwnership.declaration.arrangementTrustee"}
                value={data.declaration?.arrangementTrustee || ""}
                onChange={(e) => update("beneficialOwnership.declaration.arrangementTrustee", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
          <div className="md:col-span-3">
            <Field label="Address">
              <Input
                    path={"beneficialOwnership.declaration.arrangementAddress"}
                value={data.declaration?.arrangementAddress || ""}
                onChange={(e) => update("beneficialOwnership.declaration.arrangementAddress", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 text-sm text-zinc-300">I declare that I</div>
        <div className="mt-3 space-y-2">
          <CheckRow
            checked={statusIs}
            onChange={(v) => update("beneficialOwnership.declaration.isBeneficialOwner", v)}
            path={"beneficialOwnership.declaration.isBeneficialOwner"}
            label="I am the beneficial owner of the customer for this account."
          />
          <CheckRow
            checked={statusIsNot}
            onChange={(v) => update("beneficialOwnership.declaration.isNotBeneficialOwner", v)}
            path={"beneficialOwnership.declaration.isNotBeneficialOwner"}
            label="I am not the beneficial owner of the customer for this account. Complete identifying information for all beneficial owners that own or control 10% or more of the customer's equity, beneficial owners on whose behalf the account is being operated, and at least one person who exercises effective control of the legal entity regardless of whether such person is already listed."
          />
        </div>

        <div className="mt-4 text-xs text-zinc-400 leading-relaxed">
          * “politically exposed person” means an individual who is entrusted with prominent public functions either domestically or by a foreign country, or in an international organization and includes a Head of a State or a Government, a politician, a senior government officer, judicial officer or military officer, a senior executive of a State owned Corporation, Government or an autonomous body but does not include middle rank or junior rank individuals
        </div>

        <div className="mt-3 text-xs text-zinc-400 leading-relaxed">
          ** beneficial owner as “a natural person who ultimately owns or controls a customer or the person on whose behalf a transaction is being conducted and includes the person who exercises ultimate effective control over a person or a legal arrangement”
        </div>

        {/* <div className="mt-6">
          <Field label="Notes (optional)">
            <Input
                    path={"beneficialOwnership.notes"}
              value={data.notes || ""}
              onChange={(e) => update("beneficialOwnership.notes", e.target.value)}
              disabled={busy}
            />
          </Field>
        </div> */}
      </div>

      {/* <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onPrev} disabled={busy}>
          Back
        </Button>
        <Button onClick={onNext} disabled={busy}>
          Next
        </Button>
      </div> */}
    </div>
  );
}
