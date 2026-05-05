import express from "express";
import EmailTrace from "../models/EmailTrace.js";

const router = express.Router();

// Get all traces
router.get("/", async (req, res) => {
  try {
    const traces = await EmailTrace.find();
    res.json(traces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ingest metadata from Python Simulator
router.post("/metadata", async (req, res) => {
  try {
    const { targetEmail, extractedIPs, metadata } = req.body;
    let trace = await EmailTrace.findOne({ targetEmail });
    
    if (!trace) {
      trace = new EmailTrace({ targetEmail, knownIPs: [], resolvedLocations: [], metadataLogs: [] });
    }
    
    // Add new unique IPs
    if (extractedIPs && Array.isArray(extractedIPs)) {
        extractedIPs.forEach(ip => {
        if (!trace.knownIPs.includes(ip)) {
            trace.knownIPs.push(ip);
        }
        });
    }

    if (metadata) trace.metadataLogs.push(metadata);

    await trace.save();
    res.json({ message: "Metadata ingested successfully", trace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update location from Java GeoIP Tracker
router.post("/resolve", async (req, res) => {
  try {
    const { targetEmail, ip, location } = req.body;
    let trace = await EmailTrace.findOne({ targetEmail });
    if (!trace) return res.status(404).json({ error: "Trace not found" });

    trace.resolvedLocations.push({
      ip,
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city,
      country: location.country
    });

    await trace.save();
    res.json({ message: "IP Location resolved", trace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
