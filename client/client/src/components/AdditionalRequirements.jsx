import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";

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

export default function AdditionalRequirements({
  form,
  update,
  busy,
  onPrev,
  onNext,
  additionalDocs,
  setAdditionalDocs,
}) {
  const data = form?.additionalRequirements || {};

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-6">
        {/* Title */}
        <div className="text-center">
          <div className="text-lg md:text-xl font-semibold tracking-wide">
            ADDITIONAL REQUIREMENT FOR CORPORATE BODIES
          </div>
        </div>

        {/* Content (Doc-style bullets) */}
        <div className="mt-6 text-sm text-zinc-300 leading-relaxed">
          <ul className="list-disc pl-6 space-y-4">
            <li>
              Names, Addresses, National identity card numbers and occupations of Directors as at date.
              <span className="text-zinc-400">
                {" "}
                ( If the Company is listed in a Stock exchange only the names should be given. Proof of such
                listing should be submitted in that event )
              </span>
            </li>

            <li>
              If the directors are also a company, the following information on such Director company should
              be given:
              <ol className="mt-3 list-[lower-roman] pl-6 space-y-2 text-zinc-300">
                <li>Name of the Company</li>
                <li>Date of Incorporation</li>
                <li>Place of Incorporation</li>
                <li>Registered Address</li>
              </ol>
            </li>

            <li>
              Names, NIC and address of top 10 share holders list as at date.
              <span className="text-zinc-400">
                {" "}
                ( Not applicable if the Company is listed in Stock Exchange. )
              </span>
            </li>

            <li>
              Name of person/s authorized to give instructions with a copy of the Power of Attorney or board
              resolution
            </li>

            <li>
              Certified Copies of the following documents
              <ol className="mt-3 list-decimal pl-6 space-y-2 text-zinc-300">
                <li>Memorandum &amp; Articles of Association or corresponding Document.</li>
                <li>Certificate of Incorporation</li>
                <li>Certified extract of the resolution to open the CDS account</li>
                <li>
                  Certified extract of the resolution to who has authorize to give instruction on behalf of
                  the company
                </li>
              </ol>
            </li>

            <li>Certified copy of letter of Commence of business</li>
          </ul>

          <div className="mt-8 text-sm font-semibold text-zinc-200">
            Certification for Non Resident Applicant
          </div>

          <ul className="mt-3 list-disc pl-6 space-y-3 text-zinc-300">
            <li>
              By the Company Registry where the documents were originally issued
              <span className="text-zinc-400"> ( applicable for Corporate bodies )</span>
            </li>
            <li>
              By a Sri Lankan diplomatic officer or Sri Lankan consular officer in the country where the
              documents were originally issued or.
            </li>
            <li>
              By a Solicitor, Attorney-at-law, Notary Public, practicing in the country where the applicant
              resides
            </li>
            <li>Proof of SIERA account details</li>
            <li>Copy of Passport of Directors</li>
          </ul>
        </div>

        {/* Optional meta fields */}
        {/* <div className="mt-10 rounded-3xl border border-zinc-800 bg-black/20 p-5">
          <div className="text-base font-semibold text-zinc-200">Office / Broker Notes (optional)</div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Requested By (optional)">
              <Input
                    path={"additionalRequirements.requestedByBroker"}
                value={data.requestedByBroker || ""}
                onChange={(e) => update("additionalRequirements.requestedByBroker", e.target.value)}
                disabled={busy}
              />
            </Field>

            <Field label="Due Date (optional)" hint="YYYY-MM-DD">
              <Input
                    path={"additionalRequirements.dueDate"}
                type="date"
                value={data.dueDate || ""}
                onChange={(e) => update("additionalRequirements.dueDate", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Notes (optional)">
              <textarea
                value={data.notes || ""}
                onChange={(e) => update("additionalRequirements.notes", e.target.value)}
                placeholder="Type additional notes here..."
                disabled={busy}
                className="w-full min-h-[110px] resize-y rounded-2xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-60"
              />
            </Field>
          </div>

          <div className="mt-6">
            <FileUpload
              label="Upload additional supporting document (optional)"
              accept=".pdf,.png,.jpg,.jpeg"
              file={additionalDocs}
              setFile={setAdditionalDocs}
            />
          </div>
        </div> */}
      </div>

      {/* Nav buttons */}
      {/* <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onPrev} disabled={busy}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={busy}>
          Next
        </Button>
      </div> */}
    </div>
  );
}
