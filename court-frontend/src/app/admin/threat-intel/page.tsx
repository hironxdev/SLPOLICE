"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  ExternalLink, 
  ChevronRight, 
  AlertTriangle, 
  Lock, 
  Globe,
  Ghost,
  Target,
  Zap,
  Clock
} from "lucide-react";

export default function ThreatMonitoring() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/threats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
    .then(res => res.json())
    .then(data => {
      setThreats(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cyber Threat Intelligence</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time National Security Threat Monitoring & Vulnerability Analysis</p>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 px-6 py-3 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_#2563eb]"></div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Active Intelligence Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Ghost className="w-5 h-5 text-blue-700" /> Active Threat Spectrum
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dataset: Global Security Cloud</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {threats.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 font-medium text-sm italic">No active threats detected in current cycle.</div>
              ) : threats.map(threat => (
                <div key={threat.id} className="p-10 hover:bg-slate-50/50 transition-all group relative overflow-hidden">
                  <div className={`absolute left-0 top-0 w-1.5 h-full ${threat.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                  
                  <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-10">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold border shadow-sm ${
                          threat.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {threat.severity}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{threat.id} // {threat.source}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                        {threat.title}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{threat.summary}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right mr-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Observation Status</p>
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{threat.status}</p>
                      </div>
                      <button className="bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-700 p-4 rounded-xl transition-all border border-slate-200">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical Intel Side */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-10 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Zap className="w-4 h-4 text-blue-700 fill-blue-700/10" /> Security Signal Matrix
            </h3>
            <div className="space-y-6">
              {[
                { label: "IP Reputation Score", status: "NORMAL", color: "text-emerald-600 bg-emerald-50" },
                { label: "Credentials Audit", status: "MATCH_FOUND", color: "text-rose-600 bg-rose-50" },
                { label: "DDoS Mitigation", status: "OPERATIONAL", color: "text-blue-600 bg-blue-50" },
              ].map(sig => (
                <div key={sig.label} className="flex justify-between items-center border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sig.label}</span>
                  <span className={`text-[9px] font-bold ${sig.color} px-2 py-0.5 rounded border border-transparent hover:border-current transition-all uppercase`}>{sig.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-700 rounded-2xl p-8 space-y-6 shadow-xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
              <Lock className="w-24 h-24 text-white" />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Global Watchlist Synchronized</h3>
              <p className="text-[10px] font-medium text-blue-100 leading-relaxed uppercase opacity-90">
                Coordinating with Interpol Cyber Division. High-priority threat actors are being countered at the edge gateway.
              </p>
              <div className="flex items-center gap-3 text-white">
                <Globe className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase">Cloud_Sync: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
