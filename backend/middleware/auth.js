import { supabase } from "../supabase.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied, no token provided" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    
    req.user = { id: data.user.id };
    
    // Fetch role manually from users table
    const { data: dbUser } = await supabase.from('users').select('role').eq('id', data.user.id).single();
    if (dbUser) req.user.role = dbUser.role;

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied, Admin only" });
  }
};
