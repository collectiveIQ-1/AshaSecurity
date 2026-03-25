import FileUpload from "../components/FileUpload.jsx";
import PhoneInput from "../components/PhoneInput.jsx";
import { useFormErrors } from "../forms/FormErrorContext.jsx";

/**
 * DirectionOnlineForm.jsx
 * Step 6 (Local -> Individual)
 * UI matches your screenshots (light form inside dark wizard).
 *
 * Writes data to:
 * form.directionOnline = {
 *   clientName, address,
 *   telephone: { home, office, mobile },
 *   email,
 *   contractNotesEmailed,
 *   cds1: { prefix, number, name },
 *   cds2: { prefix, number, name },
 *   iWe: { name, address },
 *   officeUseOnly: { userName, advisor, authorisedSignature, date },
 *   accepted
 * }
 */

function InlineInput({ value, onChange, placeholder, className = "", disabled, type = "text", path, name }) {
  const errors = useFormErrors();
  const key = path || name;
  const hasError = !!(key && errors && errors[key]);
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      data-path={key || undefined}
      className={
        "h-10 w-full rounded-xl border bg-zinc-900/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition " +
        (hasError ? " border-red-500 ring-2 ring-red-500/20 " : " border-zinc-700 ") +
        "focus:border-zinc-500 focus:ring-2 focus:ring-white/10 " +
        className
      }
    />
  );
}

function InlineSelect({ value, onChange, disabled, className = "", children }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={
        "h-10 rounded-xl border border-zinc-700 bg-zinc-900/70 px-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-white/10 " +
        className
      }
    >
      {children}
    </select>
  );
}

function Label({ children }) {
  return <div className="mb-2 text-xs font-medium text-zinc-300">{children}</div>;
}

export default function DirectionOnlineForm({
  form,
  update,
  busy,
  onPrev,
  onNext, // used as "Submit" on last step in Wizard
  onSubmit, // optional
  // Optional signature states from Wizard (uploads)
  doPrincipalSig,
  setDoPrincipalSig,
  doJointSig,
  setDoJointSig,
}) {
  const d = form?.directionOnline || {};
  const tel = d?.telephone || {};
  const cds1 = d?.cds1 || { prefix: "MSB", number: "", name: "" };
  const cds2 = d?.cds2 || { prefix: "MSB", number: "", name: "" };
  const iWe = d?.iWe || { name: "", address: "" };
  const office = d?.officeUseOnly || {
    userName: "",
    advisor: "",
    authorisedSignature: "",
    date: "",
  };

  const submitFn = onSubmit || onNext;

  return (
    <div className="space-y-4">
      {/* Dark document card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="text-center text-sm font-semibold tracking-wide text-zinc-100">
          DIRECTION ONLINE FORM &amp; AGREEMENT
        </div>

        {/* Top grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Client Name</Label>
            <InlineInput
              value={d.clientName}
              onChange={(v) => update("directionOnline.clientName", v)}
              placeholder="Enter Client Name"
              disabled={busy}
            />
          </div>

          <div>
            <Label>Address</Label>
            <InlineInput
              value={d.address}
              onChange={(v) => update("directionOnline.address", v)}
              placeholder="Enter Address"
              disabled={busy}
            />
          </div>
        </div>

        {/* Telephone + Email */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <Label>Telephone</Label>
              <div>
                <PhoneInput
                    path={"directionOnline.telephone.home"}
                  value={tel.home}
                  onChange={(v) => update("directionOnline.telephone.home", v)}
                  placeholder="Home"
                  disabled={busy}
                />
              </div>
              <br></br>
              <div>
                <PhoneInput
                    path={"directionOnline.telephone.office"}
                  value={tel.office}
                  onChange={(v) => update("directionOnline.telephone.office", v)}
                  placeholder="Office"
                  disabled={busy}
                />
              </div>
              <br></br>
              <div>
                <PhoneInput
                    path={"directionOnline.telephone.mobile"}
                  value={tel.mobile}
                  onChange={(v) => update("directionOnline.telephone.mobile", v)}
                  placeholder="Mobile"
                  disabled={busy}
                />
              </div>
              <br></br>

              <label className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={!!d.contractNotesEmailed}
                  onChange={(e) => update("directionOnline.contractNotesEmailed", e.target.checked)}
                  disabled={busy}
                />
                Contract Notes to be Emailed
              </label>
            </div>

            <div className="md:col-span-4">
              <Label>Email</Label>
              <InlineInput
                value={d.email}
                onChange={(v) => update("directionOnline.email", v)}
                path={"directionOnline.email"}
                placeholder="Enter Email"
                disabled={busy}
              />
            </div>
          </div>
        </div>

        {/* CDS rows */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Label>CDS A/C No</Label>
            <div className="flex gap-2">
              <InlineSelect
                value={cds1.prefix}
                onChange={(v) => update("directionOnline.cds1.prefix", v)}
                disabled={busy}
                className="w-20"
              >
                <option value="MSB">MSB</option>
              </InlineSelect>
              <InlineInput
                value={cds1.number}
                onChange={(v) => update("directionOnline.cds1.number", v)}
                placeholder="Enter CDS A/C No"
                disabled={busy}
              />
            </div>
          </div>

          <div>
            <Label>CDS Name</Label>
            <InlineInput
              value={cds1.name}
              onChange={(v) => update("directionOnline.cds1.name", v)}
              placeholder="Enter CDS Name"
              disabled={busy}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Label>CDS A/C No</Label>
            <div className="flex gap-2">
              <InlineSelect
                value={cds2.prefix}
                onChange={(v) => update("directionOnline.cds2.prefix", v)}
                disabled={busy}
                className="w-20"
              >
                <option value="MSB">MSB</option>
              </InlineSelect>
              <InlineInput
                value={cds2.number}
                onChange={(v) => update("directionOnline.cds2.number", v)}
                placeholder="Enter CDS A/C No"
                disabled={busy}
              />
            </div>
          </div>

          <div>
            <Label>CDS Name</Label>
            <InlineInput
              value={cds2.name}
              onChange={(v) => update("directionOnline.cds2.name", v)}
              placeholder="Enter CDS Name"
              disabled={busy}
            />
          </div>
        </div>

        {/* I/We line */}
        <div className="mt-10 text-xs text-zinc-400">I/We,</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <InlineInput
              value={iWe.name}
              onChange={(v) => update("directionOnline.iWe.name", v)}
              placeholder="Enter Name"
              disabled={busy}
            />
          </div>
          <div className="md:col-span-1 text-center text-xs text-zinc-400">of</div>
          <div className="md:col-span-6">
            <InlineInput
              value={iWe.address}
              onChange={(v) => update("directionOnline.iWe.address", v)}
              placeholder="Enter Address"
              disabled={busy}
            />
          </div>
        </div>

        {/* Agreement paragraphs */}
        <div className="mt-6 space-y-3 text-[11px] leading-relaxed text-zinc-400">
          <p>
            request you to allow me the use of Asha Securities Ltd (hereinafter referred to as &quot;ASL&quot;) Internet Trading Service
            ( hereinafter referred to as the &quot;Online Service&quot; ) and hereby agree to be bound by the terms and conditions governing such service.
          </p>
          <p>
            I/We do hereby authorise ASL to issue me/us the distinctive user identification number ( hereinafter sometimes referred to as the User ID )
            for the purpose of using the Online Service by me/us
          </p>
          <p>
            I/We do hereby undertake that the online service used solely for the purpose of operating my/our CDS account.
          </p>
          <p>
            By completing this online “Internet Trading Online Form and Agreement, I/We authorize ASL to accept or act upon all instructions or messages which purport to come from me/us and are received through the Online Service and authenticated in the manner described by ASL under the usage of password issued to me/us by ASL. Passwords shall mean original passwords confidentially generated or subsequent passwords generated and issued exclusively for me/us on my/our request. Issue shall mean the emailing of password to the address given in the Application Form.
          </p>
          <p>
            I/we will immediately bring to the notice of ASL any error, discrepancy or omission noted by me/us.
          </p>
          <p>
            If my/our securities account with ASL is a jointly held account, every holder shall be jointly and severally liable for all transactions arising from the use of Online Trading.
          </p>
          <p>
            I/We do hereby agree to change the password immediately after accessing Online Service and thereafter at regular intervals in keeping with ASL’s requirements.
          </p>
          <p>
            I/We shall inform ASL immediately if I/we become aware of any act or attempt of unauthorized use of the User ID and Password by anyone.
          </p>
          <p>
            I/we shall not attempt to effect transactions through Online Service unless sufficient funds (for purchases of securities) inclusive of other charges associated with the transaction, are available in with me/us. For the purpose of this Agreement “Sufficient Funds” shall mean, in case of a cash deposit, up to 100% of the value the proposed transactions to be effected by me/us through internet trading or otherwise and in case of the securities portfolio such percentage made available to us by ASL from time to time. I/we hereby authorize ASL at its sole discretion to sell any securities that are in my/our accounts maintained with ASL in order to recover any loss or damages that shall arise to ASL as a result of me/us trading through the Online Service without sufficient funds or any other reason whatsoever. This right of ASL shall be in addition to any other rights that shall be available to ASL under any laws or regulations including the rules and regulations of theSecurities and Exchange Commission of Sri Lanka, the Colombo Stock Exchange and the Central Depository Systems (Private) Limited.
          </p>
          <p>
            I/we hereby acknowledge that I am permitted to enter into this agreement in terms of the ASL member application signed by me whereby I/we have opened a CDS account/s with ASL and that the terms and conditions contained herein are in addition to the other documents and agreements that I have signed with ASL.
          </p>
          <p>
            I/We are fully liable and responsible for all consequences arising from or in connection with use of the Online Service services and/or access to any information or report (including market analysis information) or any other information as a result of such use by me/us or any other person whether or not authorized.
          </p>
          <p>
            ASL shall at any time be entitled to amend, supplement or vary any of these terms and conditions, at its absolute discretion with notice to me/us and such amendment, supplement or variation shall be binding on me/us.
          </p>
          <p>
            I/we do hereby agree to abide by the terms and conditions applicable to any new features/options/version updates that may be introduced by ASL subsequent to this application; upon I/we expressly registers myself/ourselves to obtain such services.
          </p>
          <p>
            The use of the Online Service shall be subject to the prevailing rules of the Securities and Exchange Commission of Sri Lanka, the Colombo Stock Exchange and the Central Depository Systems (Private) Limited and ASL, Rules and Regulations and any Terms and Conditions governing all services, facilities and transactions covered by the Online Service.
          </p>
          <p>
            I/We have read and understood the foregoing and agree to be bound by the above terms and conditions contained in this agreement.
          </p>

        </div>

        {/* <div className="mt-8 text-[11px] text-zinc-400">
          I/We have read and understood the foregoing and agree to be bound by the above terms and conditions contained in this agreement.
        </div> */}

        {/* Signatures */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            label="Signature of Principal Applicant"
            accept="image/*,.pdf"
            file={doPrincipalSig}
            setFile={setDoPrincipalSig}
          />
          <FileUpload
            label="Signature of Joint Applicant"
            accept="image/*,.pdf"
            file={doJointSig}
            setFile={setDoJointSig}
          />
        </div>

        <div className="my-10 h-px bg-zinc-800" />

        {/* Office Use Only */}
        <div className="text-center text-sm font-medium text-zinc-200">Office Use Only</div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label>User Name:</Label>
            <InlineInput
              value={office.userName}
              onChange={(v) => update("directionOnline.officeUseOnly.userName", v)}
              placeholder="Enter User Name"
              disabled={busy}
              className=""
            />
          </div>

          <div>
            <Label>Advisor:</Label>
            <InlineInput
              value={office.advisor}
              onChange={(v) => update("directionOnline.officeUseOnly.advisor", v)}
              placeholder="Enter Advisor"
              disabled={busy}
              className=""
            />
          </div>

          <div>
            <Label>Authorised Signature</Label>
            <InlineInput
              value={office.authorisedSignature}
              onChange={(v) => update("directionOnline.officeUseOnly.authorisedSignature", v)}
              placeholder="Authorised Signature"
              disabled={busy}
              className=""
            />
          </div>

          <div>
            <Label>Date</Label>
            <InlineInput
              type="date"
              value={office.date}
              onChange={(v) => update("directionOnline.officeUseOnly.date", v)}
              placeholder="mm/dd/yyyy"
              disabled={busy}
              className=""
            />
          </div>
        </div>
      </div>

      {/* Footer buttons - dark theme */}
      {/* <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={busy}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-200 disabled:opacity-40"
        >
          previous
        </button>

        <button
          type="button"
          onClick={submitFn}
          disabled={busy}
          className="rounded-2xl bg-white px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          Submit
        </button>
      </div> */}
    </div>
  );
}
