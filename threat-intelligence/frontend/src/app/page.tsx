"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { 
  ShieldAlert, 
  Activity, 
  Globe, 
  Zap, 
  Lock, 
  AlertTriangle,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import AttackMap from "@/components/AttackMap";

interface Attack {
  id: string;
  source_ip: string;
  source_country: string;
  target_country: string;
  attack_type: string;
  severity: string;
  timestamp: string;
  risk_score: number;
}

export default function ThreatDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [stats, setStats] = useState({ incoming: 0, outgoing: 0 });
  const [activeAlert, setActiveAlert] = useState<any>(null);

  useEffect(() => {
    const s = io("http://localhost:5050");
    setSocket(s);

    s.on("new_attack", (attack: Attack) => {
      setAttacks((prev) => [attack, ...prev.slice(0, 50)]);
    });

    s.on("alert_triggered", (alert) => {
      setActiveAlert(alert);
      setTimeout(() => setActiveAlert(null), 5000);
    });

    // Initial Fetch
    fetch("http://localhost:5050/api/attacks/recent")
      .then(res => res.json())
      .then(data => setAttacks(data));

    fetch("http://localhost:5050/api/stats/sri-lanka")
      .then(res => res.json())
      .then(data => setStats(data));

    return () => {
      s.disconnect();
    };
  }, []);

  const sriLankaAttacks = attacks.filter(a => a.target_country === "LK");

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans p-6 lg:p-10">
      {/* 🛡️ TOP NAVIGATION / SECURITY HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="bg-rose-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                <ShieldAlert className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-2xl font-black uppercase tracking-tighter">SL-CERT Intelligence</h1>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-12">Cyber Operations Command • Sri Lanka Police CCID</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">System Health: Nominal</span>
           </div>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:translate-y-1">
              Admin Login
           </button>
        </div>
      </header>

      {/* 📊 GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT PANEL: REAL-TIME STATISTICS */}
        <div className="xl:col-span-1 space-y-6">
           {/* Metric Card 1 */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all"></div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <Activity className="w-3 h-3 text-blue-500" /> Live Threat Level
              </p>
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-4xl font-black text-white italic">ELEVATED</h3>
                    <p className="text-[10px] text-blue-400 font-bold mt-1">Condition: Yellow Alert</p>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-slate-700">7.4</span>
                 </div>
              </div>
           </div>

           {/* Sri Lanka Focus Context */}
           <div className="bg-blue-600/5 border border-blue-600/20 rounded-3xl p-6 relative">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold italic">LK</div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Regional Awareness</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Incoming Traffic</p>
                    <p className="text-2xl font-black text-emerald-500">{stats.incoming}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">High Risk IPs</p>
                    <p className="text-2xl font-black text-rose-500">14</p>
                 </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-white/5 transition-all">
                Export Region Report
              </button>
           </div>

           {/* Live Alert Ticker */}
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[300px] flex flex-col">
              <h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">Event Stream</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {attacks.slice(0, 10).map((attack) => (
                    <div key={attack.id} className="flex gap-4 group cursor-pointer">
                       <div className={`w-1 h-12 rounded-full transition-all ${
                          attack.severity === "CRITICAL" ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : 
                          attack.severity === "HIGH" ? "bg-orange-500" : "bg-blue-500"
                       }`}></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-200 group-hover:text-blue-400 transition-colors uppercase italic">{attack.attack_type}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-black text-slate-500">{attack.source_ip}</span>
                             <span className="text-[9px] text-white/20">|</span>
                             <span className="text-[9px] font-black text-rose-500">{attack.source_country}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 🌍 CENTER PANEL: MAP VISUALIZATION */}
        <div className="xl:col-span-3 space-y-8">
           <div className="relative group">
              <AttackMap attacks={attacks} />
              
              {/* Alert Notification Toast (Internal) */}
              {activeAlert && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-rose-600/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-rose-400 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                  <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white italic">CRITICAL_EVENT_DETECTED</h4>
                    <p className="text-[10px] font-bold text-rose-100 uppercase">{activeAlert.description}</p>
                  </div>
                </div>
              )}
           </div>

           {/* BOTTOM: ANALYTICS CARDS */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 flex items-center justify-between group hover:border-blue-600/50 transition-all">
                 <div>
                    <Globe className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-xl font-black italic">Active Botnets</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Detected via Global Nodes</p>
                 </div>
                 <span className="text-4xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">412</span>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 flex items-center justify-between group hover:border-emerald-600/50 transition-all">
                 <div>
                    <Lock className="w-8 h-8 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-black italic">Mitigated Threats</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Last 24 Hours Intelligence</p>
                 </div>
                 <span className="text-4xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">8.9k</span>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 flex items-center justify-between group hover:border-rose-600/50 transition-all">
                 <div>
                    <Zap className="w-8 h-8 text-rose-500 mb-4" />
                    <h3 className="text-xl font-black italic">Brute Force</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Attempts on Regional Hubs</p>
                 </div>
                 <span className="text-4xl font-black text-slate-800 group-hover:text-rose-600 transition-colors">1.2k</span>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
