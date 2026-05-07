"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import { Terminal, Shield, ShieldAlert, Zap, Activity } from "lucide-react";

export default function SystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/audit-logs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Audit Logs
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Official Government Immutable Master Audit Trail
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
          <Shield className="w-4 h-4 text-blue-700" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Integrity: VERIFIED
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm font-sans">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-4">
          <Terminal size={14} className="text-blue-700" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Live Security Audit Stream
          </span>
        </div>
        <div className="p-4 md:p-10 space-y-3 font-mono">
          {logs.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs italic">
              No security events logged in current session.
            </div>
          ) : (
            [...logs].reverse().map((log, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-[10px] sm:text-[11px] hover:bg-slate-50/80 p-3 rounded-lg transition-all border border-transparent hover:border-slate-100 items-start"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-slate-400 shrink-0 font-bold font-mono tracking-tighter">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-bold shrink-0 px-1.5 py-0.5 rounded text-center bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest text-[9px] sm:text-[10px]`}
                  >
                    {log.action_type || "ACCESS"}
                  </span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-slate-400 font-bold opacity-80 uppercase tracking-tighter text-[9px]">
                    [AUTH: {log.admin_id || "SYSTEM"}]
                  </span>
                  <span className="text-slate-700 font-bold mt-1">
                    {log.action_type === "INTEL_TRACE"
                      ? `Forensic investigation initiated for target identifier: ${log.target}`
                      : log.action_type === "OSINT_SCAN"
                        ? `Deep OSINT reconnaissance scan executed on query: ${log.target}`
                        : log.action_type === "VIEW_VISITS"
                          ? `High-precision visit matrix retrieval triggered.`
                          : log.action_type === "VIEW_REQUESTS"
                            ? `Citizen submission repository interrogated.`
                            : `Administrative session activity recorded.`}
                    {log.ip_address && (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Origin Node: {log.ip_address}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold py-6 border-t border-slate-100 mt-6 group">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="uppercase tracking-widest opacity-60">
              Monitoring Real-time Encryption Vectors...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
