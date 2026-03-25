import { useEffect, useMemo, useState } from "react";
import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";

function get(obj, path) {
  if (!obj || !path) return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function digitsOnly(v) {
  return String(v ?? "").replace(/\D+/g, "");
}

function intInRange(raw, min, max) {
  const d = digitsOnly(raw);
  if (!d) return { value: "", error: "" };
  const n = parseInt(d, 10);
  if (Number.isNaN(n)) return { value: "", error: "" };
  const value = String(n);
  if (n < min || n > max) {
    return { value, error: `Must be between ${min} and ${max}.` };
  }
  return { value, error: "" };
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-900">
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-zinc-300 bg-[#f4f4f1] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-semibold tracking-wide text-zinc-900">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs text-zinc-600">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

function SectionTitle({ children, hint }) {
  return (
    <div className="mt-8 first:mt-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold tracking-[0.14em] text-zinc-900">
          {children}
        </div>
        {hint ? <div className="text-xs text-zinc-600">{hint}</div> : null}
      </div>
      <div className="mt-3 h-px bg-zinc-300" />
    </div>
  );
}

function InfoBox({ children }) {
  return (
    <div className="mt-4 rounded-3xl border border-zinc-300 bg-white p-4 text-xs leading-relaxed text-zinc-700">
      {children}
    </div>
  );
}

function PartyBlock({ label, basePath, data, update, busy, locked = false }) {
  return (
    <div className="rounded-3xl border border-zinc-300 bg-white p-4">
      <div className="mb-3 text-xs font-semibold tracking-wide text-zinc-900">
        {label}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Enter Name">
          <Input
                    path={`${basePath}.name`}
            value={data?.name || ""}
            onChange={(e) => update(`${basePath}.name`, e.target.value)}
            placeholder="Enter Name"
            disabled={busy || locked}
          />
        </Field>

        <div className="grid grid-cols-1 gap-2">
          <div className="text-xs text-zinc-600">Bearing Passport Number</div>
          <div className="grid grid-cols-[1fr_140px] gap-2">
            <Input path={`${basePath}.passportNo`}
              value={data?.passportNo || ""}
              onChange={(e) =>
                update(`${basePath}.passportNo`, e.target.value)
              }
              placeholder="Enter Passport Number"
              disabled={busy || locked}
            />
            {/* <Input path={`${basePath}.passportCountry`}
              value={data?.passportCountry || ""}
              onChange={(e) =>
                update(`${basePath}.passportCountry`, e.target.value)
              }
              placeholder="of (Country)"
              disabled={busy}
            /> */}
          </div>
        </div>

        <Field label="Enter Address" className="md:col-span-2">
          <Input
                    path={`${basePath}.address`}
            value={data?.address || ""}
            onChange={(e) => update(`${basePath}.address`, e.target.value)}
            placeholder="Enter Address"
            disabled={busy || locked}
          />
        </Field>
      </div>
    </div>
  );
}



export default function ForeignIndividualClientAgreement({
  form,
  update,
  busy,

  // Signature uploads (same style as your other steps)
  principalSig,
  setPrincipalSig,
  jointSig,
  setJointSig,
  secondJointSig,
  setSecondJointSig,
}) {
  const data = form?.fiClientAgreement || {};
  const date = data?.agreementDate || {};
  const p1 = data?.party1 || {};
  const p2 = data?.party2 || {};
  const p3 = data?.party3 || {};

  

  const [showFullTerms, setShowFullTerms] = useState(false);
  const [dateErr, setDateErr] = useState("");
  const [monthErr, setMonthErr] = useState("");

  // -------------------------------------------------
  // Auto-fill (LIVE): By & Between (1) (2) (3)
  // (1) Principal Applicant -> name / passport / permanent address
  // (2) Joint Applicant     -> name / passport / permanent address
  // (3) 2nd Joint Applicant -> name / passport / permanent address
  // Always stays in sync when client registration values change.
  // -------------------------------------------------
  useEffect(() => {
    const setIfDifferent = (path, nextValue) => {
      const v = String(nextValue ?? "").trim();
      const cur = String(get(form, path) ?? "").trim();
      if (v !== cur) update(path, v);
    };

    const pName = String(
      get(form, "fiClientRegistration.principal.namesByInitials") ??
        get(form, "fiClientRegistration.principal.initials") ??
        ""
    ).trim();
    const pPassport = String(get(form, "fiClientRegistration.principal.passportNo") ?? "");
    const pAddress = String(
      get(form, "fiClientRegistration.principal.permanentAddress") ?? ""
    ).trim();

    setIfDifferent("fiClientAgreement.party1.name", pName);
    setIfDifferent("fiClientAgreement.party1.passportNo", pPassport);
    setIfDifferent("fiClientAgreement.party1.address", pAddress);

    const jEnabled = !!get(form, "fiClientRegistration.jointApplicant.enabled");
    const jName = String(
      get(form, "fiClientRegistration.jointApplicant.namesByInitials") ??
        get(form, "fiClientRegistration.jointApplicant.initials") ??
        ""
    ).trim();
    const jPassport = String(get(form, "fiClientRegistration.jointApplicant.passportNo") ?? "");
    const jAddress = String(
      get(form, "fiClientRegistration.jointApplicant.permanentAddress") ?? ""
    ).trim();

    setIfDifferent("fiClientAgreement.party2.name", jEnabled ? jName : "");
    setIfDifferent(
      "fiClientAgreement.party2.passportNo",
      jEnabled ? jPassport : ""
    );
    setIfDifferent(
      "fiClientAgreement.party2.address",
      jEnabled ? jAddress : ""
    );

    const sEnabled = !!get(
      form,
      "fiClientRegistration.secondJointApplicant.enabled"
    );
    const sName = String(
      get(form, "fiClientRegistration.secondJointApplicant.namesByInitials") ??
        get(form, "fiClientRegistration.secondJointApplicant.initials") ??
        ""
    ).trim();
    const sPassport = String(get(form, "fiClientRegistration.secondJointApplicant.passportNo") ?? "");
    const sAddress = String(
      get(form, "fiClientRegistration.secondJointApplicant.resAddress") ??
        get(form, "fiClientRegistration.secondJointApplicant.officeAddress") ??
        get(form, "fiClientRegistration.secondJointApplicant.permanentAddress") ??
        ""
    ).trim();

    setIfDifferent("fiClientAgreement.party3.name", sEnabled ? sName : "");
    setIfDifferent(
      "fiClientAgreement.party3.passportNo",
      sEnabled ? sPassport : ""
    );
    setIfDifferent(
      "fiClientAgreement.party3.address",
      sEnabled ? sAddress : ""
    );
  }, [form, update]);

  const termsBoxClass = useMemo(() => {
    return showFullTerms
      ? ""
      : "max-h-[260px] overflow-hidden relative";
  }, [showFullTerms]);

  return (
    <div className="space-y-8">
      <Card><center>
        <CardHeader
          title="CLIENT AGREEMENT"
          // subtitle="Matches the Word document structure (By & Between + Terms + Execution)"
          // right={<Pill>Foreign Individual</Pill>}
        /></center>

        <div className="px-6 py-6">
          {/* Agreement date */}
          <SectionTitle>AGREEMENT DATE</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <span>This Agreement is made and entered into on this</span>
            <Field label="Date" error={dateErr}>
              <Input path="fiClientAgreement.agreementDate.date"
                inputMode="numeric"
                value={date.date || ""}
                onChange={(e) => {
                  const { value, error } = intInRange(e.target.value, 1, 31);
                  setDateErr(error ? `Date ${error}` : "");
                  update("fiClientAgreement.agreementDate.date", value);
                }}
                placeholder="Date"
                disabled={busy}
              />
            </Field>

            <Field label="Month" error={monthErr}>
              <Input path="fiClientAgreement.agreementDate.month"
                inputMode="numeric"
                value={date.month || ""}
                onChange={(e) => {
                  const { value, error } = intInRange(e.target.value, 1, 12);
                  setMonthErr(error ? `Month ${error}` : "");
                  update("fiClientAgreement.agreementDate.month", value);
                }}
                placeholder="Month"
                disabled={busy}
              />
            </Field>

            <Field label="Year">
              <Input path="fiClientAgreement.agreementDate.year"
                type="number"
                value={date.year || ""}
                onChange={(e) =>
                  update("fiClientAgreement.agreementDate.year", e.target.value)
                }
                placeholder="Year"
                disabled={busy}
              />
            </Field>
          </div>

          {/* By & Between */}
          <SectionTitle>BY AND BETWEEN</SectionTitle>
          <div className="mt-4 space-y-4">
            <PartyBlock
              label="(1)"
              basePath="fiClientAgreement.party1"
              data={p1}
              update={update}
              busy={busy}
              locked
            />
            <PartyBlock
              label="(2)"
              basePath="fiClientAgreement.party2"
              data={p2}
              update={update}
              busy={busy}
              locked
            />
            <PartyBlock
              label="(3)"
              basePath="fiClientAgreement.party3"
              data={p3}
              update={update}
              busy={busy}
              locked
            />
          </div>
          <br></br>
          <p>( hereinafter sometimes jointly and severally referred to as the <b>"Client/s"</b> ) of the<b> One Part. </b></p>
          {/* Agreement text area (eye-catchy + readable) */}
          <br></br>
          <span>AND</span>
          <SectionTitle hint="">TERMS & CONDITIONS</SectionTitle>

          <div className="relative">
            <InfoBox>
              <div className={termsBoxClass}>
            Asha Securities Ltd a company duly incorporated under the laws of Sri Lanka bearing Company registration No. P B 405 and having its registered office at No 60 5th Lane Colombo 03(hereinafter referred to as "the Stockbroker Firm" which term or expression has herein used shall where the context requires or admits mean and include the said Stockbroker Firm, its successors and permitted assigns) of the Other Part;. 
            
            <br></br><br></br>
            <p>
              <b>The Client's and the Stockbroker Firm shall hereinafter be collectively referred to as "Parties" and each individually as "Party".</b>
            </p>

            <br></br><br></br>
            <p>
              <b>WHEREAS</b> the Stockbroker Firm is a Member/Trading Member of the Colombo Stock Exchange ( hereinafter referred to as the <b>'CSE' </b>) and is licensed by the Securities and Exchange Commission of Sri Lanka ( hereinafter referred to as the<b> 'SEC' </b>) to operate as a Stockbroker;
            </p>

            <br></br><br></br>
            <p>
              <b>NOW THEREFORE THIS AGREEMENT WITNESSETH</b> and it is hereby agreed by and between the Parties hereto as follows:
            </p>

            <br></br><br></br>
            <p>
              <h2>1.0 RIGHTS AND RESPONSIBILITIES OF THE CLIENT/S</h2>
            </p>

            <br></br>
            <p>1.1 Subject to clause 1.5 below;</p>
            <p>a. In the event of a Joint Account, the Client/5 shall provide to the Stockbroker Firm, the names of the persons</p>
            <p>- authorized to give trading orders and settlement instructions; and</p>
            <p>- to whom payments by the Stockbroker Firm are to be made.</p>

            <br></br>
            <p>b. In the event of a Corporate Client Account, the Client shall provide to the Stockbroker Firm, the name's of specific directors and officers authorized to;</p>
            <p>- trade in securities; and</p>
            <p>- execute all documentation for trading and settlement in the account,together with a copy of the Board resolution certified by the Company Secretary evidencing same.</p>

            <br></br>
            <p>The aforesaid person/s shall hereinafter be referred to as 'authorized person/s'.</p>

            <br></br>
            <p>1.2 The Client's shall notify the Stockbroker Firm in writing, if there is any change in the contact and/or other information provided by the Client/s to the Stockbroker Firm, within seven (7) calendar days of such change.</p>

            <br></br>
            <p>1.3 Subject to clause 1.5 below, in the event the Client/authorized person(s) ( as applicable ) intends to purchase and/or sell securities, the Client/authorized person(s) ( as applicable ) shall give specific order instructions to the Investment Advisor ( an employee of the Stockbroker Firm, who is certified by the CSE/SEC to deal with Clients ) assigned to deal with the Client/5 regarding same.</p>

            <br></br>
            <p>1.4 The Client/authorized person(s) ( as applicable ) authorizeis the Stockbroker Firm to accept order instructions given by the Client/authorized person(s) ( as applicable ) to the Stockbroker Firm pertaining to the CDS Account of the Client's through electronic means and other means including telephone, Short Message Service ( SMS ), E-mail and Fax. The order instructions provided by the Client/authorized person(s) ( as applicable ) through aforesaid means shall not be revoked or withdrawn by the Client/authorized person(s) ( as applicable ) after the execution of the order and shall therefore be confirmed.</p>

            <br></br>
            <p>1.5 If the Client/s intends the Stockbroker Firm to use the Stockbroker Firm's own judgment, expertise and discretion to buy and/or sell securities on behalf of the Client/s, the Client's shall provide the prior written authorization to the Stockbroker Firm for same.</p>
            <p>The said written authorization provided by the Client's to the Stockbroker Firm shall clearly include the following;</p>
            <p>- Name of the Client's and the CDS Account Number;</p>
            <p>- Effective Date of the authorization;</p>
            <p>- Applicable period of the authorization;</p>
            <p>- Investment objective (short term, long term, trading in any specific industry, any other specifications); and,</p>
            <p>- Purpose of giving discretion to the Registered Investment Advisor.</p>

            <br></br>
            <p>1.6 The Client/s shall ensure that cleared funds are made available to the Stockbroker Firm in respect of the securities purchased by the Stockbroker Firm on behalf of the Client/s, by 09.00 hours on the settlement date of such purchase transaction and if the Client/s fail/s to make payment as aforesaid, the Stockbroker Firm may, at its absolute discretion, charge an interest commencing from the day after the settlement date at a rate decided by the Stockbroker Firm, but not exceeding 0.1 % per day as specified in the Stockbroker/Stock Dealer Rules of the CSE. The Client/s shall accept the liabilities arising from all authorized transactions executed in the CDS Account of the Client/authorized person(s) ( as applicable ) by the Investment Advisor.</p>

            <br></br>
            <p>1.7 If the Client/s has/have a complaint against the Stockbroker Firm relating to a particular transaction/s, the Client/s shall first refer such complaint to the Compliance Officer of the Stockbroker Firm, in writing, within a period of three (3) months from the date of the transaction/s. Where the Client/s is/are not satisfied with the decision given by the Stockbroker Firm or the manner in which the complaint was dealt with by the Stockbroker Firm, the Client/s may refer the complaint to the CSE, in writing, in accordance with the Procedure set out by the CSE ( which is available on the CSE website, www.cse.lk ).</p>

            <br></br>
            <p>1.8 The Client/s agree/s that the Stockbroker Firm may, at its absolute discretion, sell not only the securities in respect of which payment has been defaulted by the Client/s, but also any other securities lying in the CDS Account of the Client/s in respect of which payment has been made by the Client/s, in full or part, in order to enable the Stockbroker Firm to recover the monies due to the Stockbroker Firm from the Client/s including interest and other applicable charges.</p>

            <br></br>
            <p>1.9 The Client/s shall not;</p>
            <p>a. use any funds derived through illegal activity for the purpose of settling purchases of securities to the Client's CDS Account.</p>
            <p>b. Enter into any verbal or written agreement/s with the employee/s of the Stockbroker Firm to share profits arising from the transactions carried out on behalf of the Client/s by the Stockbroker Firm.</p>

            <br></br><br></br>
            <p>
              <h2>2.0 RIGHTS AND RESPONSIBILITIES OF THE STOCKBROKER FIRM</h2>
            </p>

            <br></br>
            <p>2.1 Subject to clause 2.3 below;</p>
            <p>a. In the event of a Joint Account, the Stockbroker Firm shall obtain from the Client's, the name's of the persons;</p>
            <p>- authorized to give trading orders and settlement instructions; and,</p>
            <p>- to whom payments by the Stockbroker Firm are to be made.</p>

            <br></br>
            <p>b. In the event of a Corporate Client Account, the Stockbroker Firm shall obtain from the Client's, the name's of specific directors and officers authorized to;</p>
            <p>- trade in securities; and, execute all documentation for trading and settlement in the account,</p>
            <p>- together with a copy of the Board resolution certified by the Company Secretary evidencing same.</p>

            <br></br>
            <p>c. the Stockbroker Firm shall carry out all transactions based on the specific order instructions provided by the Client/authorized person(s) (as applicable) through the communications channels specified in clause 1.4 of this Agreement.</p>

            <br></br>
            <p>2.2 Prior to accepting any orders from a third party on behalf of the Client/s, the Stockbroker Firm shall first obtain the written authorization of the Client/s empowering the third party to trade on behalf of the Client/s through the Client's CDS Account.</p>

            <br></br>
            <p>2.3 The Stockbroker Firm shall not exercise the discretion to buy or sell securities on behalf of the Client/s, unless the Client/s has/have given prior written authorization to the Stockbroker Firm to effect transactions for the Client's without his/their specific order instructions as set out in clause 1.5 of this Agreement.</p>

            <br></br>
            <p>2.4 The Stockbroker Firm shall send to the Client/s a note confirming the purchase and/or sale of securities ( bought/sold note ) by the end of the trade day (T). Upon obtaining the prior consent of the Client/s, the Stockbroker Firm may send the bought/sold notes to the Client/s in electronic form to the e-mail address provided by the Client/s for such purpose.</p>

            <br></br>
            <p>2.5 The Stockbroker Firm shall send a Statement of Accounts to the Client/s who is/are debtor/s over Trade Day + 3 (T+3), on a monthly basis by the 7th day of the following month. This should apply when the client/s has/have had transactions during the month and the "interest charged on delayed payment" should also be considered as a transaction for this purpose. Such Statement of Accounts shall specify the transactions in the account including receipts and payments during the month under reference.</p>

            <br></br>
            <p>2.6 In the event the Statements of Accounts are issued electronically, the Stockbroker Firm shall obtain the consent of the Client/s and retain evidence of such consent.</p>

            <br></br>
            <p>2.7 The Stockbroker Firm shall provide a copy of its latest Audited Financial Statements filed with the CSE to a Client/s, upon request by such Client/s.</p>

            <br></br>
            <p>2.8 The Stockbroker Firm shall communicate in writing, directly with its Client/s in respect of statements, bought/sold notes or any other information unless the Client/s has/have authorized the Stockbroker Firm otherwise in writing.</p>

            <br></br>
            <p>2.9 The Stockbroker Firm shall ensure that 'cleared funds' are made available to the Client(s) /authorized person(s) (as applicable) on the settlement date, unless the Client/s has/have expressly permitted the Stockbroker Firm, in writing, to hold the sales proceeds for future purchases.</p>

            <br></br>
            <p>2.10 Upon the request of the Client/s, the Stockbroker Firm may:</p>
            <p>a. extend credit facilitates to the Client/s solely for the purpose of purchasing securities on the CSE and in accordance with the applicable Rules set out in the CSE Stockbroker Rules and terms and condition mutually agreed to between the Client/s and the Stockbroker Firm by way of a written agreement for extension of such facilities.</p>
            <p>b. provide internet trading facilities to such Client/s based on a written agreement mutually agreed between the Client/sand the Stockbroker Firm, in accordance with the requirements applicable to Internet Trading published by the CSE from time to time.</p>

            <br></br>
            <p>2.11 The Stockbroker Firm shall assign a Registered Investment Advisor to deal with the Client/sand shall inform such Client/s regarding the name and contact details of the Registered investment Advisor assigned to such Client/s. Further, the Stockbroker Firm shall inform the Client in writing regarding any change to the Registered Investment Advisor within seven (7) Calendar Days of such change.</p>

            <br></br>
            <p>2.12 The Stockbroker Firm shall forthwith notify the Client/s in writing, if there is any material change in contact or other information provided to the Client/s by the Stockbroker Firm.</p>

            <br></br>
            <p>2.13 The Stockbroker Firm undertakes to maintain all information of the Client/sin complete confidence and the Stockbroker Firm shall not disclose such information to any person except in accordance with the Stockbroker Rules of the CSE.</p>

            <br></br>
            <p>2.14 The Stockbroker Firm shall disclose to the Client/s, the existence of any incentive scheme applicable for employees of the Stockbroker Firm, which is based on turnover generated from the transactions carried out by the employees for the Client/ s.</p>

            <br></br>
            <p>2.15 The Stockbroker Firm may recover any outstanding balance arising from the purchase of securities of the Client/s from the sales proceeds due to the buyer only in the circumstances set out in the Stockbroker Rules of the CSE.</p>

            <br></br>
            <p>2.16 The Stockbroker Firm shall provide services to the Client/sin compliance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.</p>

            <br></br><br></br>
            <p>
              <h2>3.0 RISK DISCLOSURE STATEMENT</h2>
            </p>

            <br></br>
            <p>3.1 The Stockbroker Firm agrees that a member of its staff who is authorized by the Board of Directors of the Stockbroker Firm to make declarations on behalf of the Stockbroker Firm has explained the applicable Risk Disclosures to the Client/sand has executed the declaration set out in Schedule 1 hereto in proof of same and such Schedule 1 shall form part and parcel of this Agreement</p>
            
            <br></br>
            <p>3.2 The Client's agrees and acknowledge/s that he/she/it has understood the Risk Disclosures explained by the Stockbroker Firm and executed the Acknowledgement set out in Schedule 2 here to and such Schedule 2 shall form part and parcel of this Agreement.</p>

            <br></br><br></br>
            <p>
              <h2>4.0 INDEMNITY AND LIMITATION OFLIABILITY</h2>
            </p>

            <br></br>
            <p>4.1 Each Party hereto, agrees to indemnify, defend and hold harmless the other Party against any loss, liability, damages, claims and costs, which each such Party may sustain by reason of negligence and/or breach of the terms and conditions hereof committed by the other Party hereto or its representatives. The aggrieved Party shall be entitled to enforce its/his/her indemnity rights by injunction or other equitable relief in any competent court of law in Sri Lanka.</p>

            <br></br>
            <p>4.2 The Client's agrees's that the Stockbroker Firm will not be liable for any losses arising out of or relating to any cause which is beyond the control of the Stockbroker Firm.</p>

            <br></br><br></br>
            <p>
              <h2>5.0 TERMINATION</h2>
            </p>

            <br></br>
            <p>5.1 This Agreement shall forthwith terminate, if the Stockbroker Firm for any reason ceases to be a Member/Trading Member of the CSE or if the license issued to the Stockbroker Firm by the SEC is cancelled.</p>

            <br></br>
            <p>5.2 The Parties shall be entitled to terminate this Agreement upon giving notice in writing of not less than fourteen (14) calendar days to the other Party.</p>

            <br></br>
            <p>5.3 Notwithstanding any such termination, all rights, liabilities and obligations of the Parties arising out of or in respect of the transactions entered into prior to the termination of this Agreement shall continue to be in force.</p>

            <br></br><br></br>
            <p>
              <h2>6.0 GENERAL</h2>
            </p>

            <br></br>
            <p>6.1 Words and expressions which are used in this Agreement, but which are not defined herein shall, unless the context otherwise requires, have the same meaning as assigned thereto in the Rules of the CSE, SEC and other applicable laws of Sri Lanka.</p>

            <br></br>
            <p>6.2 The terms and conditions contained in this Agreement shall be subject to the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE and other applicable laws of Sri Lanka.</p>

            <br></br>
            <p>6.3 In the event of any contradiction between the terms and conditions hereof and the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka, the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka (as applicable) shall prevail.</p>

            <br></br><br></br>
            <p>IN WITNESS WHEREOF the Parties to the Agreement have set their respective hands hereto and to one (01) other of the same tenor and date as herein above mentioned.</p>

              {!showFullTerms ? (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent" />
              ) : null}

              </div>



            {/* <div className="mt-3">
              <details className="rounded-2xl border border-zinc-300 bg-white/[0.02] p-4">
                <summary className="cursor-pointer text-xs font-semibold tracking-wide text-zinc-900">
                  View Agreement Sections (1.0 – 6.0)
                </summary>

                <div className="mt-3 max-h-[360px] overflow-auto pr-2 text-xs text-zinc-700 leading-relaxed space-y-3">
                  <div><span className="font-semibold">1.0</span> Rights and responsibilities of the Client/s</div>
                  <div><span className="font-semibold">2.0</span> Rights and responsibilities of the Stockbroker Firm</div>
                  <div><span className="font-semibold">3.0</span> Risk Disclosure Statement</div>
                  <div><span className="font-semibold">4.0</span> Indemnity and Limitation of Liability</div>
                  <div><span className="font-semibold">5.0</span> Termination</div>
                  <div><span className="font-semibold">6.0</span> General</div>

                  <div className="pt-2 text-zinc-600">
                    (If you want the full exact text displayed inside the UI, tell me — I will convert the Word agreement images into structured HTML sections.)
                  </div>
                </div>
              </details>
            </div> */}
            </InfoBox>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFullTerms((v) => !v)}
                className="text-xs font-semibold text-zinc-900 underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
              >
                {showFullTerms ? "Less" : "More"}
              </button>
            </div>
          </div>

          {/* Execution */}
          <SectionTitle>IN WITNESS WHEREOF</SectionTitle>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-300 bg-white p-4">
              <FileUpload
                label="Signature of Principal Applicant"
                accept="image/*,.pdf"
                file={principalSig}
                setFile={setPrincipalSig}
                disabled={busy}
              />
            </div>

            <div className="rounded-3xl border border-zinc-300 bg-white p-4">
              <FileUpload
                label="Signature of Joint Applicant"
                accept="image/*,.pdf"
                file={jointSig}
                setFile={setJointSig}
                disabled={busy}
              />
            </div>

            <div className="rounded-3xl border border-zinc-300 bg-white p-4">
              <FileUpload
                label="Signature of 2nd Joint Applicant"
                accept="image/*,.pdf"
                file={secondJointSig}
                setFile={setSecondJointSig}
                disabled={busy}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Authorized Signatory of the Stockbroker Firm">
              <Input path="fiClientAgreement.authorizedSignatory"
                value={data?.authorizedSignatory || ""}
                onChange={(e) =>
                  update("fiClientAgreement.authorizedSignatory", e.target.value)
                }
                placeholder="Enter Name"
                disabled={busy}
              />
            </Field>

            <Field label="Witness 1">
              <Input
                    path={"fiClientAgreement.witness1"}
                value={data?.witness1 || ""}
                onChange={(e) => update("fiClientAgreement.witness1", e.target.value)}
                placeholder="Enter Name"
                disabled={busy}
              />
            </Field>

            <Field label="Witness 2">
              <Input
                    path={"fiClientAgreement.witness2"}
                value={data?.witness2 || ""}
                onChange={(e) => update("fiClientAgreement.witness2", e.target.value)}
                placeholder="Enter Name"
                disabled={busy}
              />
            </Field>
          </div>

          {/* <label className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-300 bg-white/80 p-4">
            <input
              type="checkbox"
              checked={!!data.accepted}
              onChange={(e) => update("fiClientAgreement.accepted", e.target.checked)}
            />
            <span className="text-sm text-zinc-900">
              I confirm I have read and accept the Client Agreement
            </span>
          </label> */}
        </div>
      </Card>
    </div>
  );
}
