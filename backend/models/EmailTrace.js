import mongoose from "mongoose";

const EmailTraceSchema = new mongoose.Schema({
  targetEmail: { type: String, required: true, unique: true },
  knownIPs: [String],
  resolvedLocations: [{
    ip: String,
    latitude: Number,
    longitude: Number,
    city: String,
    country: String,
    timestamp: { type: Date, default: Date.now }
  }],
  metadataLogs: [{
    subject: String,
    sender: String,
    userAgent: String,
    extractedAt: { type: Date, default: Date.now }
  }],
  status: { type: String, default: "active" } // tracking, active, closed
}, { timestamps: true });

export default mongoose.model("EmailTrace", EmailTraceSchema);
