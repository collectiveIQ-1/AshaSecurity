import { useState } from "react";
import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import { Select } from "./Select.jsx";
import FileUpload from "./FileUpload.jsx";
import PhoneInput from "./PhoneInput.jsx";

function getByPath(root, path) {
  try {
    return String(path || "")
      .split(".")
      .reduce((acc, part) => (acc == null ? undefined : acc[part]), root);
  } catch {
    return undefined;
  }
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-[28px] border border-zinc-200/80 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        {subtitle ? <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SectionTitle({ children }) {
  return <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">{children}</div>;
}



const FOREIGN_INDIVIDUAL_CLIENT_AGREEMENT_TERMS = [
  '(hereinafter sometimes jointly and severally referred to as the "Client/s") of the One Part.',
  'AND',
  'Asha Securities Ltd a company duly incorporated under the laws of Sri Lanka bearing Company registration No. P B 405 and having its registered office at No 60 5th Lane Colombo 03(hereinafter referred to as "the Stockbroker Firm" which term or expression has herein used shall where the context requires or admits mean and include the said Stockbroker Firm, its successors and permitted assigns) of the Other Part',
  'The Client/s and the Stockbroker Firm shall hereinafter be collectively referred to as "Parties" and each individually as "Party".',
  'WHEREAS the Stockbroker Firm is a Member/Trading Member of the Colombo Stock Exchange (hereinafter referred to as the CSE) and is licensed by the Securities and Exchange Commission of Sri Lanka (hereinafter referred to as the SEC) to operate as a Stockbroker',
  'AND WHEREAS the Client/s is/are desirous of trading on the securities listed on the CSE through the said Stockbroker Firm and the Stockbroker Firm agrees to provide such services to the Client/s in accordance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.',
  'NOW THEREFORE THIS AGREEMENT WITNESSETH and it is hereby agreed by and between the Parties hereto as follows:',
  { type: 'heading', text: '1.0 RIGHTS AND RESPONSIBILITIES OF THE CLIENT/S' },
  '1.1 Subject to clause 1.5 below;',
  'a) In the event of a Joint Account, the Client/s shall provide to the Stockbroker Firm, the name/s of the persons;- authorized to give trading orders and settlement instructions; and,- to whom payments by the Stockbroker Firm are to be made.',
  'b) In the event of a Corporate Client Account, the Client shall provide to the Stockbroker Firm, the name/s of specific directors and officers authorized to;- trade in securities; and,- execute all documentation for trading and settlement in the account, together with a copy of the Board resolution certified by the Company Secretary evidencing same.',
  'The aforesaid person/s shall hereinafter be referred to as "authorized person/s".',
  '1.2 The Client/s shall notify the Stockbroker Firm in writing, if there is any change in the contact and/or other information provided by the Client/s to the Stockbroker Firm, within seven (7) calendar days of such change.',
  '1.3 Subject to clause 1.5 below, in the event the Client/authorized person(s) (as applicable) intends to purchase and/or sell securities, the Client/authorized person(s) (as applicable) shall give specific order instructions to the Investment Advisor (an employee of the Stockbroker Firm, who is certified by the CSE/SEC to deal with Clients) assigned to deal with the Client/s regarding same.',
  '1.4 The Client/authorized person(s) (as applicable) authorize/s the Stockbroker Firm to accept order instructions given by the Client/authorized person(s) (as applicable) to the Stockbroker Firm pertaining to the CDS Account of the Client/s through electronic means and other means including telephone, Short Message Service (SMS), E-mail and Fax. The order instructions provided by the Client/authorized person(s) (as applicable) through aforesaid means shall not be revoked or withdrawn by the Client/authorized person(s) (as applicable) after the execution of the order and shall therefore be confirmed.',
  '1.5 If the Client/s intends the Stockbroker Firm to use the Stockbroker Firm own judgment, expertise and discretion to buy and/or sell securities on behalf of the Client/s, the Client/s shall provide the prior written authorization to the Stockbroker Firm for same. The said written authorization provided by the Client/s to the Stockbroker Firm shall clearly include the following; - Name of the Client/sand the CDS Account Number;- Effective Date of the authorization;-Applicable period of the authorization;- Investment objective (short term, long term, trading in any specific industry, any other specifications); and,- Purpose of giving discretion to the Registered Investment Advisor.',
  '1.6 The Client/s shall ensure that cleared funds are made available to the Stockbroker Firm in respect of the securities purchased by the Stockbroker Firm on behalf of the Client/s, by 09.00 hours on the settlement date of such purchase transaction and if the Client/s fail/s to make payment as aforesaid, the Stockbroker Firm may, at its absolute discretion, charge an interest commencing from the day after the settlement date at a rate decided by the Stockbroker Firm, but not exceeding 0.1 % per day as specified in the Stockbroker/Stock Dealer Rules of the CSE.',
  'The Client/s shall accept the liabilities arising from all authorized transactions executed in the CDS Account of the Client/authorized person(s) (as applicable) by the Investment Advisor.',
  '1.1.7 7 If the Client/s has/have a complaint against the Stockbroker Firm relating to a particular transaction/s, the Client/s shall first refer such complaint to the Compliance Officer of the Stockbroker Firm, in writing, within a period of three (3) months from the date of the transaction/s. Where the Client/s is/are not satisfied with the decision given by the Stockbroker Firm or the manner in which the complaint was dealt with by the Stockbroker Firm, the Client/s may refer the complaint to the CSE, in writing, in accordance with the Procedure set out by the CSE (which is available on the CSE website, www.cse.lk).',
  '1.8 The Client/s agree/s that the Stockbroker Firm may, at its absolute discretion, sell not only the securities in respect of which payment has been defaulted by the Client/s, but also any other securities lying in the CDS Account of the Client/s in respect of which payment has been made by the Client/s, in full or part, in order to enable the Stockbroker Firm to recover the monies due to the Stockbroker Firm from the Client/s including interest and other applicable charges.',
  '1.9 9 The Client/s shall not;',
  'a. use any funds derived through illegal activity for the purpose of settling purchases of securities to the Clients CDS Account.',
  'b. enter into any verbal or written agreement/s with the employee/s of the Stockbroker Firm to share profits arising from the transactions carried out on behalf of the Client/s by the Stockbroker Firm.',
  { type: 'heading', text: '2.0 RIGHTS AND RESPONSIBILITIES OF THE STOCKBROKER FIRM' },
  '2.1 Subject to clause 2.3 below;',
  '- authorized to give trading orders and settlement instructions; and,',
  '- to whom payments by the Stockbroker Firm are to be made.',
  'b) In the event of a Corporate Client Account, the Stockbroker Firm shall obtain from the Client/s, the name/s of specific directors and officers authorized to;',
  '- trade in securities; and,',
  '-execute all documentation for trading and settlement in the account,',
  'together with a copy of the Board resolution certified by the Company Secretary evidencing same.',
  'c) the Stockbroker Firm shall carry out all transactions based on the specific order instructions provided by the Client/authorized person(s) (as applicable) through the communications channels specified in clause 1.4 of this Agreement.',
  '2.2 Prior to accepting any orders from a third party on behalf of the Client/s, the Stockbroker Firm shall first obtain the written authorization of the Client/s empowering the third party to trade on behalf of the Client/s through the Client CDS Account.',
  '2.3 The Stockbroker Firm shall not exercise the discretion to buy or sell securities on behalf of the Client/s, unless the Client/s has/have given prior written authorization to the Stockbroker Firm to effect transactions for the Client/s without his/their specific order instructions as set out in clause 1.5 of this Agreement.',
  '2.4 The Stockbroker Firm shall send to the Client/s a note confirming the purchase and/or sale of securities (bought/sold note) by the end of the trade day (T). Upon obtaining the prior consent of the Client/s, the Stockbroker Firm may send the bought/sold notes to the Client/s in electronic form to the e-mail address provided by the Client/s for such purpose.',
  '2.5 The Stockbroker Firm shall send a Statement of Accounts to the Client/s who is/are debtor/s over Trade Day + 2 (T+2), on a monthly basis by the 7th day of the following month. This should apply when the client/s has/have had transactions during the month and the "interest charged on delayed payment" should also be considered as a transaction for this purpose. Such Statement of Accounts shall specify the transactions in the account including receipts and payments during the month under reference.',
  '2.6 In the event the Statements of Accounts are issued electronically, the Stockbroker Firm shall obtain the consent of the Client/s and retain evidence of such consent.',
  '2.7 The Stockbroker Firm shall provide a copy of its latest Audited Financial Statements filed with the CSE to a Client/s, upon request by such Client/s.',
  '2.8 The Stockbroker Firm shall communicate in writing, directly with its Client/s in respect of statements, bought/sold notes or any other information unless the Client/s has/have authorized the Stockbroker Firm otherwise in writing.',
  '2.9 The Stockbroker Firm shall ensure that cleared funds are made available to the Client(s) /authorized person(s) (as applicable) on the settlement date, unless the Client/s has/have expressly permitted the Stockbroker Firm, in writing, to hold the sales proceeds for future purchases.',
  '2.10 Upon the request of the Client/s, the Stockbroker Firm may:',
  'a) extend credit facilitates to the Client/s solely for the purpose of purchasing securities on the CSE and in accordance with the applicable Rules set out in the CSE Stockbroker Rules and terms and condition mutually agreed to between the Client/s and the Stockbroker Firm by way of a written agreement for extension of such facilities.',
  'b) provide internet trading facilities to such Client/s based on a written agreement mutually agreed between the Client/sand the Stockbroker Firm, in accordance with the requirements applicable to Internet Trading published by the CSE from time to time.',
  '2.11 The Stockbroker Firm shall assign a Registered Investment Advisor to deal with the Client/sand shall inform such Client/s regarding the name and contact details of the Registered investment Advisor assigned to such Client/s. Further, the Stockbroker Firm shall inform the Client in writing regarding any change to the Registered Investment Advisor within seven (7) Calendar Days of such change.',
  '2.12 The Stockbroker Firm shall forthwith notify the Client/s in writing, if there is any material change in contact or other information provided to the Client/s by the Stockbroker Firm.',
  '2.13 The Stockbroker Firm undertakes to maintain all information of the Client/sin complete confidence and the Stockbroker Firm shall not disclose such information to any person except in accordance with the Stockbroker Rules of the CSE.',
  '2.14 The Stockbroker Firm shall disclose to the Client/s, the existence of any incentive scheme applicable for employees of the Stockbroker Firm, which is based on turnover generated from the transactions carried out by the employees for the Client/ s.',
  '2.15 The Stockbroker Firm may recover any outstanding balance arising from the purchase of securities of the Client/s from the sales proceeds due to the buyer only in the circumstances set out in the Stockbroker Rules of the CSE.',
  '2.16 The Stockbroker Firm shall provide services to the Client/sin compliance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.',
  { type: 'heading', text: '3.0 RISK DISCLOSURE STATEMENT' },
  '3.1 The Stockbroker Firm agrees that a member of its staff who is authorized by the Board of Directors of the Stockbroker Firm to make declarations on behalf of the Stockbroker Firm has explained the applicable Risk Disclosures to the Client/sand has executed the declaration set out in Schedule 1 hereto in proof of same and such Schedule 1 shall form part and parcel of this Agreement',
  '3.2 The Client/s agree/sand acknowledge/s that he/she/it has understood the Risk Disclosures explained by the Stockbroker Firm and executed the Acknowledgement set out in Schedule 2 hereto and such Schedule 2 shall form part and parcel of this Agreement.',
  { type: 'heading', text: '4.0 INDEMNITY AND LIMITATION OF LIABILITY' },
  '4.1 Each Party hereto, agrees to indemnify, defend and hold harmless the other Party against any loss, liability, damages, claims and costs, which each such Party may sustain by reason of negligence and/or breach of the terms and conditions hereof committed by the other Party hereto or its representatives. The aggrieved Party shall be entitled to enforce its/his/her indemnity rights by injunction or other equitable relief in any competent court of law in Sri Lanka.',
  '4.2 The Client/s agrees/s that the Stockbroker Firm will not be liable for any losses arising out of or relating to any cause which is beyond the control of the Stockbroker Firm.',
  { type: 'heading', text: '5.0 TERMINATION' },
  '5.1 This Agreement shall forthwith terminate, if the Stockbroker Firm for any reason ceases to be a Member/Trading Member of the CSE or if the license issued to the Stockbroker Firm by the SEC is cancelled.',
  '5.2 The Parties shall be entitled to terminate this Agreement upon giving notice in writing of not less than fourteen (14) calendar days to the other Party.',
  '5.3 Notwithstanding any such termination, all rights, liabilities and obligations of the Parties arising out of or in respect of the transactions entered into prior to the termination of this Agreement shall continue to be in force.',
  { type: 'heading', text: '6.0 GENERAL' },
  '6.1 Words and expressions which are used in this Agreement, but which are not defined herein shall, unless the context otherwise requires, have the same meaning as assigned thereto in the Rules of the CSE, SEC and other applicable laws of Sri Lanka.',
  '6.2 The terms and conditions contained in this Agreement shall be subject to the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE and other applicable laws of Sri Lanka.',
  'In the event of any contradiction between the terms and conditions hereof and the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka, the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka (as applicable) shall prevail.',
  'IN WITNESS WHEREOF the Parties to the Agreement have set their respective hands hereto and to one (01) other of the same tenor and date as herein above mentioned.',
];

function CheckRow({ checked, onChange, label }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
      <input type="checkbox" className="mt-1 h-4 w-4" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function ApplicantBlock({ title, base, form, update, enabledPath, enableLabel }) {
  const enabled = enabledPath ? !!getByPath(form, enabledPath) : true;
  const applicantType = base.endsWith("principal")
    ? "principal"
    : base.endsWith("jointApplicant")
      ? "joint"
      : "secondJoint";

  const isSecondJoint = applicantType === "secondJoint";

  const show = {
    title: !isSecondJoint,
    surname: !isSecondJoint,
    telHome: !isSecondJoint,
    telOffice: true,
    faxHome: !isSecondJoint,
    faxOffice: true,
    mobile: !isSecondJoint,
    email: !isSecondJoint,
    permanentAddress: true,
    correspondenceAddress: !isSecondJoint,
    identityNo: true,
    identityFront: true,
    identityBack: true,
    cdsAccountNo: applicantType === "principal",
    dateOfIssue: applicantType !== "joint" && applicantType !== "secondJoint" ? true : applicantType === "secondJoint",
    utilityBill: applicantType === "principal",
    occupation: applicantType !== "joint" && applicantType !== "secondJoint" ? true : false,
    employerAddress: applicantType === "principal",
    employerContactNo: applicantType === "principal",
  };

  const applicantHint =
    applicantType === "joint"
      ? ""
      : applicantType === "secondJoint"
        ? ""
        : "Complete principal applicant details.";

  const inputClass = "w-full rounded-2xl border border-zinc-300 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100";

  if (isSecondJoint) {
    return (
      <div className="space-y-4 rounded-[24px] border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{applicantHint}</p>
          </div>
        </div>

        {enabledPath ? (
          <CheckRow checked={enabled} onChange={(v) => update(enabledPath, v)} label={enableLabel || `Enable ${title}`} />
        ) : null}

        {enabled ? (
          <div className="space-y-5">
            <div className="rounded-[26px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-zinc-800 dark:from-zinc-950/80 dark:via-zinc-900/60 dark:to-zinc-900/30">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {/* <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  2nd Joint Applicant
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Minimal, clean and image-matched field set</span> */}
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="space-y-5 lg:col-span-2">
                  <Field label="Name">
                    <Input
                      path={`${base}.name`} value={getByPath(form, `${base}.name`) || ""}
                      onChange={(e) => update(`${base}.name`, e.target.value)}
                      placeholder="Enter 2nd Joint Applicant Name"
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Residential Address">
                    <textarea
                      value={getByPath(form, `${base}.resAddress`) || ""}
                      onChange={(e) => update(`${base}.resAddress`, e.target.value)}
                      rows={3}
                      placeholder="Enter 2nd Joint Applicant Residential Address"
                      data-path={`${base}.officeAddress`} className={inputClass}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Occupation">
                    <Input
                      path={`${base}.occupation`} value={getByPath(form, `${base}.occupation`) || ""}
                      onChange={(e) => update(`${base}.occupation`, e.target.value)}
                      placeholder="Enter 2nd Joint Applicant Occupation"
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Office Address">
                    <textarea
                      value={getByPath(form, `${base}.officeAddress`) || ""}
                      onChange={(e) => update(`${base}.officeAddress`, e.target.value)}
                      rows={3}
                      placeholder="Enter 2nd Joint Applicant Office Address"
                      data-path={`${base}.officeAddress`} className={inputClass}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="NIC / Passport">
                    <Input
                      path={`${base}.identityNo`} value={getByPath(form, `${base}.identityNo`) || ""}
                      onChange={(e) => update(`${base}.identityNo`, e.target.value)}
                      placeholder="Enter 2nd Joint Applicant NIC or Passport Number"
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Upload NIC or Passport (Front Side)">
                    <FileUpload
                      label="Upload Front Side"
                      value={getByPath(form, `${base}.identityFront`) || null}
                      setValue={(file) => update(`${base}.identityFront`, file)}
                      accept="image/*,application/pdf"
                      path={`${base}.identityFront`}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Upload NIC or Passport (Back Side)">
                    <FileUpload
                      label="Upload Back Side"
                      value={getByPath(form, `${base}.identityBack`) || null}
                      setValue={(file) => update(`${base}.identityBack`, file)}
                      accept="image/*,application/pdf"
                      path={`${base}.identityBack`}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Date of Issue">
                    <Input
                      path={`${base}.dateOfIssue`}
                      type="date"
                      value={getByPath(form, `${base}.dateOfIssue`) || ""}
                      onChange={(e) => update(`${base}.dateOfIssue`, e.target.value)}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Nationality">
                    <Input
                      path={`${base}.nationality`} value={getByPath(form, `${base}.nationality`) || ""}
                      onChange={(e) => update(`${base}.nationality`, e.target.value)}
                      placeholder="Enter 2nd Joint Applicant Nationality"
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Tel">
                    <PhoneInput
                      value={getByPath(form, `${base}.tel`) || ""}
                      onChange={(v) => update(`${base}.tel`, v)}
                      placeholder="Enter 2nd Joint Applicant Tel No"
                      path={`${base}.tel`}
                    />
                  </Field>
                </div>

                <div className="space-y-5 lg:col-span-2">
                  <Field label="Fax">
                    <Input
                      path={`${base}.fax`} value={getByPath(form, `${base}.fax`) || ""}
                      onChange={(e) => update(`${base}.fax`, e.target.value)}
                      placeholder="Enter 2nd Joint Applicant Fax No"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{applicantHint}</p>
        </div>
      </div>

      {enabledPath ? (
        <CheckRow checked={enabled} onChange={(v) => update(enabledPath, v)} label={enableLabel || `Enable ${title}`} />
      ) : null}

      {enabled ? (
        <div className="md:col-span-2">
          {show.title ? (
            <><Field label="Title">
              <Select path={`${base}.title`} value={getByPath(form, `${base}.title`) || ""} onChange={(e) => update(`${base}.title`, e.target.value)}>
                <option value="">Select</option>
                <option value="Rev">Rev.</option>
                <option value="Mr">Mr.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Ms">Ms.</option>
              </Select>
            </Field><br /></>
          ) : null}

          <Field label="Name">
            <Input path={`${base}.name`} value={getByPath(form, `${base}.name`) || ""} onChange={(e) => update(`${base}.name`, e.target.value)} placeholder="Enter Name" />
          </Field><br />

          {show.surname ? (
            <><Field label="Surname">
              <Input path={`${base}.surname`} value={getByPath(form, `${base}.surname`) || ""} onChange={(e) => update(`${base}.surname`, e.target.value)} placeholder="Enter Surname" />
            </Field><br /></>
          ) : null}

          {show.telHome ? (
            <><Field label="Tel No (Home)">
              <PhoneInput path={`${base}.telHome`} value={getByPath(form, `${base}.telHome`) || ""} onChange={(v) => update(`${base}.telHome`, v)} placeholder="Enter Home Telephone No" />
            </Field><br /></>
          ) : null}

          {show.telOffice ? (
            <><Field label="Tel No (Office)">
              <PhoneInput path={`${base}.telOffice`} value={getByPath(form, `${base}.telOffice`) || ""} onChange={(v) => update(`${base}.telOffice`, v)} placeholder="Enter Office Telephone No" />
            </Field><br /></>
          ) : null}

          {show.faxHome ? (
            <><Field label="Fax No (Home)">
              <Input path={`${base}.faxHome`} value={getByPath(form, `${base}.faxHome`) || ""} onChange={(e) => update(`${base}.faxHome`, e.target.value)} placeholder="Enter Home Fax No" />
            </Field><br /></>
          ) : null}

          {show.faxOffice ? (
            <><Field label="Fax No (Office)">
              <Input path={`${base}.faxOffice`} value={getByPath(form, `${base}.faxOffice`) || ""} onChange={(e) => update(`${base}.faxOffice`, e.target.value)} placeholder="Enter Office Fax No" />
            </Field><br /></>
          ) : null}

          {show.mobile ? (
            <><Field label="Mobile No">
              <PhoneInput path={`${base}.mobile`} value={getByPath(form, `${base}.mobile`) || ""} onChange={(v) => update(`${base}.mobile`, v)} placeholder="Enter Mobile Number" />
            </Field><br /></>
          ) : null}

          {show.email ? (
            <><Field label="Email">
              <Input path={`${base}.email`} type="email" value={getByPath(form, `${base}.email`) || ""} onChange={(e) => update(`${base}.email`, e.target.value)} placeholder="Enter Email" />
            </Field><br /></>
          ) : null}

          {show.permanentAddress ? (
            <><div className="md:col-span-2">
              <Field label="Permanent Address">
                <textarea
                  value={getByPath(form, `${base}.permanentAddress`) || getByPath(form, `${base}.resAddress`) || ""}
                  onChange={(e) => update(`${base}.permanentAddress`, e.target.value)}
                  rows={3}
                  data-path={`${base}.permanentAddress`} className="w-full rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                />
              </Field>
            </div><br /></>
          ) : null}

          {show.correspondenceAddress ? (
            <><div className="md:col-span-2">
              <Field label="Correspondence Address">
                <textarea
                  value={getByPath(form, `${base}.correspondenceAddress`) || getByPath(form, `${base}.officeAddress`) || ""}
                  onChange={(e) => update(`${base}.correspondenceAddress`, e.target.value)}
                  rows={3}
                  data-path={`${base}.correspondenceAddress`} className="w-full rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                />
              </Field>
            </div><br /></>
          ) : null}

          {show.identityNo ? (
            <><Field label="NIC / Passport / Driving License No">
              <Input path={`${base}.identityNo`} value={getByPath(form, `${base}.identityNo`) || ""} onChange={(e) => update(`${base}.identityNo`, e.target.value)} placeholder="Enter NIC / Passport / Driving License No" />
            </Field><br /></>
          ) : null}

          {show.identityFront ? (
            <><Field label="Upload ID Front Side">
              <FileUpload
                label="Upload front side"
                value={getByPath(form, `${base}.identityFront`) || null}
                setValue={(file) => update(`${base}.identityFront`, file)}
                accept="image/*,application/pdf"
                path={`${base}.identityFront`}
              />
            </Field><br /></>
          ) : null}

          {show.identityBack ? (
            <><Field label="Upload ID Back Side">
              <FileUpload
                label="Upload back side"
                value={getByPath(form, `${base}.identityBack`) || null}
                setValue={(file) => update(`${base}.identityBack`, file)}
                accept="image/*,application/pdf"
                path={`${base}.identityBack`}
              />
            </Field><br /></>
          ) : null}

          {show.cdsAccountNo ? (
            <><Field label="CDS A/C No">
              <Input path={`${base}.cdsAccountNo`} value={getByPath(form, `${base}.cdsAccountNo`) || ""} onChange={(e) => update(`${base}.cdsAccountNo`, e.target.value)} />
            </Field><br /></>
          ) : null}

          {show.dateOfIssue ? (
            <><Field label="Date of Issue">
              <Input path={`${base}.dateOfIssue`} type="date" value={getByPath(form, `${base}.dateOfIssue`) || ""} onChange={(e) => update(`${base}.dateOfIssue`, e.target.value)} />
            </Field><br /></>
          ) : null}

          {show.utilityBill ? (
            <><Field label="Attached Copy of Utility Bill">
              <FileUpload
                label="Choose utility bill"
                value={getByPath(form, `${base}.utilityBill`) || null}
                setValue={(file) => update(`${base}.utilityBill`, file)}
                accept="image/*,application/pdf"
                path={`${base}.utilityBill`}
              />
            </Field><br /></>
          ) : null}

          {show.occupation ? (
            <><Field label="Occupation">
              <Input path={`${base}.occupation`} value={getByPath(form, `${base}.occupation`) || ""} onChange={(e) => update(`${base}.occupation`, e.target.value)} placeholder="Enter Occupation" />
            </Field><br /></>
          ) : null}

          {show.employerAddress ? (
            <><Field label="Employer’s Address">
              <textarea
                value={getByPath(form, `${base}.employerAddress`) || ""}
                onChange={(e) => update(`${base}.employerAddress`, e.target.value)}
                rows={3}
                placeholder="Enter Employer Address"
                data-path={`${base}.employerAddress`} className="w-full rounded-2xl border border-zinc-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
              />
            </Field><br /></>
          ) : null}

          {show.employerContactNo ? (
            <><Field label="Employer Contact No">
              <PhoneInput path={`${base}.employerContactNo`} value={getByPath(form, `${base}.employerContactNo`) || ""} onChange={(v) => update(`${base}.employerContactNo`, v)} placeholder="Enter Employer Contact No" />
            </Field><br /></>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HolderYesNo({ label, path, form, update }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">{label}</div>
      <Select value={getByPath(form, path) || ""} onChange={(e) => update(path, e.target.value)}>
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </Select>
    </div>
  );
}


function KycSectionHeader({ n, title }) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.22)] ring-4 ring-white dark:border-zinc-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 dark:text-zinc-900 dark:ring-zinc-900/70">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),transparent_45%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_48%)]" />
        <span className="relative">{n}</span>
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400"></div>
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-800 dark:text-zinc-200">{title}</div>
      </div>
    </div>
  );
}

function KycCellCheck({ path, form, update, disabled = false }) {
  return (
    <label className={`flex items-center justify-center ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={!!getByPath(form, path)}
        disabled={disabled}
        onChange={(e) => update(path, e.target.checked)}
        className="h-4 w-4 rounded border-zinc-400 accent-red-600 dark:border-zinc-600 dark:accent-red-500"
      />
    </label>
  );
}

function KycResidencyRow({ label, basePath, form, update, holders }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
      <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        {label}
      </div>
      {holders.map((holder) => (
        <div
          key={`${basePath}.${holder.key}`}
          className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800"
        >
          <KycCellCheck
            path={`${basePath}.${holder.key}`}
            form={form}
            update={update}
            disabled={!holder.enabled}
          />
        </div>
      ))}
    </div>
  );
}


function KycHolderPills({ holders }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
      {holders.map((holder) => (
        <div
          key={`pill-${holder.key}`}
          className={[
            "rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide",
            holder.enabled
              ? "border-zinc-200 bg-white/80 text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200"
              : "border-zinc-200 bg-zinc-100/80 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-500",
          ].join(" ")}
        >
          {holder.label}
        </div>
      ))}
    </div>
  );
}

function KycProfileCard({ title, enabled = true, children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[24px] border p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition",
        enabled
          ? "border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/30"
          : "border-zinc-200 bg-zinc-100/70 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/20",
        className,
      ].join(" ")}
    >
      <div className="mb-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">{title}</div>
      {children}
    </div>
  );
}

function KycSourceOption({ checked, onChange, label, disabled = false }) {
  return (
    <label
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
        disabled
          ? "cursor-not-allowed border-zinc-200 bg-zinc-100/70 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-500"
          : "cursor-pointer border-zinc-200 bg-white/75 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-zinc-700",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-400 accent-red-600 dark:border-zinc-600 dark:accent-red-500"
      />
      <span>{label}</span>
    </label>
  );
}

function KycTextarea({ value, onChange, placeholder = "Type here...", disabled = false, rows = 4 }) {
  return (
    <textarea
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      className={[
        "w-full rounded-2xl border border-zinc-200 bg-white/75 px-4 py-3 text-sm text-zinc-900 shadow-[0_10px_30px_rgba(15,23,42,0.04)] outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100",
        disabled ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
    />
  );
}

function PepQuestion({ base, enabled, qLabel, yesNoKey, explainKey, explainPlaceholder, form, update }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/75 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{qLabel}</div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Answer">
          <Select
            value={getByPath(form, `${base}.${yesNoKey}`) || ""}
            onChange={(e) => update(`${base}.${yesNoKey}`, e.target.value)}
            disabled={!enabled}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </Field>
        <Field label="If Yes, please explain">
          <Input
            value={getByPath(form, `${base}.${explainKey}`) || ""}
            onChange={(e) => update(`${base}.${explainKey}`, e.target.value)}
            disabled={!enabled || String(getByPath(form, `${base}.${yesNoKey}`) || "") !== "Yes"}
            placeholder={explainPlaceholder}
          />
        </Field>
      </div>
    </div>
  );
}

function KycPepCard({ holderKey, label, enabled, form, update }) {
  const base = `fiClientRegistration.kycProfile.pep.${holderKey}`;

  return (
    <KycProfileCard title={label} enabled={enabled}>
      <div className="grid grid-cols-1 gap-3">
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are or have been entrusted domestically by a with prominent public functions? For example, Heads of State or of government, senior politicians, senior government, judicial or military officials, senior executives of state owned corporations, important political party officials. If “Yes” please explain."
          yesNoKey="domesticPublicFunction"
          explainKey="domesticExplain"
          explainPlaceholder="Explain"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are or have been entrusted with prominent public functions by a foreign country? For example, Heads of State or of government, senior politicians, senior government, judicial or military officials, senior executives of state owned corporations, important political party officials. If “Yes” please explain the relationship"
          yesNoKey="foreignPublicFunction"
          explainKey="foreignExplain"
          explainPlaceholder="Explain relationship"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are related to a PEP either directly (consanguinity) or through marriage or similar (civil) forms of partnership? If “Yes” please explain the relationship"
          yesNoKey="relatedToPep"
          explainKey="relatedExplain"
          explainPlaceholder="Explain relationship"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are closely connected to a PEP, either socially or professionally? If “Yes” please explain the relationship"
          yesNoKey="closelyConnected"
          explainKey="closelyExplain"
          explainPlaceholder="Explain relationship"
        />
      </div>
    </KycProfileCard>
  );
}

function KycRiskSelect({ pathBase, holders, form, update }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {holders.map((holder) => (
        <KycProfileCard key={`risk-${holder.key}`} title={holder.label} enabled={holder.enabled} className="border-zinc-200/80 shadow-none dark:border-zinc-800">
          <Field label="Risk Category">
            <Select
              value={getByPath(form, `${pathBase}.${holder.key}`) || ""}
              onChange={(e) => update(`${pathBase}.${holder.key}`, e.target.value)}
              disabled={!holder.enabled}
            >
              <option value="">Select</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="H">H</option>
            </Select>
          </Field>
        </KycProfileCard>
      ))}
    </div>
  );
}

export default function ForeignIndividualFullRegistration({ form, update }) {
  const [showClientAgreementModal, setShowClientAgreementModal] = useState(false);
  const jointEnabled = !!form?.fiClientRegistration?.jointApplicant?.enabled;
  const secondJointEnabled = !!form?.fiClientRegistration?.secondJointApplicant?.enabled;

  return (
    <div className="space-y-6">
      {/* <div className="rounded-[32px] border border-zinc-200/80 bg-gradient-to-r from-white via-zinc-50 to-white px-5 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          FOREIGN INDIVIDUAL
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Client Registration</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          Separate Foreign Individual component set with the same main section flow as the Local Individual form.
        </p>
      </div> */}

      <Card title="Client Registration" subtitle="">
        <div className="space-y-5">
          <ApplicantBlock title="Principal Applicant" base="fiClientRegistration.principal" form={form} update={update} />

          <ApplicantBlock
            title="Joint Applicant"
            base="fiClientRegistration.jointApplicant"
            form={form}
            update={update}
            enabledPath="fiClientRegistration.jointApplicant.enabled"
            enableLabel="Enable Joint Applicant"
          />

          <ApplicantBlock
            title="2nd Joint Applicant"
            base="fiClientRegistration.secondJointApplicant"
            form={form}
            update={update}
            enabledPath="fiClientRegistration.secondJointApplicant.enabled"
            enableLabel="Enable 2nd Joint Applicant"
          />

          <div className="md:col-span-2">
            <h1><b>Bank / SIA Account Details</b></h1><br></br>
            
            <Field label="Bank">
              <Input path="fiClientRegistration.principal.bank" value={getByPath(form, "fiClientRegistration.principal.bank") || ""} onChange={(e) => update("fiClientRegistration.principal.bank", e.target.value)} />
            </Field><br></br>
            <Field label="Branch">
              <Input path="fiClientRegistration.principal.branch" value={getByPath(form, "fiClientRegistration.principal.branch") || ""} onChange={(e) => update("fiClientRegistration.principal.branch", e.target.value)} />
            </Field><br></br>
            <Field label="Type of Account">
              <Input path="fiClientRegistration.principal.accountType" value={getByPath(form, "fiClientRegistration.principal.accountType") || ""} onChange={(e) => update("fiClientRegistration.principal.accountType", e.target.value)} />
            </Field><br></br>
            <Field label="Account No">
              <Input path="fiClientRegistration.principal.accountNo" value={getByPath(form, "fiClientRegistration.principal.accountNo") || ""} onChange={(e) => update("fiClientRegistration.principal.accountNo", e.target.value)} />
            </Field><br></br>
            <Field label="Stock Market Experience">
              <Select path="fiClientRegistration.principal.stockMarketExperience" value={getByPath(form, "fiClientRegistration.principal.stockMarketExperience") || ""} onChange={(e) => update("fiClientRegistration.principal.stockMarketExperience", e.target.value)}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </Field><br></br>
            <Field label="Present Brokers (If Any)">
              <Input path="fiClientRegistration.principal.presentBrokers" value={getByPath(form, "fiClientRegistration.principal.presentBrokers") || ""} onChange={(e) => update("fiClientRegistration.principal.presentBrokers", e.target.value)} />
            </Field><br></br>
            
            <h2><b>Mailing Instruction</b></h2><br></br>
            <Field label="Please post our,">
              <Select path="fiClientRegistration.principal.mailingInstruction" value={getByPath(form, "fiClientRegistration.principal.mailingInstruction") || ""} onChange={(e) => update("fiClientRegistration.principal.mailingInstruction", e.target.value)}>
                <option value="">Select</option>
                <option value="Post to Office">Correspondence to office</option>
                <option value="Post to Home">Contracts to home</option>
              </Select>
            </Field><br></br>
            <Field label="Cheques to be">
              <Select path="fiClientRegistration.principal.chequesInstruction" value={getByPath(form, "fiClientRegistration.principal.chequesInstruction") || ""} onChange={(e) => update("fiClientRegistration.principal.chequesInstruction", e.target.value)}>
                <option value="">Select</option>
                <option value="Posted">Posted</option>
                <option value="Collect">Collected</option>
                <option value="Do not prepare">Do not prepare</option>
              </Select>
            </Field><br></br>
            <Field label="Contact Notes">
              <Select path="fiClientRegistration.principal.contactNotes" value={getByPath(form, "fiClientRegistration.principal.contactNotes") || ""} onChange={(e) => update("fiClientRegistration.principal.contactNotes", e.target.value)}>
                <option value="">Select</option>
                <option value="Post">Post</option>
                <option value="Collect">Collect</option>
                <option value="Email">Email</option>
              </Select>
            </Field><br></br>
          </div>

        
          <h1><b>Risk of Security Trading</b></h1>
          <p>The price of securities fluctuates, sometimes drastically. The price of a security may move up or down, and may even become valueless. It is likely that losses may be incurred as a result of buying and selling securities.</p>
          <CheckRow
            checked={!!getByPath(form, "fiClientRegistration.principal.riskAcknowledged")}
            onChange={(v) => update("fiClientRegistration.principal.riskAcknowledged", v)}
            label="I acknowledge that the risk disclosure was explained and understood."
          />

          <Field label="Investment decision are to be:">
                  <Select
                    path="fiClientRegistration.investmentDecision.type"
                    value={getByPath(form, "fiClientRegistration.investmentDecision.type") || ""}
                    onChange={(e) => update("fiClientRegistration.investmentDecision.type", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Discretionary">Discretionary</option>
                    <option value="Non Discretionary">Non Discretionary</option>
                    <option value="Non Discretionary">If so please fill letter of Discretionary</option>
                  </Select>
                </Field>

                <Field label="Declaration by the staff">
                  <Select
                    path="fiClientRegistration.staffDeclaration.advisorName"
                    value={getByPath(form, "fiClientRegistration.staffDeclaration.advisorName") || ""}
                    onChange={(e) => update("fiClientRegistration.staffDeclaration.advisorName", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Mr. Dimuthu Abeyesekera">Mr. Dimuthu Abeyesekera</option>
                          <option value="Mr. Upul Indrajith Priyantha">Mr. Upul Indrajith Priyantha</option>
                          <option value="Mr. Shanmugam Wickramasinghe">Mr. Shanmugam Wickramasinghe</option>
                          <option value="Mrs. Vasantha Wickramasinghe">Mrs. Vasantha Wickramasinghe</option>
                          <option value="Mrs. Nilmini Hapuarchchi">Mrs. Nilmini Hapuarchchi</option>
                          <option value="Mr. Gamage Jayarathne">Mr. Gamage Jayarathne</option>
                          <option value="Mr. Piyasage Ranasinghe">Mr. Piyasage Ranasinghe</option>
                          <option value="Mr. Buddika Jayasinghe">Mr. Buddika Jayasinghe</option>
                          <option value="Mrs. Chandrika Abeywickrama">Mrs. Chandrika Abeywickrama</option>
                          <option value="Mr. Nuwan Hewage">Mr. Nuwan Hewage</option>
                          <option value="Mr. Mohamed Assim Insaf">Mr. Mohamed Assim Insaf</option>
                          <option value="Mr. Janith Hettiarachchi">Mr. Janith Hettiarachchi</option>
                          <option value="Mr. Dhanushka Fernando">Mr. Dhanushka Fernando</option>
                          <option value="Mr. Vidura De Zoysa">Mr. Vidura De Zoysa</option>
                          <option value="Mr. Prasad Wijesinghe">Mr. Prasad Wijesinghe</option>
                          <option value="Mr. Nilum Samantha">Mr. Nilum Samantha</option>
                          <option value="Mr. Manoj Liyanapathirana">Mr. Manoj Liyanapathirana</option>
                          <option value="Mr. Sugath Siriwardana">Mr. Sugath Siriwardana</option>
                          <option value="Mr. Dinesh Delsi Ravinda">Mr. Dinesh Delsi Ravinda</option>
                          <option value="Mr. Mohamed Iliyas">Mr. Mohamed Iliyas</option>
                          <option value="Mr. Akila Sadun Ekanayake">Mr. Akila Sadun Ekanayake</option>
                          <option value="Mr. Prasanna Sujith Bandara Kangara">Mr. Prasanna Sujith Bandara Kangara</option>
                          <option value="Mr. Sanath Karunaweera">Mr. Sanath Karunaweera</option>
                          <option value="Mr. Nishantha Liyanarachchi">Mr. Nishantha Liyanarachchi</option>
                          <option value="Mr. Vinod Rajitha Ramanayake">Mr. Vinod Rajitha Ramanayake</option>
                          <option value="Mr. Muditha Dananjaya">Mr. Muditha Dananjaya</option>
                          <option value="Mr. Croos Christian Croos">Mr. Croos Christian Croos</option>
                          <option value="Mr. Isuru Poorna Premasiri">Mr. Isuru Poorna Premasiri</option>
                          <option value="Mr. Jeewana helage">Mr. Jeewana helage</option>
                          <option value="Mr. Ranjan Liyanage">Mr. Ranjan Liyanage</option>
                          <option value="Mr. Dilshan Fernando">Mr. Dilshan Fernando</option>
                          <option value="Mr. Ashan Chanaka">Mr. Ashan Chanaka</option>
                          <option value="Mr. Umayanga Rajamanthri">Mr. Umayanga Rajamanthri</option>
                  </Select>
                </Field>
                <div className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Investment Advisor on behalf of the asha security Ltd has clearly explained the risk disclosure statement to the client while inviting to the client to the read and ask question and take independent advice if the client wishes.
                </div>

                <div className="lg:col-span-2">
                          <Field label="Name & Address of person/s authorizes to give instructions">
                            <textarea
                              data-path="fiClientRegistration.authorizedInstructions.nameAndAddress"
                              value={getByPath(form, "fiClientRegistration.authorizedInstructions.nameAndAddress") || ""}
                              onChange={(e) => update("fiClientRegistration.authorizedInstructions.nameAndAddress", e.target.value)}
                              rows={4}
                              placeholder="Enter Name & Address"
                              className="w-full rounded-2xl border border-zinc-300 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                            />
                          </Field>
                        </div>

                        <div className="lg:col-span-2 rounded-[20px] border border-dashed border-zinc-300 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                          <Field label="Signature of Agent / Person introducing">
                            <FileUpload
                              label="Upload signature (optional)"
                              value={getByPath(form, "fiClientRegistration.authorizedInstructions.agentSignature") || null}
                              setValue={(file) => update("fiClientRegistration.authorizedInstructions.agentSignature", file)}
                              accept="image/*,application/pdf"
                              path="fiClientRegistration.authorizedInstructions.agentSignature"
                            />
                          </Field>
                        </div>

                        <Field label="Agent Code">
                          <Input
                            path="fiClientRegistration.authorizedInstructions.agentCode"
                            value={getByPath(form, "fiClientRegistration.authorizedInstructions.agentCode") || ""}
                            onChange={(e) => update("fiClientRegistration.authorizedInstructions.agentCode", e.target.value)}
                            placeholder="Agent code"
                          />
                        </Field><br></br>

                        <div className="mb-3">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Office Use Only</div>
                        {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">Internal processing details for the application.</div> */}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Application Received on">
                          <Input
                            path="fiClientRegistration.officeUseOnly.applicationReceivedOn"
                            type="date"
                            value={getByPath(form, "fiClientRegistration.officeUseOnly.applicationReceivedOn") || ""}
                            onChange={(e) => update("fiClientRegistration.officeUseOnly.applicationReceivedOn", e.target.value)}
                          />
                        </Field>

                        

                        <Field label="Advisor's Name">
                          <Select
                            path="fiClientRegistration.officeUseOnly.advisorsName"
                            value={getByPath(form, "fiClientRegistration.officeUseOnly.advisorsName") || ""}
                            onChange={(e) => update("fiClientRegistration.officeUseOnly.advisorsName", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Mr. Dimuthu Abeyesekera">Mr. Dimuthu Abeyesekera</option>
                            <option value="Mr. Upul Indrajith Priyantha">Mr. Upul Indrajith Priyantha</option>
                            <option value="Mr. Shanmugam Wickramasinghe">Mr. Shanmugam Wickramasinghe</option>
                            <option value="Mrs. Vasantha Wickramasinghe">Mrs. Vasantha Wickramasinghe</option>
                            <option value="Mrs. Nilmini Hapuarchchi">Mrs. Nilmini Hapuarchchi</option>
                            <option value="Mr. Gamage Jayarathne">Mr. Gamage Jayarathne</option>
                            <option value="Mr. Piyasage Ranasinghe">Mr. Piyasage Ranasinghe</option>
                            <option value="Mr. Buddika Jayasinghe">Mr. Buddika Jayasinghe</option>
                            <option value="Mrs. Chandrika Abeywickrama">Mrs. Chandrika Abeywickrama</option>
                            <option value="Mr. Nuwan Hewage">Mr. Nuwan Hewage</option>
                            <option value="Mr. Mohamed Assim Insaf">Mr. Mohamed Assim Insaf</option>
                            <option value="Mr. Janith Hettiarachchi">Mr. Janith Hettiarachchi</option>
                            <option value="Mr. Dhanushka Fernando">Mr. Dhanushka Fernando</option>
                            <option value="Mr. Vidura De Zoysa">Mr. Vidura De Zoysa</option>
                            <option value="Mr. Prasad Wijesinghe">Mr. Prasad Wijesinghe</option>
                            <option value="Mr. Nilum Samantha">Mr. Nilum Samantha</option>
                            <option value="Mr. Manoj Liyanapathirana">Mr. Manoj Liyanapathirana</option>
                            <option value="Mr. Sugath Siriwardana">Mr. Sugath Siriwardana</option>
                            <option value="Mr. Dinesh Delsi Ravinda">Mr. Dinesh Delsi Ravinda</option>
                            <option value="Mr. Mohamed Iliyas">Mr. Mohamed Iliyas</option>
                            <option value="Mr. Akila Sadun Ekanayake">Mr. Akila Sadun Ekanayake</option>
                            <option value="Mr. Prasanna Sujith Bandara Kangara">Mr. Prasanna Sujith Bandara Kangara</option>
                            <option value="Mr. Sanath Karunaweera">Mr. Sanath Karunaweera</option>
                            <option value="Mr. Nishantha Liyanarachchi">Mr. Nishantha Liyanarachchi</option>
                            <option value="Mr. Vinod Rajitha Ramanayake">Mr. Vinod Rajitha Ramanayake</option>
                            <option value="Mr. Muditha Dananjaya">Mr. Muditha Dananjaya</option>
                            <option value="Mr. Croos Christian Croos">Mr. Croos Christian Croos</option>
                            <option value="Mr. Isuru Poorna Premasiri">Mr. Isuru Poorna Premasiri</option>
                            <option value="Mr. Jeewana helage">Mr. Jeewana helage</option>
                            <option value="Mr. Ranjan Liyanage">Mr. Ranjan Liyanage</option>
                            <option value="Mr. Dilshan Fernando">Mr. Dilshan Fernando</option>
                            <option value="Mr. Ashan Chanaka">Mr. Ashan Chanaka</option>
                            <option value="Mr. Umayanga Rajamanthri">Mr. Umayanga Rajamanthri</option>
                          </Select>
                        </Field>

                        <div className="rounded-[24px] border border-zinc-200 bg-white/85 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"><u>Remarks</u></div>
                        {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">Office visit confirmation and authorization details.</div> */}
                      </div>

                      {(() => {
                        const visited = String(getByPath(form, "fiClientRegistration.clientDeclaration.clientVisitedOffice") || "") === "Yes";
                        return (
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300">
                              <input
                                type="checkbox"
                                checked={visited}
                                onChange={(e) => {
                                  const next = e.target.checked;
                                  update("fiClientRegistration.clientDeclaration.clientVisitedOffice", next ? "Yes" : "");
                                  if (!next) update("fiClientRegistration.clientDeclaration.visitedOfficeOn", "");
                                }}
                                className="h-4 w-4"
                              />
                              <span>Client has visited the office</span>
                            </label>

                            <Field label="If Yes, on">
                              <Input
                                type="date"
                                disabled={!visited}
                                value={getByPath(form, "fiClientRegistration.clientDeclaration.visitedOfficeOn") || ""}
                                onChange={(e) => update("fiClientRegistration.clientDeclaration.visitedOfficeOn", e.target.value)}
                              />
                            </Field>

                            <Field label="Name of the Staff Member">
                              <Input
                                value={getByPath(form, "fiClientRegistration.clientDeclaration.staffMemberName") || ""}
                                onChange={(e) => update("fiClientRegistration.clientDeclaration.staffMemberName", e.target.value)}
                                placeholder="Enter Staff Member Name"
                              />
                            </Field>

                            <Field label="Authorize Signature">
                              <Input
                                value={getByPath(form, "fiClientRegistration.clientDeclaration.authorizeName") || ""}
                                onChange={(e) => update("fiClientRegistration.clientDeclaration.authorizeName", e.target.value)}
                                placeholder="Enter Authorize Signature"
                              />
                            </Field>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="rounded-[30px] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950/70 dark:via-zinc-900/50 dark:to-zinc-900/20">
                          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Client Declaration &amp; Authorization</div>
                              {/* <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">Image-style declaration block for the Foreign Individual form</h3> */}
                              {/* <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                Added between Office Use Only and the Advisor&apos;s Name / Remarks area to match the form image in a cleaner, more polished way.
                              </p> */}
                            </div>
                            {/* <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
                              Asha Securities
                            </span> */}
                          </div>

                          <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white/90 shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:bg-zinc-950/50">
                            <div className="border-b border-zinc-200 bg-zinc-50/90 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">ASHA SECURITIES LIMITED</div>
                                  <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    No. 60, 5th Lane, Colombo 03.<br />
                                    Tel: +94 (011) 2429100 &nbsp;&nbsp; Fax: +94 (011) 2429199
                                  </div>
                                </div>
                                {/* <div className="self-start rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                                  Client Details
                                </div> */}
                              </div>
                            </div>

                            <div className="space-y-5 px-5 py-5">
                              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[130px_minmax(0,1fr)_170px_minmax(0,1fr)] lg:items-end">
                                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">I / We</div>
                                <Input
                                  value={getByPath(form, "fiClientRegistration.clientDeclaration.declarationName") || ""}
                                  onChange={(e) => update("fiClientRegistration.clientDeclaration.declarationName", e.target.value)}
                                  placeholder=""
                                  path="fiClientRegistration.clientDeclaration.declarationName"
                                  className="rounded-[18px]"
                                />
                                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">bearing NIC No(s)</div>
                                <Input
                                  value={getByPath(form, "fiClientRegistration.clientDeclaration.declarationNicNumbers") || ""}
                                  onChange={(e) => update("fiClientRegistration.clientDeclaration.declarationNicNumbers", e.target.value)}
                                  placeholder=""
                                  path="fiClientRegistration.clientDeclaration.declarationNicNumbers"
                                  className="rounded-[18px]"
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[130px_minmax(0,1fr)_60px_minmax(0,1fr)_minmax(260px,1.4fr)] lg:items-end">
                                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">CDS A/C No.</div>
                                <Input
                                  value={getByPath(form, "fiClientRegistration.clientDeclaration.declarationCdsAccountNo") || ""}
                                  onChange={(e) => update("fiClientRegistration.clientDeclaration.declarationCdsAccountNo", e.target.value)}
                                  placeholder=""
                                  path="fiClientRegistration.clientDeclaration.declarationCdsAccountNo"
                                  className="rounded-[18px]"
                                />
                                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">of</div>
                                <Input
                                  value={getByPath(form, "fiClientRegistration.clientDeclaration.declarationAddress") || ""}
                                  onChange={(e) => update("fiClientRegistration.clientDeclaration.declarationAddress", e.target.value)}
                                  placeholder=""
                                  path="fiClientRegistration.clientDeclaration.declarationAddress"
                                  className="rounded-[18px]"
                                />
                                {/* <div className="rounded-[20px] border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300">
                                  hereby declare that I / we are aware of the particulars given below.
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-4 px-1 text-[15px] leading-8 text-zinc-700 dark:text-zinc-300">
                            <p>
                              I / We undertake to operate my / our share trading account with ASHA SECURITIES LTD. (Hereinafter referred to as BROKER) in accordance with CSE Stock Broker Rule and other prevailing laws and regulations of Sri Lanka and in particular to the authority hereinafter granted by me / us to the Broker.
                            </p>
                            <p>
                              In the event of my / our failure to settle the amounts due in respect of a share purchase, I / we do hereby irrevocably authorize the Broker to sell such securities involved in the default and if such proceeds are inadequate to cover the shortfall and any loss incurred by the Broker, to sell any other security in my / our portfolio held by the Broker in the Central Depository Systems (Pvt) Ltd., so that the full amount due to the Broker may be settled and any surplus arising on the sale of shares shall accrue to the Broker unless such surplus arise from the sale of other quoted shares deposited by the buyer as collateral with broker in which event the surplus shall be remitted to after settlement day of the relevant sale(s).
                            </p>
                            <p>
                              The funds to be invested for the purchase of Securities through the Securities Account to be opened with the CDS will not be funds derived from any money laundering activity or funds generated through financing of terrorist or any other illegal activity.
                            </p>
                            <p>
                              In the event of a variation of any information given in the CDS Form 1, Addendum to CDS Form 1 (A) this declaration and other information submitted by me / us along with the application to open a CDS Account, I / we undertake to inform the CDS in writing within fourteen (14) days of such variation.
                            </p>
                            <p>
                              Change of Broker Material Information (Ownership / Address) will be notified over public notice in printed Media.
                            </p>
                            <p>
                              The irrevocable authority granted hereby shall in no way effect or exempt me / us from any liability as stated herein towards the BROKER arising from or consequent upon any such default.
                            </p>
                            <p>
                              Also I / we do hereby irrevocably agree that in the event of any purchase orders placed with you for the purchase of shares, I / we shall pay approximately 50% of the value of such purchase by a legal tender which amount shall be set off against the total amount due from me / us to you on the due date of settlement in respect of such purchases, and the relevant investment advisors may be incentiviced by the company on such purchase and sales turnovers.
                            </p>
                            <p>
                              Any delayed payments will be subject to additional interest cost on the consideration and will be debited to my / our account. Interest percentage will be decided by the Broker considering the prevailing interest rates. (not exceeding a maximum interest rate of 0.1% per day)
                            </p>
                            <p>
                              The risk disclosure statement was explained while advising independently and was invited to read and ask questions.
                            </p>
                            <p>
                              Services provided: - Online Facility, Research Reports.
                            </p>
                          </div>
                        </div>

                        {/* <div className="rounded-[20px] border border-dashed border-zinc-300 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                          <Field label="Advisor's Signature">
                            <FileUpload
                              label="Upload signature (optional)"
                              value={getByPath(form, "fiClientRegistration.officeUseOnly.advisorsSignature") || null}
                              setValue={(file) => update("fiClientRegistration.officeUseOnly.advisorsSignature", file)}
                              accept="image/*,application/pdf"
                              path="fiClientRegistration.officeUseOnly.advisorsSignature"
                            />
                          </Field>
                        </div> */}
                      </div>

                {/* <div className="mt-6 space-y-5 rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950/70 dark:via-zinc-900/50 dark:to-zinc-900/20"> */}
                  {/* <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Client Declaration & Authorization</div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Additional registration details</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Added directly under the risk disclosure area in a clean card layout to match the image flow while keeping the form more polished and easy to read.</p>
                  </div> */}

                  {/* <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"> */}
                    {/* <div className="rounded-[24px] border border-zinc-200 bg-white/85 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 xl:col-span-2">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Authorized Instructions</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">Name, address and introducing agent details.</div>
                        </div>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">Client Registration</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        
                      </div>
                    </div> */}

                    {/* <div className="rounded-[24px] border border-zinc-200 bg-white/85 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30">
                      
                    </div> */}

                    
                  {/* </div> */}
                {/* </div> */}

          {/* <div className="mt-6 space-y-4 rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950/70 dark:via-zinc-900/50 dark:to-zinc-900/20"> */}
            {/* <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Client Registration Additions</div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Word layout fields placed after Risk of Security Trading</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Clean card-style inputs added to match the Word document flow. These fields now sit directly under the risk acknowledgement area.</p>
            </div> */}

            {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"> */}
              {/* <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30">
                <div className="mb-3">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Declaration by the Staff</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Select the investment advisor exactly in the Word-file style.</div>
                </div>
                
              </div> */}

              {/* <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30"> */}
                {/* <div className="mb-3">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Investment Decision</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Styled to match the Word document wording.</div>
                </div> */}
                

                {/* {getByPath(form, "fiClientRegistration.investmentDecision.type") === "Discretionary" ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                    <Field label="Letter of Discretionary">
                      <FileUpload
                        label="Upload letter of discretionary"
                        value={getByPath(form, "fiClientRegistration.investmentDecision.discretionaryLetter") || null}
                        setValue={(file) => update("fiClientRegistration.investmentDecision.discretionaryLetter", file)}
                        accept="image/*,application/pdf"
                        path="fiClientRegistration.investmentDecision.discretionaryLetter"
                      />
                    </Field>
                  </div>
                ) : null} */}
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}
          
        </div>
        
      </Card>

      <Card title="Know Your Customer (KYC) Profile" subtitle="">
        {(() => {
          const holders = [
            { key: "main", label: "Main", enabled: true },
            { key: "joint1", label: "Joint 1", enabled: jointEnabled },
            { key: "joint2", label: "Joint 2", enabled: secondJointEnabled },
          ];

          const dualSelections = Array.isArray(getByPath(form, "fiClientRegistration.kycProfile.dualCitizenshipSelection"))
            ? getByPath(form, "fiClientRegistration.kycProfile.dualCitizenshipSelection")
            : ["", "", ""];

          const setDualSelection = (index, holderKey) => {
            const next = [...dualSelections];
            next[index] = holderKey;
            update("fiClientRegistration.kycProfile.dualCitizenshipSelection", next);
          };

          const dualRows = [0, 1, 2];

          return (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950/70 dark:via-zinc-900/50 dark:to-zinc-900/20">
                {/* <div className="flex flex-col gap-2 rounded-3xl border border-zinc-200/80 bg-white/80 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <div className="text-center text-base font-semibold tracking-[0.2em] text-zinc-900 dark:text-zinc-100">
                    KNOW YOUR CUSTOMER (KYC) PROFILE
                  </div>
                  <p className="text-center text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                    Foreign Individual KYC now follows the same clean table flow and section order used in the Local Individual KYC area.
                  </p>
                </div> */}

                <div className="mt-6 space-y-6">
                  <div>
                    <KycSectionHeader n="1" title="Documents Provided" />
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/75 dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                        <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">KYC</div>
                        {holders.map((holder) => (
                          <div
                            key={`fi-kyc-head-${holder.key}`}
                            className={`border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 text-center text-xs font-semibold dark:border-zinc-800 ${holder.enabled ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-500"}`}
                          >
                            {holder.label}
                          </div>
                        ))}
                      </div>

                      {[
                        ["National Identity Card", "fiClientRegistration.kycProfile.documentsProvided.forKyc.nationalIdentityCard"],
                        ["Passport", "fiClientRegistration.kycProfile.documentsProvided.forKyc.passport"],
                        ["Driving License", "fiClientRegistration.kycProfile.documentsProvided.forKyc.drivingLicense", "An Affidavit is required confirming the fact that both NIC / Passport are not available."],
                      ].map(([label, basePath, note]) => (
                        <div key={basePath} className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                          <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                            <div>{label}</div>
                            {note ? <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">({note})</div> : null}
                          </div>
                          {holders.map((holder) => (
                            <div key={`${basePath}.${holder.key}`} className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800">
                              <KycCellCheck path={`${basePath}.${holder.key}`} form={form} update={update} disabled={!holder.enabled} />
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                        <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">Proof of Residency</div>
                        {holders.map((holder) => (
                          <div key={`fi-proof-section-${holder.key}`} className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800">
                            <KycCellCheck path={`fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.section.${holder.key}`} form={form} update={update} disabled={!holder.enabled} />
                          </div>
                        ))}
                      </div>

                      {[
                        ["National Identity Card", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.nationalIdentityCard"],
                        ["Bank/ Credit card Statement", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.bankOrCreditCardStatement"],
                        ["Telephone Bill", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.telephoneBill"],
                        ["Electricity/Water Bill", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.electricityWaterBill"],
                        ["Registered Lease Agreement", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.registeredLeaseAgreement"],
                        ["Gramasevaka Certificate certified by the Divisional Secretary", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.gramasevakaCertificate"],
                        ["Letter issued by superintendent of a plantation estate in respect of estate workers who have no other documentary proof.", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.plantationSuperintendentLetter"],
                        ["Any Other Document (Please Specify)", "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther"],
                      ].map(([label, basePath]) => (
                        <div key={basePath} className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                          <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">{label}</div>
                          {holders.map((holder) => (
                            <div key={`${basePath}.${holder.key}`} className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800">
                              <KycCellCheck path={`${basePath}.${holder.key}`} form={form} update={update} disabled={!holder.enabled} />
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="grid grid-cols-[minmax(0,1fr)_90px_90px_90px] md:grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                        <div className="border-r border-zinc-200 px-3 py-3 dark:border-zinc-800">
                          <Input
                            value={getByPath(form, "fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther.specify") || ""}
                            onChange={(e) => update("fiClientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther.specify", e.target.value)}
                            placeholder="Please specify"
                          />
                        </div>
                        <div className="border-r border-zinc-200 dark:border-zinc-800" />
                        <div className="border-r border-zinc-200 dark:border-zinc-800" />
                        <div />
                      </div>

                      <div className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        Note: These documents should be within (3) months as of the date of submission of the CDS Account opening form.
                      </div>
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="2" title="Status of Residency Address (Premises)" />
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/75 dark:border-zinc-800 dark:bg-zinc-950/30">
                      <KycResidencyRow label="Owner" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.owner" form={form} update={update} holders={holders} />
                      <KycResidencyRow label="With parents" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.withParents" form={form} update={update} holders={holders} />
                      <KycResidencyRow label="Lease / Rent" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.leaseRent" form={form} update={update} holders={holders} />
                      <KycResidencyRow label="Friends / Relatives" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.friendsRelatives" form={form} update={update} holders={holders} />
                      <KycResidencyRow label="Board / Lodging" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.boardLodging" form={form} update={update} holders={holders} />
                      <KycResidencyRow label="Official" basePath="fiClientRegistration.kycProfile.residencyAddressStatus.official" form={form} update={update} holders={holders} />
                      <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 p-4 md:grid-cols-[minmax(0,1fr)_220px] dark:border-zinc-800">
                        <Field label="Other Places">
                          <Input
                            value={getByPath(form, "fiClientRegistration.kycProfile.residencyAddressStatus.otherPlaces.specify") || ""}
                            onChange={(e) => update("fiClientRegistration.kycProfile.residencyAddressStatus.otherPlaces.specify", e.target.value)}
                            placeholder="Please specify"
                          />
                        </Field>
                        <div className="grid grid-cols-3 gap-2 md:pt-7">
                          {holders.map((holder) => (
                            <div key={`other-place-${holder.key}`} className="rounded-2xl border border-zinc-200 px-3 py-3 text-center dark:border-zinc-800">
                              <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${holder.enabled ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-500"}`}>{holder.label}</div>
                              <KycCellCheck path={`fiClientRegistration.kycProfile.residencyAddressStatus.otherPlaces.${holder.key}`} form={form} update={update} disabled={!holder.enabled} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="3" title="Dual Citizenship" />
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/75 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="grid grid-cols-[140px_1fr_1fr] md:grid-cols-[180px_1fr_1fr]">
                        <div className="border-b border-r border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">Holder</div>
                        <div className="border-b border-r border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">Country</div>
                        <div className="border-b border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">Passport No</div>
                      </div>

                      {dualRows.map((rowIndex) => (
                        <div key={`dual-row-${rowIndex}`} className="grid grid-cols-[140px_1fr_1fr] md:grid-cols-[180px_1fr_1fr]">
                          <div className="border-b border-r border-zinc-200 px-3 py-3 dark:border-zinc-800">
                            <div className="space-y-2">
                              {holders.map((holder) => (
                                <label key={`dual-holder-${rowIndex}-${holder.key}`} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs transition ${holder.enabled ? "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900/40" : "text-zinc-400 dark:text-zinc-500"}`}>
                                  <input
                                    type="radio"
                                    name={`fi-dual-holder-${rowIndex}`}
                                    disabled={!holder.enabled}
                                    checked={dualSelections[rowIndex] === holder.key}
                                    onChange={() => setDualSelection(rowIndex, holder.key)}
                                    className="h-4 w-4 accent-red-600 dark:accent-red-500"
                                  />
                                  <span className="truncate">{holder.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="border-b border-r border-zinc-200 px-3 py-3 dark:border-zinc-800">
                            <Input
                              value={getByPath(form, `fiClientRegistration.kycProfile.dualCitizenship.${dualSelections[rowIndex] || "main"}.${rowIndex}.country`) || ""}
                              onChange={(e) => update(`fiClientRegistration.kycProfile.dualCitizenship.${dualSelections[rowIndex] || "main"}.${rowIndex}.country`, e.target.value)}
                              placeholder="Country"
                            />
                          </div>
                          <div className="border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
                            <Input
                              value={getByPath(form, `fiClientRegistration.kycProfile.dualCitizenship.${dualSelections[rowIndex] || "main"}.${rowIndex}.passportNo`) || ""}
                              onChange={(e) => update(`fiClientRegistration.kycProfile.dualCitizenship.${dualSelections[rowIndex] || "main"}.${rowIndex}.passportNo`, e.target.value)}
                              placeholder="Passport No"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="4" title="Are you a US person under the Foreign Account Tax Compliance Act (FATCA) of the US?" />
                    <KycHolderPills holders={holders} />
                    <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white/80 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_110px] md:grid-cols-[minmax(0,1fr)_120px_120px_120px]">
                        <div className="border-b border-r border-zinc-200 px-4 py-3 dark:border-zinc-800" />
                        {holders.map((holder) => (
                          <div key={`fatca-head-${holder.key}`} className="border-b border-r last:border-r-0 border-zinc-200 px-3 py-3 text-center text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                            {holder.label}
                          </div>
                        ))}
                      </div>

                      {[
                        ["Yes", "If yes, FATCA declaration has to be submitted along with application form"],
                        ["No", "In the event if I/We become a US person under FATCA of US, I/We do hereby undertake to inform the said fact to the Participant immediately"],
                      ].map(([answer, note]) => (
                        <div key={`fatca-${answer}`} className="grid grid-cols-[minmax(0,1fr)_110px_110px_110px] md:grid-cols-[minmax(0,1fr)_120px_120px_120px]">
                          <div className="border-b border-r border-zinc-200 px-4 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                            <span className="font-semibold">{answer}</span>
                            <span className="text-zinc-500 dark:text-zinc-400"> ({note})</span>
                          </div>
                          {holders.map((holder) => (
                            <div key={`fatca-${answer}-${holder.key}`} className="border-b border-r last:border-r-0 border-zinc-200 px-3 py-4 dark:border-zinc-800">
                              <label className={`flex items-center justify-center ${holder.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}>
                                <input
                                  type="checkbox"
                                  checked={(getByPath(form, `fiClientRegistration.kycProfile.fatcaUsPerson.${holder.key}`) || "") === answer}
                                  disabled={!holder.enabled}
                                  onChange={() => update(`fiClientRegistration.kycProfile.fatcaUsPerson.${holder.key}`, answer)}
                                  className="h-5 w-5 rounded border-zinc-400 accent-red-600 dark:border-zinc-600 dark:accent-red-500"
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="5" title="Employment" />
                    <KycHolderPills holders={holders} />
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {holders.map((holder) => {
                        const employmentBase = `fiClientRegistration.kycProfile.employment.${holder.key}`;
                        return (
                          <KycProfileCard key={`employment-${holder.key}`} title={holder.label} enabled={holder.enabled}>
                            <div className="grid grid-cols-1 gap-4">
                              <Field label="Status">
                                <Select
                                  value={getByPath(form, `${employmentBase}.status`) || ""}
                                  onChange={(e) => update(`${employmentBase}.status`, e.target.value)}
                                  disabled={!holder.enabled}
                                >
                                  <option value="">Select</option>
                                  <option value="Employed">Employed</option>
                                  <option value="Self Employed">Self Employed</option>
                                  {/* <option value="Business Owner">Business Owner</option>
                                  <option value="Retired">Retired</option>
                                  <option value="Student">Student</option>
                                  <option value="Unemployed">Unemployed</option>
                                  <option value="Other">Other</option> */}
                                </Select>
                              </Field>

                              <Field label="Occupation / Nature of Business">
                                <Input
                                  value={getByPath(form, `${employmentBase}.occupationNature`) || ""}
                                  onChange={(e) => update(`${employmentBase}.occupationNature`, e.target.value)}
                                  placeholder="Occupation / Nature of Business"
                                  disabled={!holder.enabled}
                                />
                              </Field>

                              <Field label="Name of the Business / Organization">
                                <Input
                                  value={getByPath(form, `${employmentBase}.businessOrganizationName`) || ""}
                                  onChange={(e) => update(`${employmentBase}.businessOrganizationName`, e.target.value)}
                                  placeholder="Business / Organization"
                                  disabled={!holder.enabled}
                                />
                              </Field>

                              <Field label="Office Address">
                                <Input
                                  value={getByPath(form, `${employmentBase}.officeAddress`) || ""}
                                  onChange={(e) => update(`${employmentBase}.officeAddress`, e.target.value)}
                                  placeholder="Office Address"
                                  disabled={!holder.enabled}
                                />
                              </Field>

                              <Field label="Telephone">
                                <PhoneInput
                                  value={getByPath(form, `${employmentBase}.telephone`) || ""}
                                  onChange={(v) => update(`${employmentBase}.telephone`, v)}
                                  placeholder="Telephone"
                                  path={`${employmentBase}.telephone`}
                                  disabled={!holder.enabled}
                                />
                              </Field>

                              <Field label="Fax">
                                <Input
                                  value={getByPath(form, `${employmentBase}.fax`) || ""}
                                  onChange={(e) => update(`${employmentBase}.fax`, e.target.value)}
                                  placeholder="Fax"
                                  disabled={!holder.enabled}
                                />
                              </Field>

                              <Field label="E-mail">
                                <Input
                                  type="email"
                                  value={getByPath(form, `${employmentBase}.email`) || ""}
                                  onChange={(e) => update(`${employmentBase}.email`, e.target.value)}
                                  placeholder="E-mail"
                                  disabled={!holder.enabled}
                                />
                              </Field>
                            </div>
                          </KycProfileCard>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="6" title="Expected Value of Investment per annum" />
                    <KycHolderPills holders={holders} />
                    <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {holders.map((holder) => {
                          const path = `fiClientRegistration.kycProfile.expectedInvestmentPerAnnum.${holder.key}`;
                          return (
                            <KycProfileCard key={`expected-${holder.key}`} title={holder.label} enabled={holder.enabled} className="border-zinc-200/80 shadow-none dark:border-zinc-800">
                              <Field label={holder.label}>
                                <Select value={getByPath(form, path) || ""} onChange={(e) => update(path, e.target.value)} disabled={!holder.enabled}>
                                  <option value="">Select</option>
                                  <option value="Less than Rs. 100,000">Less than Rs. 100,000</option>
                                  <option value="Rs 100,000 to Rs 500,000">Rs 100,000 to Rs 500,000</option>
                                  <option value="Rs 500,000 to Rs 1,000,000">Rs 500,000 to Rs 1,000,000</option>
                                  <option value="Rs 1,000,000 to Rs 2,000,000">Rs 1,000,000 to Rs 2,000,000</option>
                                  <option value="Rs 2,000,000 to Rs 3,000,000">Rs 2,000,000 to Rs 3,000,000</option>
                                  <option value="Rs 3,000,000 to Rs 4,000,000">Rs 3,000,000 to Rs 4,000,000</option>
                                  <option value="Rs 4,000,000 to Rs 5,000,000">Rs 4,000,000 to Rs 5,000,000</option>
                                  <option value="Rs 5,000,000 to Rs 10,000,000">Rs 5,000,000 to Rs 10,000,000</option>
                                  <option value="Over Rs 10,000,000">Over Rs 10,000,000</option>
                                </Select>
                              </Field>
                            </KycProfileCard>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="7" title="Source of funds" />
                    <KycHolderPills holders={holders} />
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {holders.map((holder) => {
                        const sourceBase = `fiClientRegistration.kycProfile.sourceOfFunds.${holder.key}`;
                        return (
                          <KycProfileCard key={`source-${holder.key}`} title={holder.label} enabled={holder.enabled}>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
                              {[
                                ["Salary / Profit Income", "salaryProfitIncome"],
                                ["Investment Proceeds / Savings", "investmentProceedsSavings"],
                                ["Sales and Business Turnover", "salesBusinessTurnover"],
                                ["Contract Proceeds", "contractProceeds"],
                                ["Sales of Property/Assets", "salesOfPropertyAssets"],
                                ["Gifts", "gifts"],
                                ["Donations / Charities (Local / Foreign)", "donationsCharities"],
                                ["Commission Income", "commissionIncome"],
                                ["Family Remittance", "familyRemittance"],
                                ["Export proceeds", "exportProceeds"],
                                ["Membership contribution", "membershipContribution"],
                                ["Others (Specify)", "others"],
                              ].map(([label, key]) => (
                                <KycSourceOption
                                  key={`${holder.key}-${key}`}
                                  label={label}
                                  checked={!!getByPath(form, `${sourceBase}.${key}`)}
                                  onChange={(value) => update(`${sourceBase}.${key}`, value)}
                                  disabled={!holder.enabled}
                                />
                              ))}
                            </div>

                            <div className="mt-4">
                              <Field label="If Others, specify">
                                <Input
                                  value={getByPath(form, `${sourceBase}.othersSpecify`) || ""}
                                  onChange={(e) => update(`${sourceBase}.othersSpecify`, e.target.value)}
                                  placeholder="Specify other source of funds"
                                  disabled={!holder.enabled}
                                />
                              </Field>
                            </div>
                          </KycProfileCard>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="8" title="Any other connected Businesses / Professional activities" />
                    <KycHolderPills holders={holders} />
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {holders.map((holder) => (
                        <KycProfileCard key={`business-${holder.key}`} title={holder.label} enabled={holder.enabled}>
                          <Field label={holder.label}>
                            <KycTextarea
                              value={getByPath(form, `fiClientRegistration.kycProfile.otherConnectedBusinesses.${holder.key}`) || ""}
                              onChange={(e) => update(`fiClientRegistration.kycProfile.otherConnectedBusinesses.${holder.key}`, e.target.value)}
                              disabled={!holder.enabled}
                              placeholder="Type here..."
                              rows={4}
                            />
                          </Field>
                        </KycProfileCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="9" title="Politically Exposed Persons (PEPs)" />
                    <KycHolderPills holders={holders} />
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {holders.map((holder) => (
                        <KycPepCard
                          key={`pep-${holder.key}`}
                          holderKey={holder.key}
                          label={holder.label}
                          enabled={holder.enabled}
                          form={form}
                          update={update}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="10" title="Risk Categorization (Office use only)" />
                    <KycHolderPills holders={holders} />
                    <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <KycRiskSelect pathBase="fiClientRegistration.kycProfile.riskCategorizationOfficeUse" holders={holders} form={form} update={update} />
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="11" title="Name of the person(s) authorized to give instructions to the Participant" />
                    <KycHolderPills holders={holders} />
                    <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <KycTextarea
                        value={getByPath(form, "fiClientRegistration.kycProfile.authorizedToGiveInstructions") || ""}
                        onChange={(e) => update("fiClientRegistration.kycProfile.authorizedToGiveInstructions", e.target.value)}
                        placeholder=""
                        rows={4}
                      />
                      <div className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <div>Please Attach a duly certified copy of Power of Attorney if applicable.</div>
                        <div>Participant means your Stockbroker or Custodian Bank.</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <KycSectionHeader n="12" title="Other remarks / notes (if any)" />
                    <KycHolderPills holders={holders} />
                    <div className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/30">
                      <KycTextarea
                        value={getByPath(form, "fiClientRegistration.kycProfile.otherRemarksNotes") || ""}
                        onChange={(e) => update("fiClientRegistration.kycProfile.otherRemarksNotes", e.target.value)}
                        placeholder="Type here..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Card>

      <Card title="Client Agreement" subtitle="">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-zinc-100/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:from-zinc-950/80 dark:via-zinc-900/60 dark:to-zinc-900/30">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              {/* <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">Client Agreement</div>
                <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Separate FI client agreement details</div>
              </div> */}
              {/* <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                Full Agreement View
              </div> */}
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                This Agreement is made and entered into on this day of
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="DD">
                  <Input value={getByPath(form, "fiClientRegistration.clientAgreement.date.day") || ""} onChange={(e) => update("fiClientRegistration.clientAgreement.date.day", e.target.value)} placeholder="DD" />
                </Field>
                <Field label="MM">
                  <Input value={getByPath(form, "fiClientRegistration.clientAgreement.date.month") || ""} onChange={(e) => update("fiClientRegistration.clientAgreement.date.month", e.target.value)} placeholder="MM" />
                </Field>
                <Field label="YYYY">
                  <Input value={getByPath(form, "fiClientRegistration.clientAgreement.date.year") || ""} onChange={(e) => update("fiClientRegistration.clientAgreement.date.year", e.target.value)} placeholder="YYYY" />
                </Field>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">By and Between</div>
                {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">Auto-filled party details</div> */}
              </div>

              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="rounded-[22px] border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="mb-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-zinc-300 bg-white px-2 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                      ({index + 1})
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                      <div className="md:col-span-4">
                        <Field label="Name">
                          <Input value={getByPath(form, `fiClientRegistration.clientAgreement.parties.${index}.name`) || ""} onChange={(e) => update(`fiClientRegistration.clientAgreement.parties.${index}.name`, e.target.value)} placeholder="Enter Name" />
                        </Field>
                      </div>
                      <div className="md:col-span-3">
                        <Field label="bearing National Identity Card No / Company registration No.">
                          <Input value={getByPath(form, `fiClientRegistration.clientAgreement.parties.${index}.idNo`) || ""} onChange={(e) => update(`fiClientRegistration.clientAgreement.parties.${index}.idNo`, e.target.value)} placeholder="NIC / Reg No" />
                        </Field>
                      </div>
                      <div className="md:col-span-5">
                        <Field label="Address">
                          <Input value={getByPath(form, `fiClientRegistration.clientAgreement.parties.${index}.address`) || ""} onChange={(e) => update(`fiClientRegistration.clientAgreement.parties.${index}.address`, e.target.value)} placeholder="Address" />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50/90 p-4 shadow-soft dark:border-zinc-800 dark:from-zinc-950/55 dark:via-zinc-950/35 dark:to-zinc-900/30">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    {/* <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                      Agreement Preview
                    </div> */}
                    <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      (hereinafter sometimes jointly and severally referred to as the <span className="font-semibold">&quot;Client/s&quot;</span>) of the One Part ... This agreement covers the rights and responsibilities of the Client/s and the Stockbroker Firm, risk disclosures, indemnity, termination terms, and the final witness clause.
                    </p>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Click the button to read the full agreement.
                    </p>
                  </div>

                  <div className="lg:pl-4">
                    <button
                      type="button"
                      onClick={() => setShowClientAgreementModal(true)}
                      className="inline-flex items-center justify-center rounded-2xl border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      View Full Agreement
                    </button>
                  </div>
                </div>
              </div>

              {showClientAgreementModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
                  <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center justify-between border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-white px-5 py-4 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
                      <div>
                        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Client Agreement</div>
                        {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">Full agreement text for the Foreign Individual flow.</div> */}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowClientAgreementModal(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                        aria-label="Close agreement popup"
                      >
                        ×
                      </button>
                    </div>

                    <div className="max-h-[78vh] overflow-y-auto p-5">
                      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 text-sm leading-7 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                        {FOREIGN_INDIVIDUAL_CLIENT_AGREEMENT_TERMS.map((item, idx) => (
                          typeof item === "string" ? (
                            <p key={idx} className="mb-4 last:mb-0">{item}</p>
                          ) : (
                            <div key={idx} className="mb-4 mt-6 text-base font-semibold uppercase tracking-[0.08em] text-zinc-900 dark:text-zinc-100">
                              {item.text}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Privacy Notice & Data Collection Consent Clause" subtitle="">
        <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-3 text-sm text-sky-900 shadow-[0_12px_35px_rgba(14,165,233,0.12)] dark:border-sky-900/60 dark:from-sky-950/30 dark:via-zinc-950/30 dark:to-cyan-950/20 dark:text-sky-100">
          By submitting this form, you acknowledge and agree that <span className="font-semibold">Asha Securities Limited</span> ("Company") may collect, process, and store your personal data in accordance with its Privacy Policy.
        </div>

        <div className="mt-4 rounded-[28px] border border-zinc-200 bg-white/80 p-5 text-[13px] leading-7 text-zinc-700 shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-300">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                1. Types of Data Collected
              </h4>
              <p className="mt-1">
                The Company collects personal data, including but not limited to, your name, contact details, passport or identification details, financial information, tax-related information, and any other relevant details necessary for providing brokerage and related services.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                2. Purpose of Data Collection
              </h4>
              <p className="mt-1">
                Your personal data is collected for the purposes of account onboarding, account management, regulatory compliance, transaction processing, customer support, and improving our services.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                3. Third-Party Sharing
              </h4>
              <p className="mt-1">
                Your data may be shared with authorized third-party service providers, correspondent banks, custodians, regulators, or other authorities where required by law, solely for operational, settlement, and compliance purposes.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                4. Data Retention
              </h4>
              <p className="mt-1">
                Your personal data will be retained only for the period necessary to fulfill the purposes outlined in this notice or as required by applicable laws and regulations.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                5. User Rights &amp; Consent
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>You have the right to access, correct, or request the deletion of your personal data, subject to applicable legal obligations.</li>
                <li>By checking the boxes below, you confirm that you have read and understood this notice and consent to the collection, processing, and storage of your personal data.</li>
                <li>If applicable, you may provide additional consent for third-party sharing and marketing communications.</li>
              </ul>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <label className="group flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white/85 px-4 py-3 text-sm text-zinc-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_16px_40px_rgba(14,165,233,0.12)] dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                <input
                  type="checkbox"
                  checked={!!getByPath(form, "fiClientRegistration.privacyConsent.consentDataProcessing")}
                  onChange={(e) => update("fiClientRegistration.privacyConsent.consentDataProcessing", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                <span>
                  I consent to the collection, processing, and storage of my personal data in accordance with the Company&apos;s Privacy Policy.
                </span>
              </label>

              <label className="group flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white/85 px-4 py-3 text-sm text-zinc-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_16px_40px_rgba(14,165,233,0.12)] dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                <input
                  type="checkbox"
                  checked={!!getByPath(form, "fiClientRegistration.privacyConsent.consentThirdPartySharing")}
                  onChange={(e) => update("fiClientRegistration.privacyConsent.consentThirdPartySharing", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                <span>
                  I agree to share my data with third-party service providers for specified operational, settlement, and compliance purposes.
                </span>
              </label>

              <label className="group flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white/85 px-4 py-3 text-sm text-zinc-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_16px_40px_rgba(14,165,233,0.12)] dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                <input
                  type="checkbox"
                  checked={!!getByPath(form, "fiClientRegistration.privacyConsent.consentMarketing")}
                  onChange={(e) => update("fiClientRegistration.privacyConsent.consentMarketing", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                <span>
                  I would like to receive promotional updates and service announcements via email/SMS.
                </span>
              </label>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                6. Privacy Policy
              </h4>
              <p className="mt-1">
                For more details on how your data is handled, please refer to our full Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* <Card title="Status" subtitle="Quick FI summary">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">Joint applicant: <span className="font-semibold">{jointEnabled ? "Enabled" : "Disabled"}</span></div>
            <div className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">2nd joint: <span className="font-semibold">{secondJointEnabled ? "Enabled" : "Disabled"}</span></div>
          </div>
        </Card> */}
        {/* <Card title="Uploads" subtitle="Core FI supporting files">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Discretionary letter (if applicable)">
              <FileUpload
                label="Upload discretionary letter"
                value={getByPath(form, "fiClientRegistration.investmentDecision.discretionaryLetter") || null}
                setValue={(file) => update("fiClientRegistration.investmentDecision.discretionaryLetter", file)}
                accept="image/*,application/pdf"
                path="fiClientRegistration.investmentDecision.discretionaryLetter"
              />
            </Field>
          </div>
        </Card> */}
      </div>
    </div>
  );
}
