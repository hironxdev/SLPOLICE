import mongoose from "mongoose";

const ForensicDataSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  dataType: { type: String, required: true }, // e.g., 'contacts', 'messages', 'logs'
  dataContent: { type: mongoose.Schema.Types.Mixed }, // flexible JSON storage for simulated dumps
  extractedAt: { type: Date, default: Date.now },
  source: String, // 'Kali-Python-Simulator'
}, { timestamps: true });

export default mongoose.model("ForensicData", ForensicDataSchema);
