"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import { 
  Database, 
  Search, 
  FileLock, 
  History, 
  ShieldCheck, 
  Download, 
  Share2, 
  MoreVertical,
  Plus,
  Trash2,
  Clock,
  Fingerprint
} from "lucide-react";

export default function ForensicVault() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/evidence`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
    .then(res => res.json())
    .then(data => {
      setEvidence(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forensic Evidence Vault</h2>
          <p className="text-sm text-slate-500 font-medium">Official Digital Artifact Storage & Immutable Chain of Custody</p>
        </div>
        <button className="bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95">
          <Plus size={18} /> Register Evidence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Evidence Search */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-700 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Evidence Hash, Case ID, or Name..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-16 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Database className="w-4 h-4 text-blue-700" /> Evidence Repository Matrix
              </h3>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{evidence.length} Registered Artifacts</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {evidence.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 font-medium text-sm italic">No forensic evidence currently registered in vault.</div>
              ) : evidence.map(item => (
                <div key={item.id} className="p-8 hover:bg-slate-50/50 transition-all group">
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                    <div className="flex gap-6 max-w-xl">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-700 transition-all border border-slate-200 shadow-sm shrink-0">
                        <FileLock className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{item.id}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{item.type}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{item.size}</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 font-mono break-all">{item.hash}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="hidden lg:block text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Investigator</p>
                        <p className="text-xs font-bold text-slate-700">{item.officer}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${
                          item.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {item.status}
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-all"><MoreVertical size={20} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <History className="w-4 h-4 text-blue-700" /> Vault Activity Logs
            </h3>
            <div className="space-y-6">
              {[
                { time: "10:24 AM", action: "Evidence Registered", user: "Det. Silva" },
                { time: "09:45 AM", action: "Integrity Verified", user: "SYSTEM" },
                { time: "Yesterday", action: "Secure Access", user: "Admin Root" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 h-full bg-slate-100 rounded-full relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-700 shadow-sm"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-900 uppercase">{log.action}</p>
                    <p className="text-[9px] font-medium text-slate-500 uppercase">{log.time} • {log.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-8 space-y-5 shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><ShieldCheck size={80} /></div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-3 relative z-10">
              <ShieldCheck className="w-4 h-4" /> Integrity Verification
            </h3>
            <p className="text-xs font-medium text-blue-50 leading-relaxed opacity-90 relative z-10">
              Digital evidence logs are currently synchronized and protected by immutable hash chains.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold text-white bg-white/10 px-4 py-2 rounded-lg relative z-10">
              <Fingerprint size={14} /> SYSTEM_VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
