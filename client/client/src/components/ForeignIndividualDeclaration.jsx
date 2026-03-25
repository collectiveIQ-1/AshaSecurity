import { useEffect, useState } from "react";
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

function MiniGrid({ children }) {
  return <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function TrioGrid({ children }) {
  return <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>;
}

function PersonLine({ labelPrefix, basePath, data, update, busy, locked = false }) {
  return (
    <div className="rounded-3xl border border-zinc-300 bg-white p-4">
      <div className="mb-3 text-xs font-semibold tracking-wide text-zinc-900">
        {labelPrefix}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input
                    path={`${basePath}.name`}
            value={data?.name || ""}
            onChange={(e) => update(`${basePath}.name`, e.target.value)}
            placeholder="Enter Name"
            disabled={busy || locked}
          />
        </Field>

        <Field label="Bearing Passport Number">
          <Input path={`${basePath}.passportNo`}
            value={data?.passportNo || ""}
            onChange={(e) =>
              update(`${basePath}.passportNo`, e.target.value)
            }
            placeholder="Enter Passport Number"
            disabled={busy || locked}
          />
        </Field>

        <Field label="Address">
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


// Allow manual typing in date inputs but keep calendar picker. Clamp year to 4 digits.
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

export default function ForeignIndividualDeclaration({
  form,
  update,
  busy,

  // Schedule 2 signatures (as your existing props)
  principalSig,
  setPrincipalSig,
  jointSig,
  setJointSig,
  secondJointSig,
  setSecondJointSig,

  // Schedule 1 (staff sign) signature - we will use advisorSig for this
  advisorSig,
  setAdvisorSig,
}) {
  const data = form?.fiDeclaration || {};

  // -------------------------------------------------
  // Auto-fill (LIVE): Schedule 2 - Acknowledgement
  // (1) Principal Applicant -> name / passport / permanent address
  // (2) Joint Applicant     -> name / passport / permanent address
  // (3) 2nd Joint Applicant -> name / passport / permanent address
  // If Joint / 2nd Joint is not enabled, we keep those lines blank.
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

    setIfDifferent("fiDeclaration.schedule2.person1.name", pName);
    setIfDifferent("fiDeclaration.schedule2.person1.passportNo", pPassport);
    setIfDifferent("fiDeclaration.schedule2.person1.address", pAddress);

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

    setIfDifferent("fiDeclaration.schedule2.person2.name", jEnabled ? jName : "");
    setIfDifferent(
      "fiDeclaration.schedule2.person2.passportNo",
      jEnabled ? jPassport : ""
    );
    setIfDifferent(
      "fiDeclaration.schedule2.person2.address",
      jEnabled ? jAddress : ""
    );

    const sEnabled = !!get(form, "fiClientRegistration.secondJointApplicant.enabled");
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

    setIfDifferent("fiDeclaration.schedule2.person3.name", sEnabled ? sName : "");
    setIfDifferent(
      "fiDeclaration.schedule2.person3.passportNo",
      sEnabled ? sPassport : ""
    );
    setIfDifferent(
      "fiDeclaration.schedule2.person3.address",
      sEnabled ? sAddress : ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const s1 = data.schedule1 || {};
  const s2 = data.schedule2 || {};

  // Schedule 2 people
  const p1 = s2.person1 || {};
  const p2 = s2.person2 || {};
  const p3 = s2.person3 || {};

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader
          title="DECLARATION"
          // subtitle="Structured exactly as the Word document: Schedule 1 + Schedule 2"
          // right={
          //   <>
          //     <Pill>Schedule 1</Pill>
          //     <Pill>Schedule 2</Pill>
          //   </>
          // }
        />

        <div className="px-6 py-6">
          {/* =========================
              SCHEDULE 1 - DECLARATION
             ========================= */}
          <SectionTitle>SCHEDULE 1 - DECLARATION</SectionTitle>

          <Card className="mt-4">
            <CardHeader
              title="Schedule 1"
              // subtitle="Declaration by authorised person (Asha Securities Ltd)"
              // right={<Pill>Required</Pill>}
            />
            <div className="px-6 py-6">
              <Field label="Enter full name of the authorised person ( IN BLOCK LETTERS )">
                <Input path="fiDeclaration.schedule1.authorisedPersonBlockLetters"
                  value={s1.authorisedPersonBlockLetters || ""}
                  onChange={(e) =>
                    update(
                      "fiDeclaration.schedule1.authorisedPersonBlockLetters",
                      String(e.target.value || "").toUpperCase()
                    )
                  }
                  placeholder="Enter full name of authorised person (BLOCK LETTERS)"
                  disabled={busy}
                />
              </Field>

              <InfoBox>
                an employee of Asha Securities Ltd ( Stockbroker Firm ), who is duly authorized by the Board of
                Directors of the Stockbroker Firm to make declarations on its behalf hereby confirm that the
                following risks involved in investing / trading in securities listed on the Colombo Stock Exchange
                ( “Risk Disclosure Statements” ) were clearly explained by me to
              </InfoBox>
              <br></br>
              <Field label="Enter name/s of the client/s">
                <Input path="fiDeclaration.schedule1.clientNames"
                  value={s1.clientNames || ""}
                  onChange={(e) =>
                    update("fiDeclaration.schedule1.clientNames", e.target.value)
                  }
                  placeholder="Enter name/s of the client/s"
                  disabled={busy}
                />
              </Field>

              <InfoBox>
                ( “the Client/s” ) and invited the Client/s to read the below mentioned Risk Disclosure Statements,
                ask questions and take independent advice if the Client/s wish/es to:
                <div className="mt-3 space-y-2">
                  <div> a. The prices of securities fluctuate, sometimes drastically and the price of a security may depreciate in value and may even become valueless.</div>
                  <div> b. It is possible that losses may be incurred rather than profits made as a result of transacting in securities.</div>
                  <div> c. It is advisable to invest funds that are not required in the short term to reduce the risk of investing.</div>
                </div>
              </InfoBox>

              <div className="mt-6 text-xs font-semibold tracking-wide text-zinc-900">
                Signed on behalf of the Stockbroker Firm by :
              </div>

              <Field label="">
                <Input path="fiDeclaration.schedule1.signedOnBehalfBy"
                  value={s1.signedOnBehalfBy || ""}
                  onChange={(e) =>
                    update("fiDeclaration.schedule1.signedOnBehalfBy", e.target.value)
                  }
                  placeholder="Name of the authorized person"
                  disabled={busy}
                />
              </Field>

              <TrioGrid>
                <div className="rounded-3xl border border-zinc-300 bg-white p-4">
                  <FileUpload
                    label="Signature"
                    accept="image/*,.pdf"
                    file={advisorSig}
                    setFile={setAdvisorSig}
                    disabled={busy}
                  />
                </div>

                <Field label="Name">
                  <Input
                    path={"fiDeclaration.schedule1.name"}
                    value={s1.name || ""}
                    onChange={(e) => update("fiDeclaration.schedule1.name", e.target.value)}
                    placeholder="Enter Name"
                    disabled={busy}
                  />
                </Field>

                <Field label="Designation">
                  <Input path="fiDeclaration.schedule1.designation"
                    value={s1.designation || ""}
                    onChange={(e) =>
                      update("fiDeclaration.schedule1.designation", e.target.value)
                    }
                    placeholder="Enter Designation"
                    disabled={busy}
                  />
                </Field>

                <Field label="Passport Number">
                  <Input path="fiDeclaration.schedule1.passportNo"
                    value={s1.passportNo || ""}
                    onChange={(e) =>
                      update(
                        "fiDeclaration.schedule1.passportNo",
                        e.target.value
                      )
                    }
                    placeholder="Enter Passport Number"
                    disabled={busy}
                  />
                </Field>

                <Field label="Date">
                  <Input path="fiDeclaration.schedule1.date"
                    type="date"
                    value={s1.date || ""}
                    onChange={(e) => update("fiDeclaration.schedule1.date", clampYear4(e.target.value))}
                    disabled={busy}
                  />
                </Field>
              </TrioGrid>
            </div>
          </Card>

          {/* =========================
              SCHEDULE 2 - ACKNOWLEDGEMENT
             ========================= */}
          <SectionTitle>SCHEDULE 2 - ACKNOWLEDGEMENT</SectionTitle>

          <Card className="mt-4">
            <CardHeader
              title="Schedule 2"
              // subtitle="Acknowledgement by Client/s"
              // right={<Pill>Required</Pill>}
            />
            <div className="px-6 py-6">
              <div className="text-xs text-zinc-600">
                I/We
              </div>

              <div className="mt-4 space-y-4">
                <PersonLine
                  labelPrefix="(1)"
                  basePath="fiDeclaration.schedule2.person1"
                  data={p1}
                  update={update}
                  busy={busy}
                  locked
                />

                <PersonLine
                  labelPrefix="(2)"
                  basePath="fiDeclaration.schedule2.person2"
                  data={p2}
                  update={update}
                  busy={busy}
                  locked
                />

                <PersonLine
                  labelPrefix="(3)"
                  basePath="fiDeclaration.schedule2.person3"
                  data={p3}
                  update={update}
                  busy={busy}
                  locked
                />
              </div>

              <div className="mt-5 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 px-5 py-4 text-sm leading-[1.9] text-zinc-700 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:from-zinc-950/80 dark:to-zinc-950/40 dark:text-zinc-200/90">
                <span>
                  I/We agree and acknowledge that the following risks involved in investing / trading in securities listed
                  on the Colombo Stock Exchange ( “Risk Disclosure Statements” ) were explained to me/us by{' '}
                </span>
                <input
                  type="text"
                  value={s2.explainedByName || ""}
                  data-path="fiDeclaration.schedule2.explainedByName"
                  onChange={(e) => update("fiDeclaration.schedule2.explainedByName", e.target.value)}
                  placeholder="Enter employee name"
                  disabled={busy}
                  className="mx-1 inline-block min-w-[220px] border-0 border-b-2 border-dotted border-zinc-500 bg-transparent px-2 py-0.5 align-baseline text-sm font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-sky-500 focus:border-emerald-500 dark:border-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <span>
                  , an employee of Asha Securities Ltd ( “Stockbroker Firm” ) and I/we was/were invited to read the below
                  mentioned Risk Disclosure Statements, ask questions and take independent advice if I/we wish to.
                </span>
              </div>

              <InfoBox>
                Additionally, I/we acknowledge that I/we understood the following Risk Disclosure Statements;
                <div className="mt-3 space-y-2">
                  <div> a. The Prices of securities fluctuate, sometimes drastically and the price of a security may depreciate in value and may even become valueless.</div>
                  <div> b. It is possible that losses may be incurred rather than profits made as a result of transacting in securities.</div>
                  <div> c. It is advisable to invest funds that are not required in the short term to reduce the risk of investing.</div>
                </div>
              </InfoBox>

              <MiniGrid>
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

                <Field label="Date">
                  <Input path="fiDeclaration.schedule2.date"
                    type="date"
                    value={s2.date || ""}
                    onChange={(e) => update("fiDeclaration.schedule2.date", clampYear4(e.target.value))}
                    disabled={busy}
                  />
                </Field>
              </MiniGrid>

              {/* <label className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-300 bg-white/80 p-4">
                <input
                  type="checkbox"
                  checked={!!data.accepted}
                  onChange={(e) => update("fiDeclaration.accepted", e.target.checked)}
                />
                <span className="text-sm text-zinc-900">
                  I confirm the above Declaration & Acknowledgement
                </span>
              </label> */}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
