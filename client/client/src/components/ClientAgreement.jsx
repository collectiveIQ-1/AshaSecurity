import { useState } from "react";
import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";

const Para = ({ children }) => (
  <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-200/90">
    {children}
  </p>
);

export default function ClientAgreement(props) {
  const {
    form,
    update,
    busy,

    // uploads from Wizard state
    agreementPrincipalSig,
    setAgreementPrincipalSig,
    principalSig,
    setPrincipalSig,
    jointSig,
    setJointSig,
    secondJointSig,
    setSecondJointSig,
    agreementJointSig,
    setAgreementJointSig,
    agreementSecondJointSig,
    setAgreementSecondJointSig,
    agreementFirmSig,
    setAgreementFirmSig,
    agreementWitness1Sig,
    setAgreementWitness1Sig,
    agreementWitness2Sig,
    setAgreementWitness2Sig,
    jointEnabled,
    secondJointEnabled,

    onPrev,
    onNext,
  } = props;

  const ca = form?.clientAgreement || {};
  const date = ca?.date || {};
  const parties = Array.isArray(ca?.parties) ? ca.parties : [];

  const p0 = parties[0] || { name: "", nicNo: "", address: "" };
  const p1 = parties[1] || { name: "", nicNo: "", address: "" };
  const p2 = parties[2] || { name: "", nicNo: "", address: "" };

  const accepted = !!ca?.accepted;

  const digitsOnly = (v) => (v || "").replace(/[^\d]/g, "");
  const notify = props?.notify || ((msg) => window.alert(msg));

  const isInRange = (v, min, max) => {
    if (v === "" || v == null) return true; // empty allowed here
    const n = Number(v);
    return Number.isInteger(n) && n >= min && n <= max;
  };

  // ✅ More / Less toggle for agreement body
  const [showAllAgreement, setShowAllAgreement] = useState(false);

  return (
    <div className="space-y-4">
      {/* Dark document container */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="text-center text-lg font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
          CLIENT AGREEMENT
        </div>

        <br />

        <div className="md:col-span-4">
          <Field label="This Agreement is made and entered into on this day of"></Field>
        </div>

        {/* Date row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <Field label="Date">
              <Input path="clientAgreement.date.day"
                placeholder="Day"
                inputMode="numeric"
                value={date.day || ""}
                onChange={(e) => {
                  // digits only, max 2 chars while typing
                  const raw = digitsOnly(e.target.value).slice(0, 2);
                  update("clientAgreement.date.day", raw);
                }}
                onBlur={(e) => {
                  const raw = digitsOnly(e.target.value).slice(0, 2);
                  if (raw && !isInRange(raw, 1, 31)) {
                    notify("Invalid date.");
                    update("clientAgreement.date.day", ""); // clear it
                    return;
                  }
                  update("clientAgreement.date.day", raw);
                }}
                disabled={busy}
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Month">
              <Input path="clientAgreement.date.month"
                placeholder="Month"
                inputMode="numeric"
                value={date.month || ""}
                onChange={(e) => {
                  // digits only, max 2 chars while typing
                  const raw = digitsOnly(e.target.value).slice(0, 2);
                  update("clientAgreement.date.month", raw);
                }}
                onBlur={(e) => {
                  const raw = digitsOnly(e.target.value).slice(0, 2);
                  if (raw && !isInRange(raw, 1, 12)) {
                    notify("Invalid month.");
                    update("clientAgreement.date.month", ""); // clear it
                    return;
                  }
                  update("clientAgreement.date.month", raw);
                }}
                disabled={busy}
              />
            </Field>
          </div>

          <div className="md:col-span-4">
            <Field label="Year">
              <Input
                    path={"clientAgreement.date.year"}
                placeholder="Year"
                value={date.year || ""}
                onChange={(e) => update("clientAgreement.date.year", e.target.value)}
                disabled={busy}
              />
            </Field>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-8 text-sm font-semibold text-zinc-900 dark:text-zinc-100">By and Between</div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Principal (0) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-xs text-zinc-700 dark:text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-3">(1)</div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <Field label="Name">
                  <Input path="clientRegistration.principal.namesByInitials"
                    placeholder="Enter Name"
                    value={form.clientRegistration.principal.namesByInitials || ""}
                    onChange={(e) =>
                      update("clientRegistration.principal.namesByInitials", e.target.value)
                    }
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-6">
                <Field label="Bearing National Identity Card No">
                  <Input
                    path={"clientRegistration.principal.nic"}
                    placeholder="Enter NIC"
                    value={form.clientRegistration.principal.nic || ""}
                    onChange={(e) => update("clientRegistration.principal.nic", e.target.value)}
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-12">
                <Field label="Address">
                  <Input path="clientRegistration.principal.permanentAddress"
                    placeholder="Enter Address"
                    value={form.clientRegistration.principal.permanentAddress || ""}
                    onChange={(e) =>
                      update(
                        "clientRegistration.principal.permanentAddress",
                        e.target.value
                      )
                    }
                    disabled={busy}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Joint (1) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-xs text-zinc-700 dark:text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-3">(2)</div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <Field label="Name">
                  <Input path="clientRegistration.jointApplicant.namesByInitials"
                    placeholder="Enter Name"
                    value={form.clientRegistration.jointApplicant.namesByInitials || ""}
                    onChange={(e) =>
                      update("clientRegistration.jointApplicant.namesByInitials", e.target.value)
                    }
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-6">
                <Field label="Bearing National Identity Card No">
                  <Input path="clientRegistration.jointApplicant.nic"
                    placeholder="Enter NIC"
                    value={form.clientRegistration.jointApplicant.nic || ""}
                    onChange={(e) =>
                      update("clientRegistration.jointApplicant.nic", e.target.value)
                    }
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-12">
                <Field label="Address">
                  <Input path="clientRegistration.jointApplicant.permanentAddress"
                    placeholder="Enter Address"
                    value={form.clientRegistration.jointApplicant.permanentAddress || ""}
                    onChange={(e) =>
                      update(
                        "clientRegistration.jointApplicant.permanentAddress",
                        e.target.value
                      )
                    }
                    disabled={busy}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* 2nd Joint (2) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-xs text-zinc-700 dark:text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-3">(3)</div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <Field label="Name">
                  <Input path="clientRegistration.secondJointApplicant.namesByInitials"
                    placeholder="Enter Name"
                    value={form.clientRegistration.secondJointApplicant.namesByInitials || ""}
                    onChange={(e) =>
                      update(
                        "clientRegistration.secondJointApplicant.namesByInitials",
                        e.target.value
                      )
                    }
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-6">
                <Field label="Bearing National Identity Card No">
                  <Input path="clientRegistration.secondJointApplicant.nic"
                    placeholder="Enter NIC"
                    value={form.clientRegistration.secondJointApplicant.nic || ""}
                    onChange={(e) =>
                      update(
                        "clientRegistration.secondJointApplicant.nic",
                        e.target.value
                      )
                    }
                    disabled={busy}
                  />
                </Field>
              </div>

              <div className="md:col-span-12">
                <Field label="Address">
                  <Input path="clientRegistration.secondJointApplicant.residentialAddress"
                    placeholder="Enter Address"
                    value={form.clientRegistration.secondJointApplicant.residentialAddress || ""}
                    onChange={(e) =>
                      update(
                        "clientRegistration.secondJointApplicant.residentialAddress",
                        e.target.value
                      )
                    }
                    disabled={busy}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Agreement body with More / Less */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Client Agreement</div>

            <button
              type="button"
              onClick={() => setShowAllAgreement((v) => !v)}
              className="text-sm font-medium underline underline-offset-4 text-blue-700 hover:text-blue-800 dark:text-white dark:hover:text-zinc-900 dark:text-zinc-100"
            >
              {showAllAgreement ? "Less" : "More"}
            </button>
          </div>

          <div
            className={[
              "space-y-4 p-4 transition-all",
              showAllAgreement
                ? "max-h-[520px] overflow-auto"
                : "max-h-[180px] overflow-hidden",
            ].join(" ")}
          >
            <Para>
              ( hereinafter sometimes jointly and severally referred to as the{" "}
              <b>"Client/s" </b>) of the <b>One Part</b>
            </Para>

            <Para>
              <b>And</b>{"\n"}
              Asha Securities Ltd a company duly incorporated under the laws of Sri Lanka
              bearing Company registration No. P B 405 and having its registered office
              at No 60 5th Lane Colombo 03 ( hereinafter referred to as "the Stockbroker
              Firm" which term or expression has herein used shall where the context
              requires or admits mean and include the said Stockbroker Firm, its
              successors and permitted assigns ) of the Other Part;
            </Para>

            <Para>
              <b>
                The Client/s and the Stockbroker Firm shall hereinafter be collectively
                referred to as "Parties" and each individually as "Party".
              </b>
            </Para>

            <Para>
              <b>WHEREAS </b>the Stockbroker Firm is a Member/Trading Member of the Colombo
              Stock Exchange ( hereinafter referred to as the <b>'CSE'</b> ) and is
              licensed by the Securities and Exchange Commission of Sri Lanka (
              hereinafter referred to as the 'SEC' ) to operate as a Stockbroker;
            </Para>

            <Para>
              <b>AND WHEREAS</b> the Client/s is/are desirous of trading on the securities
              listed on the CSE through the said Stockbroker Firm and the Stockbroker
              Firm agrees to provide such services to the Client/s in accordance with
              the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri
              Lanka.
            </Para>

            <Para>
              NOW THEREFORE THIS AGREEMENT WITNESSETH and it is hereby agreed by and
              between the Parties hereto as follows:
            </Para>

            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <b>1.0 RIGHTS AND RESPONSIBILITIES OF THE CLIENT/S</b>
              <br />
              <br />
              1.1 Subject to clause 1.5 below;
              <br />
              a. In the event of a Joint Account, the Client/s shall provide to the
              Stockbroker Firm, the name/s of the persons;
              <p>i. authorized to give trading orders and settlement instructions; and</p>
              <p>ii. to whom payments by the Stockbroker Firm are to be made.</p>

              <br />
              b. In the event of a Corporate Client Account, the Client shall provide to
              the Stockbroker Firm, the name/s of specific directors and officers
              authorized to;
              <p>i. trade in securities; and,</p>
              <p>
                ii. execute all documentation for trading and settlement in the account
                together with a copy of the Board resolution certified by the Company
                Secretary evidencing same.
              </p>

              <br />
              The aforesaid person/s shall hereinafter be referred to as 'authorized
              person/s'.

              <br />
              <br />
              1.2 The Client/s shall notify the Stockbroker Firm in writing, if there is
              any change in the contact and/or other information provided by the Client/s
              to the Stockbroker Firm, within seven (7) calendar days of such change.

              <br />
              <br />
              1.3 Subject to clause 1.5 below, in the event the Client/authorized person(s)
              (as applicable) intends to purchase and/or sell securities, the Client/authorized
              person(s) (as applicable) shall give specific order instructions to the Investment
              Advisor (an employee of the Stockbroker Firm, who is certified by the CSE/SEC to deal
              with Clients) assigned to deal with the Client/s regarding same.

              <br />
              <br />
              1.4 The Client/authorized person(s) (as applicable) authorize/s the Stockbroker Firm
              to accept order instructions given by the Client/authorized person(s) (as applicable)
              to the Stockbroker Firm pertaining to the CDS Account of the Client/s through electronic means
              and other means including telephone, Short Message Service (SMS), E-mail and Fax. The order instructions
              provided by the Client/authorized person(s) (as applicable) through aforesaid means shall not be revoked
              or withdrawn by the Client/authorized person(s) (as applicable) after the execution of the order and shall
              therefore be confirmed.

              <br />
              <br />
              1.5 If the Client/s intends the Stockbroker Firm to use the Stockbroker Firm's own judgment, expertise and
              discretion to buy and/or sell securities on behalf of the Client/s, the Client/s shall provide the prior written
              authorization to the Stockbroker Firm for same.

              <br />
              <br />
              The said written authorization provided by the Client/s to the Stockbroker Firm shall clearly include the following;

              <br />
              <br />
              <p>i. Name of the Client/sand the CDS Account Number;</p>
              <p>ii. Effective Date of the authorization;</p>
              <p>iii. Applicable period of the authorization;</p>
              <p>
                iv. Investment objective (short term, long term, trading in any specific industry, any other specifications);
                and,
              </p>
              <p>v. Purpose of giving discretion to the Registered Investment Advisor.</p>

              <br />
              <br />
              1.6 The Client/s shall ensure that cleared funds are made available to the Stockbroker Firm in respect of the securities
              purchased by the Stockbroker Firm on behalf of the Client/s, by 09.00 hours on the settlement date of such purchase transaction
              and if the Client/s fail/s to make payment as aforesaid, the Stockbroker Firm may, at its absolute discretion, charge an interest
              commencing from the day after the settlement date at a rate decided by the Stockbroker Firm, but not exceeding 0.1 % per day as specified
              in the Stockbroker/Stock Dealer Rules of the CSE. The Client/s shall accept the liabilities arising from all authorized transactions executed
              in the CDS Account of the Client/authorized person(s) (as applicable) by the Investment Advisor.

              <br />
              <br />
              1.7 If the Client/s has/have a complaint against the Stockbroker Firm relating to a particular transaction/s, the Client/s shall first refer
              such complaint to the Compliance Officer of the Stockbroker Firm, in writing, within a period of three (3) months from the date of the transaction/s.
              Where the Client/s is/are not satisfied with the decision given by the Stockbroker Firm or the manner in which the complaint was dealt with by the
              Stockbroker Firm, the Client/s may refer the complaint to the CSE, in writing, in accordance with the Procedure set out by the CSE (which is available
              on the CSE website, www.cse.lk).

              <br />
              <br />
              1.8 The Client/s agree/s that the Stockbroker Firm may, at its absolute discretion, sell not only the securities in respect of which payment has been
              defaulted by the Client/s, but also any other securities lying in the CDS Account of the Client/s in respect of which payment has been made by the Client/s,
              in full or part, in order to enable the Stockbroker Firm to recover the monies due to the Stockbroker Firm from the Client/s including interest and other applicable charges.

              <br />
              <br />
              1.9 The Client/s shall not;
              <br />
              <p>i. use any funds derived through illegal activity for the purpose of settling purchases of securities to the Client's CDS Account.</p>
              <p>ii. Enter into any verbal or written agreement/s with the employee/s of the Stockbroker Firm to share profits arising from the transactions carried out on behalf of the Client/s by the Stockbroker Firm.</p>

              <br />
              <br />
              <br />
              <b>2.0 RIGHTS AND RESPONSIBILITIES OF THE STOCKBROKER FIRM</b>

              <br />
              <br />
              2.1 Subject to clause 2.3 below;

              <br />
              <br />
              a. In the event of a Joint Account, the Stockbroker Firm shall obtain from the Client/s, the name/s of the persons;
              <p>i. authorized to give trading orders and settlement instructions; and, to whom payments by the Stockbroker Firm are to be made.</p>
              <p>ii. trade in securities; and, execute all documentation for trading and settlement in the account,</p>
              <p>iii. together with a copy of the Board resolution certified by the Company Secretary evidencing same.</p>

              <br />
              b. the Stockbroker Firm shall carry out all transactions based on the specific order instructions provided by the Client/authorized person(s) (as applicable) through the communications channels specified in clause 1.4 of this Agreement.

              <br />
              <br />
              <br />
              2.2 Prior to accepting any orders from a third party on behalf of the Client/s, the Stockbroker Firm shall first obtain the written authorization of the Client/s empowering the third party to trade on behalf of the Client/s through the Client's CDS Account.

              <br />
              <br />
              2.3 The Stockbroker Firm shall not exercise the discretion to buy or sell securities on behalf of the Client/s, unless the Client/s has/have given prior written authorization to the Stockbroker Firm to effect transactions for the Client/s without his/their specific order instructions as set out in clause 1.5 of this Agreement.

              <br />
              <br />
              2.4 The Stockbroker Firm shall send to the Client/s a note confirming the purchase and/or sale of securities (bought/sold note) by the end of the trade day (T). Upon obtaining the prior consent of the Client/s, the Stockbroker Firm may send the bought/sold notes to the Client/s in electronic form to the e-mail address provided by the Client/s for such purpose.

              <br />
              <br />
              2.5 The Stockbroker Firm shall send a Statement of Accounts to the Client/s who is/are debtor/s over Trade Day + 3 (T+3), on a monthly basis by the 7th day of the following month. This should apply when the client/s has/have had transactions during the month and the "interest charged on delayed payment" should also be considered as a transaction for this purpose. Such Statement of Accounts shall specify the transactions in the account including receipts and payments during the month under reference.

              <br />
              <br />
              2.6 In the event the Statements of Accounts are issued electronically, the Stockbroker Firm shall obtain the consent of the Client/s and retain evidence of such consent.

              <br />
              <br />
              2.7 The Stockbroker Firm shall provide a copy of its latest Audited Financial Statements filed with the CSE to a Client/s, upon request by such Client/s.

              <br />
              <br />
              2.8 The Stockbroker Firm shall communicate in writing, directly with its Client/s in respect of statements, bought/sold notes or any other information unless the Client/s has/have authorized the Stockbroker Firm otherwise in writing.

              <br />
              <br />
              2.9 The Stockbroker Firm shall ensure that 'cleared funds' are made available to the Client(s) /authorized person(s) (as applicable) on the settlement date, unless the Client/s has/have expressly permitted the Stockbroker Firm, in writing, to hold the sales proceeds for future purchases.

              <br />
              <br />
              2.10 Upon the request of the Client/s, the Stockbroker Firm may:
              <br />
              <br />
              <p>a. extend credit facilitates to the Client/s solely for the purpose of purchasing securities on the CSE and in accordance with the applicable Rules set out in the CSE Stockbroker Rules and terms and condition mutually agreed to between the Client/s and the Stockbroker Firm by way of a written agreement for extension of such facilities.</p>
              <br />
              <p>b. provide internet trading facilities to such Client/s based on a written agreement mutually agreed between the Client/sand the Stockbroker Firm, in accordance with the requirements applicable to Internet Trading published by the CSE from time to time.</p>

              <br />
              <br />
              2.11 The Stockbroker Firm shall assign a Registered Investment Advisor to deal with the Client/sand shall inform such Client/s regarding the name and contact details of the Registered investment Advisor assigned to such Client/s. Further, the Stockbroker Firm shall inform the Client in writing regarding any change to the Registered Investment Advisor within seven (7) Calendar Days of such change.

              <br />
              <br />
              2.12 The Stockbroker Firm shall forthwith notify the Client/s in writing, if there is any material change in contact or other information provided to the Client/s by the Stockbroker Firm.
              2.13 The Stockbroker Firm undertakes to maintain all information of the Client/sin complete confidence and the Stockbroker Firm shall not disclose such information to any person except in accordance with the Stockbroker Rules of the CSE.

              <br />
              <br />
              2.14 The Stockbroker Firm shall disclose to the Client/s, the existence of any incentive scheme applicable for employees of the Stockbroker Firm, which is based on turnover generated from the transactions carried out by the employees for the Client/ s.

              <br />
              <br />
              2.15 The Stockbroker Firm may recover any outstanding balance arising from the purchase of securities of the Client/s from the sales proceeds due to the buyer only in the circumstances set out in the Stockbroker Rules of the CSE.

              <br />
              <br />
              2.16 The Stockbroker Firm shall provide services to the Client/sin compliance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.

              <br />
              <br />
              <br />
              <b>3.0 RISK DISCLOSURE STATEMENT</b>

              <br />
              <br />
              3.1 The Stockbroker Firm agrees that a member of its staff who is authorized by the Board of Directors of the Stockbroker Firm to make declarations on behalf of the Stockbroker Firm has explained the applicable Risk Disclosures to the Client/sand has executed the declaration set out in Schedule 1 hereto in proof of same and such Schedule 1 shall form part and parcel of this Agreement

              <br />
              <br />
              3.2 The Client/s agree/sand acknowledge/s that he/she/it has understood the Risk Disclosures explained by the Stockbroker Firm and executed the Acknowledgement set out in Schedule 2 hereto and such Schedule 2 shall form part and parcel of this Agreement.

              <br />
              <br />
              <br />
              <b>4.0 INDEMNITY AND LIMITATION OFLIABILITY</b>

              <br />
              <br />
              4.1 Each Party hereto, agrees to indemnify, defend and hold harmless the other Party against any loss, liability, damages, claims and costs, which each such Party may sustain by reason of negligence and/or breach of the terms and conditions hereof committed by the other Party hereto or its representatives. The aggrieved Party shall be entitled to enforce its/his/her indemnity rights by injunction or other equitable relief in any competent court of law in Sri Lanka.

              <br />
              <br />
              4.2 The Client/s agrees/s that the Stockbroker Firm will not be liable for any losses arising out of or relating to any cause which is beyond the control of the Stockbroker Firm.

              <br />
              <br />
              <br />
              <b>5.0 TERMINATION</b>

              <br />
              <br />
              5.1 This Agreement shall forthwith terminate, if the Stockbroker Firm for any reason ceases to be a Member/Trading Member of the CSE or if the license issued to the Stockbroker Firm by the SEC is cancelled.

              <br />
              <br />
              5.2 The Parties shall be entitled to terminate this Agreement upon giving notice in writing of not less than fourteen (14) calendar days to the other Party.

              <br />
              <br />
              5.3 Notwithstanding any such termination, all rights, liabilities and obligations of the Parties arising out of or in respect of the transactions entered into prior to the termination of this Agreement shall continue to be in force.

              <br />
              <br />
              <br />
              <b>6.0 GENERAL</b>

              <br />
              <br />
              6.1 Words and expressions which are used in this Agreement, but which are not defined herein shall, unless the context otherwise requires, have the same meaning as assigned thereto in the Rules of the CSE, SEC and other applicable laws of Sri Lanka.

              <br />
              <br />
              6.2 The terms and conditions contained in this Agreement shall be subject to the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE and other applicable laws of Sri Lanka..
              In the event of any contradiction between the terms and conditions hereof and the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka, the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka (as applicable) shall prevail.

              <br />
              <br />
              <br />
              IN WITNESS WHEREOF the Parties to the Agreement have set their respective hands hereto and to one (01) other of the same tenor and date as herein above mentioned.
            </div>

            {/* (Keep the rest of your long agreement text here exactly as you already pasted) */}
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Signatures</div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUpload
              label="Signature of Principal Applicant"
              accept="image/*,.pdf"
              file={principalSig}
              setFile={setPrincipalSig}
              clientNameMode="random"
              serverName="Signature of Principal Applicant"
            />

            <FileUpload
              label="Signature of Joint Applicant"
              accept="image/*,.pdf"
              file={jointSig}
              setFile={setJointSig}
              clientNameMode="random"
              serverName="Signature of Joint Applicant"
            />

            <FileUpload
              label="Signature of 2nd Joint Applicant"
              accept="image/*,.pdf"
              file={secondJointSig}
              setFile={setSecondJointSig}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUpload
              label="Authorized Signatory of the Stockbroker Firm"
              accept="image/*,.pdf"
              file={agreementFirmSig}
              setFile={setAgreementFirmSig}
            />
            <FileUpload
              label="Witness 1"
              accept="image/*,.pdf"
              file={agreementWitness1Sig}
              setFile={setAgreementWitness1Sig}
              clientNameMode="random"
              serverName="Witness 1 Signature - Client Agreement"
            />
            <FileUpload
              label="Witness 2"
              accept="image/*,.pdf"
              file={agreementWitness2Sig}
              setFile={setAgreementWitness2Sig}
              clientNameMode="random"
              serverName="Witness 2 Signature - Client Agreement"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
