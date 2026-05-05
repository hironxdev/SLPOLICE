import express from "express";
import ForensicData from "../models/ForensicData.js";
import Device from "../models/Device.js";

const router = express.Router();

router.post("/ingest", async (req, res) => {
  try {
    const { imei, dataType, dataContent, source } = req.body;
    const device = await Device.findOne({ imei });
    if (!device) return res.status(404).json({ error: "Device not found" });

    const extraction = new ForensicData({
      deviceId: device._id,
      dataType,
      dataContent,
      source
    });
    await extraction.save();
    res.json({ message: "Forensic data ingested successfully", extraction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:imei", async (req, res) => {
    try {
        const device = await Device.findOne({ imei: req.params.imei });
        if(!device) return res.status(404).json({ error: "Device not found"});
        const forensics = await ForensicData.find({ deviceId: device._id }).sort({ extractedAt: -1 });
        res.json(forensics);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
