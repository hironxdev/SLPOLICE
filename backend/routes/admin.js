import express from "express";
import { supabase } from "../supabase.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/cases", verifyToken, isAdmin, async (req, res) => {
  try {
    const { data: cases, error } = await supabase.from('cases')
      .select('*, users!inner(name, nic)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Map to mimic Mongoose
    const mapped = cases.map(c => ({...c, user_id: {name: c.users.name, nic: c.users.nic}, _id: c.id}));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/cases/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    await supabase.from('cases').update({ status }).eq('id', req.params.id);

    await supabase.from('case_updates').insert([{
      case_id: req.params.id,
      admin_id: req.user.id,
      note: note || `Status updated to ${status}`,
      status_change: status
    }]);

    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/cases/:id/note", verifyToken, isAdmin, async (req, res) => {
  try {
    const { note } = req.body;
    
    const { data, error } = await supabase.from('case_updates').insert([{
      case_id: req.params.id,
      admin_id: req.user.id,
      note: note
    }]).select().single();

    if (data) data._id = data.id;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/cases/:id/updates", verifyToken, async (req, res) => {
  try {
     const { data: updates, error } = await supabase.from('case_updates')
        .select('*, users!inner(name)')
        .eq('case_id', req.params.id)
        .order('timestamp', { ascending: false });
     
     if (error) throw error;
     const mapped = updates.map(u => ({...u, admin_id: {name: u.users.name}, timestamp: u.timestamp, note: u.note, _id: u.id}));
     res.json(mapped);
  } catch (error) {
     res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id, name, email, nic, role').eq('role', 'user');
    if (error) throw error;
    res.json(data.map(u => ({...u, _id: u.id})));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
