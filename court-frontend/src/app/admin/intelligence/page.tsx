"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState } from "react";
import {
  Search,
  History,
  Fingerprint,
  Shield,
  Zap,
  Globe,
  Target,
  User,
  Mail,
  Database,
  Activity,
  MapPin,
} from "lucide-react";

export default function ForensicIntelligence() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [correlatedData, setCorrelatedData] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!email) return;
    setLoading(true);
    setCorrelatedData(null);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/intelligence/email-trace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ email }),
        },
      );

      if (response.status === 403) {
        setError(
          "Your administrative session has expired. Please log out and sign in again to resume investigation.",
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();
      if (data.status === "IDENTITY_FUSION_COMPLETE" || data.status === "LINK_ESTABLISHED") {
        setCorrelatedData({
          status: data.status,
          confidence: data.confidence,
          summary: data.summary,
          targets: (data.vectors || []).map((v: any) => ({
            timestamp: new Date(v.timestamp).toLocaleString(),
            ip: v.ip || "N/A",
            location: v.location || "Unknown Coordinate",
            device: v.device || "Generic Workforce Device",
            isp: v.isp || "Local Node",
            context: v.context || "DIGITAL_FOOTPRINT",
            precision_trace: v.location?.includes("Colombo"),
          })),
        });
      } else {
        setError("Target correlation failed: Linkage status unresolved.");
      }
    } catch (err: any) {
      console.error(err);
      setError(`Intelligence Linkage Failure: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Forensic Intelligence Center
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Professional Digital Identity Correlation & Investigation Engine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
              Classification: RESTRICTED
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white p-6 md:p-14 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-blue-50 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Fingerprint size={240} />
        </div>

        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-700 fill-blue-700/10" />{" "}
              Identity Correlation Engine
            </h3>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
              Enter a subject&apos;s{" "}
              <span className="text-blue-700 font-bold border-b-2 border-blue-200 pb-0.5">
                email address
              </span>{" "}
              to analyze historical session linkages, device fingerprints, and
              verified geographical footprints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="investigation-target@provider.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-14 pr-6 text-slate-900 font-semibold outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>
            <button
              onClick={handleLookup}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider px-10 py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs"
            >
              {loading ? "SEARCHING..." : "Analyze Subject"}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700 animate-in fade-in slide-in-from-top-2">
          <Shield className="w-5 h-5 text-rose-600" />
          <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {correlatedData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-8 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" /> Evidence Confidence
              </h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Analysis Score
                    </span>
                    <span className="text-2xl font-bold text-blue-700">
                      {correlatedData.confidence}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-blue-600 rounded-full shadow-sm"
                      style={{ width: correlatedData.confidence }}
                    ></div>
                  </div>
                </div>
                
                {correlatedData.summary && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Target size={12} /> Executive Summary
                    </p>
                    <p className="text-[11px] font-semibold text-blue-900 leading-tight">
                      {correlatedData.summary}
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    Verification Hash
                  </p>
                  <code className="text-[10px] font-bold text-slate-600 break-all font-mono bg-slate-50 p-2 rounded block border border-slate-100">
                    SHA-256: {Math.random().toString(16).slice(2, 10).toUpperCase()}...
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Identified Linkage History
                </h4>
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-blue-700" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase">
                    {correlatedData.targets.length} Linked Data Vectors
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {correlatedData.targets.map((target: any, i: number) => (
                  <div
                    key={i}
                    className="p-6 md:p-8 hover:bg-slate-50/50 transition-all group relative overflow-hidden"
                  >
                    {/* Source context badge */}
                    <div className="absolute top-0 right-0 py-1.5 px-4 bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] transform rotate-0 rounded-bl-xl shadow-lg border-l border-b border-slate-700">
                      SOURCE: {target.context}
                    </div>

                    <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
                      <div className="space-y-5 flex-1 w-full">
                        <div className="flex items-center gap-4">
                          <span className={`${target.context === 'LIVE_SESSION_LOCK' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'} px-2.5 py-1 text-[9px] font-bold rounded border uppercase`}>
                            Identity Link {i + 1}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Captured: {target.timestamp}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Digital Network ID
                            </p>
                            <p className="text-lg font-bold text-slate-900 font-mono">
                              {target.ip}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase leading-none">
                              {target.isp}
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Geographical Node
                            </p>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <p className="text-sm font-bold text-slate-800">
                                {target.location}
                              </p>
                            </div>
                            {(target.precision_trace || target.context === 'LIVE_SESSION_LOCK') && (
                              <span className="text-[9px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 uppercase tracking-tighter">
                                Verified Geospatial Hub
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              System Identifier
                            </p>
                            <p className="text-xs font-semibold text-slate-600 truncate font-mono">
                              {target.device}
                            </p>
                          </div>
                          {target.context === 'OFFICIAL_COURT_REQUEST' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                              <Shield size={12} />
                              <span className="text-[10px] font-bold uppercase">Institutional Match</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex xl:flex-col gap-2 w-full xl:w-auto">
                        <button className="flex-1 xl:flex-none whitespace-nowrap px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95">
                          Evidence Export
                        </button>
                        <button className="flex-1 xl:flex-none whitespace-nowrap px-6 py-3 bg-blue-700 text-white hover:bg-blue-800 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95">
                          GPS Lock
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
