"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState } from "react";
import { 
  Target, 
  Search, 
  Globe, 
  Mail, 
  Share2, 
  ExternalLink, 
  Layers, 
  Shield,
  Zap,
  MoreVertical,
  Activity,
  Cpu,
  Fingerprint
} from "lucide-react";

export default function OSINTReconHub() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/osint/scan`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}` 
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResults({
        ...data,
        last_updated: new Date(data.last_updated).toLocaleString()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">OSINT Reconnaissance Hub</h2>
          <p className="text-sm text-slate-500 font-medium">Open Source Intelligence Gathering & Digital Identity Footprinting</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
          <Zap className="w-4 h-4 text-blue-700 fill-blue-700/10" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recon Engine: OPERATIONAL</span>
        </div>
      </div>

      {/* Target Acquisition */}
      <section className="bg-white p-10 lg:p-16 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-50 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Layers className="w-64 h-64" />
        </div>
        
        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Target Acquisition</h2>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Identify subjects via <span className="text-blue-700 font-bold">Domain</span>, <span className="text-blue-700 font-bold">Alias</span>, or <span className="text-blue-700 font-bold">Handle</span> to initiate deep digital profile harvesting.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-700 transition-colors" />
              <input 
                type="text"
                placeholder="Enter domain or subject handle..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-14 pr-6 text-slate-900 font-semibold outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider px-12 py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs"
            >
              {searching ? "Harvesting Intelligence..." : "Initialize Scan"}
            </button>
          </div>
        </div>
      </section>

      {results && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="xl:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-8 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-700" /> Subject Intelligence
              </h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Identifier</p>
                  <p className="text-xl font-bold text-slate-900 tracking-tight">{results.domain}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Profile Score</p>
                  <span className="text-base font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">{results.threat_score}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest Data Fetch</p>
                  <p className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block">{results.last_updated}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-700" /> Identity Harvesting
              </h3>
              <div className="space-y-3">
                {results.emails.map((email: string) => (
                  <div key={email} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 hover:bg-white transition-all shadow-sm">
                    <span className="text-xs font-bold text-slate-700 font-mono italic">{email}</span>
                    <button className="text-slate-400 hover:text-blue-700 transition-colors"><ExternalLink size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-700" /> Domain Architecture
              </h3>
              <div className="space-y-3">
                {results.subdomains.map((sub: string) => (
                  <div key={sub} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 hover:bg-white transition-all shadow-sm">
                    <span className="text-xs font-bold text-slate-700 font-mono">{sub}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold uppercase tracking-widest">Active Node</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 md:col-span-2 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Share2 className="w-4 h-4 text-blue-700" /> Profile Fingerprinting (Social Data)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-5 shadow-sm hover:border-blue-200 transition-all">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 border border-blue-100">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Platform Handle: X/Twitter</p>
                    <p className="text-xs font-bold text-slate-900">{results.social_footprint.twitter}</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-5 shadow-sm hover:border-blue-200 transition-all">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 border border-blue-100">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Professional Identity: LinkedIn</p>
                    <p className="text-xs font-bold text-slate-900">{results.social_footprint.linkedin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
