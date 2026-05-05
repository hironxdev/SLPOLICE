import { supabase } from "./supabase.js";

async function check() {
  const email = "admin@slpoliceccid.lk";
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) {
    console.error("Error fetching user:", error.message);
  } else {
    console.log("User data in DB:", data);
  }
  process.exit(0);
}

check();
