import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complaint_type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Investigating", "Closed"], default: "Pending" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Case", caseSchema);
