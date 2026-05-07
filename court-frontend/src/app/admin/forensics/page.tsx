"use client";
import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import {
  Shield,
  Zap,
  Globe,
  Briefcase,
  AlertCircle,
  Fingerprint,
  FileLock,
  ExternalLink,
  ShieldAlert,
  X,
  Plus,
  Clock,
  Search,
  MapPin,
  User,
} from "lucide-react";

export default function DigitalEvidenceCollection() {
  const [cases, setCases] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"CASES" | "COLLECT" | "LEGAL">(
    "CASES",
  );
  const [status, setStatus] = useState("");

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [newCaseClass, setNewCaseClass] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  // COLLECTION STATE
  const [caseId, setCaseId] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [legalAuth, setLegalAuth] = useState("");
  const [evidence, setEvidence] = useState<any[]>([]);

  const fetchCases = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/evidence/cases`);
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Link Failure:", err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const createCase = async () => {
    if (!newCaseClass) {
      setStatus("ERROR: INVESTIGATION CLASSIFICATION REQUIRED.");
      return;
    }

    setStatus("GENERATING NEW INVESTIGATION FILE...");
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/evidence/cases/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classification: newCaseClass, priority }),
      });
      const newCase = await res.json();
      setCases([newCase, ...cases]);
      setNewCaseClass("");
      setShowModal(false);
      setStatus("VITAL: NEW INVESTIGATION CASE REGISTERED.");
    } catch (e) {
      setStatus("ERROR: CASE REGISTRATION FAILED.");
    }
  };

  const initiateCollection = async () => {
    if (!caseId || !profileUrl || !legalAuth) {
      setStatus("ERROR: INSUFFICIENT AUTHORIZATION DATA");
      return;
    }

    setStatus("INITIATING FORENSIC HANDSHAKE...");
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/evidence/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, platform, profileUrl, legalAuth }),
      });
      const data = await res.json();
      setEvidence([data, ...evidence]);
      setStatus("COLLECTION COMPLETE: EVIDENCE HASHED & ARCHIVED.");
    } catch (e) {
      setStatus("FAILURE: TARGET ENCRYPTION OR ACCESS BLOCKED.");
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-10 relative">
      {/* CASE REGISTRATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 transition-all">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Briefcase size={18} className="text-blue-700" /> New Case
                Registration
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Investigation Classification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Identity Theft, Cyber-Fraud..."
                  value={newCaseClass}
                  onChange={(e) => setNewCaseClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-400 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Operational Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold outline-none appearance-none cursor-pointer"
                >
                  <option value="LOW">LOW PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="CRITICAL">CRITICAL SURVEILLANCE</option>
                </select>
              </div>
              <button
                onClick={createCase}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase tracking-widest p-5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 text-xs"
              >
                Register Investigation File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="w-7 h-7 text-blue-700" /> Digital Evidence
            Intelligence
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            CCID Cyber-Crime Investigation & Social Media Surveillance
          </p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex">
          {["CASES", "COLLECT", "LEGAL"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* INVESTIGATION CENTER */}
        <div className="lg:col-span-3 space-y-10">
          {activeTab === "CASES" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-4">
                  <Briefcase className="w-4 h-4 text-blue-700" /> Active CCID
                  Investigation Files
                </h3>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-700 text-white font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl text-[10px] flex items-center gap-2 hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                  <Plus size={16} /> Create Case
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {cases.length === 0 ? (
                  <div className="p-24 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <ShieldAlert className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-medium text-sm italic">
                      No active investigative cases in system.
                    </p>
                  </div>
                ) : (
                  cases.map((c) => (
                    <div
                      key={c.case_id}
                      className="p-8 flex justify-between items-center group hover:bg-slate-50 transition-all"
                    >
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-blue-700 group-hover:border-blue-100 transition-all shadow-sm">
                          <Briefcase size={22} />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900">
                            {c.case_number}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                              {c.classification}
                            </span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                              <Clock size={10} />{" "}
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Priority
                          </p>
                          <span
                            className={`text-[10px] font-black uppercase italic ${c.priority === "CRITICAL" ? "text-rose-600" : "text-amber-600"}`}
                          >
                            {c.priority || "MEDIUM"}
                          </span>
                        </div>
                        <button className="bg-white border border-slate-200 p-3 rounded-xl hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "COLLECT" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <section className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-blue-100 opacity-20 pointer-events-none">
                  <Globe size={180} />
                </div>
                <div className="max-w-2xl space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <Zap size={24} className="text-blue-600" /> Evidence
                      Extraction Matrix
                    </h3>
                    <p className="text-slate-500 font-medium">
                      Platform-agnostic scraper for deep profile metrics,
                      historical metadata, and geographical traces.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Target Case File
                      </label>
                      <select
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-bold outline-none appearance-none"
                      >
                        <option value="">Select Case Registry...</option>
                        {cases.map((c) => (
                          <option key={c.case_id} value={c.case_id}>
                            {c.case_number} ({c.classification})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Legal Authorization ID
                      </label>
                      <input
                        type="text"
                        placeholder="WARRANT-REFERENCE-ID"
                        value={legalAuth}
                        onChange={(e) => setLegalAuth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-bold font-mono outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Social Network URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://facebook.com/..."
                        value={profileUrl}
                        onChange={(e) => {
                          setProfileUrl(e.target.value);
                          if (e.target.value.includes("facebook"))
                            setPlatform("FACEBOOK");
                          else if (e.target.value.includes("instagram"))
                            setPlatform("INSTAGRAM");
                          else setPlatform("UNSPECIFIED");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 p-5 rounded-xl text-sm font-semibold outline-none pl-14"
                      />
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={20} />
                      </div>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-700 uppercase tracking-widest">
                        {platform}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={initiateCollection}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase tracking-widest p-5 rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-95 text-xs flex items-center justify-center gap-3"
                  >
                    <Shield size={18} /> Initiate Forensic extraction
                  </button>
                </div>
              </section>

              {status && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-emerald-400 font-mono text-[10px] flex items-center gap-4 animate-pulse">
                  <Zap size={16} /> SYSCALL: {status}
                </div>
              )}

              {/* FORENSIC DOSSIER PREVIEW */}
              {evidence.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl animate-in slide-in-from-bottom-5 duration-1000">
                  <div className="bg-slate-900 p-8 flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                        Forensic Dossier Locked
                      </h4>
                      <p className="text-white font-bold text-lg tracking-tight">
                        {evidence[0].dossier?.account_handle || "@Unknown"}
                      </p>
                    </div>
                    <div className="bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-lg text-center">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">
                        Confidential
                      </span>
                    </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <User size={12} className="text-blue-700" /> Real
                          Identity Name
                        </p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                          {evidence[0].dossier?.account_name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={12} className="text-blue-700" />{" "}
                          Geospatial Node
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {evidence[0].dossier?.gps_coords}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-4 border-b border-blue-200 pb-2 flex items-center justify-between">
                        <span>Unmasked Intel</span>
                        <Shield size={10} className="text-blue-700" />
                      </p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">
                            Email
                          </span>
                          <span className="font-mono font-black text-slate-900 border-b border-dotted border-blue-300">
                            {evidence[0].dossier?.private_intel?.masked_email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">
                            Phone
                          </span>
                          <span className="font-mono font-black text-slate-900 bg-blue-50 px-1 rounded">
                            {evidence[0].dossier?.private_intel?.masked_phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">
                            Device
                          </span>
                          <span className="font-bold text-blue-700 italic">
                            {
                              evidence[0].dossier?.private_intel?.device_fingerprint?.split(
                                " ",
                              )[0]
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50">
                      <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-4 border-b border-rose-100 pb-2 flex items-center justify-between">
                        <span>Leak Correlation</span>
                        <AlertCircle size={10} className="text-rose-700" />
                      </p>
                      <div className="space-y-3">
                        {evidence[0].dossier?.leak_correlation?.map(
                          (leak: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between items-start text-[9px] gap-2"
                            >
                              <span className="text-slate-500 font-bold uppercase leading-tight">
                                {leak.source}
                              </span>
                              <span
                                className={`font-black uppercase tracking-tighter ${leak.status === "MATCH_FOUND" || leak.status === "VERIFIED_HIT" ? "text-rose-600" : "text-slate-400"}`}
                              >
                                {leak.status}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button className="h-full bg-blue-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 shadow-xl shadow-blue-100 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all">
                          <FileLock size={60} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">
                          Forensic Dossier
                          <br />
                          Status
                        </p>
                        <div className="bg-white/20 border border-white/30 px-3 py-1.5 rounded-lg text-[8px] font-black italic">
                          IDENTITY FULLY UNMASKED
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* LIVE ANALYSIS CONSOLE */}
                  <div className="bg-slate-900 mx-8 mb-8 p-6 rounded-xl border border-slate-800 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/10 mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-slate-500 uppercase font-black">Node Correlation</span>
                        <span className="text-blue-400 font-black tracking-widest">{evidence[0].dossier?.correlated_node_id}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] text-slate-500 uppercase font-black">Trust Integrity</span>
                        <span className="text-emerald-400 font-black tracking-widest">{evidence[0].dossier?.trust_score}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 opacity-90">
                      { (evidence[0].dossier?.analysis_log || []).map((log: string, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start group">
                          <span className="text-slate-600 shrink-0 font-bold">[{new Date(evidence[0].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                          <p className={`leading-relaxed ${idx === (evidence[0].dossier?.analysis_log?.length - 1) ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>
                            {log}
                            {idx === (evidence[0].dossier?.analysis_log?.length - 1) && <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-2 animate-pulse"></span>}
                          </p>
                        </div>
                      ))}
                      <p className="text-emerald-400 font-black mt-2 tracking-widest uppercase text-[8px] animate-pulse">
                          &gt;&gt;&gt; OSINT HANDSHAKE COMPLETE. TARGET ASSETS ARCHIVED TO VAULT.
                      </p>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3 overflow-x-auto no-scrollbar">
                    {(evidence[0].dossier?.meta_tags || ["CCID_ARCHIVED"]).map(
                      (tag: string) => (
                        <span
                          key={tag}
                          className="text-[8px] font-black text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* EVIDENCE HISTORY MODULE */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Seized Forensic Artifacts
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {evidence.length} Records
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {evidence.length === 0 ? (
                    <div className="p-20 text-center text-slate-400 italic text-sm uppercase tracking-tighter">
                      No historical artifacts detected in current session.
                    </div>
                  ) : (
                    evidence.map((ev) => (
                      <div
                        key={ev.evidence_id}
                        className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-700 transition-all shadow-sm">
                            <Shield size={18} />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                              {ev.profile_url}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              {ev.evidence_id.split("-")[0]} •{" "}
                              {new Date(ev.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <button className="bg-white border border-slate-200 p-2.5 rounded-lg hover:text-blue-700 hover:border-blue-200 transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR OPS */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-1000">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <AlertCircle size={16} className="text-blue-700" /> Operational
              Warning
            </h4>
            <div className="space-y-4">
              <p className="text-[11px] font-semibold text-slate-600 leading-relaxed uppercase opacity-80">
                Unauthorized access to private data without a valid court
                warrant is a violation of S.L. Cyber Law.
              </p>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-black text-rose-700 flex gap-3 italic">
                <ShieldAlert size={14} className="shrink-0" />
                SYSTEM LOGGING ALL ATTEMPTS.
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
              <Fingerprint size={80} />
            </div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3 relative z-10">
              <Shield size={16} className="text-blue-400" /> Legal Compliance
            </h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-slate-500 uppercase italic">
                  Immutable Logs
                </span>
                <span className="text-xs font-black text-blue-400 uppercase">
                  Active
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[100%] shadow-[0_0_8px_#3b82f6]"></div>
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic uppercase">
                Every artifact collected is digitally signed and
                cryptographically cross-verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
