"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import { 
  Radar, 
  Target, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Zap, 
  Signal, 
  Globe,
  Settings,
  Database,
  Search,
  ChevronRight,
  ExternalLink,
  Lock,
  Cpu,
  History,
  ShieldCheck,
  AlertTriangle,
  Fingerprint
} from "lucide-react";

export default function MVLTSCommand() {
  const [activeTargets, setActiveTargets] = useState<any[]>([]);
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTargets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/visits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setActiveTargets(data.map(v => ({
          id: `T-${v.id.split('-')[1].toUpperCase()}`,
          alias: v.forensics?.isp === "Dialog Telekom Plc" ? "MOBILE_UPLINK" : "REMOTE_VECTOR",
          ip: v.forensics?.ip || v.ip_address,
          status: v.forensics?.latitude ? "LOCKED" : "TRACKING",
          fusion_score: v.forensics?.latitude ? 100 : 75,
          last_seen: v.forensics?.city_name || "Colombo"
        })).slice(0, 10));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTargets();
    const interval = setInterval(fetchTargets, 10000);
    const pulseInterval = setInterval(() => setPulse(p => !p), 2000);
    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="p-8 lg:p-10 space-y-8">
      {/* MVLTS Government Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shadow-sm">
              <Radar className={`w-6 h-6 text-blue-700 ${pulse ? 'animate-pulse scale-105' : 'transition-all'}`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Geospatial Intelligence <span className="text-blue-600 text-sm font-medium ml-2 px-2 py-0.5 bg-blue-50 rounded border border-blue-100">v1.4</span></h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Multi-Vector Location Tracing & Triangulation System</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
          <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Fusion Status: 100%</span>
          </div>
          <div className="px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Active Intercepts: 2</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 mx-2 hidden xl:block"></div>
          <div className="flex items-center gap-3 px-2">
             <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Operator Session</p>
                <p className="text-[11px] font-bold text-slate-700">ADMIN_CENTRAL</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Fusion Engine & Target Matrix */}
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
        
        {/* Target Acquisition Matrix */}
        <div className="2xl:col-span-3 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> Target Acquisition Registry
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input type="text" placeholder="Filter by ID or IP..." className="bg-white border border-slate-200 rounded-lg py-2 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition-all placeholder:text-slate-400 shadow-sm" />
                </div>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-sans">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vector Identifier</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lock Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 text-sm font-medium animate-pulse">Initializing orbital tracking downlink...</td>
                    </tr>
                ) : activeTargets.map(t => (
                  <tr key={t.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-blue-700 font-mono text-xs font-bold">
                            {t.id.split('-')[1]}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">{t.alias}</p>
                            <p className="text-[10px] font-semibold text-slate-400 font-mono">{t.ip}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5 max-w-[120px]">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-bold text-slate-700">{t.fusion_score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${t.fusion_score > 90 ? 'bg-emerald-500' : 'bg-blue-600'} transition-all`} style={{ width: `${t.fusion_score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                         <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'LOCKED' ? 'bg-rose-500 animate-pulse' : t.status === 'TRACKING' ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${t.status === 'LOCKED' ? 'text-rose-600' : 'text-slate-500'}`}>{t.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm">
                          Commence Trace
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm overflow-hidden relative">
            <div className="absolute -top-10 -right-10 opacity-5 text-blue-700 pointer-events-none"><Globe size={160} /></div>
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Operational Signals
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Triangulation Sync", val: "ACTIVE", color: "text-emerald-600 bg-emerald-50" },
                  { label: "Orbital Lock", val: "STABLE", color: "text-blue-600 bg-blue-50" },
                  { label: "Identity Proxy Match", val: "VERIFIED", color: "text-emerald-600 bg-emerald-50" },
                  { label: "Hardware Matrix", val: "STANDBY", color: "text-slate-500 bg-slate-50" },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{s.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 rounded-xl space-y-4 shadow-xl shadow-rose-100">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                   <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Priority Alert</p>
                   <p className="text-[9px] font-semibold text-rose-100 opacity-80 uppercase">Code Red Isolation</p>
                </div>
             </div>
             <p className="text-xs font-medium text-rose-50 leading-relaxed">
                Unauthorized cross-border access detected on secondary vectors. Initiating hardware isolation.
             </p>
             <button className="w-full py-2.5 bg-white text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-rose-50 shadow-md transition-all active:scale-95">
                Authorize Countermeasures
             </button>
          </div>
        </div>
      </div>
      {/* Decorative Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
    </div>
  );
}
