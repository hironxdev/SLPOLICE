import mongoose from "mongoose";

const caseUpdateSchema = new mongoose.Schema({
  case_id: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String },
  status_change: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("CaseUpdate", caseUpdateSchema);
