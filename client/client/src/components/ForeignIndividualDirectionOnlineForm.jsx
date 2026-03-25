import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import PhoneInput from "./PhoneInput.jsx";
import FileUpload from "./FileUpload.jsx";

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

export default function ForeignIndividualDirectionOnlineForm({
  form,
  update,
  busy,
  principalSig,
  setPrincipalSig,
  jointSig,
  setJointSig,
}) {
  const data = form?.fiDirectionOnline || {};
  const office = data.officeUseOnly || {};

  const cds1 = data.cdsLine1 || {};
  const cds2 = data.cdsLine2 || {};
  const iWe = data.iWe || {};

  return (
    <div className="space-y-8">
      <Card><center>
        <CardHeader
          title="DIRECTFN ONLINE FORM & AGREEMENT"
          // subtitle="Foreign Individual"
          // right={<Pill>DirectFN</Pill>}
        /></center>

        <div className="px-6 py-6">
          {/* TOP DETAILS */}
          <SectionTitle>CLIENT DETAILS</SectionTitle>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Client Name">
              <Input
                    path={"fiDirectionOnline.clientName"}
                value={data.clientName || ""}
                onChange={(e) => update("fiDirectionOnline.clientName", e.target.value)}
                placeholder="Enter Name"
                disabled={busy}
              />
            </Field>

            <Field label="Address">
              <Input
                    path={"fiDirectionOnline.address"}
                value={data.address || ""}
                onChange={(e) => update("fiDirectionOnline.address", e.target.value)}
                placeholder="Enter Address"
                disabled={busy}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field label="Telephone (Hotline)">
              <PhoneInput
                    path={"fiDirectionOnline.telHotline"} value={data.telHotline || ""} onChange={(v) => update("fiDirectionOnline.telHotline", v)} />
            </Field>

            <Field label="Telephone (Office)">
              <PhoneInput
                    path={"fiDirectionOnline.telOffice"} value={data.telOffice || ""} onChange={(v) => update("fiDirectionOnline.telOffice", v)} />
            </Field>

            <Field label="Mobile">
              <PhoneInput
                    path={"fiDirectionOnline.mobile"} value={data.mobile || ""} onChange={(v) => update("fiDirectionOnline.mobile", v)} />
            </Field>

            <Field label="Email">
              <Input
                    path={"fiDirectionOnline.email"}
                type="email"
                value={data.email || ""}
                onChange={(e) => update("fiDirectionOnline.email", e.target.value)}
                placeholder="Enter Email"
                disabled={busy}
              />
            </Field>
          </div>

          {/* CDS LINES (as per Word doc: two CDS lines) */}
          <SectionTitle hint="">CDS DETAILS</SectionTitle>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="CDS A/C No (1)">
              <div className="grid grid-cols-[76px_1fr] gap-2">
                <Input value={cds1.prefix || "MSB"} disabled />
                <Input
                    path={"fiDirectionOnline.cdsLine1.number"}
                  value={cds1.number || ""}
                  onChange={(e) => update("fiDirectionOnline.cdsLine1.number", e.target.value)}
                  placeholder="Enter CDS A/C No"
                  disabled={busy}
                />
              </div>
            </Field>

            <Field label="CDS Name (1)">
              <Input
                    path={"fiDirectionOnline.cdsLine1.name"}
                value={cds1.name || ""}
                onChange={(e) => update("fiDirectionOnline.cdsLine1.name", e.target.value)}
                placeholder="Enter CDS Name"
                disabled={busy}
              />
            </Field>

            <Field label="CDS A/C No (2)">
              <div className="grid grid-cols-[76px_1fr] gap-2">
                <Input value={cds2.prefix || "MSB"} disabled />
                <Input
                    path={"fiDirectionOnline.cdsLine2.number"}
                  value={cds2.number || ""}
                  onChange={(e) => update("fiDirectionOnline.cdsLine2.number", e.target.value)}
                  placeholder="Enter CDS A/C No"
                  disabled={busy}
                />
              </div>
            </Field>

            <Field label="CDS Name (2)">
              <Input
                    path={"fiDirectionOnline.cdsLine2.name"}
                value={cds2.name || ""}
                onChange={(e) => update("fiDirectionOnline.cdsLine2.name", e.target.value)}
                placeholder="Enter CDS Name"
                disabled={busy}
              />
            </Field>
          </div>

          {/* I/We line */}
          <SectionTitle>I/We</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="I/We (Name)">
              <Input
                    path={"fiDirectionOnline.iWe.name"}
                value={iWe.name || ""}
                onChange={(e) => update("fiDirectionOnline.iWe.name", e.target.value)}
                placeholder="Enter Name"
                disabled={busy}
              />
            </Field>

            <Field label="of (Organization)">
              <Input path="fiDirectionOnline.iWe.organization"
                value={iWe.organization || ""}
                onChange={(e) =>
                  update("fiDirectionOnline.iWe.organization", e.target.value)
                }
                placeholder="Organization"
                disabled={busy}
              />
            </Field>
          </div>

          {/* AGREEMENT TEXT */}
          <SectionTitle>AGREEMENT</SectionTitle>

          <InfoBox>
            <div className="space-y-3">
              <p>
                request you to allow me the use of Asha Securities Ltd ( hereinafter referred to as “ASL” )
                Internet Trading Service ( hereinafter referred to as the “Online Service” ) and hereby agree
                to be bound by the terms and conditions governing such service.
              </p>

              <p>
                I/We do hereby authorise ASL to issue me/us the distinctive user identification number
                ( hereinafter sometimes referred to as the User ID ) for the purpose of using the Online
                Service by me/us.
              </p>

              <p>
                I/We do hereby undertake that the online service used solely for the purpose of operating
                my/our CDS account.
              </p>

              <p>
                By completing this online “Internet Trading Online Form and Agreement, I/We authorize ASL to accept or act upon all instructions or messages which purport to come from me/us and are received through the Online Service and authenticated in the manner described by ASL under the usage of password issued to me/us by ASL. Passwords shall mean original passwords confidentially generated or subsequent passwords generated and issued exclusively for me/us on my/our request. Issue shall mean the emailing of password to the address given in the Application Form.
              </p>

              <p>
                I/We will immediately bring to the notice of ASL any error, discrepancy or omission noted by
                me/us.
              </p>

              <p>
                If my/our securities account with ASL is a jointly held account, every holder shall be jointly
                and severally liable for all transactions arising from the use of Online Trading.
              </p>

              <p>
                I/We do hereby agree to change the password immediately after accessing Online Service and
                thereafter at regular intervals in keeping with ASL’s requirements.
              </p>

              <p>
                I/We shall inform ASL immediately if I/we become aware of any act or attempt of unauthorized
                use of the User ID and Password by anyone.
              </p>

              <p>
                I/We shall not attempt to effect transactions through Online Service unless sufficient funds
                ( for purchases of securities ) inclusive of other charges associated with the transaction, are
                available with me/us. For the purpose of this Agreement “Sufficient Funds” shall mean, in case
                of a cash deposit, up to 100% of the value the proposed transactions to be effected by me/us
                through internet trading or otherwise and in case of the securities portfolio such percentage
                made available to us by ASL from time to time. I/we hereby authorize ASL at its sole discretion
                to sell any securities that are in my/our accounts maintained with ASL in order to recover any
                loss or damages that shall arise to ASL as a result of me/us trading through the Online Service
                without sufficient funds or any other reason whatsoever. This right of ASL shall be in addition
                to any other rights that shall be available to ASL under any laws or regulations including the
                rules and regulations of the Securities and Exchange Commission of Sri Lanka, the Colombo Stock
                Exchange and the Central Depository Systems ( Private ) Limited.
              </p>

              <p>
                I/we hereby acknowledge that I am permitted to enter into this agreement in terms of the ASL
                member application signed by me whereby I/we have opened a CDS account/s with ASL and that the
                terms and conditions contained herein are in addition to the other documents and agreements
                that I have signed with ASL.
              </p>

              <p>
                I/We are fully liable and responsible for all consequences arising from or in connection with
                use of the Online Service services and/or access to any information or report ( including market
                analysis information ) or any other information as a result of such use by me/us or any other
                person whether or not authorized.
              </p>

              <p>
                ASL shall at any time be entitled to amend, supplement or vary any of these terms and
                conditions, at its absolute discretion with notice to me/us and such amendment, supplement or
                variation shall be binding on me/us.
              </p>

              <p>
                I/we do hereby agree to abide by the terms and conditions applicable to any new
                features/options/version updates that may be introduced by ASL subsequent to this application;
                upon I/we expressly registers myself/ourselves to obtain such services
              </p>

              <p>
                The use of the Online Service shall be subject to the prevailing rules of the Securities and
                Exchange Commission of Sri Lanka, the Colombo Stock Exchange and the Central Depository Systems
                ( Private ) Limited and ASL, Rules and Regulations and any Terms and Conditions governing all
                services, facilities and transactions covered by the Online Service.
              </p>

              <p>
                I/We have read and understood the foregoing and agree to be bound by the above terms and
                conditions contained in this agreement.
              </p>
            </div>
          </InfoBox>

          {/* SIGNATURES */}
          <SectionTitle>SIGNATURES</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </div>

          {/* OFFICE USE ONLY */}
          <SectionTitle>OFFICE USE ONLY</SectionTitle>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="User Name">
              <Input path="fiDirectionOnline.officeUseOnly.userName"
                value={office.userName || ""}
                onChange={(e) =>
                  update("fiDirectionOnline.officeUseOnly.userName", e.target.value)
                }
                placeholder="Enter User Name"
                disabled={busy}
              />
            </Field>

            <Field label="Advisor">
              <Input path="fiDirectionOnline.officeUseOnly.advisor"
                value={office.advisor || ""}
                onChange={(e) =>
                  update("fiDirectionOnline.officeUseOnly.advisor", e.target.value)
                }
                placeholder="Enter Advisor"
                disabled={busy}
              />
            </Field>

            <Field label="Authorised Signature">
              <Input path="fiDirectionOnline.officeUseOnly.authorisedSignature"
                value={office.authorisedSignature || ""}
                onChange={(e) =>
                  update(
                    "fiDirectionOnline.officeUseOnly.authorisedSignature",
                    e.target.value
                  )
                }
                placeholder="Authorised Signature"
                disabled={busy}
              />
            </Field>

            <Field label="Date">
              <Input path="fiDirectionOnline.officeUseOnly.date"
                type="date"
                value={office.date || ""}
                onChange={(e) =>
                  update("fiDirectionOnline.officeUseOnly.date", e.target.value)
                }
                disabled={busy}
              />
            </Field>
          </div>

          {/* ACCEPT */}
          {/* <label className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-300 bg-white/80 p-4">
            <input
              type="checkbox"
              checked={!!data.accepted}
              onChange={(e) => update("fiDirectionOnline.accepted", e.target.checked)}
            />
            <span className="text-sm text-zinc-900">
              I/We have read and understood the above and agree to be bound by the terms & conditions
            </span>
          </label> */}
        </div>
      </Card>
    </div>
  );
}
