import nodemailer from "nodemailer";
import { env } from "../utils/env.js";

export function getTransporter() {
  if (!env.EMAIL_ENABLED) return null;

  if (!env.MAIL_HOST || !env.MAIL_USER || !env.MAIL_PASS) {
    throw new Error("Email enabled but SMTP env vars are incomplete.");
  }

  return nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_SECURE,
    auth: { user: env.MAIL_USER, pass: env.MAIL_PASS },
  });
}
/**
 * Generic mail sender used by auth flows (forgot password etc.)
 * If EMAIL_ENABLED is false, this will no-op (logs in dev).
 */
export async function sendMail({ to, subject, html, text, attachments } = {}) {
  const transporter = getTransporter();
  if (!transporter) {
    if (env.NODE_ENV !== "production") {
      console.log("[mailer] EMAIL_ENABLED=false. Skipping email:", { to, subject });
    }
    return { skipped: true };
  }

  if (!to) throw new Error("sendMail: 'to' is required");
  if (!subject) throw new Error("sendMail: 'subject' is required");

  const from = env.MAIL_USER;

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  });
}



export function buildEmailHTML(app) {
  const line = (k, v) => `<tr><td style="padding:6px 10px;color:#777">${k}</td><td style="padding:6px 10px;color:#111"><b>${v ?? "-"}</b></td></tr>`;
  const title = `New Application: ${app.region} / ${app.applicantType}`;

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden">
        <div style="padding:18px 20px;background:#111;color:#fff">
          <div style="font-size:18px;font-weight:700">${title}</div>
          <div style="opacity:.8;margin-top:4px">Submission ID: ${app._id}</div>
        </div>
        <div style="padding:18px 20px">
          <table style="width:100%;border-collapse:collapse">
            ${line("Region", app.region)}
            ${line("Applicant type", app.applicantType)}
            ${line("Account type", app.accountType)}
            ${line("NIC/Passport", app.nicOrPassport)}
            ${line(app.applicantType === "individual" ? "Full name" : "Company", app.applicantType === "individual" ? app.fullName : app.companyName)}
            ${line(app.applicantType === "individual" ? "DOB" : "Reg No", app.applicantType === "individual" ? app.dob : app.regNo)}
            ${line("Email", app.email)}
            ${line("Phone", app.phone)}
            ${line("Address", [app.address1, app.city, app.country].filter(Boolean).join(", "))}
          </table>
          <div style="margin-top:14px;color:#666;font-size:12px">
            Attachments: signature + ID document (if provided).
          </div>
        </div>
      </div>
    </div>
  `;
}
