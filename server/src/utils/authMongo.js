import mongoose from "mongoose";
import { env } from "./env.js";

let authConn = null;

export function getAuthConnection() {
  if (authConn) return authConn;

  // Use a separate DB for auth users (same Mongo cluster is fine).
  // If AUTH_MONGODB_URI is not set, we fall back to MONGODB_URI.
  const uri = env.AUTH_MONGODB_URI || env.MONGODB_URI;

  authConn = mongoose.createConnection(uri, {
    dbName: env.AUTH_DB_NAME || "stoxiq_auth",
  });

  authConn.on("connected", () => {
    console.log("Auth MongoDB connected");
  });
  authConn.on("error", (err) => {
    console.error("Auth MongoDB connection error:", err);
  });

  return authConn;
}
