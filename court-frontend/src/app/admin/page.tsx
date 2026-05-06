"use client";
import { API_URL, authHeaders } from "@/lib/config";

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
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-50 rounded-full mb-6 border border-blue-100 shadow-sm">
            <ShieldAlert className="w-10 h-10 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CCID Admin Portal
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-widest">
            Official Access • Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-700 transition-colors" />
              <input
                required
                type="text"
                placeholder="Official Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 font-semibold outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-700 transition-colors" />
              <input
                required
                type="password"
                placeholder="Access Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 font-semibold outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-600 text-xs font-bold text-center bg-rose-50 p-3 rounded-lg border border-rose-100 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50 uppercase tracking-widest text-xs active:scale-[0.98]"
          >
            {loading ? "AUTHENTICATING..." : "Establish Secure Session"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            Audit logging active. All access attempts are recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
