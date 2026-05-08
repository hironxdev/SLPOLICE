import { supabase } from "./supabase.js";

async function seedAdmin() {
  const email = "admin@slpoliceccid.lk";
  const password = "AdminPassword123";

  console.log(`Attempting to create admin user: ${email}`);

  // 1. Create user in Supabase Auth using Service Role key (can bypass email confirmation)
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { name: "CSEU Administrator" }
  });

  if (error) {
    if (error.status === 422) {
      console.log("User already exists in Auth. Proceeding to update database record...");
      // We need to find the user ID to update the role
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) return console.error("Error listing users:", listError.message);
      
      const existingUser = listData.users.find(u => u.email === email);
      if (existingUser) {
        await updateDatabaseRole(existingUser.id, email);
      }
    } else {
      return console.error("Error creating auth user:", error.message);
    }
  } else {
    console.log("Auth user created successfully.");
    await updateDatabaseRole(data.user.id, email);
  }
}

async function updateDatabaseRole(userId, email) {
  // 2. Ensure user exists in public.users with admin role
  const { data, error } = await supabase.from('users').upsert({
    id: userId,
    email: email,
    name: "CSEU Administrator",
    nic: "ADMIN_ROOT_001",
    role: "admin"
  });

  if (error) {
    console.error("Error updating public.users role:", error.message);
  } else {
    console.log("Admin role updated in database successfully!");
  }
}

seedAdmin();
