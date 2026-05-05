import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  case_id: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  file_path: { type: String, required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploaded_at: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);
