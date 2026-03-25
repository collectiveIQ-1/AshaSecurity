import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { env } from "../utils/env.js";
import { User } from "../models/auth/User.js";
import { sendMail } from "../services/mailer.js";

const router = express.Router();

function signToken(user, { remember = false } = {}) {
  const expiresIn = remember ? "30d" : "8h";
  return jwt.sign(
    { sub: String(user._id), email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn }
  );
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, tel } = req.body || {};
    if (!name || !email || !password || !confirmPassword || !tel) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ error: "Password and Confirm Password must match" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      tel: String(tel).trim(),
      passwordHash,
    });

    const token = signToken(user, { remember: true });

    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, tel: user.tel },
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password, remember } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user, { remember: !!remember });

    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, tel: user.tel },
    });
  } catch (err) {
    console.error("signin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", async (req, res) => {
  // Lightweight token check without extra middleware to keep this route standalone.
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({ user: { id: String(user._id), name: user.name, email: user.email, tel: user.tel } });
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Missing email" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    // Always respond OK to avoid account enumeration
    if (!user) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expires;
    await user.save();

    const base = env.PUBLIC_WEB_BASE || env.CORS_ORIGIN || "http://ashasecurity.netlify.app";
    const link = `${base.replace(/\/$/, "")}/reset-password/${token}`;

    if (env.EMAIL_ENABLED === true || env.EMAIL_ENABLED === "true") {
      await sendMail({
        to: user.email,
        subject: "StoxIQ password reset",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5">
            <h2 style="margin:0 0 10px 0">Reset your StoxIQ password</h2>
            <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
            <p style="margin:16px 0">
              <a href="${link}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px">
                Reset Password
              </a>
            </p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: "Missing fields" });

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
