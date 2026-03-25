import FileUpload from "../components/FileUpload.jsx";

function InlineInput({ value, onChange, placeholder, className = "", disabled }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={
        "h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2 " +
        "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-zinc-200/60 \n         dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-white/10 " +
        className
      }
    />
  );
}

export default function CreditFacilityAgreementLocalIndividual({
  form,
  update,
  busy,
  onPrev,
  onNext,

  // Signatures passed from Wizard (recommended)
  cfPrincipalSig,
  setCfPrincipalSig,
  cfFirmSig,
  setCfFirmSig,
  cfWitness1Sig,
  setCfWitness1Sig,
  cfWitness2Sig,
  setCfWitness2Sig,
}) {
  const cf = form?.creditFacility || {};
  const date = cf?.date || { day: "", month: "", year: "" };
  const client = cf?.client || {
    name: "",
    nicCds: "",
    address: "",
    includeTheSaid: "",
  };

  // New execution section fields
  const exec = cf?.execution || {
    name: "",
    date: "",
    month: "",
    year: "",
    witness1: { name: "", nic: "" },
    witness2: { name: "", nic: "" },
  };

  return (
    <div className="space-y-4">
      {/* Page (dark) */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          AGREEMENT - CREDIT FACILITY
        </div>

        {/* This AGREEMENT line */}
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm text-zinc-700 dark:text-zinc-200/90">
          <span>This AGREEMENT is made and entered</span>
          <span>into on this</span>

          <InlineInput
            value={date.day}
            onChange={(v) => update("creditFacility.date.day", v)}
            placeholder="Date"
            disabled={busy}
            className="w-28"
          />

          <span>day of</span>

          <InlineInput
            value={date.month}
            onChange={(v) => update("creditFacility.date.month", v)}
            placeholder="Month"
            disabled={busy}
            className="w-40"
          />

          <InlineInput
            value={date.year}
            onChange={(v) => update("creditFacility.date.year", v)}
            placeholder="Year"
            disabled={busy}
            className="w-28"
          />
        </div>

        {/* By and Between */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By and Between</div>

          <div className="mt-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-200/90">
            Asha Securities Limited a company duly incorporated under the laws of Sri Lanka and having its registered office at No. 60, 5th Lane, Colombo 03. (hereinafter referred to as "The Company") which term shall as herein used where the context so requires mean and include the said Asha Securities Limited (its successors permitted assigns) of the One Part.
          </div>

          <div className="mt-5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">AND</div>

          {/* Client line with inputs */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3 text-xs text-zinc-700 dark:text-zinc-200/90">
            <InlineInput
              value={client.name}
              onChange={(v) => update("creditFacility.client.name", v)}
              placeholder="Enter Client or Company Name"
              disabled={busy}
              className="w-64"
            />

            <span>(a company incorporated under the laws of Sri Lanka\client name) bearing NIC/CDS numbers</span>

            <InlineInput
              value={client.nicCds}
              onChange={(v) => update("creditFacility.client.nicCds", v)}
              placeholder="Bearing NIC / CDS Numbers"
              disabled={busy}
              className="w-72"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-700 dark:text-zinc-200/90">
            <span>and having its registered office/residence at No</span>

            <InlineInput
              value={client.address}
              onChange={(v) => update("creditFacility.client.address", v)}
              placeholder="Enter Address"
              disabled={busy}
              className="w-[28rem] max-w-full"
            />

            <span>(hereinafter referred to as "The Client") which term shall as herein used where the context so requires mean and include the said</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-700 dark:text-zinc-200/90">
            <span>
              which term shall as herein used where the context so requires mean and include the said
            </span>

            <InlineInput
              value={client.includeTheSaid}
              onChange={(v) => update("creditFacility.client.includeTheSaid", v)}
              placeholder=""
              disabled={busy}
              className="w-80"
            />
          </div>

          <div className="mt-2 text-xs text-zinc-700 dark:text-zinc-200/90">
            or its successors and assigns / his hers executors administrators and assigns of the Other
            Part.
          </div>

          <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
            The Company and The Client are individually referred to herein as <b>&quot;Party&quot;</b> and
            collectively as <b>&quot;Parties&quot;.</b>
          </div>

          <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
            <b>WHEREAS</b> the Colombo Stock Exchange Stock Broker Rules which are in force from 12th
            February 2012 to refrain from extending credit to the clients, without a written Agreement.
          </div>

          <br />

          <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-200/90">
            <b>THEREFORE THIS AGREEMENT WITNESSETH </b>
            and it is hereby agreed by and between the parties hereto as follows:
          </div>
        </div>

        <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>REPRESENTATIONS AND WARRANTIES</b>
          <br />
          Each of the parties represents and warrants that:
          <br /><br />
          <p>
            1. They have the legal power and authority to enter into and perform their respective
            obligations under this Agreement and that the parties have the financial capacity to
            undertake and perform their respective obligations under this Agreement;
          </p>
          <p>
            2. No litigation, arbitration, dispute or legal proceeding has been commenced or is pending
            or is threatened and no judgment or award has been given or is pending which in any way
            prejudices or restricts the power, capacity or authority of the respective parties hereto to
            perform its undertakings under this Agreement.
          </p>
        </div>

        <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>CONDITIONS OF CREDIT</b>
          <br /><br />
          <p>1. The Company shall grant credit only in instances where the credit granted is secured by listed securities.</p>
          <p>2. The Company shall not grant credit exceeding 50% of the market value of the client's pledged securities portfolio, provided however in the event that the securities pledged are less than 10% at the time they are pledged the client shall make good such shortfall by the next market day.</p>
          <p>3. If the client fails to make good such shortfall by the next market day the Company shall be entitled to sell the pledged securities and recover such shortfall.</p>
          <p>4. The Company shall not grant credit to any single client beyond the stipulated limits setout by the Securities Exchange Commission Regulation. % annually.</p>
          <p>5. Any outstanding credit payments above T+7 will be charged at an interest rate of 17.5% annually.</p>
        </div>

        <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>
            However the above rates and directions are subject to vary from time to time as per the Colombo Stock Exchange and Securities Exchange Commission regulations/guidelines and directions.
          </b>
        </div>

        <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>VARIATION AND CANCELLATION</b>
          <br />
          No agreement varying, adding to, deleting from or cancelling the Agreement shall be effective unless reduced to writing and signed by on behalf of the Parties.
        </div>

        <div className="mt-5 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>REMEDIES AND WAIVERS</b>
          <br />
          No delay or omission on the part of any Party in exercising any right, power or remedy provided by law or under this Agreement shall impair such right, power or remedy, or operate as a waiver thereof.
        </div>

        {/* ===== NEW PART (as per your screenshot) ===== */}
        <div className="mt-8 text-xs text-zinc-700 dark:text-zinc-200/90">
          <b>IN WITNESS WHEREOF</b> the said Asha Securities Limited has affixed its Common seal and the said
        </div>

        <div className="mt-3 flex items-center gap-3">
          <InlineInput
            value={exec.name}
            onChange={(v) => update("creditFacility.execution.name", v)}
            placeholder=""
            disabled={busy}
            className="w-full"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-700 dark:text-zinc-200/90">
          <span>has affixed its common seal / placed his / her signature hereunto and to one other on this</span>

          <InlineInput
            value={exec.date}
            onChange={(v) => update("creditFacility.execution.date", v)}
            placeholder="Date"
            disabled={busy}
            className="w-24"
          />

          <span>day of</span>

          <InlineInput
            value={exec.month}
            onChange={(v) => update("creditFacility.execution.month", v)}
            placeholder="Month"
            disabled={busy}
            className="w-32"
          />

          <InlineInput
            value={exec.year}
            onChange={(v) => update("creditFacility.execution.year", v)}
            placeholder="Year"
            disabled={busy}
            className="w-24"
          />
        </div>

        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Authorised Signatory of the Client</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={cfPrincipalSig}
              setFile={setCfPrincipalSig}
            />
          </div>

          <div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Authorised Signatory of the Company</div>
            <FileUpload
              label=""
              accept="image/*,.pdf"
              file={cfFirmSig}
              setFile={setCfFirmSig}
            />
          </div>
        </div>

        <br></br>
        <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Witness 1</div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InlineInput
            value={exec.witness1?.name}
            onChange={(v) => update("creditFacility.execution.witness1.name", v)}
            placeholder="Witness 1"
            disabled={busy}
          />

          <InlineInput
            value={exec.witness1?.nic}
            onChange={(v) => update("creditFacility.execution.witness1.nic", v)}
            placeholder="National ID Number"
            disabled={busy}
          />

          <FileUpload
            label="Signature"
            accept="image/*,.pdf"
            file={cfWitness1Sig}
            setFile={setCfWitness1Sig}
          />
        </div>

        <br></br>
        <div className="text-xs text-zinc-700 dark:text-zinc-200/90 mb-2">Witness 2</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InlineInput
            value={exec.witness2?.name}
            onChange={(v) => update("creditFacility.execution.witness2.name", v)}
            placeholder="Witness 2"
            disabled={busy}
          />

          <InlineInput
            value={exec.witness2?.nic}
            onChange={(v) => update("creditFacility.execution.witness2.nic", v)}
            placeholder="National ID Number"
            disabled={busy}
          />

          <FileUpload
            label="Signature"
            accept="image/*,.pdf"
            file={cfWitness2Sig}
            setFile={setCfWitness2Sig}
          />
        </div> */}

        {/* Accept checkbox */}
        {/* <label className="mt-8 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <input
            type="checkbox"
            checked={!!cf.accepted}
            onChange={(e) => update("creditFacility.accepted", e.target.checked)}
            disabled={busy}
          />
          <span className="text-sm text-zinc-200">
            I/We accept the Agreement – Credit Facility
          </span>
        </label> */}
      </div>

      {/* Footer controls */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={busy}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 disabled:opacity-40"
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
