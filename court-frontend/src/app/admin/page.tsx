"use client";

import { useState } from "react";
import { Lock, User, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Connect to Node Registry Backend
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.access_token);
        window.location.href = "/admin/dashboard";
      } else {
        setError("Invalid credentials or unauthorized access.");
        setLoading(false);
      }
    } catch (err) {
      setError("System connection failure.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-sky-500/10 rounded-full mb-4 border border-sky-500/20 shadow-2xl">
            <ShieldAlert className="w-10 h-10 text-sky-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
            CCID - ADMIN
          </h1>
          <p className="text-sky-500/60 text-xs font-bold mt-2 uppercase tracking-tighter">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
              <input
                required
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-400 text-xs font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg shadow-xl shadow-sky-900/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? "Authenticating..." : "System Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">
          Audit logging active. All access attempts recorded.
        </p>
      </div>
    </div>
  );
}
