import mongoose from "mongoose";

const ConnectionLogSchema = new mongoose.Schema({
  ip: String,
  networkType: String,
  timestamp: { type: Date, default: Date.now }
});

const LocationLogSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const DeviceSchema = new mongoose.Schema({
  imei: { type: String, required: true, unique: true },
  model: String,
  os: String,
  status: { type: String, default: "active" },
  targetName: String,
  lastKnownLocation: {
    latitude: Number,
    longitude: Number
  },
  locationLogs: [LocationLogSchema],
  connectionLogs: [ConnectionLogSchema],
}, { timestamps: true });

export default mongoose.model("Device", DeviceSchema);
