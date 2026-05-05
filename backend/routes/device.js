import express from "express";
import Device from "../models/Device.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/track", async (req, res) => {
  try {
    const { imei, model, os, targetName, location, connection } = req.body;
    let device = await Device.findOne({ imei });
    if (!device) {
      device = new Device({ imei, model, os, targetName });
    }
    
    // Update simple fields if they are provided
    if (model) device.model = model;
    if (os) device.os = os;
    if (targetName) device.targetName = targetName;

    if (location) {
        device.lastKnownLocation = location;
        device.locationLogs.push(location);
    }
    if (connection) {
        device.connectionLogs.push(connection);
    }
    await device.save();
    res.json({ message: "Device tracked successfully", device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:imei", async (req, res) => {
  try {
    const device = await Device.findOne({ imei: req.params.imei });
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
