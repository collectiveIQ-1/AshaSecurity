import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // Keep both `message` and `error` for backwards compatibility with older clients.
  if (!token) return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.auth = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token", error: "Invalid token" });
  }
}
