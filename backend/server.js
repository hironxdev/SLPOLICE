import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userCases.js";
import adminRoutes from "./routes/admin.js";
import fileRoutes from "./routes/files.js";
import deviceRoutes from "./routes/device.js";
import forensicRoutes from "./routes/forensics.js";
import analyticsRoutes from "./routes/analytics.js";
import emailTraceRoutes from "./routes/emailTrace.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", fileRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/forensics", forensicRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/emails", emailTraceRoutes);

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep the process alive
setInterval(() => {}, 10000);
