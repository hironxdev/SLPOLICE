import express from "express";
import multer from "multer";
import path from "path";
import { supabase } from "../supabase.js";
import { verifyToken } from "../middleware/auth.js";
import fs from "fs";

const router = express.Router();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){ fs.mkdirSync(uploadDir, { recursive: true }); }

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { case_id } = req.body;
    if (!case_id) return res.status(400).json({ message: "case_id is required" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path.replace(/\\/g, '/');
    const { data, error } = await supabase.from('files').insert([{
      case_id: case_id,
      file_path: filePath,
      uploaded_by: req.user.id
    }]).select().single();
    
    if (error) throw error;
    
    if (data) data._id = data.id;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error during file upload", error: error.message });
  }
});

export default router;
