import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    region: { type: String, required: true },
    applicantType: { type: String, required: true },
    formKey: { type: String, required: true },
    formData: { type: mongoose.Schema.Types.Mixed, required: true },
    files: { type: [FileSchema], default: [] },

    // ✅ 7-day edit window (simple token-based access)
    editToken: { type: String, required: true },
    editUntil: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
