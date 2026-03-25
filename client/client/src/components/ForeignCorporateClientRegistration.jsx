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
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function InfoBox({ title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 dark:border-zinc-800/70 dark:bg-zinc-950/10">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>
      <div className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>
    </div>
  );
}

/** ✅ Inline sentence + inputs like the screenshot */
function InlineDeclaration({ data, update, busy }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/20">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Declaration</div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-3 text-sm text-zinc-800 dark:text-zinc-300 leading-7">
        <span>We</span>

        <div className="w-full sm:w-[240px]">
          <Input
                    path={"fcClientRegistration.companyName"}
            placeholder="Enter Company Name"
            value={data.companyName || ""}
            onChange={(e) => update("fcClientRegistration.companyName", e.target.value)}
            disabled={busy}
          />
        </div>

        <span>Bearing Business Registration No.</span>

        <div className="w-full sm:w-[240px]">
          <Input
                    path={"fcClientRegistration.businessRegNo"}
            placeholder="Enter Business Registration No."
            value={data.businessRegNo || ""}
            onChange={(e) => update("fcClientRegistration.businessRegNo", e.target.value)}
            disabled={busy}
          />
        </div>

        <span>of</span>

        <div className="w-full sm:w-[360px]">
          <Input
                    path={"fcClientRegistration.registeredAddress"}
            placeholder="Enter Address"
            value={data.registeredAddress || ""}
            onChange={(e) => update("fcClientRegistration.registeredAddress", e.target.value)}
            disabled={busy}
          />
        </div>

        <span>hereby declare that the particulars given overleaf are true and correct.</span>
      </div>
    </div>
  );
}

export default function ForeignCorporateClientRegistration({
  form,
  update,
  busy,

  // uploads
  dir1Sig,
  setDir1Sig,
  dir2Sig,
  setDir2Sig,
  companySeal,
  setCompanySeal,

  // bottom certification uploads
  finalDir1Sig,
  setFinalDir1Sig,
  finalDir2Sig,
  setFinalDir2Sig,
  finalCompanySeal,
  setFinalCompanySeal,
  certOfficerSig,
  setCertOfficerSig,
}) {
  const data = form?.fcClientRegistration || {};
  const bank = data.bankSia || {};
  const localBank = data.localBankContact || {};
  const office = data.officeUseOnly || {};
  const cert = data.certification || {};

  return (
    <div className="space-y-8">
      <Card title="Client Registration">
        {/* TOP: Company Details */}
        <ColSpan2>
          <Section title="Company Details" subtitle="">
            <Field label="Name of Company">
              <Input
                    path={"fcClientRegistration.companyName"}
                value={data.companyName || ""}
                onChange={(e) => update("fcClientRegistration.companyName", e.target.value)}
                disabled={busy}
                placeholder="Enter Name of Company"
              />
            </Field>

            <Field label="Tel No(s)">
              <PhoneInput
                    path={"fcClientRegistration.telNos"} value={data.telNos || ""} onChange={(v) => update("fcClientRegistration.telNos", v)} />
            </Field>

            <Field label="Email Address">
              <Input
                    path={"fcClientRegistration.emailAddress"}
                type="email"
                value={data.emailAddress || ""}
                onChange={(e) => update("fcClientRegistration.emailAddress", e.target.value)}
                disabled={busy}
                placeholder="Enter Email Address"
              />
            </Field>

            <Field label="Fax No(s)">
              <Input
                    path={"fcClientRegistration.faxNos"}
                value={data.faxNos || ""}
                onChange={(e) => update("fcClientRegistration.faxNos", e.target.value)}
                disabled={busy}
                placeholder="Enter Fax No"
              />
            </Field>

            <Field label="Website">
              <Input
                    path={"fcClientRegistration.website"}
                value={data.website || ""}
                onChange={(e) => update("fcClientRegistration.website", e.target.value)}
                disabled={busy}
                placeholder="Enter Website"
              />
            </Field>

            <ColSpan2>
              <Field label="Registered Address">
                <Input
                    path={"fcClientRegistration.registeredAddress"}
                  value={data.registeredAddress || ""}
                  onChange={(e) => update("fcClientRegistration.registeredAddress", e.target.value)}
                  disabled={busy}
                  placeholder="Enter Registered Address"
                />
              </Field>
            </ColSpan2>

            <ColSpan2>
              <Field label="Correspondence Address">
                <Input path="fcClientRegistration.correspondenceAddress"
                  value={data.correspondenceAddress || ""}
                  onChange={(e) =>
                    update("fcClientRegistration.correspondenceAddress", e.target.value)
                  }
                  disabled={busy}
                  placeholder="Enter Correspondence Address"
                />
              </Field>
            </ColSpan2>

            <Field label="Business Reg No.">
              <Input
                    path={"fcClientRegistration.businessRegNo"}
                value={data.businessRegNo || ""}
                onChange={(e) => update("fcClientRegistration.businessRegNo", e.target.value)}
                disabled={busy}
                placeholder="Enter Business Reg No"
              />
            </Field>

            <Field label="Date of Incorporation">
              <Input
                    path={"fcClientRegistration.dateOfIncorporation"}
                type="date"
                value={data.dateOfIncorporation || ""}
                onChange={(e) => update("fcClientRegistration.dateOfIncorporation", e.target.value)}
                disabled={busy}
              />
            </Field>

            <Field label="Nature of Business">
              <Input
                    path={"fcClientRegistration.natureOfBusiness"}
                value={data.natureOfBusiness || ""}
                onChange={(e) => update("fcClientRegistration.natureOfBusiness", e.target.value)}
                disabled={busy}
                placeholder="Enter Nature of Business"
              />
            </Field>
          </Section>
        </ColSpan2>

        {/* Bank (SIA) Account Details */}
        <ColSpan2>
          <Section title="Bank (SIA) Account Details">
            <Field label="Bank Name">
              <Input
                    path={"fcClientRegistration.bankSia.bankName"}
                value={bank.bankName || ""}
                onChange={(e) => update("fcClientRegistration.bankSia.bankName", e.target.value)}
                disabled={busy}
                placeholder="Enter Bank Name"
              />
            </Field>

            <Field label="Branch Name">
              <Input
                    path={"fcClientRegistration.bankSia.branchName"}
                value={bank.branchName || ""}
                onChange={(e) => update("fcClientRegistration.bankSia.branchName", e.target.value)}
                disabled={busy}
                placeholder="Enter Branch Name"
              />
            </Field>

            <Field label="Type of Account">
              <Input
                    path={"fcClientRegistration.bankSia.accountType"}
                value={bank.accountType || ""}
                onChange={(e) => update("fcClientRegistration.bankSia.accountType", e.target.value)}
                disabled={busy}
                placeholder="Enter Type of Account"
              />
            </Field>

            <Field label="A/C No">
              <Input
                    path={"fcClientRegistration.bankSia.accountNo"}
                value={bank.accountNo || ""}
                onChange={(e) => update("fcClientRegistration.bankSia.accountNo", e.target.value)}
                disabled={busy}
                placeholder="Enter A/C No"
              />
            </Field>
          </Section>
        </ColSpan2>

        {/* Contact Details of Local Bank */}
        <ColSpan2>
          <Section title="Contact Details of the Local Bank">
            <Field label="Bank Name">
              <Input path="fcClientRegistration.localBankContact.bankName"
                value={localBank.bankName || ""}
                onChange={(e) =>
                  update("fcClientRegistration.localBankContact.bankName", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Bank Name"
              />
            </Field>

            <Field label="Contact Person">
              <Input path="fcClientRegistration.localBankContact.contactPerson"
                value={localBank.contactPerson || ""}
                onChange={(e) =>
                  update("fcClientRegistration.localBankContact.contactPerson", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Contact Person"
              />
            </Field>

            <Field label="Phone Number of Contact Person">
              <PhoneInput
                    path={"fcClientRegistration.localBankContact.contactPhone"} value={localBank.contactPhone || ""} onChange={(v) => update("fcClientRegistration.localBankContact.contactPhone", v)} />
            </Field>
          </Section>
        </ColSpan2>

        {/* Present Brokers */}
        <ColSpan2>
          <Section title="Present Broker(s) If Any">
            <ColSpan2>
              <Field label="Present Broker(s) If Any">
                <Input
                    path={"fcClientRegistration.presentBrokers"}
                  value={data.presentBrokers || ""}
                  onChange={(e) => update("fcClientRegistration.presentBrokers", e.target.value)}
                  disabled={busy}
                  placeholder="Present Broker(s) If Any"
                />
              </Field>
            </ColSpan2>
          </Section>
        </ColSpan2>

        {/* Uploads (Top) */}
        <ColSpan2>
          <Section title="Specimen Signatures & Company Seal">
            <Field label="Specimen Signature of Director 1">
              <FileUpload label="Choose File" file={dir1Sig} setFile={setDir1Sig} />
            </Field>

            <Field label="Specimen Signature of Director 2">
              <FileUpload label="Choose File" file={dir2Sig} setFile={setDir2Sig} />
            </Field>

            <Field label="Company Seal">
              <FileUpload label="Choose File" file={companySeal} setFile={setCompanySeal} />
            </Field>
          </Section>
        </ColSpan2>

        {/* Correspondence Contact */}
        <ColSpan2>
          <Section title="Correspondences Contact">
            <Field label="Correspondences Contact">
              <Input path="fcClientRegistration.correspondenceContact"
                value={data.correspondenceContact || ""}
                onChange={(e) =>
                  update("fcClientRegistration.correspondenceContact", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Correspondences Contact"
              />
            </Field>

            <Field label="Tel No">
              <PhoneInput
                    path={"fcClientRegistration.correspondenceTelNo"} value={data.correspondenceTelNo || ""} onChange={(v) => update("fcClientRegistration.correspondenceTelNo", v)} />
            </Field>

            <Field label="Fax No">
              <Input path="fcClientRegistration.correspondenceFaxNo"
                value={data.correspondenceFaxNo || ""}
                onChange={(e) =>
                  update("fcClientRegistration.correspondenceFaxNo", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Fax No"
              />
            </Field>
          </Section>
        </ColSpan2>

        {/* Office Use Only */}
        <ColSpan2>
          <Section title="Office Use Only">
            <Field label="Application Received On">
              <Input path="fcClientRegistration.officeUseOnly.applicationReceivedOn"
                type="date"
                value={office.applicationReceivedOn || ""}
                onChange={(e) =>
                  update("fcClientRegistration.officeUseOnly.applicationReceivedOn", e.target.value)
                }
                disabled={busy}
              />
            </Field>

            <Field label="Date">
              <Input
                    path={"fcClientRegistration.officeUseOnly.date"}
                value={office.date || ""}
                onChange={(e) => update("fcClientRegistration.officeUseOnly.date", e.target.value)}
                disabled={busy}
                placeholder="Enter Date"
              />
            </Field>

            <Field label="Advisor's Code">
              <Input path="fcClientRegistration.officeUseOnly.advisorsCode"
                value={office.advisorsCode || ""}
                onChange={(e) =>
                  update("fcClientRegistration.officeUseOnly.advisorsCode", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Advisor's Code"
              />
            </Field>

            <Field label="Advisor's Signatures">
              <Input path="fcClientRegistration.officeUseOnly.advisorsSignatures"
                value={office.advisorsSignatures || ""}
                onChange={(e) =>
                  update("fcClientRegistration.officeUseOnly.advisorsSignatures", e.target.value)
                }
                disabled={busy}
                placeholder="Enter Advisor's Signatures"
              />
            </Field>

            <ColSpan2>
              <InfoBox title="Risk of Securities Trading">
                <p>
                  The price of securities fluctuates, sometimes drastically. The price of a
                  security may move up or down, and may even become valueless. It is likely
                  that losses may be incurred as a result of buying and selling securities.
                </p>
              </InfoBox>
            </ColSpan2>

            <ColSpan2>
              <Field label="Declaration by the staff,">
                <Input
                    path={"fcClientRegistration.officeUseOnly.staffName"}
                  value={office.staffName || ""}
                  onChange={(e) => update("fcClientRegistration.officeUseOnly.staffName", e.target.value)}
                  disabled={busy}
                  placeholder="Enter Staff Name"
                />
              </Field>

              <p className="mt-2 text-xs text-zinc-400">
                ( Investment Advisor ) on behalf of the Asha Philip Securities Ltd has clearly
                explained the risk disclosure statement to the client while inviting the client
                to read and ask questions and take independent advice if the client wishes.
              </p>

              <br />

              <Field label="Signature of Director 1">
                <FileUpload label="Choose File" file={finalDir1Sig} setFile={setFinalDir1Sig} />
              </Field>

              <br />

              <Field label="Signature of Director 2">
                <FileUpload label="Choose File" file={finalDir2Sig} setFile={setFinalDir2Sig} />
              </Field>

              <br />

              <Field label="Company Seal">
                <FileUpload label="Choose File" file={finalCompanySeal} setFile={setFinalCompanySeal} />
              </Field>
            </ColSpan2>

            <Field label="Advisor's Signature">
              <Input
                    path={"fcClientRegistration.officeUseOnly.advisorsSignature"}
                value={office.advisorsSignature || ""}
                onChange={(e) => update("fcClientRegistration.officeUseOnly.advisorsSignature", e.target.value)}
                disabled={busy}
                placeholder="Advisor's Signature"
              />
            </Field>
          </Section>
        </ColSpan2>

        

        {/* ✅ ADD THIS PART AFTER Client Declaration */}
        <ColSpan2>
          <InlineDeclaration data={data} update={update} busy={busy} />
        </ColSpan2>

        {/* Client Declaration (Read-only block) */}
        <ColSpan2>
          <InfoBox title="">
            <p>
              We undertake to operate my / our share trading account with ASHA SECURITIES LTD. ( Hereinafter referred to as BROKER ) in accordance with the Rules and Conditions given in the Colombo Stock Exchange Bought and Sold Notes and in accordance with the conditions of Sale of the Colombo Stock Exchange and other prevailing laws and regulations of Sri Lanka and in particular to the authority hereinafter granted by us to the Broker.
            </p>
            <p>
              In the event of our failure to settle the amounts due in respect of a share purchase, we do hereby irrevocably authorise the Broker to sell such securities involved in the default and if such proceeds are inadequate to cover the shortfall and any loss incurred by the Broker, to sell any other security in our portfolio held by the Broker in the Central Depository Systems (Pvt) Ltd, so that the full amount due to the Broker may be settled and any surplus arising on the sale of shares shall accrue to the Broker unless such surplus arise from the sale of other quoted shares deposited by the buyer as collateral with broker in which event the surplus shall be remitted to us after settlement day of the relevant sale (s).
            </p>
            <p>
              The funds to be invested for the purchase of Securities through the SecuritiesAccount to be opened with the CDS will not be funds derived from any money laundering activity of funds generated through financing of terrorist or any other illegal activity.
            </p>
            <p>
              In the event of a variation of any information given in the CDS Form 2, Addendum to CDS Form 2(A) this declaration and other information submitted by us along with the application to open a CDS Account, we undertake to inform the CDS in writing within fourteen (14) days of such variation.
            </p>
            <p>
              The irrevocable authority granted hereby shall in no way effect or exempt us from any liability as stated herein towards the BROKER arising from or consequent upon any such default.
            </p>
            <p>
              Also we do hereby irrevocably agree that in the event of any purchase orders placed with you for the purchase of shares, we shall pay approximately 50% of the value of such purchase by a legal tender which amount shall be set off against the total amount due from us to you on the due date of settlement in respect of such purchases, and the relevant investment advisors may be incentivized by the company on such purchase and sales turnovers.
            </p>
            <p>
              Any delayed payments will be subject to additional interest cost on the condition and will be debited to my/our account. Interest percentage will be decided by the Broker considering the prevailing interest rates. ( not exceeding a maximum interest rate of 0.1% per day )
            </p>
            <p>
              The risk disclosure statement was explained while advising independently and was invited to read and ask questions.
            </p>
            <p>Services provided : Online facility, Research reports.</p>
          </InfoBox>
        </ColSpan2>

        {/* Bottom Uploads + Certification */}
        <ColSpan2>
          <Section title="Signatures & Certification" 
          // subtitle="Complete the certification section at the end of the form."
          >
            <Field label="Signature of Director 1">
              <FileUpload label="Choose File" file={finalDir1Sig} setFile={setFinalDir1Sig} />
            </Field>

            <Field label="Signature of Director 2">
              <FileUpload label="Choose File" file={finalDir2Sig} setFile={setFinalDir2Sig} />
            </Field>

            <Field label="Company Seal">
              <FileUpload label="Choose File" file={finalCompanySeal} setFile={setFinalCompanySeal} />
            </Field>

            <ColSpan2>
              <Field label="Name of the Certifying Officer">
                <Input path="fcClientRegistration.certification.certifyingOfficerName"
                  value={cert.certifyingOfficerName || ""}
                  onChange={(e) =>
                    update("fcClientRegistration.certification.certifyingOfficerName", e.target.value)
                  }
                  disabled={busy}
                  placeholder="Name of the Certifying Officer"
                />
              </Field>
            </ColSpan2>

            <Field label="Signature of the Certifying Officer">
              <FileUpload label="Choose File" file={certOfficerSig} setFile={setCertOfficerSig} />
            </Field>

            <Field label="Date">
              <Input
                    path={"fcClientRegistration.certification.date"}
                type="date"
                value={cert.date || ""}
                onChange={(e) => update("fcClientRegistration.certification.date", e.target.value)}
                disabled={busy}
              />
            </Field>
          </Section>
        </ColSpan2>
      </Card>
    </div>
  );
}
