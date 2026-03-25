import multer from "multer";
import fs from "fs";
import path from "path";
import { env } from "../utils/env.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), env.UPLOAD_DIR);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const stamp = Date.now();
    cb(null, `${stamp}_${safe}`);
  },
});

const limits = { fileSize: env.MAX_FILE_MB * 1024 * 1024 };

export const upload = multer({ storage, limits });
