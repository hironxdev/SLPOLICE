import express from "express";
import { supabase } from "../supabase.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { complaint_type, description } = req.body;
    
    if (!complaint_type || !description) return res.status(400).json({ message: "Type and description required" });

    // Creating case in Supabase
    const { data, error } = await supabase.from('cases').insert([{
      user_id: req.user.id,
      complaint_type,
      description,
      status: "Pending"
    }]).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('cases')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data.map(c => ({...c, _id: c.id})));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { data: caseItem, error } = await supabase.from('cases').select('*').eq('id', req.params.id).single();
    if (error || !caseItem) return res.status(404).json({ message: "Case not found" });

    if (caseItem.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const { data: files } = await supabase.from('files').select('*').eq('case_id', caseItem.id);
    res.json({ ...caseItem, files: files || [], _id: caseItem.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
