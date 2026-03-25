import { Router } from "express";
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { getModelFor, findByIdAcrossCollections } from "../models/ApplicationModels.js";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { buildApplicationPdfBuffer } from "../services/pdf.js";

const router = Router();

// Protect application portal APIs
router.use(requireAuth);


// ✅ Customers can edit submitted applications within this window
const EDIT_WINDOW_DAYS = Number(process.env.EDIT_WINDOW_DAYS || 7);

function computeEditUntil(fromDate = new Date()) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + EDIT_WINDOW_DAYS);
  return d;
}

async function loadAndAuthorizeEditable(req, res) {
  const { id } = req.params;

  const found = await findByIdAcrossCollections(id);
  const app = found?.doc;
  const Model = found?.Model;

  if (!app || !Model) {
    res.status(404).json({ message: "Application not found" });
    return null;
  }

  const now = new Date();
  if (now > new Date(app.editUntil)) {
    res.status(403).json({ message: "Edit window expired" });
    return null;
  }

  return { app, Model };
}

/**
 * ✅ Email config (from .env)
 */
const TO_EMAILS =
  process.env.TO_EMAILS ||
  "sruhunage@collectivercm.com,bherath@collectivercm.com,dfernando@collectivercm.com,nranasinghe@collectivercm.com";

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "";

const EMAIL_ENABLED =
  String(process.env.EMAIL_ENABLED || "true").toLowerCase() === "true";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

/**
 * ✅ Confirmation email to applicant (no PDF attachment)
 * - Individual: principal applicant email (from Client Registration)
 * - Corporate: company email address (from Client Registration)
 */
function pickApplicantEmail(region, applicantType, formData) {
  const r = String(region || "").toLowerCase();
  const t = String(applicantType || "").toLowerCase();

  try {
    if (t === "individual") {
      if (r === "local") return formData?.clientRegistration?.principal?.email || "";
      if (r === "foreign") return formData?.fiClientRegistration?.principal?.email || "";
    }
    if (t === "corporate") {
      if (r === "local") return formData?.clientRegistration?.email || "";
      if (r === "foreign") return formData?.fcClientRegistration?.emailAddress || formData?.fcClientRegistration?.email || "";
    }
  } catch {
    // ignore
  }
  return "";
}

function safeText(v) {
  return String(v ?? "").trim();
}

function isValidEmail(email) {
  const e = safeText(email);
  // simple check (avoid throwing on weird values)
  return !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function buildClientRegistrationRows(region, applicantType, formData) {
  const r = String(region || "").toLowerCase();
  const t = String(applicantType || "").toLowerCase();
  const rows = [];

  const push = (k, v) => rows.push({ k, v: safeText(v) || "-" });

  if (t === "individual" && r === "local") {
    const p = formData?.clientRegistration?.principal || {};
    push("Name", [p.title, p.name || p.namesByInitials, p.surname].filter(Boolean).join(" "));
    push("NIC/Passport", p.identityNo || p.nic);
    push("Nationality", p.nationality);
    push("Mobile", p.mobile);
    push("Email", p.email);
    push("Permanent Address", p.permanentAddress);
    push("Correspondence Address", p.correspondenceAddress);
    push("CDS", p.cdsAccountNo || [p.cds?.prefix, p.cds?.number].filter(Boolean).join(" "));
  } else if (t === "individual" && r === "foreign") {
    const p = formData?.fiClientRegistration?.principal || {};
    push("Name", [p.title, p.name || p.namesByInitials, p.surname].filter(Boolean).join(" "));
    push("Passport/NIC", p.nicOrPassport || p.passportNo || p.nic);
    push("Mobile", p.mobile);
    push("Email", p.email);
    push("Permanent Address", p.permanentAddress);
    push("Correspondence Address", p.correspondenceAddress);
    push("CDS", p.cdsAccountNo || [p.cds?.prefix, p.cds?.number].filter(Boolean).join(" "));
  } else if (t === "corporate" && r === "local") {
    const cr = formData?.clientRegistration || {};
    push("Company Name", cr.companyName);
    push("Reg No", cr.regNo || cr.businessRegNo);
    push("Telephone", cr.telNos);
    push("Email", cr.email);
    push("Registered Address", cr.registeredAddress);
    push("Correspondence Address", cr.correspondenceAddress);
  } else if (t === "corporate" && r === "foreign") {
    const cr = formData?.fcClientRegistration || {};
    push("Company Name", cr.companyName);
    push("Business Reg No", cr.businessRegNo);
    push("Telephone", cr.telNos);
    push("Email", cr.emailAddress || cr.email);
    push("Registered Address", cr.registeredAddress);
    push("Correspondence Address", cr.correspondenceAddress);
  }

  return rows;
}

// ✅ Convert action + status into correct message
function buildStatusMessage(action, status) {
  const a = String(action || "").toLowerCase(); // "submission" or "update"
  const isSubmission = a === "submission";

  if (status === "success") {
    return isSubmission ? "Submitted Successfully." : "Updated Successfully.";
  }
  return isSubmission ? "Submission Failed." : "Update Failed.";
}

function buildApplicantConfirmationHTML({
  action,
  status,
  id,
  region,
  applicantType,
  editLink,
  formData,
}) {
  const badgeBg = status === "success" ? "#16a34a" : "#dc2626";
  const badgeText = status === "success" ? "SUCCESS" : "FAILED";
  const rows = buildClientRegistrationRows(region, applicantType, formData);

  const rowHtml = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 10px;color:#6b7280;border-bottom:1px solid #f1f5f9;vertical-align:top">${r.k}</td>
          <td style="padding:8px 10px;color:#111827;border-bottom:1px solid #f1f5f9"><b>${r.v}</b></td>
        </tr>`
    )
    .join("");

  const statusLine = buildStatusMessage(action, status);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:24px">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
      <div style="padding:18px 20px;background:#0f172a;color:#fff">
        <div style="font-size:18px;font-weight:700">Application ${safeText(action)} Confirmation</div>
        <div style="margin-top:8px;display:inline-block;padding:4px 10px;border-radius:999px;background:${badgeBg};font-size:12px;letter-spacing:.08em">${badgeText}</div>
      </div>

      <div style="padding:18px 20px">
        <div style="color:#111827;font-size:14px;line-height:1.5">
          Status: <b>${statusLine}</b><br/>
          Submission ID: <b>${safeText(id)}</b><br/>
          Edit Link: <a href="${editLink}" style="color:#2563eb;text-decoration:none"><b>${editLink}</b></a>
        </div>

        <div style="margin-top:16px;font-size:13px;color:#334155;font-weight:700">Client Registration (Summary)</div>
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          ${rowHtml || `<tr><td style="padding:10px;color:#6b7280">No client registration details found.</td></tr>`}
        </table>

        <div style="margin-top:14px;color:#6b7280;font-size:12px">
          This email is a confirmation only. No PDF attachment is included.
        </div>
      </div>
    </div>
  </div>
  `;
}

/**
 * ✅ Create transporter once
 */
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: String(process.env.MAIL_SECURE || "true").toLowerCase() === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

/**
 * ✅ Eye-catchy admin email body (PDF-attached submission)
 * Keeps the same information, but in a clean StoxIQ-styled layout.
 */
function buildAdminPdfEmailHTML({ id, region, applicantType, formKey, editUntil, action = "New" }) {
  const safe = (v) =>
    String(v ?? "-")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const fmtEditUntil = editUntil
    ? new Date(editUntil).toLocaleString()
    : "-";

  const actionLabel = safe(action);
  const title = `${actionLabel} Application — ${safe(region)}/${safe(applicantType)} (${safe(formKey)})`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:28px 12px;">
            <table width="720" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(15,23,42,0.10);border:1px solid #e5e7eb;">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0f172a,#020617);padding:22px 22px;color:#ffffff;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                    <div>
                      <div style="font-size:22px;font-weight:800;letter-spacing:.6px;">StoxIQ</div>
                    <div style="opacity:.85;font-size:13px;margin-top:4px;">Asha Securities • Onboarding ${actionLabel}</div>
                    </div>
                    <div style="text-align:right;">
                      <div style="font-size:12px;opacity:.85;">Submission ID</div>
                      <div style="font-size:16px;font-weight:800;">${safe(id)}</div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:22px 22px 10px 22px;">
                  <div style="font-size:16px;color:#0f172a;font-weight:800;">${title}</div>
                  <div style="margin-top:8px;color:#475569;font-size:14px;line-height:1.6;">
                    ${actionLabel === "Updated" ? "An existing onboarding application has been updated via the StoxIQ portal." : "A new onboarding application has been submitted via the StoxIQ portal."}
                    The PDF summary and any uploaded supporting documents are attached to this email.
                  </div>

                  <!-- Details Card -->
                  <div style="margin-top:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:14px 14px;">
                    <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;">Application Details</div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;color:#0f172a;">
                      <tr>
                        <td style="padding:8px 0;color:#64748b;">Submission ID</td>
                        <td style="padding:8px 0;text-align:right;font-weight:800;">
                          <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#0f172a;color:#ffffff;font-size:12px;letter-spacing:.3px;">${safe(id)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#64748b;">Region</td>
                        <td style="padding:8px 0;text-align:right;font-weight:800;">${safe(region)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#64748b;">Applicant Type</td>
                        <td style="padding:8px 0;text-align:right;font-weight:800;">${safe(applicantType)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#64748b;">Form Key</td>
                        <td style="padding:8px 0;text-align:right;font-weight:800;">${safe(formKey)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#64748b;">Edit Window Until</td>
                        <td style="padding:8px 0;text-align:right;font-weight:800;">${safe(fmtEditUntil)}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Attachment note -->
                  <div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:#eef2ff;border:1px solid #c7d2fe;">
                    <div style="font-size:13px;font-weight:800;color:#1e3a8a;">Attachments Included</div>
                    <div style="margin-top:6px;font-size:13px;color:#1e293b;line-height:1.6;">
                      • Application PDF (summary)<br/>
                      • Uploaded documents (if provided by the applicant)
                    </div>
                  </div>

                  <div style="margin-top:14px;color:#64748b;font-size:12px;line-height:1.6;">
                    This email was generated automatically by the StoxIQ platform.
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#020617;color:#94a3b8;text-align:center;padding:16px 10px;font-size:12px;">
                  TYTECH PTY LTD • A Subsidiary of VentureCorp<br/>
                  © ${new Date().getFullYear()} StoxIQ Platform
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

/**
 * ✅ Multer allowed fields (your current list)
 */
const uploadFields = upload.fields([
  // local / foreign individual
  { name: "bankProof", maxCount: 1 },
  { name: "principalSig", maxCount: 1 },
  { name: "jointSig", maxCount: 1 },
  { name: "secondJointSig", maxCount: 1 },
  { name: "clientSig", maxCount: 1 },
  { name: "advisorSig", maxCount: 1 },

  // local individual (client registration) uploads
  { name: "liPrincipalIdFront", maxCount: 1 },
  { name: "liPrincipalIdBack", maxCount: 1 },
  { name: "liPrincipalUtilityBill", maxCount: 1 },
  { name: "fiPrincipalUtilityBill", maxCount: 1 },
  { name: "liJointIdFront", maxCount: 1 },
  { name: "liJointIdBack", maxCount: 1 },
  { name: "liSecondJointIdFront", maxCount: 1 },
  { name: "liSecondJointIdBack", maxCount: 1 },
  { name: "liDiscretionaryLetter", maxCount: 1 },
  { name: "liAgentSignature", maxCount: 1 },
  { name: "liOfficeAdvisorSignature", maxCount: 1 },


  // credit facility (local individual)
  { name: "cfPrincipalSig", maxCount: 1 },
  { name: "cfFirmSig", maxCount: 1 },
  { name: "cfWitness1Sig", maxCount: 1 },
  { name: "cfWitness2Sig", maxCount: 1 },

  // local corporate
  { name: "corpRegCert", maxCount: 1 },
  // local corporate specimen signatures / seal (used in CorporateClientRegistration)
  { name: "lcDirector1Sig", maxCount: 1 },
  { name: "lcDirector2Sig", maxCount: 1 },
  { name: "lcCompanySeal", maxCount: 1 },
  // local corporate (NEW single form)
  { name: "lcBankStatement", maxCount: 1 },
  { name: "lcBoardResolution", maxCount: 1 },
  { name: "lcMemorandumArticles", maxCount: 1 },
  { name: "lcIncorporationCertificate", maxCount: 1 },
  { name: "lcAgentSignature", maxCount: 1 },
  { name: "lcAuthorizerSignature", maxCount: 1 },
  { name: "lcStockbrokerFirmSignature", maxCount: 1 },
  { name: "lcWitness1Signature", maxCount: 1 },
  { name: "lcWitness2Signature", maxCount: 1 },
  { name: "lcPrincipalApplicantSignature", maxCount: 1 },
  { name: "lcJointApplicantSignature", maxCount: 1 },
  { name: "kycDocs", maxCount: 1 },
  { name: "boDocs", maxCount: 1 },
  { name: "boFiSeal", maxCount: 1 },
  { name: "additionalDocs", maxCount: 1 },

  // foreign corporate
  { name: "fcBankStatement", maxCount: 1 },
  { name: "fcBoardResolution", maxCount: 1 },
  { name: "fcMemorandumArticles", maxCount: 1 },
  { name: "fcIncorporationCertificate", maxCount: 1 },
  { name: "fcDir1Sig", maxCount: 1 },
  { name: "fcDir2Sig", maxCount: 1 },
  { name: "fcCompanySeal", maxCount: 1 },

  { name: "fcFinalDir1Sig", maxCount: 1 },
  { name: "fcFinalDir2Sig", maxCount: 1 },
  { name: "fcFinalCompanySeal", maxCount: 1 },
  { name: "fcCertOfficerSig", maxCount: 1 },

  { name: "fcKycAuthorizedSignatorySig", maxCount: 1 },
  { name: "fcKycCertifyingOfficerSig", maxCount: 1 },
  { name: "fcKycInvestmentAdvisorSig", maxCount: 1 },

  // foreign corporate - beneficial ownership (step 3)
  { name: "fcBoAuthorizedPersonSig", maxCount: 1 },
  { name: "fcBoAfiSignatureSeal", maxCount: 1 },
]);

/**
 * ✅ Wrap multer to return JSON errors
 */
router.post("/", (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || "Upload error" });
    next();
  });
});

/**
 * POST /api/applications
 * - data (JSON string): { region, applicantType, formKey, formData }
 * - files (optional): allowed fields above
 */
router.post("/", async (req, res) => {
  try {
    const raw = req.body?.data;
    if (!raw) return res.status(400).json({ message: "Missing data" });

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(400).json({ message: "Invalid JSON in data" });
    }

    const { region, applicantType, formKey, formData } = data || {};
    if (!region || !applicantType || !formKey || !formData) {
      return res.status(400).json({
        message: "Missing required fields: region, applicantType, formKey, formData",
      });
    }

    // Collect uploaded files for DB + email attachments
    const files = [];
    const add = (field) => {
      const f = req.files?.[field]?.[0];
      if (!f) return;
      files.push({
        field,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        path: `/uploads/${path.basename(f.path)}`, // public path
      });
    };

    [
      "bankProof",
      "principalSig",
      "jointSig",
      "secondJointSig",
      "clientSig",
      "advisorSig",

      // local individual (client registration)
      "liPrincipalIdFront",
      "liPrincipalIdBack",
      "liPrincipalUtilityBill",
      "fiPrincipalUtilityBill",
      "liJointIdFront",
      "liJointIdBack",
      "liSecondJointIdFront",
      "liSecondJointIdBack",
      "liDiscretionaryLetter",
      "liAgentSignature",
      "liOfficeAdvisorSignature",

      "cfPrincipalSig",
      "cfFirmSig",
      "cfWitness1Sig",
      "cfWitness2Sig",
      "corpRegCert",
      "lcDirector1Sig",
      "lcDirector2Sig",
      "lcCompanySeal",
      "lcBankStatement",
      "lcBoardResolution",
      "lcMemorandumArticles",
      "lcIncorporationCertificate",
      "lcAgentSignature",
      "lcAuthorizerSignature",
      "lcStockbrokerFirmSignature",
      "lcWitness1Signature",
      "lcWitness2Signature",
      "lcPrincipalApplicantSignature",
      "lcJointApplicantSignature",
      "kycDocs",
      "boDocs",
      "boFiSeal",
      "additionalDocs",
      "fcBankStatement",
      "fcBoardResolution",
      "fcMemorandumArticles",
      "fcIncorporationCertificate",
      "fcDir1Sig",
      "fcDir2Sig",
      "fcCompanySeal",
      "fcFinalDir1Sig",
      "fcFinalDir2Sig",
      "fcFinalCompanySeal",
      "fcCertOfficerSig",
      "fcKycAuthorizedSignatorySig",
      "fcKycCertifyingOfficerSig",
      "fcKycInvestmentAdvisorSig",
      "fcBoAuthorizedPersonSig",
      "fcBoAfiSignatureSeal",
    ].forEach(add);

    // Save application
    const editToken = crypto.randomBytes(24).toString("hex");
    const editUntil = computeEditUntil(new Date());

    const Model = getModelFor(region, applicantType);
    if (!Model) return res.status(400).json({ message: "Invalid region/applicantType" });

    const created = await Model.create({
      region,
      applicantType,
      formKey,
      formData,
      files,
      editToken,
      editUntil,
    });

    // ✅ Email with PDF + uploads
    if (EMAIL_ENABLED) {
      // Validate mail config quickly
      if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn("EMAIL_ENABLED=true but MAIL_HOST/MAIL_USER/MAIL_PASS missing. Skipping email.");
      } else {
        const transporter = getTransporter();

        // PDF buffer
        const pdfBuffer = await buildApplicationPdfBuffer(created);

        // Attachments: PDF first + uploaded files
        const attachments = [
          {
            filename: `${region}_${applicantType}_${formKey}_${String(created._id)}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
          ...files.map((f) => ({
            filename: f.originalName,
            path: path.join(process.cwd(), UPLOAD_DIR, path.basename(f.path)),
          })),
        ];

        const subject = `New Application [${String(created._id)}] ${region}/${applicantType} (${formKey})`;

        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.MAIL_USER,
          to: TO_EMAILS,
          subject,
          text: `A new application was submitted.\n\nSubmission ID: ${String(created._id)}
Edit Until: ${new Date(created.editUntil).toLocaleString()}\n\nRegion: ${region}\nApplicant Type: ${applicantType}\nForm Key: ${formKey}\n\nPDF attached.`,
          html: buildAdminPdfEmailHTML({
            id: String(created._id),
            region,
            applicantType,
            formKey,
            editUntil: created.editUntil,
          }),
          attachments,
        });

        // ✅ Applicant confirmation email (no PDF)
        try {
          const applicantEmail = pickApplicantEmail(region, applicantType, formData);
          if (isValidEmail(applicantEmail)) {
            const editLink = `${String(FRONTEND_URL || "").replace(/\/$/, "")}/update?id=${String(created._id)}`;
            await transporter.sendMail({
              from: process.env.MAIL_FROM || process.env.MAIL_USER,
              to: applicantEmail,
              subject: `Application Submission Confirmation — ${String(created._id)}`,
              html: buildApplicantConfirmationHTML({
                action: "Submission",
                status: "success",
                id: String(created._id),
                region,
                applicantType,
                editLink,
                formData,
              }),
              text: `Status: ${buildStatusMessage("Submission", "success")}\nSubmission ID: ${String(created._id)}\nEdit Link: ${editLink}`,
            });
          }
        } catch (mailErr2) {
          console.warn("Failed to send applicant confirmation email:", mailErr2);
        }
      }
    }

    return res.status(201).json({
      id: String(created._id),
      editUntil: new Date(created.editUntil).toISOString(),
      editWindowDays: EDIT_WINDOW_DAYS,
    });
  } catch (e) {
    console.error("applications POST error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/applications/admin/:category
 * category: localIndividual | localCorporate | foreignIndividual | foreignCorporate
 * Returns lightweight rows for grid view.
 */
router.get("/admin/:category", async (req, res) => {
  try {
    const cat = String(req.params.category || "");
    const map = {
      localIndividual: getModelFor("local", "individual"),
      localCorporate: getModelFor("local", "corporate"),
      foreignIndividual: getModelFor("foreign", "individual"),
      foreignCorporate: getModelFor("foreign", "corporate"),
    };
    const Model = map[cat];
    if (!Model) return res.status(400).json({ message: "Invalid category" });

    const limit = Math.min(Number(req.query.limit || 200), 500);
    const docs = await Model.find({})
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    function deepFind(obj, predicate) {
      if (!obj || typeof obj !== "object") return null;
      if (Array.isArray(obj)) {
        for (const v of obj) {
          const r = deepFind(v, predicate);
          if (r) return r;
        }
        return null;
      }
      for (const [k, v] of Object.entries(obj)) {
        if (predicate(k, v)) return v;
        const r = deepFind(v, predicate);
        if (r) return r;
      }
      return null;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    const rows = docs.map((d) => {
      const email =
        deepFind(
          d.formData,
          (k, v) => typeof v === "string" && (k.toLowerCase().includes("email") || emailRegex.test(v))
        ) || "";
      const name =
        deepFind(
          d.formData,
          (k, v) => typeof v === "string" && (k.toLowerCase().includes("fullname") || k.toLowerCase() === "name")
        ) || "";
      const phone =
        deepFind(
          d.formData,
          (k, v) => typeof v === "string" && (k.toLowerCase().includes("mobile") || k.toLowerCase().includes("phone"))
        ) || "";

      return {
        id: String(d._id),
        region: d.region,
        applicantType: d.applicantType,
        formKey: d.formKey,
        name,
        email,
        phone,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        editUntil: d.editUntil,
      };
    });

    return res.json({ category: cat, count: rows.length, rows });
  } catch (e) {
    console.error("admin list error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/applications/:id
 * - Used for re-opening a submitted application for edits (within edit window)
 */
router.get("/:id", async (req, res) => {
  try {
    const found = await loadAndAuthorizeEditable(req, res);
    if (!found) return;
    const app = found.app;
    const origin = `${req.protocol}://${req.get("host")}`;
    const files = (app.files || []).map((file) => ({
      ...file,
      url: file?.path ? new URL(file.path, origin).toString() : "",
    }));

    return res.json({
      id: String(app._id),
      region: app.region,
      applicantType: app.applicantType,
      formKey: app.formKey,
      formData: app.formData,
      files,
      editUntil: new Date(app.editUntil).toISOString(),
      editWindowDays: EDIT_WINDOW_DAYS,
    });
  } catch (e) {
    console.error("applications GET error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/applications/:id
 * - Same payload as POST (multipart): data (JSON string) + optional files
 * - Allowed only within edit window
 */
router.put("/:id", (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || "Upload error" });
    next();
  });
});

router.put("/:id", async (req, res) => {
  try {
    const found = await loadAndAuthorizeEditable(req, res);
    if (!found) return;
    const existing = found.app;
    const Model = found.Model;

    const raw = req.body?.data;
    if (!raw) return res.status(400).json({ message: "Missing data" });

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(400).json({ message: "Invalid JSON in data" });
    }

    const { region, applicantType, formKey, formData } = data || {};
    if (!region || !applicantType || !formKey || !formData) {
      return res.status(400).json({
        message: "Missing required fields: region, applicantType, formKey, formData",
      });
    }

    // Ensure the edit matches the original flow
    if (
      String(region) !== String(existing.region) ||
      String(applicantType) !== String(existing.applicantType) ||
      String(formKey) !== String(existing.formKey)
    ) {
      return res.status(400).json({ message: "Cannot change application type/region" });
    }

    // Collect uploaded files (if any) and merge by field
    const incomingFiles = [];
    const add = (field) => {
      const f = req.files?.[field]?.[0];
      if (!f) return;
      incomingFiles.push({
        field,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        path: `/uploads/${path.basename(f.path)}`,
      });
    };

    [
      "bankProof",
      "principalSig",
      "jointSig",
      "secondJointSig",
      "clientSig",
      "advisorSig",

      // local individual (client registration)
      "liPrincipalIdFront",
      "liPrincipalIdBack",
      "liPrincipalUtilityBill",
      "fiPrincipalUtilityBill",
      "liJointIdFront",
      "liJointIdBack",
      "liSecondJointIdFront",
      "liSecondJointIdBack",
      "liDiscretionaryLetter",
      "liAgentSignature",
      "liOfficeAdvisorSignature",

      "corpRegCert",
      "lcDirector1Sig",
      "lcDirector2Sig",
      "lcCompanySeal",
      "lcBankStatement",
      "lcBoardResolution",
      "lcMemorandumArticles",
      "lcIncorporationCertificate",
      "lcAgentSignature",
      "lcAuthorizerSignature",
      "lcStockbrokerFirmSignature",
      "lcWitness1Signature",
      "lcWitness2Signature",
      "lcPrincipalApplicantSignature",
      "lcJointApplicantSignature",
      "kycDocs",
      "boDocs",
      "boFiSeal",
      "additionalDocs",
      "fcBankStatement",
      "fcBoardResolution",
      "fcMemorandumArticles",
      "fcIncorporationCertificate",
      "cfPrincipalSig",
      "cfFirmSig",
      "cfWitness1Sig",
      "cfWitness2Sig",

      // foreign corporate signatures/seals
      "fcDir1Sig",
      "fcDir2Sig",
      "fcCompanySeal",
      "fcFinalDir1Sig",
      "fcFinalDir2Sig",
      "fcFinalCompanySeal",
      "fcCertOfficerSig",
      "fcKycAuthorizedSignatorySig",
      "fcKycCertifyingOfficerSig",
      "fcKycInvestmentAdvisorSig",
      "fcBoAuthorizedPersonSig",
      "fcBoAfiSignatureSeal",
    ].forEach(add);

    // Merge: replace same field, keep others
    const mergedFiles = Array.isArray(existing.files) ? [...existing.files] : [];
    for (const nf of incomingFiles) {
      const idx = mergedFiles.findIndex((x) => x.field === nf.field);
      if (idx >= 0) mergedFiles[idx] = nf;
      else mergedFiles.push(nf);
    }

    const updated = await Model.findByIdAndUpdate(
      existing._id,
      { formData, files: mergedFiles },
      { new: true }
    );

    // ✅ Re-send email with updated PDF + latest attachments (if email is enabled)
    if (EMAIL_ENABLED) {
      try {
        if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
          console.warn("EMAIL_ENABLED=true but MAIL_HOST/MAIL_USER/MAIL_PASS missing. Skipping update email.");
        } else {
          const transporter = getTransporter();
          const pdfBuffer = await buildApplicationPdfBuffer(updated);

          const attachments = [
            {
              filename: `${updated.region}_${updated.applicantType}_${updated.formKey}_${String(updated._id)}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
            ...(Array.isArray(updated.files) ? updated.files : []).map((f) => ({
              filename: f.originalName,
              path: path.join(process.cwd(), UPLOAD_DIR, path.basename(f.path)),
            })),
          ];

          const subject = `UPDATED Application [${String(updated._id)}] ${updated.region}/${updated.applicantType} (${updated.formKey})`;

          await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to: TO_EMAILS,
            subject,
            text: `An existing application was UPDATED.\n\nSubmission ID: ${String(updated._id)}
Edit Until: ${new Date(updated.editUntil).toLocaleString()}\n\nRegion: ${updated.region}\nApplicant Type: ${updated.applicantType}\nForm Key: ${updated.formKey}\nUpdated At: ${new Date(updated.updatedAt || Date.now()).toLocaleString()}\n\nUpdated PDF attached.`,
            html: buildAdminPdfEmailHTML({
              id: String(updated._id),
              region: updated.region,
              applicantType: updated.applicantType,
              formKey: updated.formKey,
              editUntil: updated.editUntil,
              action: "Updated",
            }),
            attachments,
          });

          // ✅ Applicant update confirmation email (no PDF)
          try {
            const applicantEmail = pickApplicantEmail(updated.region, updated.applicantType, formData);
            if (isValidEmail(applicantEmail)) {
              const editLink = `${String(FRONTEND_URL || "").replace(/\/$/, "")}/update?id=${String(updated._id)}`;
              await transporter.sendMail({
                from: process.env.MAIL_FROM || process.env.MAIL_USER,
                to: applicantEmail,
                subject: `Application Update Confirmation — ${String(updated._id)}`,
                html: buildApplicantConfirmationHTML({
                  action: "Update",
                  status: "success",
                  id: String(updated._id),
                  region: updated.region,
                  applicantType: updated.applicantType,
                  editLink,
                  formData,
                }),
                text: `Status: ${buildStatusMessage("Update", "success")}\nSubmission ID: ${String(updated._id)}\nEdit Link: ${editLink}`,
              });
            }
          } catch (mailErr2) {
            console.warn("Failed to send applicant update confirmation email:", mailErr2);
          }
        }
      } catch (mailErr) {
        console.warn("Failed to send update email:", mailErr);
      }
    }

    return res.json({
      id: String(updated._id),
      editUntil: new Date(updated.editUntil).toISOString(),
      editWindowDays: EDIT_WINDOW_DAYS,
    });
  } catch (e) {
    console.error("applications PUT error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
