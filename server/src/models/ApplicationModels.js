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

    // 7-day edit window (token-based)
    editToken: { type: String, required: true },
    editUntil: { type: Date, required: true },
  },
  { timestamps: true }
);

// Explicit collection names so they show as 4 "tables"/collections in MongoDB
export const LocalIndividualApplication =
  mongoose.models.LocalIndividualApplication ||
  mongoose.model("LocalIndividualApplication", ApplicationSchema, "LocalIndividualApplications");

export const LocalCorporateApplication =
  mongoose.models.LocalCorporateApplication ||
  mongoose.model("LocalCorporateApplication", ApplicationSchema, "LocalCorporateApplications");

export const ForeignIndividualApplication =
  mongoose.models.ForeignIndividualApplication ||
  mongoose.model("ForeignIndividualApplication", ApplicationSchema, "ForeignIndividualApplications");

export const ForeignCorporateApplication =
  mongoose.models.ForeignCorporateApplication ||
  mongoose.model("ForeignCorporateApplication", ApplicationSchema, "ForeignCorporateApplications");

export const ALL_APPLICATION_MODELS = [
  LocalIndividualApplication,
  LocalCorporateApplication,
  ForeignIndividualApplication,
  ForeignCorporateApplication,
];

export function getModelFor(region, applicantType) {
  const r = String(region || "").toLowerCase();
  const t = String(applicantType || "").toLowerCase();

  if (r === "local" && t === "individual") return LocalIndividualApplication;
  if (r === "local" && t === "corporate") return LocalCorporateApplication;
  if (r === "foreign" && t === "individual") return ForeignIndividualApplication;
  if (r === "foreign" && t === "corporate") return ForeignCorporateApplication;

  return null;
}

export async function findByIdAcrossCollections(id) {
  const _id = String(id || "");
  for (const Model of ALL_APPLICATION_MODELS) {
    // eslint-disable-next-line no-await-in-loop
    const doc = await Model.findById(_id).lean();
    if (doc) return { Model, doc };
  }
  return { Model: null, doc: null };
}
