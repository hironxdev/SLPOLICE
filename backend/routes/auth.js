import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, nic } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return res.status(400).json({ message: error.message });

    // Assuming table 'users' exists in Supabase public schema
    await supabase.from('users').insert([{
      id: data.user.id,
      email,
      name,
      nic,
      role: 'user'
    }]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) return res.status(400).json({ message: authError.message });

    const { data: userData, error: dbError } = await supabase.from('users')
      .select('name, role, nic')
      .eq('id', authData.user.id)
      .single();

    if (dbError) console.error("Database fetch error for user:", dbError.message);
    console.log("Login User ID:", authData.user.id);
    console.log("Fetched Database User:", userData);

    // Force admin role for the designated administrative email
    const isAdminAccount = email.toLowerCase().trim() === 'admin@slpoliceccid.lk';
    const userRole = isAdminAccount ? 'admin' : (userData?.role || 'user');
    
    // Audit logging only (Production style)
    if (isAdminAccount) console.log(`[AUTH] Admin system access granted for ${email}`);

    res.json({
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        name: isAdminAccount ? "System Administrator" : (userData?.name || 'User'),
        email,
        role: userRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

export default router;
