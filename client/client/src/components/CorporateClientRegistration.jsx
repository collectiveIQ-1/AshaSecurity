// CorporateClientRegistration.jsx
import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";
import PhoneInput from "../components/PhoneInput.jsx";

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

export default function CorporateClientRegistration({
  form,
  update,
  busy,
  onPrev,
  onNext,

  // uploads (optional – pass these from parent)
  director1Sig,
  setDirector1Sig,
  director2Sig,
  setDirector2Sig,
  companySeal,
  setCompanySeal,

  // optional proof (if you keep it)
  corpRegCert,
  setCorpRegCert,
}) {
  const data = form?.clientRegistration || {};
  const bank = data.bankAccountDetails || {};
  const contact = data.correspondenceContact || {};

  const office = data.officeUseOnly || {};
  const declaration = data.declaration || {};
  const certifying = data.certifyingOfficer || {};

  // Limit manually-typed dates to a 4-digit year
  // Supports both ISO (YYYY-MM-DD) and DD/MM/YYYY
  const clampYear4 = (value) => {
    if (!value) return value;
    const s = String(value);
    if (s.includes("/")) {
      const parts = s.split("/");
      if (parts[2]) parts[2] = parts[2].slice(0, 4);
      return parts.join("/").slice(0, 10);
    }
    const parts = s.split("-");
    if (parts[0]) parts[0] = parts[0].slice(0, 4);
    return parts.join("-").slice(0, 10);
  };


  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-6">
        <div className="text-center text-sm tracking-wide text-zinc-200">
          CLIENT REGISTRATION FORM (FOR COMPANIES)
        </div>

        {/* =========================
            Company Details
           ========================= */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name of Company">
            <Input path="clientRegistration.companyName"
              value={data.companyName || ""}
              onChange={(e) =>
                update("clientRegistration.companyName", e.target.value)
              }
              placeholder="Enter Name of Company"
              disabled={busy}
            />
          </Field>

          <div className="hidden md:block" />

          {/* <Field label="Tel No.(s)">
            <Input
                    path={"clientRegistration.telNos"}
              value={data.telNos || ""}
              onChange={(e) => update("clientRegistration.telNos", e.target.value)}
              placeholder="Enter Tel No"
              disabled={busy}
            />
          </Field> */}
          <Field label="Tel No.(s)">
            <PhoneInput
              value={data.telNos || ""}
              onChange={(val) => update("clientRegistration.telNos", val)}
              placeholder="Enter Tel No"
            />
          </Field>

          <Field label="Email Address">
            <Input
                    path={"clientRegistration.email"}
              type="email"
              value={data.email || ""}
              onChange={(e) => update("clientRegistration.email", e.target.value)}
              placeholder="Enter Email Address"
              disabled={busy}
            />
          </Field>

          <Field label="Fax No.(s)">
            <Input
                    path={"clientRegistration.faxNos"}
              value={data.faxNos || ""}
              onChange={(e) => update("clientRegistration.faxNos", e.target.value)}
              placeholder="Enter Fax No"
              disabled={busy}
            />
          </Field>

          <Field label="Website">
            <Input
                    path={"clientRegistration.website"}
              value={data.website || ""}
              onChange={(e) => update("clientRegistration.website", e.target.value)}
              placeholder="Enter Website"
              disabled={busy}
            />
          </Field>

          <Field label="Registered Address">
            <Input path="clientRegistration.registeredAddress"
              value={data.registeredAddress || ""}
              onChange={(e) =>
                update("clientRegistration.registeredAddress", e.target.value)
              }
              placeholder="Enter Registered Address"
              disabled={busy}
            />
          </Field>

          <Field label="Correspondence Address">
            <Input path="clientRegistration.correspondenceAddress"
              value={data.correspondenceAddress || ""}
              onChange={(e) =>
                update("clientRegistration.correspondenceAddress", e.target.value)
              }
              placeholder="Enter Correspondence Address"
              disabled={busy}
            />
          </Field>

          <Field label="Business Reg.No">
            <Input path="clientRegistration.businessRegNo"
              value={data.businessRegNo || ""}
              onChange={(e) => {
                update("clientRegistration.businessRegNo", e.target.value);
                // update("clientRegistration.regNo", e.target.value); // keep old validator happy
              }}
              placeholder="Enter Business Reg.No"
              disabled={busy}
            />
          </Field>

          <Field label="Date of Incorporation" hint="DD/MM/YYYY">
            <Input path="clientRegistration.dateOfIncorporation"
              type="date"
              value={data.dateOfIncorporation || ""}
              onChange={(e) =>
                update("clientRegistration.dateOfIncorporation", clampYear4(e.target.value))
              }
              disabled={busy}
            />
          </Field>

          <Field label="Nature of Business">
            <Input path="clientRegistration.natureOfBusiness"
              value={data.natureOfBusiness || ""}
              onChange={(e) =>
                update("clientRegistration.natureOfBusiness", e.target.value)
              }
              placeholder="Enter Nature of Business"
              disabled={busy}
            />
          </Field>
        </div>

        {/* =========================
            Bank Account Details
           ========================= */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-200">
            Bank Account Details
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Bank Name">
              <Input path="clientRegistration.bankAccountDetails.bankName"
                value={bank.bankName || ""}
                onChange={(e) =>
                  update(
                    "clientRegistration.bankAccountDetails.bankName",
                    e.target.value
                  )
                }
                placeholder="Enter Bank Name"
                disabled={busy}
              />
            </Field>

            <Field label="Branch Name">
              <Input path="clientRegistration.bankAccountDetails.branchName"
                value={bank.branchName || ""}
                onChange={(e) =>
                  update(
                    "clientRegistration.bankAccountDetails.branchName",
                    e.target.value
                  )
                }
                placeholder="Enter Branch Name"
                disabled={busy}
              />
            </Field>

            <Field label="Type of Account">
              <Input path="clientRegistration.bankAccountDetails.typeOfAccount"
                value={bank.typeOfAccount || ""}
                onChange={(e) =>
                  update(
                    "clientRegistration.bankAccountDetails.typeOfAccount",
                    e.target.value
                  )
                }
                placeholder="Enter Type Of Account"
                disabled={busy}
              />
            </Field>

            <Field label="A/C No">
              <Input path="clientRegistration.bankAccountDetails.accountNo"
                value={bank.accountNo || ""}
                onChange={(e) =>
                  update(
                    "clientRegistration.bankAccountDetails.accountNo",
                    e.target.value
                  )
                }
                placeholder="Enter A/C No"
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        {/* =========================
            Present Brokers
           ========================= */}
        <div className="mt-8">
          <Field label="Present Broker(s) If Any">
            <Input path="clientRegistration.presentBrokers"
              value={data.presentBrokers || ""}
              onChange={(e) =>
                update("clientRegistration.presentBrokers", e.target.value)
              }
              placeholder="Present Broker(s) If Any"
              disabled={busy}
            />
          </Field>
        </div>

        {/* =========================
            Signature uploads
           ========================= */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FileUpload
            label="Specimen Signature of Director 1"
            accept=".png,.jpg,.jpeg,.pdf"
            file={director1Sig}
            setFile={setDirector1Sig}
            path="lcDirector1Sig"
          />
          <FileUpload
            label="Specimen Signature of Director 2"
            accept=".png,.jpg,.jpeg,.pdf"
            file={director2Sig}
            setFile={setDirector2Sig}
            path="lcDirector2Sig"
          />
          <FileUpload
            label="Company Seal"
            accept=".png,.jpg,.jpeg,.pdf"
            file={companySeal}
            setFile={setCompanySeal}
            path="lcCompanySeal"
          />
        </div>

        {/* =========================
            Correspondences Contact
           ========================= */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-200">
            Correspondences Contact
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Correspondences Contact">
              <Input path="clientRegistration.correspondenceContact.name"
                value={contact.name || ""}
                onChange={(e) =>
                  update("clientRegistration.correspondenceContact.name", e.target.value)
                }
                placeholder="Enter Correspondences Contact"
                disabled={busy}
              />
            </Field>

            {/* <Field label="Tel No">
              <Input path="clientRegistration.correspondenceContact.telNo"
                value={contact.telNo || ""}
                onChange={(e) =>
                  update("clientRegistration.correspondenceContact.telNo", e.target.value)
                }
                placeholder="Enter Tel No"
                disabled={busy}
              />
            </Field> */}
            <Field label="Tel No">
            <PhoneInput
              value={contact.telNo || ""}
              onChange={(val) => update("clientRegistration.correspondenceContact.telNo", val)}
              placeholder="Enter Tel No"
            />
          </Field>

            <Field label="Fax No">
              <Input path="clientRegistration.correspondenceContact.faxNo"
                value={contact.faxNo || ""}
                onChange={(e) =>
                  update("clientRegistration.correspondenceContact.faxNo", e.target.value)
                }
                placeholder="Enter Fax No"
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        {/* =========================
            Office Use Only (from screenshot)
           ========================= */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="text-center text-base font-semibold text-zinc-200">
            Office Use Only
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Application Received On">
              <Input path="clientRegistration.officeUseOnly.applicationReceivedOn"
                type="date"
                value={office.applicationReceivedOn || ""}
                onChange={(e) =>
                  update("clientRegistration.officeUseOnly.applicationReceivedOn", clampYear4(e.target.value))
                }
                disabled={busy}
              />
            </Field>

            <Field label="Date">
              <Input path="clientRegistration.officeUseOnly.date"
                type="date"
                value={office.date || ""}
                onChange={(e) =>
                  update("clientRegistration.officeUseOnly.date", clampYear4(e.target.value))
                }
                disabled={busy}
              />
            </Field>

            <Field label="Advisor's Code">
              <Input path="clientRegistration.officeUseOnly.advisorsCode"
                value={office.advisorsCode || ""}
                onChange={(e) =>
                  update("clientRegistration.officeUseOnly.advisorsCode", e.target.value)
                }
                placeholder="Enter Advisor's Code"
                disabled={busy}
              />
            </Field>

            <Field label="Advisor's Signatures">
              <Input path="clientRegistration.officeUseOnly.advisorsSignatures"
                value={office.advisorsSignatures || ""}
                onChange={(e) =>
                  update("clientRegistration.officeUseOnly.advisorsSignatures", e.target.value)
                }
                placeholder="Enter Advisor's Signatures"
                disabled={busy}
              />
            </Field>
          </div>

          {/* Risk disclosure text */}
          <div className="mt-8">
            <div className="text-sm font-semibold text-zinc-200">
              Risk Of Securities Trading :
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              The price of securities fluctuates, sometimes drastically. The price of a security may move up or down,
              and may even become valueless. It is likely that losses may be incurred as a result of buying and
              selling securities.
            </p>
          </div>

          {/* Declaration by staff */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <div className="text-xs text-zinc-400 mb-2">
                Declaration by the staff,
              </div>
              <Field label="Staff Name">
                <Input path="clientRegistration.officeUseOnly.staffName"
                  value={office.staffName || ""}
                  onChange={(e) =>
                    update("clientRegistration.officeUseOnly.staffName", e.target.value)
                  }
                  placeholder="Enter Staff Name"
                  disabled={busy}
                />
              </Field>
            </div>

            <div className="text-xs leading-5 text-zinc-400">
              ( Investment Advisor ) on behalf of the Asha Philip Securities Ltd has clearly explained the risk disclosure
              statement to the client while inviting the client to read and ask questions and take independent advice
              if the client so wishes.
            </div>
          </div>

          {/* Signatures again (bottom of screenshot) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <FileUpload
              label="Signature of Director 1"
              accept=".png,.jpg,.jpeg,.pdf"
              file={director1Sig}
              setFile={setDirector1Sig}
            />
            <FileUpload
              label="Signature of Director 2"
              accept=".png,.jpg,.jpeg,.pdf"
              file={director2Sig}
              setFile={setDirector2Sig}
            />
            <FileUpload
              label="Company Seal"
              accept=".png,.jpg,.jpeg,.pdf"
              file={companySeal}
              setFile={setCompanySeal}
            />
          </div>
        </div>

        {/* =========================
            Declaration block (We ... of ... reg no ... ) from screenshot
           ========================= */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="We (Company Name)">
              <Input path="clientRegistration.companyName"
                value={data.companyName || ""}
                onChange={(e) =>
                  update("clientRegistration.companyName", e.target.value)
                }
                placeholder="Enter Company Name"
                disabled={busy}
              />
            </Field>

            <Field label="Bearing Business Registration No.">
              <Input path="clientRegistration.declaration.businessRegNo"
                value={data.businessRegNo || ""}
                onChange={(e) =>
                  (() => {
                  const v = e.target.value;
                  update("clientRegistration.declaration.businessRegNo", v);
                  update("clientRegistration.regNo", v);
                  update("clientRegistration.businessRegNo", v);
                  update("clientRegistration.businessRegNo", e.target.value);
                })()
                }
                placeholder="Enter Business Registration No."
                disabled={busy}
              />
            </Field>

            <Field label="of (Address)">
              <Input path="clientRegistration.declaration.address"
                value={declaration.address || ""}
                onChange={(e) =>
                  update("clientRegistration.declaration.address", e.target.value)
                }
                placeholder="Enter Address"
                disabled={busy}
              />
            </Field>

            <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              hereby declare that the particulars given overleaf are true and correct.
            </div>
          </div>

          {/* long paragraph area - keep editable so you can later bind exact wording from Word doc */}
          {/* <div className="mt-6">
            <Field label="Declaration Text / Notes (editable)">
              <Input path="clientRegistration.declaration.text"
                value={declaration.text || ""}
                onChange={(e) =>
                  update("clientRegistration.declaration.text", e.target.value)
                }
                placeholder="(Paste the declaration wording here if needed)"
                disabled={busy}
              />
            </Field>
          </div> */}

          <br></br>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              We undertake to operate my / our share trading account with ASHA SECURITIES LTD. ( Hereinafter referred to as BROKER ) in accordance with the Rules and Conditions given in the Colombo Stock Exchange Bought and Sold Notes and in accordance with the conditions of Sale of the Colombo Stock Exchange and other prevailing laws and regulations of Sri Lanka and in particular to the authority hereinafter granted by us to the Broker.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              In the event of our failure to settle the amounts due in respect of a share purchase, we do hereby irrevocably authorise the Broker to sell such securities involved in the default and if such proceeds are inadequate to cover the shortfall and any loss incurred by the Broker, to sell any other security in our portfolio held by the Broker in the Central Depository Systems (Pvt) Ltd, so that the full amount due to the Broker may be settled and any surplus arising on the sale of shares shall accrue to the Broker unless such surplus arise from the sale of other quoted shares deposited by the buyer as collateral with broker in which event the surplus shall be remitted to us after settlement day of the relevant sale (s).
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              The funds to be invested for the purchase of Securities through the SecuritiesAccount to be opened with the CDS will not be funds derived from any money laundering activity of funds generated through financing of terrorist or any other illegal activity.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              In the event of a variation of any information given in the CDS Form 2, Addendum to CDS Form 2(A) this declaration and other information submitted by us along with the application to open a CDS Account, we undertake to inform the CDS in writing within fourteen (14) days of such variation.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              The irrevocable authority granted hereby shall in no way effect or exempt us from any liability as stated herein towards the BROKER arising from or consequent upon any such default.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              Also we do hereby irrevocably agree that in the event of any purchase orders placed with you for the purchase of shares, we shall pay approximately 50% of the value of such purchase by a legal tender which amount shall be set off against the total amount due from us to you on the due date of settlement in respect of such purchases, and the relevant investment advisors may be incentivized by the company on such purchase and sales turnovers.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              Any delayed payments will be subject to additional interest cost on the condition and will be debited to my/our account. Interest percentage will be decided by the Broker considering the prevailing interest rates. ( not exceeding a maximum interest rate of 0.1% per day )
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              The risk disclosure statement was explained while advising independently and was invited to read and ask questions.
        </div>

        <div className="text-xs text-zinc-400 leading-5 flex items-end pb-2">
              Services provided : Online facility, Research reports.
        </div>

        </div>

        {/* =========================
            Certifying officer + date (bottom screenshot)
           ========================= */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FileUpload
              label="Signature of Director 1"
              accept=".png,.jpg,.jpeg,.pdf"
              file={director1Sig}
              setFile={setDirector1Sig}
            />
            <FileUpload
              label="Signature of Director 2"
              accept=".png,.jpg,.jpeg,.pdf"
              file={director2Sig}
              setFile={setDirector2Sig}
            />
            <FileUpload
              label="Company Seal"
              accept=".png,.jpg,.jpeg,.pdf"
              file={companySeal}
              setFile={setCompanySeal}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Name of the Certifying Officer">
              <Input path="clientRegistration.certifyingOfficer.name"
                value={certifying.name || ""}
                onChange={(e) =>
                  update("clientRegistration.certifyingOfficer.name", e.target.value)
                }
                disabled={busy}
              />
            </Field>

            <Field label="Signature of the Certifying Officer">
              <Input path="clientRegistration.certifyingOfficer.signature"
                value={certifying.signature || ""}
                onChange={(e) =>
                  update("clientRegistration.certifyingOfficer.signature", e.target.value)
                }
                disabled={busy}
              />
            </Field>

            <Field label="Date">
              <Input path="clientRegistration.certifyingOfficer.date"
                type="date"
                value={certifying.date || ""}
                onChange={(e) =>
                  update("clientRegistration.certifyingOfficer.date", e.target.value)
                }
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        {/* Optional proof upload */}
        {/* {setCorpRegCert ? (
          <div className="mt-8">
            <FileUpload
              label="Company Registration / Incorporation Proof (Optional)"
              accept=".pdf,.png,.jpg,.jpeg"
              file={corpRegCert}
              setFile={setCorpRegCert}
            />
          </div>
        ) : null} */}
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
