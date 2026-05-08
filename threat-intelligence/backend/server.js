import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const ATTACK_TYPES = [
  "DDoS: UDP Flood",
  "SQL Injection",
  "Ransomware Propagation",
  "Unauthorized Access Attempt",
  "Brute Force",
  "Phishing Campaign",
  "Exploit: CVE-2024-X"
];

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CN", name: "China" },
  { code: "RU", name: "Russia" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "LK", name: "Sri Lanka" }, // Target focus
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "IR", name: "Iran" },
  { code: "KP", name: "North Korea" }
];

// In-memory store for recent attacks
let attackLogs = [];
const MAX_LOGS = 100;

function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
}

/**
 * 🧪 CSEU CYBER ATTACK SIMULATOR
 */
function simulateAttack() {
  const source = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  let target = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  
  // High probability of Sri Lanka being a target for demo purposes
  if (Math.random() > 0.7) {
    target = { code: "LK", name: "Sri Lanka" };
  }

  // Avoid self-attacks unless targeted
  if (source.code === target.code && target.code !== "LK") {
    target = { code: "US", name: "United States" };
  }

  const attack = {
    id: Math.random().toString(36).substr(2, 9),
    source_ip: generateRandomIP(),
    source_country: source.code,
    target_country: target.code,
    attack_type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)],
    timestamp: new Date().toISOString(),
    risk_score: Math.floor(Math.random() * 100)
  };

  attackLogs.unshift(attack);
  if (attackLogs.length > MAX_LOGS) attackLogs.pop();

  io.emit("new_attack", attack);
  
  if (attack.severity === "CRITICAL") {
    io.emit("alert_triggered", {
      type: "HIGH_INTENSITY_EVENT",
      description: `Critical ${attack.attack_type} detected from ${source.code}`,
      timestamp: attack.timestamp
    });
  }
}

// Generate data every 2-5 seconds
setInterval(simulateAttack, 3000);

// API Routes
app.get("/api/health", (req, res) => res.json({ status: "Cyber Intel Engine Active" }));
app.get("/api/attacks/recent", (req, res) => res.json(attackLogs.slice(0, 20)));
app.get("/api/stats/sri-lanka", (req, res) => {
  const incoming = attackLogs.filter(a => a.target_country === "LK").length;
  const outgoing = attackLogs.filter(a => a.source_country === "LK").length;
  res.json({ incoming, outgoing, region: "LK", status: "MONITORED" });
});

const PORT = 5050;
httpServer.listen(PORT, () => {
  console.log(`🛡️ CSEU Threat Intel Backend running on port ${PORT}`);
});
