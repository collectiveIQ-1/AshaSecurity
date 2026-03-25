import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { env } from "./utils/env.js";
import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";

const app = express();

// CORS
// In development allow localhost on any port.
// In production keep it strict via env.CORS_ORIGIN (supports comma-separated list).
const allowedOrigins = (env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow server-to-server / curl
    if (!origin) return cb(null, true);

    if (env.NODE_ENV !== "production") {
      const ok = /^https?:\/\/localhost:\d+$/.test(origin);
      return cb(null, ok);
    }

    const ok = allowedOrigins.includes(origin);
    return cb(null, ok);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);

// Serve uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", env.UPLOAD_DIR)));

// Serve built client ONLY if it exists (prevents ENOENT in environments where client isn't built)
if (env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "..", "..", "client", "dist");
  const indexHtml = path.join(clientDist, "index.html");

  if (fs.existsSync(indexHtml)) {
    app.use(express.static(clientDist));
    app.get("*", (req, res) => res.sendFile(indexHtml));
  }
}

export default app;
