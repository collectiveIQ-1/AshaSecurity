import CreditFacilityAgreementLocalCorporate from "./CreditFacilityAgreementLocalCorporate.jsx";
import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import FileUpload from "./FileUpload.jsx";
import PhoneInput from "./PhoneInput.jsx";
import { useEffect, useMemo, useState } from "react";
import { useFormErrors } from "../forms/FormErrorContext.jsx";
import DatePicker from "react-datepicker";

function TextArea({ value, onChange, placeholder, path }) {
  const errors = useFormErrors();
  const hasError = !!(path && errors?.[path]);
  return (
    <div className={hasError ? "w-full rounded-2xl border-2 border-orange-500/80 bg-orange-50/60 p-1 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:border-orange-400/70 dark:bg-orange-500/10" : "w-full"} data-path={path || undefined}>
      <textarea
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        data-path={path || undefined}
        rows={3}
        className={[
          "w-full text-[13px] sm:text-sm rounded-2xl border px-3 py-2 outline-none transition",
          hasError ? "border-transparent bg-transparent" : "border-zinc-300 bg-white/80 text-zinc-900 placeholder:text-zinc-400",
          "focus:border-zinc-500 focus:ring-2 focus:ring-black/20",
          "dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          "dark:focus:border-white/30 dark:focus:ring-white/10",
        ].join(" ")}
      />
      {hasError ? <div className="mt-2 text-xs font-medium text-orange-700 dark:text-orange-300">{errors[path]}</div> : null}
    </div>
  );
}

const parseDmyDate = (value) => {
  const s = String(value || "").trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const formatDmyDate = (date) => {
  if (!date || Number.isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
};

function LineInput({ value, onChange, placeholder, path }) {
  const errors = useFormErrors();
  const hasError = !!(path && errors?.[path]);
  return (
    <div className="w-full" data-path={path || undefined}>
      <input
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        data-path={path || undefined}
        className={[
          "inline-block w-full min-w-[120px]",
          "bg-transparent px-1 py-0.5",
          hasError ? "border-b-2 border-orange-500 focus:border-orange-600" : "border-b border-zinc-400/70 focus:border-zinc-900",
          "outline-none transition",
          hasError ? "text-orange-900 placeholder:text-orange-300 dark:text-orange-100" : "text-sm text-zinc-900 placeholder:text-zinc-400",
          "dark:border-zinc-500/70 dark:focus:border-zinc-200",
        ].join(" ")}
      />
      {hasError ? <div className="mt-1 text-xs font-medium text-orange-700 dark:text-orange-300">{errors[path]}</div> : null}
    </div>
  );
}

function LineDateInput({ value, onChange, placeholder = "DD / MM / YYYY", path }) {
  const errors = useFormErrors();
  const hasError = !!(path && errors?.[path]);
  const selected = parseDmyDate(value);
  const baseClass = [
    "inline-block w-full min-w-[120px]",
    "bg-transparent px-1 py-0.5 pr-8",
    hasError ? "border-b-2 border-orange-500 focus:border-orange-600" : "border-b border-zinc-400/70 focus:border-zinc-900",
    "outline-none transition",
    hasError ? "text-orange-900 placeholder:text-orange-300 dark:text-orange-100" : "text-sm text-zinc-900 placeholder:text-zinc-400",
    "dark:text-zinc-100 dark:border-zinc-500/70 dark:focus:border-zinc-200",
  ].join(" ");

  return (
    <div className="relative w-full" data-path={path || undefined}>
      <DatePicker
        selected={selected}
        onChange={(date) =>
          onChange?.({
            target: {
              value: formatDmyDate(date),
            },
          })
        }
        onChangeRaw={(e) => onChange?.(e)}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        customInput={
          <input
            data-path={path || undefined}
            className={baseClass}
          />
        }
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const input = e.currentTarget.parentElement?.querySelector("input");
          input?.focus();
          input?.click();
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Open calendar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
      {hasError ? <div className="mt-1 text-xs font-medium text-orange-700 dark:text-orange-300">{errors[path]}</div> : null}
    </div>
  );
}

function AgreementInput({
  value,
  onChange,
  onBlur,
  placeholder,
  width = "w-full",
  disabled = false,
  inputMode = "text",
  maxLength,
  path,
}) {
  const errors = useFormErrors();
  const hasError = !!(path && errors?.[path]);
  return (
    <div className={hasError ? "rounded-2xl border-2 border-orange-500/80 bg-orange-50/60 p-1 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] dark:border-orange-400/70 dark:bg-orange-500/10" : ""} data-path={path || undefined}>
      <input
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        data-path={path || undefined}
        className={[
          width,
          "h-10 rounded-xl border px-3 text-sm outline-none transition",
          hasError ? "border-transparent bg-transparent text-orange-900 placeholder:text-orange-300 dark:text-orange-100" : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400",
          "focus:border-zinc-500 focus:ring-2 focus:ring-black/15",
          "dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          "dark:focus:border-white/30 dark:focus:ring-white/10",
          disabled ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      />
      {hasError ? <div className="mt-2 text-xs font-medium text-orange-700 dark:text-orange-300">{errors[path]}</div> : null}
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div className="mb-5 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/35">
      <div className="mb-3">
        <div className="text-base sm:text-lg font-semibold">{title}</div>
        {subtitle ? (
          <div className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mt-6 mb-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-zinc-700 dark:text-zinc-300">
      {children}
    </div>
  );
}

function TickBox({ checked, onChange, label, path }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        data-path={path || undefined}
        className="mt-1 h-4 w-4 rounded border-zinc-400 text-zinc-900 focus:ring-zinc-400"
      />
      <span>{label}</span>
    </label>
  );
}

function CompactField({ label, value, onChange, placeholder, path, type = "text" }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        {label}
      </div>
      {type === "date" ? (
        <LineDateInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          path={path}
        />
      ) : (
        <LineInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          path={path}
        />
      )}
    </div>
  );
}

function RequirementItem({ index, title, detail, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/85 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </div>
          {detail ? (
            <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {detail}
            </div>
          ) : null}
          {children ? (
            <div className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UploadSignatureCard({ title, detail, children }) {
  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white/85 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </div>
          {detail ? (
            <div className="mt-1 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
              {detail}
            </div>
          ) : null}
        </div>
        <div className="rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-zinc-100 dark:text-zinc-900">
          Upload
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}


function LocalCorporateClientAgreementTerms() {
  return (
    <>
      <p className="mt-4">
        (hereinafter sometimes jointly and severally referred to as the{" "}
        <span className="font-semibold">"Client/s"</span>) of the One Part
      </p>

      <p className="mt-3">
        <b>And</b> <br></br> <br></br> Asha Securities Ltd a company duly
        incorporated under the laws of Sri Lanka bearing Company registration
        No. P B 405 and having its registered office at No 60 5th Lane Colombo
        03(hereinafter referred to as "the Stockbroker Firm" which term or
        expression has herein used shall where the context requires or admits
        mean and include the said Stockbroker Firm, its successors and
        permitted assigns) of the Other Part;
      </p>

      <p className="mt-3">
        The Client/s and the Stockbroker Firm shall hereinafter be collectively
        referred to as "Parties" and each individually as "Party".
      </p>

      <p className="mt-3">
        WHEREAS the Stockbroker Firm is a Member/Trading Member of the Colombo
        Stock Exchange (hereinafter referred to as the 'CSE') and is licensed
        by the Securities and Exchange Commission of Sri Lanka (hereinafter
        referred to as the 'SEC') to operate as a Stockbroker;
      </p>

      <p className="mt-3">
        AND WHEREAS the Client/s is/are desirous of trading on the securities
        listed on the CSE through the said Stockbroker Firm and the Stockbroker
        Firm agrees to provide such services to the Client/s in accordance with
        the applicable Rules of the CSE, CDS, SEC and other applicable laws of
        Sri Lanka.
      </p>

      <p className="mt-3">
        NOW THEREFORE THIS AGREEMENT WITNESSETH and it is hereby agreed by and
        between the Parties hereto as follows:
      </p>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        1.0 RIGHTS AND RESPONSIBILITIES OF THE CLIENT/S
      </h4>
      <p className="mb-2">1.1 Subject to clause 1.5 below;</p>

      <ul className="ml-6 list-disc space-y-2">
        <li>
          In the event of a Joint Account, the Client/s shall provide to the
          Stockbroker Firm, the name/s of the persons;
          <ul>
            <li>- authorized to give trading orders and settlement instructions; and</li>
            <li>- to whom payments by the Stockbroker Firm are to be made </li>
          </ul>
        </li>
        <li>
          In the event of a Corporate Client Account, the Client shall provide
          to the Stockbroker Firm, the name/s of specific directors and officers
          authorized to;
          <ul>
            <li>- trade in securities; and,</li>
            <li>
              - execute all documentation for trading and settlement in the
              account, together with a copy of the Board resolution certified by
              the Company Secretary evidencing same.
            </li>
          </ul>
        </li>
      </ul>

      <p className="mt-3">
        The aforesaid person/s shall hereinafter be referred to as ‘authorized
        person/s’.
      </p>
      <br></br>

      <p className="mb-2">
        1.2 The Client/s shall notify the Stockbroker Firm in writing, if there
        is an change in the contact and/or other information provided by the
        Client/s to the Stockbroker Firm, within seven (7) calendar days of
        such change.
      </p>

      <p className="mb-2">
        1.3 Subject to clause 1.5 below, in the event the Client/authorized
        person(s) (as applicable) intends to purchase and/or sell securities,
        the Client/authorized person(s) (as applicable) shall give specific
        order instructions to the Investment Advisor (an employee of the
        Stockbroker Firm, who is certified by the CSE/SEC to deal with Clients)
        assigned to deal with the Client/s regarding same.
      </p>

      <p className="mb-2">
        1.4 The Client/authorized person(s) (as applicable) authorizes the
        Stockbroker Firm to accept order instructions given by the
        Client/authorized person(s) (as applicable) to the Stockbroker Firm
        pertaining to the CDS Account of the Client/s through electronic means
        and other means including telephone, Short Message Service (SMS),
        E-mail and Fax. The order instructions provided by the
        Client/authorized person(s) (as applicable) through aforesaid means
        shall not be revoked or withdrawn by the Client/authorized person(s)
        (as applicable) after the execution of the order and shall therefore be
        confirmed.
      </p>

      <p className="mb-2">
        1.5 If the Client/s intends the Stockbroker Firm to use the Stockbroker
        Firm’s own judgment, expertise and discretion to buy and/or sell
        securities on behalf of the Client/s, the Client/s shall provide the
        prior written authorization to the Stockbroker Firm for same. The said
        written authorization provided by the Client/s to the Stockbroker Firm
        shall clearly include the following;
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>Name of the Client/s and the CDS Account Number;</li>
        <li>Effective Date of the authorization;</li>
        <li>Applicable period of the authorization;</li>
        <li>
          Investment objective (short term, long term, trading in any specific
          industry, any other specifications); and,
        </li>
        <li>Purpose of giving discretion to the Registered Investment Advisor.</li>
      </ul>
      <br></br>

      <p className="mb-2">
        1.6 The Client/s shall ensure that cleared funds are made available to
        the Stockbroker Firm in respect of the securities purchased by the
        Stockbroker Firm on behalf of the Client/s, by 09.00 hours on the
        settlement date of such purchase transaction and if the Client/s fail/s
        to make payment as aforesaid, the Stockbroker Firm may, at its absolute
        discretion, charge an interest commencing from the day after the
        settlement date at a rate decided by the Stockbroker Firm, but not
        exceeding 0.1% per day as specified in the Stockbroker/Stock Dealer
        Rules of the CSE. The Client/s shall accept the liabilities arising
        from all authorized transactions executed in the CDS Account of the
        Client/authorized person(s) (as applicable) by the Investment Advisor.
      </p>

      <p className="mb-2">
        1.7 If the Client/s has/have a complaint against the Stockbroker Firm
        relating to a particular transaction/s, the Client/s shall first refer
        such complaint to the Compliance Officer of the Stockbroker Firm, in
        writing, within a period of three (3) months from the date of the
        transaction/s. Where the Client/s is/are not satisfied with the
        decision given by the Stockbroker Firm or the manner in which the
        complaint was dealt with by the Stockbroker Firm, the Client/s may
        refer the complaint to the CSE, in writing, in accordance with the
        Procedure set out by the CSE (which is available on the CSE website,
        www.cse.lk).
      </p>

      <p className="mb-2">
        1.8 The Client/s agree/s that the Stockbroker Firm may, at its absolute
        discretion, sell not only the securities in respect of which payment
        has been defaulted by the Client/s, but also any other securities lying
        in the CDS Account of the Client/s in respect of which payment has been
        made by the Client/s, in full or part, in order to enable the
        Stockbroker Firm to recover the monies due to the Stockbroker Firm from
        the Client/s including interest and other applicable charges.
      </p>

      <p className="mb-2">1.9 The Client/s shall not;</p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          Use any funds derived through illegal activity for the purpose of
          settling purchases of securities to the Client’s CDS Account.
        </li>
        <li>
          Enter into any verbal or written agreement/s with the employee/s of
          the Stockbroker Firm to share profits arising from the transactions
          carried out on behalf of the Client/s by the Stockbroker Firm.
        </li>
      </ul>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        2.0 RIGHTS AND RESPONSIBILITIES OF THE STOCKBROKER FIRM
      </h4>
      <p className="mb-2">2.1 Subject to clause 2.3 below;</p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          In the event of a Joint Account, the Stockbroker Firm shall obtain
          from the Client/s, the name/s of the persons;
          <ul>
            <li>- authorized to give trading orders and settlement instructions; and,</li>
            <li>- to whom payments by the Stockbroker Firm are to be made.</li>
          </ul>
        </li>
        <li>
          In the event of a Corporate Client Account, the Stockbroker Firm
          shall obtain from the Client/s, the name/s of specific directors and
          officers authorized to;
          <ul>
            <li>- trade in securities; and,</li>
            <li>
              - execute all documentation for trading and settlement in the
              account, together with a copy of the Board resolution certified by
              the Company Secretary evidencing same.
            </li>
          </ul>
        </li>
        <li>
          The Stockbroker Firm shall carry out all transactions based on the
          specific order instructions provided by the Client/authorized
          person(s) (as applicable) through the communications channels
          specified in clause 1.4 of this Agreement.
        </li>
      </ul>

      <p className="mb-2">
        2.2 Prior to accepting any orders from a third party on behalf of the
        Client/s, the Stockbroker Firm shall first obtain the written
        authorization of the Client/s empowering the third party to trade on
        behalf of the Client/s through the Client’s CDS Account.
      </p>
      <p className="mb-2">
        2.3 The Stockbroker Firm shall not exercise the discretion to buy or
        sell securities on behalf of the Client/s, unless the Client/s has/have
        given prior written authorization to the Stockbroker Firm to effect
        transactions for the Client/s without his/their specific order
        instructions as set out in clause 1.5 of this Agreement.
      </p>
      <p className="mb-2">
        2.4 The Stockbroker Firm shall send to the Client/s a note confirming
        the purchase and/or sale of securities (bought/sold note) by the end
        of the trade day (T). Upon obtaining the prior consent of the Client/s,
        the Stockbroker Firm may send the bought/sold notes to the Client/s in
        electronic form to the e-mail address provided by the Client/s for such
        purpose.
      </p>
      <p className="mb-2">
        2.5 The Stockbroker Firm shall send a Statement of Accounts to the
        Client/s who is/are debtor/s over Trade Day + 2 (T+2), on a monthly
        basis by the 7th day of the following month. This should apply when the
        client/s has/have had transactions during the month and the "interest
        charged on delayed payment" should also be considered as a transaction
        for this purpose. Such Statement of Accounts shall specify the
        transactions in the account including receipts and payments during the
        month under reference.
      </p>
      <p className="mb-2">
        2.6 In the event the Statements of Accounts are issued electronically,
        the Stockbroker Firm shall obtain the consent of the Client/s and
        retain evidence of such consent.
      </p>
      <p className="mb-2">
        2.7 The Stockbroker Firm shall provide a copy of its latest Audited
        Financial Statements filed with the CSE to a Client/s, upon request by
        such Client/s.
      </p>
      <p className="mb-2">
        2.8 The Stockbroker Firm shall communicate in writing, directly with
        its Client/s in respect of statements, bought/sold notes or any other
        information unless the Client/s has/have authorized the Stockbroker
        Firm otherwise in writing.
      </p>
      <p className="mb-2">
        2.9 The Stockbroker Firm shall ensure that 'cleared funds' are made
        available to the Client(s)/authorized person(s) (as applicable) on the
        settlement date, unless the Client/s has/have expressly permitted the
        Stockbroker Firm, in writing, to hold the sales proceeds for future
        purchases.
      </p>
      <p className="mb-2">
        2.10 Upon the request of the Client/s, the Stockbroker Firm may:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          extend credit facilities to the Client/s solely for the purpose of
          purchasing securities on the CSE and in accordance with the
          applicable Rules set out in the CSE Stockbroker Rules and terms and
          conditions mutually agreed to between the Client/s and the
          Stockbroker Firm by way of a written agreement for extension of such
          facilities.
        </li>
        <li>
          provide internet trading facilities to such Client/s based on a
          written agreement mutually agreed between the Client/s and the
          Stockbroker Firm, in accordance with the requirements applicable to
          Internet Trading published by the CSE from time to time.
        </li>
      </ul>
      <p className="mb-2">
        2.11 The Stockbroker Firm shall assign a Registered Investment Advisor
        to deal with the Client/s and shall inform such Client/s regarding the
        name and contact details of the Registered Investment Advisor assigned
        to such Client/s. Further, the Stockbroker Firm shall inform the Client
        in writing regarding any change to the Registered Investment Advisor
        within seven (7) calendar Days of such change.
      </p>
      <p className="mb-2">
        2.12 The Stockbroker Firm shall forthwith notify the Client/s in
        writing, if there is any material change in contact or other
        information provided to the Client/s by the Stockbroker Firm.
      </p>
      <p className="mb-2">
        2.13 The Stockbroker Firm undertakes to maintain all information of the
        Client/s in complete confidence and the Stockbroker Firm shall not
        disclose such information to any person except in accordance with the
        Stockbroker Rules of the CSE.
      </p>
      <p className="mb-2">
        2.14 The Stockbroker Firm shall disclose to the Client/s, the existence
        of any incentive scheme applicable for employees of the Stockbroker
        Firm, which is based on turnover generated from the transactions
        carried out by the employees for the Client/s.
      </p>
      <p className="mb-2">
        2.15 The Stockbroker Firm may recover any outstanding balance arising
        from the purchase of securities of the Client/s from the sales proceeds
        due to the buyer only in the circumstances set out in the Stockbroker
        Rules of the CSE.
      </p>
      <p className="mb-2">
        2.16 The Stockbroker Firm shall provide services to the Client/s in
        compliance with the applicable Rules of the CSE, CDS, SEC and other
        applicable laws of Sri Lanka.
      </p>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        3.0 RISK DISCLOSURE STATEMENT
      </h4>
      <p className="mb-2">
        3.1 The Stockbroker Firm agrees that a member of its staff who is
        authorized by the Board of Directors of the Stockbroker Firm to make
        declarations on behalf of the Stockbroker Firm has explained the
        applicable Risk Disclosures to the Client/s and has executed the
        declaration set out in Schedule 1 hereto in proof of same and such
        Schedule 1 shall form part and parcel of this Agreement.
      </p>
      <p className="mb-2">
        3.2 The Client/s agree/s and acknowledge/s that he/she/it has
        understood the Risk Disclosures explained by the Stockbroker Firm and
        executed the Acknowledgement set out in Schedule 2 hereto and such
        Schedule 2 shall form part and parcel of this Agreement.
      </p>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        4.0 INDEMNITY AND LIMITATION OF LIABILITY
      </h4>
      <p className="mb-2">
        4.1 Each Party hereto, agrees to indemnify, defend and hold harmless
        the other Party against any loss, liability, damages, claims and costs,
        which each such Party may sustain by reason of negligence and/or breach
        of the terms and conditions hereof committed by the other Party hereto
        or its representatives. The aggrieved Party shall be entitled to
        enforce its/his/her indemnity rights by injunction or other equitable
        relief in any competent court of law in Sri Lanka.
      </p>
      <p className="mb-2">
        4.2 The Client/s agree/s that the Stockbroker Firm will not be liable
        for any losses arising out of or relating to any cause which is beyond
        the control of the Stockbroker Firm.
      </p>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        5.0 TERMINATION
      </h4>
      <p className="mb-2">
        5.1 This Agreement shall forthwith terminate, if the Stockbroker Firm
        for any reason ceases to be a Member/Trading Member of the CSE or if
        the license issued to the Stockbroker Firm by the SEC is cancelled.
      </p>
      <p className="mb-2">
        5.2 The Parties shall be entitled to terminate this Agreement upon
        giving notice in writing of not less than fourteen (14) calendar days
        to the other Party.
      </p>
      <p className="mb-2">
        5.3 Notwithstanding any such termination, all rights, liabilities and
        obligations of the Parties arising out of or in respect of the
        transactions entered into prior to the termination of this Agreement
        shall continue to be in force.
      </p>

      <h4 className="mt-5 mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
        6.0 GENERAL
      </h4>
      <p className="mb-2">
        6.1 Words and expressions which are used in this Agreement, but which
        are not defined herein shall, unless the context otherwise requires,
        have the same meaning as assigned thereto in the Rules of the CSE, SEC
        and other applicable laws of Sri Lanka.
      </p>
      <p className="mb-2">
        6.2 The terms and conditions contained in this Agreement shall be
        subject to the applicable Rules, Regulations, Guidelines and Directions
        issued by SEC, Rules and Circulars of the CSE and other applicable laws
        of Sri Lanka.
      </p>

      <br></br>
      <p className="mb-2">
        In the event of any contradiction between the terms and conditions
        hereof and the applicable Rules, Regulations, Guidelines and Directions
        issued by SEC, Rules and Circulars of the CSE or other applicable laws
        of Sri Lanka, the applicable Rules, Regulations, Guidelines and
        Directions issued by SEC, Rules and Circulars of the CSE or other
        applicable laws of Sri Lanka (as applicable) shall prevail.
      </p>
      <p className="mb-2">
        IN WITNESS WHEREOF the Parties to the Agreement have set their
        respective hands hereto and to one (01) other of the same tenor and
        date as herein above mentioned.
      </p>
    </>
  );
}

export default function ForeignCorporateNewForm({
  form,
  update,
  busy,

  // uploads
  fcBankStatement,
  setFcBankStatement,
  fcBoardResolution,
  setFcBoardResolution,
  fcMemorandumArticles,
  setFcMemorandumArticles,
  fcIncorporationCertificate,
  setFcIncorporationCertificate,
  fcDirector1Sig,
  setFcDirector1Sig,
  fcDirector2Sig,
  setFcDirector2Sig,
  fcCompanySeal,
  setFcCompanySeal,
  clientSig,
  setClientSig,
  advisorSig,
  setAdvisorSig,
  fcAgentSignature,
  setFcAgentSignature,
  fcAuthorizerSignature,
  setFcAuthorizerSignature,
  fcStockbrokerFirmSignature,
  setFcStockbrokerFirmSignature,
  fcWitness1Signature,
  setFcWitness1Signature,
  fcWitness2Signature,
  setFcWitness2Signature,
  fcPrincipalApplicantSignature,
  setFcPrincipalApplicantSignature,
  fcJointApplicantSignature,
  setFcJointApplicantSignature,

  cfPrincipalSig,
  setCfPrincipalSig,
  cfFirmSig,
  setCfFirmSig,
  cfWitness1Sig,
  setCfWitness1Sig,
  cfWitness2Sig,
  setCfWitness2Sig,
}) {
  const cr = form?.fcClientRegistration || {};
  const bd = cr?.bankDetails || {};
  const cc = cr?.correspondenceContact || {};
  const ou = cr?.officeUseOnly || {};
  const sd = cr?.staffDeclaration || {};
  const decl = cr?.declaration || {};
  const mp = cr?.mainProcess || {};

  // ✅ Form 2A - KYC Profile
  const kyc = cr?.kycProfile || {};
  const ap = kyc?.authorizedPerson || {};

  const ca = cr?.clientAgreement || {};
  const s1 = cr?.schedule1 || {};
  const s2 = cr?.schedule2 || {};
  const bo = cr?.beneficialOwnershipForm || {};
  const boCi = bo?.customerIdentification || {};
  const boDec = bo?.declaration || {};
  const errors = useFormErrors();

  const [showClientAgreementModal, setShowClientAgreementModal] = useState(false);

  useEffect(() => {
    if (!showClientAgreementModal) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showClientAgreementModal]);
  const boOwners =
    Array.isArray(bo?.beneficialOwners) && bo.beneficialOwners.length
      ? bo.beneficialOwners
      : Array.from({ length: 5 }, () => ({}));
  const boAuth = bo?.authorizedCustomer || {};
  const boAfi = bo?.afiOfficial || {};
  const boPay = bo?.paymentAuthorization || {};

  const fcErrorEntries = useMemo(() => {
    const entries = Object.entries(errors || {});
    return entries.filter(([path]) => String(path || "").startsWith("fc") || [
      "fcMemorandumArticles",
      "fcIncorporationCertificate",
      "fcDir1Sig",
      "fcDir2Sig",
      "fcCompanySeal",
      "clientSig",
      "advisorSig",
    ].includes(String(path || "")));
  }, [errors]);

  const toggleMulti = (path, value) => {
    const current =
      (path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), form) ??
        []) ||
      [];
    const arr = Array.isArray(current) ? current : [];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    update(path, next);
  };

  return (
    <>
      <div className="mb-5 rounded-3xl border border-zinc-200 bg-white/60 px-4 py-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-semibold">
            Client Registration
          </h2>
          {/* <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Fill in company details and upload required documents (as per the official form).
          </div> */}
        </div>
      </div>

      {fcErrorEntries.length ? (
        <div className="mb-5 overflow-hidden rounded-3xl border border-orange-300/70 bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 shadow-soft dark:border-orange-900/40 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-rose-950/20">
          <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                Fix the highlighted foreign corporate fields before submitting
              </div>
              {/* <div className="mt-1 text-xs text-orange-700 dark:text-orange-200">
                {fcErrorEntries.length} item{fcErrorEntries.length === 1 ? "" : "s"} need your attention. Missing fields glow in orange-red so they are easy to spot.
              </div> */}
            </div>
            {/* <div className="inline-flex items-center rounded-full border border-orange-300 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-900 dark:border-orange-800 dark:bg-zinc-950/50 dark:text-orange-100">
              Validation active
            </div> */}
          </div>
        </div>
      ) : null}

      <Card title="Personal Data">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Name of Company">
            <Input
              value={cr.companyName}
              path="fcClientRegistration.companyName"
              onChange={(e) =>
                update("fcClientRegistration.companyName", e.target.value)
              }
              placeholder="Enter Company Name"
            />
          </Field>

          <Field label="Tel No(s)">
            <PhoneInput
              value={cr.telNos}
              path="fcClientRegistration.telNos"
              onChange={(v) => update("fcClientRegistration.telNos", v)}
              placeholder="Enter Telephone Number"
            />
          </Field>

          <Field label="Fax No(s)">
            <Input
              value={cr.faxNos}
              path="fcClientRegistration.faxNos"
              onChange={(e) =>
                update("fcClientRegistration.faxNos", e.target.value)
              }
              placeholder="Enter Fax Number"
            />
          </Field>

          <Field label="Email">
            <Input
              value={cr.emailAddress || cr.email}
              path="fcClientRegistration.emailAddress"
              onChange={(e) =>
                update("fcClientRegistration.emailAddress", e.target.value)
              }
              placeholder="Enter Email Address"
            />
          </Field>

          <Field label="Website">
            <Input
              value={cr.website}
              path="fcClientRegistration.website"
              onChange={(e) =>
                update("fcClientRegistration.website", e.target.value)
              }
              placeholder="Enter Website URL"
            />
          </Field>

          <Field label="Registered Address">
            <Input
              value={cr.registeredAddress}
              path="fcClientRegistration.registeredAddress"
              onChange={(e) =>
                update("fcClientRegistration.registeredAddress", e.target.value)
              }
              placeholder="Enter Registered Address"
            />
          </Field>

          <Field label="Correspondence Address">
            <Input
              value={cr.correspondenceAddress}
              path="fcClientRegistration.correspondenceAddress"
              onChange={(e) =>
                update(
                  "fcClientRegistration.correspondenceAddress",
                  e.target.value,
                )
              }
              placeholder="Enter Correspondence Address"
            />
          </Field>

          <Field label="Business Registration No.">
            <Input
              value={cr.businessRegNo}
              path="fcClientRegistration.businessRegNo"
              onChange={(e) =>
                update("fcClientRegistration.businessRegNo", e.target.value)
              }
              placeholder="Enter Business Registration Number"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of Incorporation">
              <Input
                type="date"
                value={cr.dateOfIncorporation}
                path="fcClientRegistration.dateOfIncorporation"
                onChange={(e) =>
                  update(
                    "fcClientRegistration.dateOfIncorporation",
                    e.target.value,
                  )
                }
              />
            </Field>
          </div>
          {/* <div className="grid grid-cols-1 gap-4">
            <Field label="Place of Incorporation">
              <Input
                value={cr.placeOfIncorporation}
                path="fcClientRegistration.placeOfIncorporation"
                onChange={(e) => update("fcClientRegistration.placeOfIncorporation", e.target.value)}
                placeholder="Enter place"
              />
            </Field>
          </div> */}

          <Field label="Nature of Business">
            <Input
              value={cr.natureOfBusiness}
              path="fcClientRegistration.natureOfBusiness"
              onChange={(e) =>
                update("fcClientRegistration.natureOfBusiness", e.target.value)
              }
              placeholder="Enter Nature of Business"
            />
          </Field>
        </div>
      </Card>

      <Card title="Bank Details">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Bank">
            <Input
              value={bd.bank}
              path="fcClientRegistration.bankDetails.bank"
              onChange={(e) =>
                update("fcClientRegistration.bankDetails.bank", e.target.value)
              }
            />
          </Field>
          <Field label="Branch">
            <Input
              value={bd.branch}
              path="fcClientRegistration.bankDetails.branch"
              onChange={(e) =>
                update("fcClientRegistration.bankDetails.branch", e.target.value)
              }
            />
          </Field>
          <Field label="Type of Account">
            <Input
              value={bd.accountType}
              path="fcClientRegistration.bankDetails.accountType"
              onChange={(e) =>
                update(
                  "fcClientRegistration.bankDetails.accountType",
                  e.target.value,
                )
              }
            />
          </Field>
          <Field label="Account No.">
            <Input
              value={bd.accountNo}
              path="fcClientRegistration.bankDetails.accountNo"
              onChange={(e) =>
                update(
                  "fcClientRegistration.bankDetails.accountNo",
                  e.target.value,
                )
              }
            />
          </Field>
        </div>

        <br></br>

        <div className="grid grid-cols-1 gap-4">
          Enclosed-Copy Bank Statement
        </div>
        <div className="grid grid-cols-1 gap-4">
          Attach Board resolution with operating instructions.
        </div>
        <br></br>

        {/* As per the official form (before Copy Bank Statement) */}
        <div className="mb-3 rounded-2xl border border-zinc-200 bg-white/55 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25">
          <div className="mb-3">
            {/* <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Company & Mailing Details</div>
            <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              Fill these details before uploading the bank statement.
            </div> */}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* These fields are mapped to the same values you already fill above, so the PDF stays consistent */}
            <div className="grid grid-cols-1 gap-4">
              <Field label="Name of the Company">
                <Input
                  value={cr.companyName}
                  path="fcClientRegistration.companyName"
                  onChange={(e) =>
                    update("fcClientRegistration.companyName", e.target.value)
                  }
                  placeholder="Enter Company Name"
                />
              </Field>
              <Field label="Date of Incorporation">
                <Input
                  type="date"
                  value={cr.dateOfIncorporation}
                  path="fcClientRegistration.dateOfIncorporation"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.dateOfIncorporation",
                      e.target.value,
                    )
                  }
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Place of Incorporation">
                <Input
                  value={cr.placeOfIncorporation}
                  path="fcClientRegistration.placeOfIncorporation"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.placeOfIncorporation",
                      e.target.value,
                    )
                  }
                  placeholder="Enter place"
                />
              </Field>
              <Field label="Registered Address">
                <Input
                  value={cr.registeredAddress}
                  path="fcClientRegistration.registeredAddress"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.registeredAddress",
                      e.target.value,
                    )
                  }
                  placeholder="Enter Registered Address"
                />
              </Field>
            </div>
            <br></br>

            <div className="grid grid-cols-1 gap-4">
              A list of up to ten major share holders (if there any)
            </div>
            <div className="grid grid-cols-1 gap-4">
              A board resolution passed by the company giving the names and
              designations of persons authorized to give instructions on behalf
              of the company.
            </div>
            <br></br>

            {/* <div className="grid grid-cols-1 gap-4">
              <Field label="A list of up to ten major share holders (if there any)">
                <TextArea
                  value={cr.para1}
                  path="fcClientRegistration.para1"
                  onChange={(e) => update("fcClientRegistration.para1", e.target.value)}
                  placeholder="Enter details"
                />
              </Field>
              <Field label="A para2">
                <TextArea
                  value={cr.para2}
                  path="fcClientRegistration.para2"
                  onChange={(e) => update("fcClientRegistration.para2", e.target.value)}
                  placeholder="Enter details"
                />
              </Field>
            </div> */}

            <Field label="Present broker(s) if any">
              <Input
                value={cr.presentBrokers}
                path="fcClientRegistration.presentBrokers"
                onChange={(e) =>
                  update("fcClientRegistration.presentBrokers", e.target.value)
                }
                placeholder=""
              />
            </Field>

            <div className="mt-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                Maling Instructions
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={!!mp.holdForCollections}
                    onChange={(e) =>
                      update(
                        "fcClientRegistration.mainProcess.holdForCollections",
                        e.target.checked,
                      )
                    }
                    disabled={busy}
                    className="mt-1"
                  />
                  <span>Please / post / deliver or hold for collections.</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={!!mp.chequesKeptAtOffice}
                    onChange={(e) =>
                      update(
                        "fcClientRegistration.mainProcess.chequesKeptAtOffice",
                        e.target.checked,
                      )
                    }
                    disabled={busy}
                    className="mt-1"
                  />
                  <span>
                    Cheques to be kept at your office / posted to our office.
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Correspondences Contact">
                <Input
                  value={cc.name}
                  path="fcClientRegistration.correspondenceContact.name"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.correspondenceContact.name",
                      e.target.value,
                    )
                  }
                  placeholder=""
                />
              </Field>
              <Field label="Tel No">
                <PhoneInput
                  value={cc.telNo}
                  path="fcClientRegistration.correspondenceContact.telNo"
                  onChange={(v) =>
                    update("fcClientRegistration.correspondenceContact.telNo", v)
                  }
                  placeholder="Enter Telephone Number"
                />
              </Field>
              <Field label="Fax No">
                <Input
                  value={cc.faxNo}
                  path="fcClientRegistration.correspondenceContact.faxNo"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.correspondenceContact.faxNo",
                      e.target.value,
                    )
                  }
                  placeholder=""
                />
              </Field>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 gap-4">
          <FileUpload label="Copy Bank Statement" value={fcBankStatement} setValue={setFcBankStatement} disabled={busy} />
        </div> */}

        {/* Office Use Only + Risk Disclosure (between Bank Statement and Client Introduced by) */}
        <Card title="Office Use Only" subtitle="">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Application Received on">
              <Input
                value={ou.applicationReceivedOn}
                path="fcClientRegistration.officeUseOnly.applicationReceivedOn"
                onChange={(e) =>
                  update(
                    "fcClientRegistration.officeUseOnly.applicationReceivedOn",
                    e.target.value,
                  )
                }
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={ou.date}
                path="fcClientRegistration.officeUseOnly.date"
                onChange={(e) =>
                  update(
                    "fcClientRegistration.officeUseOnly.date",
                    e.target.value,
                  )
                }
              />
            </Field>
            <Field label="Advisor’s Code">
              <Input
                value={ou.advisorsCode}
                path="fcClientRegistration.officeUseOnly.advisorsCode"
                onChange={(e) =>
                  update(
                    "fcClientRegistration.officeUseOnly.advisorsCode",
                    e.target.value,
                  )
                }
              />
            </Field>
          </div>
        </Card>

        <Card title="Risk of Security Trading" subtitle="">
          <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
            The price of securities fluctuates, sometimes drastically. The price
            of security may move up or down, and may even become valueless. It
            is likely that losses may be incurred as a result of buying and
            selling securities.
          </div>

          {/* <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="(Investment Advisor) Name">
              <Input
                value={sd.investmentAdvisorName}
                path="fcClientRegistration.staffDeclaration.investmentAdvisorName"
                onChange={(e) => update("fcClientRegistration.staffDeclaration.investmentAdvisorName", e.target.value)}
              />
            </Field>
            <Field label="Risk disclosure acknowledged">
              <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={!!decl.agreedToRiskDisclosure}
                  onChange={(e) => update("fcClientRegistration.declaration.agreedToRiskDisclosure", e.target.checked)}
                  disabled={busy}
                />
                <span>I/We confirm the risk disclosure statement was explained.</span>
              </label>
            </Field>
          </div> */}
        </Card>

        {/* <Card title="Client Introduction" subtitle="Referral / introduced by">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Client Introduced by">
              <Input
                value={cr.clientIntroducedBy}
                path="fcClientRegistration.clientIntroducedBy"
                onChange={(e) => update("fcClientRegistration.clientIntroducedBy", e.target.value)}
                placeholder=""
              />
            </Field>
          </div>
        </Card> */}
      </Card>

      {/* <Card
        title="Board Resolution & Operating Instructions"
        subtitle="Attach board resolution with operating instructions and provide any extra notes."
      >
        <div className="grid grid-cols-1 gap-4">
          <FileUpload label="Board Resolution" value={fcBoardResolution} setValue={setFcBoardResolution} disabled={busy} />
          <Field label="Board Resolution Details / Authorized persons (names & designations)">
            <Input
              value={cr.boardResolutionDetails}
              path="fcClientRegistration.boardResolutionDetails"
              onChange={(e) => update("fcClientRegistration.boardResolutionDetails", e.target.value)}
              placeholder="Enter details"
            />
          </Field>
          <Field label="Major Shareholders (up to ten)">
            <Input
              value={cr.majorShareholders}
              path="fcClientRegistration.majorShareholders"
              onChange={(e) => update("fcClientRegistration.majorShareholders", e.target.value)}
              placeholder="Enter names (comma separated)"
            />
          </Field>
        </div>
      </Card> */}

      {/* Mailing + Correspondence fields are captured in the Enclosed section above (as per the official form). */}

      <Card title="Declaration">
        <div className="grid grid-cols-1 gap-4">
          {/* Staff Declaration (as per official form) */}
          <div className="rounded-3xl border border-zinc-200 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/30">
            <div className="flex items-center justify-between gap-3">
              {/* <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Declaration by the staff</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">(Investment Advisor) on behalf of the broker</div>
              </div> */}
              {/* <div className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400">ASHA Securities Ltd</div> */}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Declaration by the staff,">
                <Input
                  value={sd.staffName}
                  path="fcClientRegistration.staffDeclaration.staffName"
                  onChange={(e) =>
                    update(
                      "fcClientRegistration.staffDeclaration.staffName",
                      e.target.value,
                    )
                  }
                  placeholder="Enter staff name"
                />
              </Field>

              <div>
                (Investment Advisor) on behalf of the Asha Philip Securities Ltd
                has clearly explained the risk disclosure statement to the
                client while inviting the client to read and ask questions and
                take independent advice if the client wishes.
              </div>

              {/* <div className="mt-2 space-y-1 text-[13px] leading-relaxed">ASHA SECURITIES LIMITED</div> */}
              <div className="mt-2 space-y-1 text-[13px] leading-relaxed">
                <div>ASHA SECURITIES LIMITED</div>
                <div>No. 60, 5th Lane,</div>
                <div>Colombo 03.</div>
                <div className="mt-2">
                  Tel: 2429100 &nbsp;&nbsp; Fax: 2429199
                </div>
              </div>

              <div className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-2 font-medium">We</div>
                    <div className="sm:col-span-10">
                      <LineInput
                        value={decl.weName}
                        path="fcClientRegistration.declaration.weName"
                        onChange={(e) =>
                          update(
                            "fcClientRegistration.declaration.weName",
                            e.target.value,
                          )
                        }
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-5 font-medium">
                      bearing Business Registration No.
                    </div>
                    <div className="sm:col-span-7">
                      <LineInput
                        value={decl.weBrNo}
                        path="fcClientRegistration.declaration.weBrNo"
                        onChange={(e) =>
                          update(
                            "fcClientRegistration.declaration.weBrNo",
                            e.target.value,
                          )
                        }
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-1 font-medium">of</div>
                    <div className="sm:col-span-11">
                      <LineInput
                        value={decl.weOf}
                        path="fcClientRegistration.declaration.weOf"
                        onChange={(e) =>
                          update(
                            "fcClientRegistration.declaration.weOf",
                            e.target.value,
                          )
                        }
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  hereby declare that the particulars given overleaf are true
                  and correct.
                </div>

                <div className="mt-3">
                  We undertake to operate my / our share trading account with
                  ASHA SECURITIES LTD. (Hereinafter referred to as BROKER) in
                  accordance with the Rules and Conditions given in the Colombo
                  Stock Exchange Bought and Sold Notes and in accordance with
                  the conditions of Sale of the Colombo Stock Exchange and other
                  prevailing laws and regulations of Sri Lanka and in particular
                  to the authority hereinafter granted to us by the Broker.
                </div>

                <div className="mt-3">
                  In the event of our failure to settle the amounts due in
                  respect of a share purchase, we do hereby irrevocably
                  authorise the Broker to sell such securities involved in the
                  default and if such proceeds are inadequate to cover the
                  shortfall any loss incurred by the Broker, to sell any other
                  security in our portfolio held by the Broker in the Central
                  Depository Systems (Pvt) Ltd., so that the full amount due to
                  the Broker may be settled and any surplus arising on the sale
                  of shares shall accrue to the Broker unless such surplus
                  arises from the sale of other quoted shares deposited by the
                  buyer as collateral with broker in which event the surplus
                  shall be remitted to us after settlement day of the relevant
                  sale(s).
                </div>

                <div className="mt-3">
                  The funds to be invested for the purchase of Securities
                  through the Securities Account to be opened with the CDS will
                  not be funds derived from any money laundering activity of
                  funds generated through financing of terrorist or any other
                  illegal activity.
                </div>

                <div className="mt-3">
                  In the event of a variation of any information given in the
                  CDS Form 2, Addendum to CDS Form 2(A) this declaration and
                  other information submitted by us along with the application
                  to open a CDS Account, we undertake to inform the CDS in
                  writing within fourteen (14) days of such variation.
                </div>

                <div className="mt-3">
                  The irrevocable authority granted hereby shall in no way
                  effect or exempt us from any liability as stated herein
                  towards the BROKER arising from or consequent upon any such
                  default.
                </div>

                <div className="mt-3">
                  Also we do hereby irrevocably agree that in the event of any
                  purchase orders placed with you for the purchase of shares, we
                  shall pay approximately 50% of the value of such purchase by a
                  legal tender which amount shall be set off against the total
                  amount due from us to you on the due date of settlement in
                  respect of such purchases, and the relevant investment
                  advisors may be incentivized by the company on such purchase
                  and sales turnovers.
                </div>

                <div className="mt-3">
                  Any delayed payments will be subject to additional interest
                  cost on the condition and will be debited to my/our account.
                  Interest percentage will be decided by the Broker considering
                  the prevailing interest rates. (not exceeding a maximum
                  interest rate of 0.1% per day)
                </div>

                <div className="mt-3">
                  The risk disclosure statement was explained while advising
                  independently and was invited to read and ask questions.
                </div>

                <div className="mt-3">
                  Services provided: Online facility, Research reports.
                </div>
                <br></br>

                <div className="grid grid-cols-1 gap-4">
                  <FileUpload
                    label="Upload the memorandum of articles"
                    path="fcMemorandumArticles"
                    value={fcMemorandumArticles}
                    setValue={setFcMemorandumArticles}
                    disabled={busy}
                  />
                  <FileUpload
                    label="Upload the incorporated certificate"
                    path="fcIncorporationCertificate"
                    value={fcIncorporationCertificate}
                    setValue={setFcIncorporationCertificate}
                    disabled={busy}
                  />
                </div>

                {/* ✅ KNOW YOUR CUSTOMER (KYC) PROFILE (Form 2A) */}
                <div className="mt-5">
                  <Card
                    title="KNOW YOUR CUSTOMER (KYC) PROFILE"
                    subtitle="In instances where the Securities Account will be maintained through a Custodian Bank, it is not mandatory to complete this Form 2A."
                  >
                    <div lassName="mt-5">
                      We declare that the information set out below is true and
                      accurate and our investments will be in accordance with
                      such information.
                    </div>

                    <br></br>

                    <div className="grid grid-cols-1 gap-4">
                      <Field label="Nature of the business">
                        <Input
                          value={kyc.natureOfBusiness}
                          path="fcClientRegistration.kycProfile.natureOfBusiness"
                          onChange={(e) =>
                            update(
                              "fcClientRegistration.kycProfile.natureOfBusiness",
                              e.target.value,
                            )
                          }
                          placeholder="Enter Nature of Business"
                        />
                      </Field>

                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Expected value of investment per annum
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            { v: "<100000", l: "Less than Rs. 100,000" },
                            {
                              v: "100000-500000",
                              l: "Rs. 100,000 – Rs. 500,000",
                            },
                            {
                              v: "500000-1000000",
                              l: "Rs. 500,000 – Rs. 1,000,000",
                            },
                            {
                              v: "1000000-2000000",
                              l: "Rs. 1,000,000 – Rs. 2,000,000",
                            },
                            {
                              v: "2000000-3000000",
                              l: "Rs. 2,000,000 – Rs. 3,000,000",
                            },
                            {
                              v: "3000000-4000000",
                              l: "Rs. 3,000,000 – Rs. 4,000,000",
                            },
                            {
                              v: "4000000-5000000",
                              l: "Rs. 4,000,000 – Rs. 5,000,000",
                            },
                            {
                              v: "5000000-10000000",
                              l: "Rs. 5,000,000 – Rs. 10,000,000",
                            },
                            { v: ">10000000", l: "Over Rs. 10,000,000" },
                          ].map((opt) => (
                            <label
                              key={opt.v}
                              className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft backdrop-blur transition hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200"
                            >
                              <input
                                type="radio"
                                name="expectedInvestmentPerAnnum"
                                checked={
                                  kyc.expectedInvestmentPerAnnum === opt.v
                                }
                                onChange={() =>
                                  update(
                                    "fcClientRegistration.kycProfile.expectedInvestmentPerAnnum",
                                    opt.v,
                                  )
                                }
                                disabled={busy}
                                className="mt-1"
                              />
                              <span>{opt.l}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Source of funds
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            "Business Ownership",
                            "Business Turnover",
                            "Investments",
                            "Contract Proceeds",
                            "Investment Proceeds / Savings",
                            "Sale of Property / Assets",
                            "Gifts",
                            "Donations / Charities / (Local / Foreign)",
                            "Commission Income",
                            "Export Proceeds",
                            "Profits",
                            "Others (Specify)",
                          ].map((label) => {
                            const isOthers = label === "Others (Specify)";
                            const checked = (kyc.sourceOfFunds || []).includes(
                              label,
                            );

                            return (
                              <div
                                key={label}
                                className={
                                  isOthers && checked ? "sm:col-span-2" : ""
                                }
                              >
                                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft backdrop-blur transition hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      const current = Array.isArray(
                                        kyc.sourceOfFunds,
                                      )
                                        ? kyc.sourceOfFunds
                                        : [];
                                      const next = isChecked
                                        ? current.includes(label)
                                          ? current
                                          : [...current, label]
                                        : current.filter((v) => v !== label);

                                      update("fcClientRegistration.kycProfile", {
                                        ...kyc,
                                        sourceOfFunds: next,
                                        sourceOfFundsOther:
                                          isOthers && !isChecked
                                            ? ""
                                            : kyc.sourceOfFundsOther || "",
                                      });
                                    }}
                                    disabled={busy}
                                    className="mt-1"
                                  />
                                  <span>{label}</span>
                                </label>

                                {isOthers && checked ? (
                                  <div className="mt-2 rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25">
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">
                                      Please specify
                                    </div>
                                    <Input
                                      value={kyc.sourceOfFundsOther || ""}
                                      path="fcClientRegistration.kycProfile.sourceOfFundsOther"
                                      onChange={(e) =>
                                        update(
                                          "fcClientRegistration.kycProfile.sourceOfFundsOther",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Type other source of funds"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-zinc-200 bg-white/55 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25">
                        <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Are you a US Person in terms of the Foreign Account
                          Tax Compliance Act (FATCA) of the US?
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["Yes", "No"].map((v) => (
                            <label
                              key={v}
                              className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200"
                            >
                              <input
                                type="radio"
                                name="fatcaUSPerson"
                                checked={kyc.fatcaUSPerson === v}
                                onChange={() =>
                                  update(
                                    "fcClientRegistration.kycProfile.fatcaUSPerson",
                                    v,
                                  )
                                }
                                disabled={busy}
                              />
                              <span>{v}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                          If yes, FATCA declaration has to be submitted along
                          with application form. If No, In the event if I/We
                          become a US person under FATCA of US, I/ We do hereby
                          undertake to inform the said fact to the Participant
                          immediately.
                        </div>
                      </div>

                      <div className="rounded-3xl border border-zinc-200 bg-white/55 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25">
                        <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Politically Exposed Persons (PEPs)
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["Yes", "No"].map((v) => (
                            <label
                              key={v}
                              className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200"
                            >
                              <input
                                type="radio"
                                name="pep"
                                checked={kyc.pep === v}
                                onChange={() =>
                                  update("fcClientRegistration.kycProfile.pep", v)
                                }
                                disabled={busy}
                              />
                              <span>{v}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                          Do you have persons who are or have been entrusted
                          domestically/ Internationally with a prominent public
                          function (for example Heads of State or of government,
                          senior politicians, senior government, judicial or
                          military officials, senior executives of state owned
                          corporations, important political party officials.),
                          as members of senior management or individuals who
                          have been entrusted with equivalent functions, i.e.
                          directors, deputy directors and members of the board
                          or equivalent functions.
                          <div className="mt-2 font-medium">
                            If ‘Yes’ please clarify
                          </div>
                        </div>
                        <div className="mt-2">
                          <TextArea
                            value={kyc.pepDetails}
                            path="fcClientRegistration.kycProfile.pepDetails"
                            onChange={(e) =>
                              update(
                                "fcClientRegistration.kycProfile.pepDetails",
                                e.target.value,
                              )
                            }
                            placeholder="Clarify if 'Yes'"
                          />
                        </div>
                      </div>

                      <Field label="Any other connected Businesses/ Professional activities">
                        <TextArea
                          value={kyc.otherConnectedBusinesses}
                          path="fcClientRegistration.kycProfile.otherConnectedBusinesses"
                          onChange={(e) =>
                            update(
                              "fcClientRegistration.kycProfile.otherConnectedBusinesses",
                              e.target.value,
                            )
                          }
                          placeholder=""
                        />
                      </Field>

                      <div className="rounded-3xl border border-zinc-200 bg-white/55 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25">
                        <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Person(s) authorized to give instructions to the
                          Participant (Stockbroker/Custodian Bank)
                        </div>
                        {/* <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-soft dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                        Select country code before entering telephone and mobile numbers
                      </div> */}
                        <div className="mt-4 grid grid-cols-1 gap-4">
                          <Input
                            value={ap.name}
                            path="fcClientRegistration.kycProfile.authorizedPerson.name"
                            onChange={(e) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.name",
                                e.target.value,
                              )
                            }
                            placeholder="Name"
                          />
                          <Input
                            value={ap.designation}
                            path="fcClientRegistration.kycProfile.authorizedPerson.designation"
                            onChange={(e) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.designation",
                                e.target.value,
                              )
                            }
                            placeholder="Designation"
                          />
                          <PhoneInput
                            value={ap.telephone}
                            path="fcClientRegistration.kycProfile.authorizedPerson.telephone"
                            onChange={(v) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.telephone",
                                v,
                              )
                            }
                            placeholder="Telephone"
                          />
                          <Input
                            value={ap.fax}
                            path="fcClientRegistration.kycProfile.authorizedPerson.fax"
                            onChange={(e) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.fax",
                                e.target.value,
                              )
                            }
                            placeholder="Fax"
                          />
                          <PhoneInput
                            value={ap.mobile}
                            path="fcClientRegistration.kycProfile.authorizedPerson.mobile"
                            onChange={(v) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.mobile",
                                v,
                              )
                            }
                            placeholder="Mobile"
                          />
                          <Input
                            value={ap.email}
                            path="fcClientRegistration.kycProfile.authorizedPerson.email"
                            onChange={(e) =>
                              update(
                                "fcClientRegistration.kycProfile.authorizedPerson.email",
                                e.target.value,
                              )
                            }
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <Field label="Other remarks / notes (if any)">
                        <TextArea
                          value={kyc.otherRemarks}
                          path="fcClientRegistration.kycProfile.otherRemarks"
                          onChange={(e) =>
                            update(
                              "fcClientRegistration.kycProfile.otherRemarks",
                              e.target.value,
                            )
                          }
                          placeholder="Other remarks / notes"
                        />
                      </Field>

                      {/* ================= CLIENT AGREEMENT (Editable Textboxes) ================= */}
                      <div className="mt-8">
                        <Card title="CLIENT AGREEMENT">
                          {(() => {
                            const date = ca?.date || {};
                            const parties = Array.isArray(ca?.parties)
                              ? ca.parties
                              : [{}, {}, {}];

                            const digitsOnly = (v) =>
                              String(v || "").replace(/[^\d]/g, "");
                            const clampAgreementPart = (key, value) => {
                              const digits = digitsOnly(value);
                              if (key === "year") return digits.slice(0, 4);
                              return digits.slice(0, 2);
                            };
                            const normalizeAgreementPart = (key, value) => {
                              const raw = clampAgreementPart(key, value);
                              if (!raw) return "";
                              if (key === "year") return raw;
                              const num = Number(raw);
                              if (Number.isNaN(num)) return "";
                              const max = key === "day" ? 31 : 12;
                              const normalized = String(
                                Math.min(Math.max(num, 1), max),
                              );
                              return raw.length === 2
                                ? normalized.padStart(2, "0")
                                : normalized;
                            };
                            const setDate = (k, v) =>
                              update(
                                `fcClientRegistration.clientAgreement.date.${k}`,
                                clampAgreementPart(k, v),
                              );
                            const finalizeDate = (k) =>
                              update(
                                `fcClientRegistration.clientAgreement.date.${k}`,
                                normalizeAgreementPart(k, date?.[k] || ""),
                              );

                            const partyMeta = [
                              {
                                idx: 0,
                                label: "(1)",
                                optional: false,
                                fallbackName: cr.companyName,
                                fallbackId: cr.businessRegNo,
                                fallbackAddress: cr.registeredAddress,
                              },
                              {
                                idx: 1,
                                label: "(2)",
                                optional: false,
                                fallbackName: "",
                                fallbackId: "",
                                fallbackAddress: "",
                              },
                              {
                                idx: 2,
                                label: "(3)",
                                optional: true,
                                fallbackName: "",
                                fallbackId: "",
                                fallbackAddress: "",
                              },
                            ];

                            return (
                              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                                    <span>
                                      This Agreement is made and entered into on
                                      this
                                    </span>
                                    <AgreementInput
                                      width="w-20"
                                      placeholder="DD"
                                      value={date.day || ""}
                                      path="fcClientRegistration.clientAgreement.date.day"
                                      inputMode="numeric"
                                      maxLength={2}
                                      onChange={(e) =>
                                        setDate("day", e.target.value)
                                      }
                                      onBlur={() => finalizeDate("day")}
                                    />
                                    <span>day of</span>
                                    <AgreementInput
                                      width="w-24"
                                      placeholder="MM"
                                      value={date.month || ""}
                                      path="fcClientRegistration.clientAgreement.date.month"
                                      inputMode="numeric"
                                      maxLength={2}
                                      onChange={(e) =>
                                        setDate("month", e.target.value)
                                      }
                                      onBlur={() => finalizeDate("month")}
                                    />
                                    <span>month</span>
                                    <AgreementInput
                                      width="w-28"
                                      placeholder="YYYY"
                                      value={date.year || ""}
                                      path="fcClientRegistration.clientAgreement.date.year"
                                      inputMode="numeric"
                                      maxLength={4}
                                      onChange={(e) =>
                                        setDate("year", e.target.value)
                                      }
                                      onBlur={() => finalizeDate("year")}
                                    />
                                    <span> year.</span>
                                  </div>
                                </div>

                                <h4 className="mt-5 mb-3 font-semibold text-zinc-900 dark:text-zinc-100">
                                  By and Between
                                </h4>

                                <div className="space-y-4">
                                  {partyMeta.map(
                                    ({
                                      idx,
                                      label,
                                      optional,
                                      fallbackName,
                                      fallbackId,
                                      fallbackAddress,
                                    }) => {
                                      const party = parties[idx] || {};
                                      const partyPath = `fcClientRegistration.clientAgreement.parties.${idx}`;
                                      return (
                                        <div
                                          key={idx}
                                          className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/25"
                                        >
                                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            <span>{label}</span>
                                            {optional ? (
                                              <span className="text-xs font-normal text-zinc-500"></span>
                                            ) : null}
                                          </div>

                                          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                            <div className="md:col-span-7">
                                              <Field label="">
                                                <AgreementInput
                                                  value={
                                                    party.name ??
                                                    fallbackName ??
                                                    ""
                                                  }
                                                  placeholder=""
                                                  path={`${partyPath}.name`}
                                                  onChange={(e) =>
                                                    update(
                                                      `${partyPath}.name`,
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </Field>
                                            </div>

                                            <div className="md:col-span-5">
                                              <Field label="bearing National Identity Card No./Company registration No ">
                                                <AgreementInput
                                                  value={
                                                    party.idNo ??
                                                    fallbackId ??
                                                    ""
                                                  }
                                                  placeholder=""
                                                  path={`${partyPath}.idNo`}
                                                  onChange={(e) =>
                                                    update(
                                                      `${partyPath}.idNo`,
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </Field>
                                            </div>

                                            <div className="md:col-span-12">
                                              <Field label="Of">
                                                <AgreementInput
                                                  value={
                                                    party.address ??
                                                    fallbackAddress ??
                                                    ""
                                                  }
                                                  placeholder=""
                                                  path={`${partyPath}.address`}
                                                  onChange={(e) =>
                                                    update(
                                                      `${partyPath}.address`,
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </Field>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>

                                <div className="mt-5 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50/90 p-4 shadow-soft dark:border-zinc-800 dark:from-zinc-950/55 dark:via-zinc-950/35 dark:to-zinc-900/30">
                                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="max-w-3xl">
                                      {/* <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                                        Client Agreement Preview
                                      </div> */}
                                      <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                                        (hereinafter sometimes jointly and severally referred to as the <span className="font-semibold">&quot;Client/s&quot;</span>) of the One Part ... This agreement covers the rights and responsibilities of the Client/s and the Stockbroker Firm, risk disclosures, indemnity, termination, and the final witness clause.
                                      </p>
                                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                        Click the button to read the full agreement.
                                      </p>
                                    </div>

                                    <div className="lg:pl-4">
                                      <button
                                        type="button"
                                        onClick={() => setShowClientAgreementModal(true)}
                                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
                                          <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                            Client Agreement
                                          </div>
                                          {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                            Full agreement text from One Part to the witness clause.
                                          </div> */}
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
                                        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                                          <LocalCorporateClientAgreementTerms />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </Card>
                      </div>

                      {/* ================= AGREEMENT - CREDIT FACILITY ================= */}
                      <div className="mt-8">
                        <CreditFacilityAgreementLocalCorporate
                          form={form}
                          update={update}
                          busy={busy}
                          onPrev={() => {}}
                          onNext={() => {}}
                          cfPrincipalSig={cfPrincipalSig}
                          setCfPrincipalSig={setCfPrincipalSig}
                          cfFirmSig={cfFirmSig}
                          setCfFirmSig={setCfFirmSig}
                          cfWitness1Sig={cfWitness1Sig}
                          setCfWitness1Sig={setCfWitness1Sig}
                          cfWitness2Sig={cfWitness2Sig}
                          setCfWitness2Sig={setCfWitness2Sig}
                          pathPrefix="fcClientRegistration.creditFacility"
                          clientDefaults={{
                            name: cr.companyName,
                            nicCds: cr.businessRegNo,
                            address: cr.registeredAddress,
                            includeTheSaid: cr.companyName,
                          }}
                        />
                      </div>

                      {/* ================= PRIVACY NOTICE & DATA COLLECTION CONSENT CLAUSE ================= */}
                      <Card
                        title="Privacy Notice & Data Collection Consent Clause"
                        // subtitle="Please review this notice carefully and confirm the applicable consents before submitting the application."
                      >
                        <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-3 text-sm text-sky-900 shadow-soft dark:border-sky-900/60 dark:from-sky-950/30 dark:via-zinc-950/30 dark:to-cyan-950/20 dark:text-sky-100">
                          By submitting this form, you acknowledge and agree
                          that{" "}
                          <span className="font-semibold">
                            Asha Securities Limited
                          </span>{" "}
                          ("Company") may collect, process, and store your
                          personal data in accordance with its Privacy Policy.
                        </div>

                        <div className="mt-4 rounded-3xl border border-zinc-200 bg-white/75 p-5 text-[13px] leading-7 text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-300">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                1. Types of Data Collected
                              </h4>
                              <p className="mt-1">
                                The Company collects personal data, including
                                but not limited to, your name, contact details,
                                National Identity Card (NIC) number, financial
                                information, and any other relevant details
                                necessary for providing brokerage and related
                                services.
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                2. Purpose of Data Collection
                              </h4>
                              <p className="mt-1">
                                Your personal data is collected for the purposes
                                of account management, regulatory compliance,
                                transaction processing, customer support, and
                                improving our services.
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                3. Third-Party Sharing
                              </h4>
                              <p className="mt-1">
                                Your data may be shared with authorized
                                third-party service providers or regulatory
                                authorities where required by law, solely for
                                operational and compliance purposes.
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                4. Data Retention
                              </h4>
                              <p className="mt-1">
                                Your personal data will be retained only for the
                                period necessary to fulfill the purposes
                                outlined in this notice or as required by
                                applicable laws and regulations.
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                5. User Rights & Consent
                              </h4>
                              <ul className="mt-2 list-disc space-y-1 pl-5">
                                <li>
                                  You have the right to access, correct, or
                                  request the deletion of your personal data.
                                </li>
                                <li>
                                  By checking the box below, you confirm that
                                  you have read and understood this notice and
                                  consent to the collection, processing, and
                                  storage of your personal data.
                                </li>
                                <li>
                                  If applicable, you may provide additional
                                  consent for data sharing and marketing
                                  communications.
                                </li>
                              </ul>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3">
                              <label className="flex items-start gap-3 rounded-3xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-soft transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                                <input
                                  type="checkbox"
                                  checked={
                                    !!form?.fcClientRegistration?.privacyConsent
                                      ?.consentDataProcessing
                                  }
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.privacyConsent.consentDataProcessing",
                                      e.target.checked,
                                    )
                                  }
                                  disabled={busy}
                                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                                />
                                <span>
                                  I consent to the collection, processing, and
                                  storage of my personal data in accordance with
                                  the Company&apos;s Privacy Policy.
                                </span>
                              </label>

                              <label className="flex items-start gap-3 rounded-3xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-soft transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                                <input
                                  type="checkbox"
                                  checked={
                                    !!form?.fcClientRegistration?.privacyConsent
                                      ?.consentThirdPartySharing
                                  }
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.privacyConsent.consentThirdPartySharing",
                                      e.target.checked,
                                    )
                                  }
                                  disabled={busy}
                                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                                />
                                <span>
                                  I agree to share my data with third-party
                                  service providers for specified operational
                                  purposes.
                                </span>
                              </label>

                              <label className="flex items-start gap-3 rounded-3xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-soft transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:border-sky-800">
                                <input
                                  type="checkbox"
                                  checked={
                                    !!form?.fcClientRegistration?.privacyConsent
                                      ?.consentMarketing
                                  }
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.privacyConsent.consentMarketing",
                                      e.target.checked,
                                    )
                                  }
                                  disabled={busy}
                                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                                />
                                <span>
                                  I would like to receive promotional updates
                                  via email/SMS.
                                </span>
                              </label>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                                6. Privacy Policy
                              </h4>
                              <p className="mt-1">
                                For more details on how your data is handled,
                                please refer to our full Privacy Policy.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-3 text-xs leading-6 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/35 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">6. Privacy Policy:</span> For more details on how your data is handled, please refer to our full Privacy Policy.
                      </div> */}
                      </Card>

                      {/* ================= SCHEDULE 1 ================= */}
                      <Card title="SCHEDULE 1" subtitle="DECLARATION">
                        {/* <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-4 py-3 text-sm text-emerald-900 shadow-soft dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-zinc-950/30 dark:to-teal-950/20 dark:text-emerald-100">
                        Please complete this declaration exactly as required in the official wording.
                      </div> */}

                        <div className="mt-4 rounded-3xl border border-zinc-200 bg-white/75 p-5 text-[13px] leading-7 text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-300">
                          <div className="text-sm leading-8 text-zinc-800 dark:text-zinc-200/90">
                            <span className="font-medium">I</span>
                            <span className="mx-2 inline-block w-full max-w-[18rem] align-middle">
                              <LineInput
                                value={s1.employeeName}
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.schedule1.employeeName",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                                path="fcClientRegistration.schedule1.employeeName"
                              />
                            </span>
                            <span>
                              an employee of Asha Securities Ltd
                              (&lsquo;Stockbroker Firm&rsquo;), who is duly
                              authorized by the Board of Directors of the
                              Stockbroker Firm to make declarations on its
                              behalf hereby confirm that the following risks
                              involved in investing/trading in securities listed
                              on the Colombo Stock Exchange (&lsquo;Risk
                              Disclosure Statements&rsquo;) were clearly
                              explained by me to
                            </span>
                            <span className="mx-2 inline-block w-full max-w-[20rem] align-middle">
                              <LineInput
                                value={s1.clientNames}
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.schedule1.clientNames",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                                path="fcClientRegistration.schedule1.clientNames"
                              />
                            </span>
                            <span>
                              (&nbsp;Name/s of the Client/s&nbsp;) the below
                              mentioned Risk Disclosure Statements, ask
                              questions and take independent advice if the
                              Client/s wish/es to:
                            </span>
                          </div>

                          <div className="mt-5 space-y-3 text-sm text-zinc-800 dark:text-zinc-200/90">
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                a)
                              </div>
                              <div>
                                The prices of securities fluctuate, sometimes
                                drastically and the price of a security may
                                depreciate in value and may even become
                                valueless.
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                b)
                              </div>
                              <div>
                                It is possible that losses may be incurred
                                rather than profits made as a result of
                                transacting in securities.
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                c)
                              </div>
                              <div>
                                It is advisable to invest funds that are not
                                required in the short term to reduce the risk of
                                investing.
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              Signed on behalf of the Stockbroker Firm by:
                            </div>

                            <div className="mt-3">
                              <LineInput
                                value={s1.signedBy}
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.schedule1.signedBy",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter signed by"
                                path="fcClientRegistration.schedule1.signedBy"
                              />
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                                  Name
                                </div>
                                <LineInput
                                  value={s1.name}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule1.name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter name"
                                  path="fcClientRegistration.schedule1.name"
                                />
                              </div>
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                                  Designation
                                </div>
                                <LineInput
                                  value={s1.designation}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule1.designation",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter designation"
                                  path="fcClientRegistration.schedule1.designation"
                                />
                              </div>
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                                  Date
                                </div>
                                <LineDateInput
                                  value={s1.date}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule1.date",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="DD / MM / YYYY"
                                  path="fcClientRegistration.schedule1.date"
                                />
                              </div>
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                                  NIC No
                                </div>
                                <LineInput
                                  value={s1.nicNo}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule1.nicNo",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter NIC number"
                                  path="fcClientRegistration.schedule1.nicNo"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card title="SCHEDULE 2" subtitle="ACKNOWLEDGEMENT">
                        <div className="mt-4 rounded-3xl border border-zinc-200 bg-white/75 p-5 text-[13px] leading-7 text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-300">
                          <div className="flex flex-col gap-4 text-sm leading-8 text-zinc-800 dark:text-zinc-200/90">
                            <div>
                              <span className="font-semibold">I / We,</span>
                            </div>

                            <div>
                              <span className="font-semibold">(1)</span>
                              <span className="mx-2 inline-block w-full max-w-[17rem] align-middle">
                                <LineInput
                                  value={s2.party1Name}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party1Name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party1Name"
                                />
                              </span>
                              <span>
                                [bearing National Identity Card No./Company
                                registration No
                              </span>
                              <span className="mx-2 inline-block w-full max-w-[14rem] align-middle">
                                <LineInput
                                  value={s2.party1Id}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party1Id",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party1Id"
                                />
                              </span>
                              <span>of</span>
                              <span className="mx-2 inline-block w-full max-w-[18rem] align-middle">
                                <LineInput
                                  value={s2.party1Address}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party1Address",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party1Address"
                                />
                              </span>
                              <span>],</span>
                            </div>

                            <div>
                              <span className="font-semibold">(2)</span>
                              <span className="mx-2 inline-block w-full max-w-[17rem] align-middle">
                                <LineInput
                                  value={s2.party2Name}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party2Name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party2Name"
                                />
                              </span>
                              <span>
                                [bearing National Identity Card No./Company
                                registration No
                              </span>
                              <span className="mx-2 inline-block w-full max-w-[14rem] align-middle">
                                <LineInput
                                  value={s2.party2Id}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party2Id",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party2Id"
                                />
                              </span>
                              <span>of</span>
                              <span className="mx-2 inline-block w-full max-w-[18rem] align-middle">
                                <LineInput
                                  value={s2.party2Address}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party2Address",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party2Address"
                                />
                              </span>
                              <span>] and,</span>
                            </div>

                            <div>
                              <span className="font-semibold">(3)</span>
                              <span className="mx-2 inline-block w-full max-w-[17rem] align-middle">
                                <LineInput
                                  value={s2.party3Name}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party3Name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party3Name"
                                />
                              </span>
                              <span>
                                [bearing National Identity Card No./Company
                                registration No
                              </span>
                              <span className="mx-2 inline-block w-full max-w-[14rem] align-middle">
                                <LineInput
                                  value={s2.party3Id}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party3Id",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party3Id"
                                />
                              </span>
                              <span>of</span>
                              <span className="mx-2 inline-block w-full max-w-[18rem] align-middle">
                                <LineInput
                                  value={s2.party3Address}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.schedule2.party3Address",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                  path="fcClientRegistration.schedule2.party3Address"
                                />
                              </span>
                              <span>],</span>
                            </div>
                          </div>

                          <div className="mt-5 text-sm leading-8 text-zinc-800 dark:text-zinc-200/90">
                            <span>
                              agree and acknowledge that the following risks
                              involved in investing / trading in securities
                              listed on the Colombo Stock Exchange (&lsquo;Risk
                              Disclosure Statements&rsquo;) were explained to
                              me/us by
                            </span>
                            <span className="mx-2 inline-block w-full max-w-[18rem] align-middle">
                              <LineInput
                                value={s2.explainedBy}
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.schedule2.explainedBy",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                                path="fcClientRegistration.schedule2.explainedBy"
                              />
                            </span>
                            <span>
                              an employee of Asha Securities Ltd
                              (&lsquo;Stockbroker Firm&rsquo;), and I/we
                              was/were invited to read the below mentioned Risk
                              Disclosure Statements, ask questions and take
                              independent advice if I/we wish to.
                            </span>
                          </div>

                          <div className="mt-5 text-sm leading-7 text-zinc-800 dark:text-zinc-200/90">
                            Additionally, I/we acknowledge that I/we understood
                            the following Risk Disclosure Statements;
                          </div>

                          <div className="mt-4 space-y-3 text-sm text-zinc-800 dark:text-zinc-200/90">
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                a)
                              </div>
                              <div>
                                The prices of securities fluctuate, sometimes
                                drastically and the price of a security may
                                depreciate in value and may even become
                                valueless.
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                b)
                              </div>
                              <div>
                                It is possible that losses may be incurred
                                rather than profits made as a result of
                                transacting in securities.
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-6 shrink-0 font-semibold">
                                c)
                              </div>
                              <div>
                                It is advisable to invest funds that are not
                                required in the short term to reduce the risk of
                                investing.
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 max-w-sm">
                            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                              Date
                            </div>
                            <LineDateInput
                              value={s2.date}
                              onChange={(e) =>
                                update(
                                  "fcClientRegistration.schedule2.date",
                                  e.target.value,
                                )
                              }
                              placeholder="DD / MM / YYYY"
                              path="fcClientRegistration.schedule2.date"
                            />
                          </div>
                        </div>
                      </Card>

                      <Card title="Beneficial Ownership Form" subtitle="">
                        <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50 p-5 shadow-soft dark:border-zinc-800 dark:from-zinc-950/60 dark:via-zinc-950/45 dark:to-zinc-900/30">
                          <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-[13px] leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/35 dark:text-zinc-300">
                            This form has been issued under the Customer Due
                            Diligence Rue No 1 of 2016 issued in terms of the
                            Section 2(3) of the Financial Transactions Reporting
                            Act of 2006. This form, or an approved equivalent,
                            is required to be completed by all customers of
                            financial institutions designated under the Acts to
                            the best of their knowledge. The original completed
                            and signed and witnessed version of this form must
                            be retained by the financial institution and
                            available to the competent authorities upon request.
                          </div>

                          <SectionTitle>
                            <b>Customer Identification</b>
                          </SectionTitle>
                          <br></br>
                          <div className="sm:col-span-2">
                            <Field label="Name of Natural Person Opening Account:">
                              <Input
                                value={boCi.naturalPersonName}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.naturalPersonName"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.naturalPersonName",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Designation of Natural Person Opening Account:">
                              <Input
                                value={boCi.naturalPersonDesignation}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.naturalPersonDesignation"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.naturalPersonDesignation",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Name of Legal Person for Which the Account is Being Opened:">
                              <Input
                                value={boCi.legalPersonName}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonName"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonName",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Reg. No of Legal Person for Which the Account is Being Opened:">
                              <Input
                                value={boCi.legalPersonRegNo}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonRegNo"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonRegNo",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <div className="sm:col-span-2">
                              <Field label="Address of Legal Person for Which the Account is Being Opened:">
                                <Input
                                  value={boCi.legalPersonAddress}
                                  path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonAddress"
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.beneficialOwnershipForm.customerIdentification.legalPersonAddress",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                />
                              </Field>
                              <br></br>
                            </div>
                            <Field label="Name of Legal Arrangement for Which the Account is Being Opened:">
                              <Input
                                value={boCi.arrangementName}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementName"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementName",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Deed No of Legal Arrangement for Which the Account is Being Opened:">
                              <Input
                                value={boCi.arrangementDeedNo}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementDeedNo"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementDeedNo",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Trustee of Legal Arrangement for Which the Account is Being Opened:">
                              <Input
                                value={boCi.arrangementTrustee}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementTrustee"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementTrustee",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Address of Legal Arrangement for Which the Account is Being Opened:">
                              <Input
                                value={boCi.arrangementAddress}
                                path="fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementAddress"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.customerIdentification.arrangementAddress",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                          </div>

                          <SectionTitle>I declare that I:</SectionTitle>
                          <div className="grid grid-cols-1 gap-3">
                            <TickBox
                              checked={boDec.isBeneficialOwner}
                              onChange={(e) =>
                                update(
                                  "fcClientRegistration.beneficialOwnershipForm.declaration.isBeneficialOwner",
                                  e.target.checked,
                                )
                              }
                              path="fcClientRegistration.beneficialOwnershipForm.declaration.isBeneficialOwner"
                              label="am the beneficial owner2of the customer for this account. "
                            />
                            <TickBox
                              checked={boDec.isNotBeneficialOwner}
                              onChange={(e) =>
                                update(
                                  "fcClientRegistration.beneficialOwnershipForm.declaration.isNotBeneficialOwner",
                                  e.target.checked,
                                )
                              }
                              path="fcClientRegistration.beneficialOwnershipForm.declaration.isNotBeneficialOwner"
                              label="am not the beneficial owner of the customer of this account. Complete identifying information for all beneficial owners that own or control 10% or more of the customer’s equity, beneficial owners on whose behalf the account is being operated, and at least one person who exercises effective control of the legal entity regardless of whether such person is already listed. "
                            />
                          </div>

                          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-[13px] leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                            beneficial owner as “a natural person who ultimately
                            owns or controls a customer or the person on whose
                            behalf a transaction is being conducted and includes
                            the person who exercises ultimate effective control
                            over a person or a legal arrangement.”
                          </div>

                          <SectionTitle>Beneficial Owner Details</SectionTitle>
                          <div className="space-y-4">
                            {boOwners.map((owner, index) => (
                              <div
                                key={index}
                                className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30"
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    Owner {index + 1}
                                  </div>
                                  {/* <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">10% or more / control</div> */}
                                </div>
                                <div className="xl:col-span-2">
                                  <CompactField
                                    label="Name"
                                    value={owner?.name}
                                    onChange={(e) =>
                                      update(
                                        `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.name`,
                                        e.target.value,
                                      )
                                    }
                                    placeholder=""
                                    path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.name`}
                                  />
                                  <br></br>
                                  <CompactField
                                    label="NIC or Passport / Country of Issue / Country of Citizenship"
                                    value={owner?.nicOrPassport}
                                    onChange={(e) =>
                                      update(
                                        `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.nicOrPassport`,
                                        e.target.value,
                                      )
                                    }
                                    placeholder=""
                                    path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.nicOrPassport`}
                                  />
                                  <br></br>
                                  <CompactField
                                    label="Date of Birth"
                                    type="date"
                                    value={owner?.dob}
                                    onChange={(e) =>
                                      update(
                                        `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.dob`,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="DD / MM / YYYY"
                                    path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.dob`}
                                  />
                                  <br></br>
                                  <div className="xl:col-span-2">
                                    <CompactField
                                      label="Current Address"
                                      value={owner?.currentAddress}
                                      onChange={(e) =>
                                        update(
                                          `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.currentAddress`,
                                          e.target.value,
                                        )
                                      }
                                      placeholder=""
                                      path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.currentAddress`}
                                    />
                                    <br></br>
                                  </div>
                                  <CompactField
                                    label="Source of Beneficial Ownership (1=Equity (indicate %), 2=Effective Control, 3=Person on Whose Behalf Account is Operated) "
                                    value={owner?.sourceOfBeneficialOwnership}
                                    onChange={(e) =>
                                      update(
                                        `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.sourceOfBeneficialOwnership`,
                                        e.target.value,
                                      )
                                    }
                                    placeholder=""
                                    path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.sourceOfBeneficialOwnership`}
                                  />
                                  <br></br>
                                  <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                                    <input
                                      type="checkbox"
                                      checked={!!owner?.pep}
                                      onChange={(e) =>
                                        update(
                                          `fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.pep`,
                                          e.target.checked,
                                        )
                                      }
                                      data-path={`fcClientRegistration.beneficialOwnershipForm.beneficialOwners.${index}.pep`}
                                      className="h-4 w-4 rounded border-zinc-400"
                                    />
                                    <span>
                                      Check if Politically Exposed Person (PEP)
                                      ^ 3{" "}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>

                          <SectionTitle>
                            Details of the Customer Authorized to Act on Behalf
                            of Entity
                          </SectionTitle>
                          <div className="xl:col-span-2">
                            <Field label="Name">
                              <Input
                                value={boAuth.name}
                                path="fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.name"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.name",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="NIC / Passport">
                              <Input
                                value={boAuth.nicOrPassport}
                                path="fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.nicOrPassport"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.nicOrPassport",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Date of Birth">
                              <Input
                                type="date"
                                value={boAuth.dob}
                                path="fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.dob"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.dob",
                                    e.target.value,
                                  )
                                }
                                placeholder="DD / MM / YYYY"
                              />
                            </Field>
                            <br></br>
                            <div className="sm:col-span-2">
                              <Field label="Verification of Beneficial Ownership">
                                <TextArea
                                  value={boAuth.verificationText}
                                  path="fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.verificationText"
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.beneficialOwnershipForm.authorizedCustomer.verificationText",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=""
                                />
                              </Field>
                              <br></br>
                            </div>
                          </div>

                          <SectionTitle>
                            Authorized Financial Institution Official
                          </SectionTitle>
                          <div className="xl:col-span-2">
                            <Field label="Name">
                              <Input
                                value={boAfi.name}
                                path="fcClientRegistration.beneficialOwnershipForm.afiOfficial.name"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.afiOfficial.name",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Title">
                              <Input
                                value={boAfi.title}
                                path="fcClientRegistration.beneficialOwnershipForm.afiOfficial.title"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.afiOfficial.title",
                                    e.target.value,
                                  )
                                }
                                placeholder=""
                              />
                            </Field>
                            <br></br>
                            <Field label="Date">
                              <Input
                                type="date"
                                value={boAfi.date}
                                path="fcClientRegistration.beneficialOwnershipForm.afiOfficial.date"
                                onChange={(e) =>
                                  update(
                                    "fcClientRegistration.beneficialOwnershipForm.afiOfficial.date",
                                    e.target.value,
                                  )
                                }
                                placeholder="DD / MM / YYYY"
                              />
                            </Field>
                          </div>

                          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/90 px-4 py-3 text-[12px] leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                            Politically exposed person" means an individual who
                            is entrusted with prominent public functions either
                            domestically or by a foreign country, or in an
                            international organization and includes a Head of a
                            State or a Government, a politician, a senior
                            government officer, judicial officer or military
                            officer, a senior executive of a State owned
                            Corporation, Government or autonomous body but does
                            not include middle rank or junior rank individuals.
                          </div>
                          <br></br>

                          {/* <SectionTitle>Settlement Authorization</SectionTitle> */}
                          <div className="rounded-[26px] border border-zinc-200 bg-white/90 p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/35">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                              <div>
                                {/* <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">ASHA SECURITIES LIMITED</div> */}
                                <div className="mt-1 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                                  Accountant,
                                  <br />
                                  Asha Securities Limited,
                                  <br />
                                  No.60, 5<sup>th</sup> Lane, Colombo.
                                </div>
                              </div>
                              {/* <div className="w-full max-w-[220px]">
                              <Field label="Date">
                                <Input
                                  value={boPay.date}
                                  path="fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.date"
                                  onChange={(e) => update("fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.date", e.target.value)}
                                  placeholder="DD / MM / YYYY"
                                />
                              </Field>
                            </div> */}
                            </div>

                            <div className="mt-6 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                              Dear Sir / Madam,
                            </div>

                            <div className="mt-6 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                              I / We hereby authorize Asha Securities Limited.
                            </div>

                            {/* <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-3 text-xs leading-6 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/35 dark:text-zinc-400">
                            Tick the instruction(s) applicable to this account.
                          </div> */}

                            <div className="mt-5 space-y-4">
                              <label className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-4 text-sm text-zinc-800 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50">
                                <input
                                  type="checkbox"
                                  checked={!!boPay.holdCreditBalance}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.holdCreditBalance",
                                      e.target.checked,
                                    )
                                  }
                                  data-path="fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.holdCreditBalance"
                                  className="mt-1 h-5 w-5 rounded border-zinc-400"
                                />
                                <span>
                                  To hold any credit balance in my account and
                                  to recover future payments for stocks
                                  purchased on my behalf from such credit
                                  balances.
                                </span>
                              </label>

                              <label className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-4 text-sm text-zinc-800 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50">
                                <input
                                  type="checkbox"
                                  checked={!!boPay.settleOnDueDate}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.settleOnDueDate",
                                      e.target.checked,
                                    )
                                  }
                                  data-path="fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.settleOnDueDate"
                                  className="mt-1 h-5 w-5 rounded border-zinc-400"
                                />
                                <span>
                                  Prepare the sale proceed and purchase
                                  consideration would be settled on the due
                                  date.
                                </span>
                              </label>

                              <label className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-4 text-sm text-zinc-800 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50">
                                <input
                                  type="checkbox"
                                  checked={!!boPay.normalSettlement}
                                  onChange={(e) =>
                                    update(
                                      "fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.normalSettlement",
                                      e.target.checked,
                                    )
                                  }
                                  data-path="fcClientRegistration.beneficialOwnershipForm.paymentAuthorization.normalSettlement"
                                  className="mt-1 h-5 w-5 rounded border-zinc-400"
                                />
                                <span>
                                  Normal Settlement. Unless other specific
                                  instructions are given by me.
                                </span>
                              </label>
                            </div>

                            <div className="mt-8 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                              Thank You,
                            </div>
                            <div className="mt-2 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                              Yours faithfully
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card
                        title="Additional Requirements"
                        subtitle="Local Company Accounts – Documents required in addition to the application forms"
                      >
                        <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-white p-5 shadow-soft dark:border-zinc-800 dark:from-zinc-950/55 dark:via-zinc-950/35 dark:to-zinc-900/30">
                          {/* <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-[13px] leading-6 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
                          Please prepare the following supporting documents for Local Company accounts. This section is presented in a clean document-style layout so it reads like the Word file while matching the rest of the onboarding form.
                        </div> */}

                          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <RequirementItem
                              index="1"
                              title="1. Form 15"
                              detail="Name, NIC, shareholding percentage and address of the shareholders list as at date."
                            />

                            <RequirementItem
                              index="2"
                              title="2. Form 20"
                              detail="Name, address, ID card number, email, contact number and occupations of directors as at date."
                            />

                            <RequirementItem
                              index="3"
                              title="3. Copies of NIC"
                              detail="Copies of the NIC of all the directors."
                            />

                            <RequirementItem
                              index="4"
                              title="4. Company Secretary Certified Copies"
                            >
                              <div className="space-y-2">
                                <div>a) Business registration form.</div>
                                <div>
                                  b) Memorandum &amp; Articles of Association or
                                  corresponding document.
                                </div>
                                <div>c) Certificate of incorporation.</div>
                                <div>
                                  d) Certified extract of the resolution to open
                                  the CDS Account.
                                </div>
                                <div>
                                  e) Certified extract of the resolution
                                  appointing a person who is authorized to give
                                  trading instructions on behalf of the company.
                                </div>
                              </div>
                            </RequirementItem>

                            <RequirementItem
                              index="5"
                              title="5. Bank Account Proof"
                              detail="Bank account proof issued within the last 3 months."
                            />

                            <RequirementItem
                              index="6"
                              title="6. Beneficial Ownership Letter"
                              detail="Submit the beneficial ownership letter together with the supporting company documents."
                            />
                          </div>

                          <div className="mt-5 rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                              Foreign Individual or Corporate Accounts
                            </div>
                            <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-200">
                              In addition to the above, a letter confirming the
                              Inward Investment Account opened with a Sri Lankan
                              bank should be attached.
                            </div>
                          </div>

                          <div className="mt-5 flex flex-col gap-3 rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50/70 px-4 py-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/30 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                Digital Onboarding via CDS
                              </div>
                              <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                                https://acc-lc.cse.lk/
                              </div>
                            </div>
                            {/* <div className="text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                            Keep these documents ready before final submission for a smoother review process.
                          </div> */}
                          </div>
                        </div>
                      </Card>

                      <Card title="Upload the Signatures" subtitle="">
                        <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-white p-5 shadow-soft dark:border-zinc-800 dark:from-zinc-950/55 dark:via-zinc-950/35 dark:to-zinc-900/30">
                          {/* <div className="rounded-[24px] border border-zinc-200 bg-white/80 px-4 py-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Signature Checklist</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-200">
                            Please upload clear scanned signatures on a light background. This section follows the same clean Word-style ordering you shared, while keeping the UI polished and easy to complete.
                          </div>
                        </div> */}

                          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <UploadSignatureCard title="Upload Specimen Signature of Director1">
                              <FileUpload
                                label="Choose Director 1 Signature"
                                accept="image/*,.pdf"
                                file={fcDirector1Sig}
                                setFile={setFcDirector1Sig}
                                path="fcDirector1Sig"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Specimen Signature of Director2">
                              <FileUpload
                                label="Choose Director 2 Signature"
                                accept="image/*,.pdf"
                                file={fcDirector2Sig}
                                setFile={setFcDirector2Sig}
                                path="fcDirector2Sig"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Agent">
                              <FileUpload
                                label="Choose Agent Signature"
                                accept="image/*,.pdf"
                                file={fcAgentSignature}
                                setFile={setFcAgentSignature}
                                path="fcAgentSignature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Advisor">
                              <FileUpload
                                label="Choose Advisor Signature"
                                accept="image/*,.pdf"
                                file={advisorSig}
                                setFile={setAdvisorSig}
                                path="advisorSig"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Authorizer">
                              <FileUpload
                                label="Choose Authorizer Signature"
                                accept="image/*,.pdf"
                                file={fcAuthorizerSignature}
                                setFile={setFcAuthorizerSignature}
                                path="fcAuthorizerSignature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Company Seal">
                              <FileUpload
                                label="Choose Company Seal"
                                accept="image/*,.pdf"
                                file={fcCompanySeal}
                                setFile={setFcCompanySeal}
                                path="fcCompanySeal"
                                hint={busy ? "" : "Upload seal file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of the Client">
                              <FileUpload
                                label="Choose Client Signature"
                                accept="image/*,.pdf"
                                file={clientSig}
                                setFile={setClientSig}
                                path="clientSig"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Stockbroker Firm">
                              <FileUpload
                                label="Choose Stockbroker Firm Signature"
                                accept="image/*,.pdf"
                                file={fcStockbrokerFirmSignature}
                                setFile={setFcStockbrokerFirmSignature}
                                path="fcStockbrokerFirmSignature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Witness1">
                              <FileUpload
                                label="Choose Witness 1 Signature"
                                accept="image/*,.pdf"
                                file={fcWitness1Signature}
                                setFile={setFcWitness1Signature}
                                path="fcWitness1Signature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Witness2">
                              <FileUpload
                                label="Choose Witness 2 Signature"
                                accept="image/*,.pdf"
                                file={fcWitness2Signature}
                                setFile={setFcWitness2Signature}
                                path="fcWitness2Signature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Principal Applicant">
                              <FileUpload
                                label="Choose Principal Applicant Signature"
                                accept="image/*,.pdf"
                                file={fcPrincipalApplicantSignature}
                                setFile={setFcPrincipalApplicantSignature}
                                path="fcPrincipalApplicantSignature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>

                            <UploadSignatureCard title="Upload Signature of Joint Applicant">
                              <FileUpload
                                label="Choose Joint Applicant Signature"
                                accept="image/*,.pdf"
                                file={fcJointApplicantSignature}
                                setFile={setFcJointApplicantSignature}
                                path="fcJointApplicantSignature"
                                hint={busy ? "" : "Upload signature file"}
                              />
                            </UploadSignatureCard>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                </div>
              </div>

              {/* <Field label="Investment Advisor">
                <Input
                  value={sd.investmentAdvisorName}
                  path="fcClientRegistration.staffDeclaration.investmentAdvisorName"
                  onChange={(e) => update("fcClientRegistration.staffDeclaration.investmentAdvisorName", e.target.value)}
                  placeholder="Enter advisor name"
                />
              </Field> */}
              {/* <Field label="Date">
                <Input
                  type="date"
                  value={sd.staffDate}
                  path="fcClientRegistration.staffDeclaration.staffDate"
                  onChange={(e) => update("fcClientRegistration.staffDeclaration.staffDate", e.target.value)}
                />
              </Field> */}
              {/* <Field label="Signature / Stamp">
                <Input
                  value={sd.staffSignature}
                  path="fcClientRegistration.staffDeclaration.staffSignature"
                  onChange={(e) => update("fcClientRegistration.staffDeclaration.staffSignature", e.target.value)}
                  placeholder="Type name or stamp details"
                />
              </Field> */}
            </div>

            {/* <label className="mt-3 flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={!!decl.agreedToRiskDisclosure}
                onChange={(e) => update("fcClientRegistration.declaration.agreedToRiskDisclosure", e.target.checked)}
                disabled={busy}
                className="mt-1"
              />
              <span>
                Asha Philip Securities Ltd has clearly explained the risk disclosure statement to the client while inviting the client to read and ask questions and take independent advice if the client wishes.
              </span>
            </label> */}
          </div>

          {/* Broker block (static) */}
          {/* <div className="rounded-3xl border border-zinc-200 bg-white/55 p-4 text-sm text-zinc-700 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
            <div className="text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100">ASHA SECURITIES LIMITED</div>
            <div className="mt-2 space-y-1 text-[13px] leading-relaxed">
              <div>No. 60, 5th Lane,</div>
              <div>Colombo 03.</div>
              <div className="mt-2">Tel: 2429100 &nbsp;&nbsp; Fax: 2429199</div>
            </div>
          </div> */}

          {/* Client Declaration (as per official form) */}
          {/* <div className="rounded-3xl border border-zinc-200 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/30">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Client Declaration</div>
            <div className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-2 font-medium">We</div>
                  <div className="sm:col-span-10">
                    <LineInput
                      value={decl.weName}
                      path="fcClientRegistration.declaration.weName"
                      onChange={(e) => update("fcClientRegistration.declaration.weName", e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-5 font-medium">bearing Business Registration No.</div>
                  <div className="sm:col-span-7">
                    <LineInput
                      value={decl.weBrNo}
                      path="fcClientRegistration.declaration.weBrNo"
                      onChange={(e) => update("fcClientRegistration.declaration.weBrNo", e.target.value)}
                      placeholder="BR No."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-1 font-medium">of</div>
                  <div className="sm:col-span-11">
                    <LineInput
                      value={decl.weOf}
                      path="fcClientRegistration.declaration.weOf"
                      onChange={(e) => update("fcClientRegistration.declaration.weOf", e.target.value)}
                      placeholder="Address / place"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                hereby declare that the particulars given overleaf are true and correct.
              </div>

              <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-3 text-[13px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                We undertake to operate my / our share trading account with <span className="font-semibold">ASHA SECURITIES LTD.</span> (Hereinafter referred to as <span className="font-semibold">BROKER</span>) in accordance with the Rules and Conditions given in the Colombo Stock Exchange Bought and Sold Notes and in accordance with the conditions of Sale of the Colombo Stock Exchange and other prevailing laws and regulations of Sri Lanka and in particular to the authority hereby granted to us by the Broker.
              </div>

              <label className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-zinc-700 shadow-soft dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={!!decl.agreedToUndertaking}
                  onChange={(e) => update("fcClientRegistration.declaration.agreedToUndertaking", e.target.checked)}
                  disabled={busy}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">Optional confirmation:</span> You may tick this undertaking if needed for your records, but it will no longer block form submission.
                </span>
              </label>
            </div>
          </div> */}
        </div>
      </Card>

      {/* <Card title="">
        <div className="grid grid-cols-1 gap-4">
          <FileUpload label="Upload the memorandum of articles" value={fcMemorandumArticles} setValue={setFcMemorandumArticles} disabled={busy} />
          <FileUpload label="Upload the incorporated certificate" value={fcIncorporationCertificate} setValue={setFcIncorporationCertificate} disabled={busy} />
        </div>
      </Card> */}
    </>
  );
}
