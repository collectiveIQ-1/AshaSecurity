import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { getAuthConnection } from "../../utils/authMongo.js";

const conn = getAuthConnection();

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tel: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = conn.models.User || conn.model("User", UserSchema);
