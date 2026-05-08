"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Target,
  AlertCircle,
  Zap,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Fingerprint,
} from "lucide-react";
import AuthorizationGate from "@/components/AuthorizationGate";

import { API_URL, authHeaders } from "@/lib/config";

interface VulnerabilityFinding {
  id: string;
  name: string;
  category: string;
  risk: string;
  status: string;
}

export default function VulnerabilityScan() {
  const [vulnerabilityChecks, setVulnerabilityChecks] = useState<
    VulnerabilityFinding[]
  >([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState("");

  const startScan = async () => {
    if (!target) return;
    setScanning(true);
    setProgress(0);

    // Log Audit Action
    try {
      await fetch(`${API_URL}/api/v1/admin/security/audit-log`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          tool: "Vulnerability Scanner",
          action: `INITIATED_SCAN_ON: ${target}`,
          officer_id: "ADMIN_NODE_01",
        }),
      });
    } catch (e) {
      console.error("Audit fail:", e);
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          fetchFindings();
          setScanning(false);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const fetchFindings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/security/vuln-scan`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setVulnerabilityChecks(data);
    } catch (e) {
      console.error("Fetch findings failed", e);
    }
  };

  const handleRemediate = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/v1/admin/security/remediate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ vulnerabilityId: id }),
      });
      fetchFindings(); // Refresh

      // Log Remediation Audit
      await fetch(`${API_URL}/api/v1/admin/security/audit-log`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          tool: "Remediation Engine",
          action: `PATCH_APPLIED: ${id}`,
          officer_id: "ADMIN_NODE_01",
        }),
      });
    } catch (e) {
      console.error("Remediation fail:", e);
    }
  };

  return (
    <AuthorizationGate toolName="Vulnerability Assessment Scanner">
      <div className="p-8 lg:p-12 space-y-10 font-sans max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-600/10 border-2 border-rose-600/10 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Vulnerability Hub
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-bold tracking-wide flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-500" /> DEPTH-FIRST
              VULNERABILITY ANALYSIS ENGINE
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex items-center gap-2">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="SCAN_TARGET_IP_OR_DOMAIN"
                className="bg-slate-50 border-none rounded-xl py-3 px-5 text-sm font-black font-mono outline-none focus:ring-2 focus:ring-rose-100 transition-all min-w-[300px]"
              />
              <button
                onClick={startScan}
                disabled={scanning || !target}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-100 flex items-center gap-2 active:scale-95"
              >
                {scanning ? "ANALYZING..." : "INITIALIZE SCAN"}
              </button>
            </div>
          </div>
        </div>

        {scanning && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Global Scan Progress
              </p>
              <span className="text-2xl font-black text-slate-900">
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-rose-600 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              <span>Memory Buffer Audit</span>
              <span>Stack Overflow Check</span>
              <span>Sanitization Verification</span>
              <span>Persistence Analysis</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-rose-600" /> Vulnerability
                Matrix
              </h3>
              <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 uppercase">
                Current Threat Level: High
              </span>
            </div>
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-left">Vector Identity</th>
                  <th className="px-6 py-5 text-left">Category</th>
                  <th className="px-6 py-5 text-left">Risk Node</th>
                  <th className="px-6 py-5 text-left">Audit Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vulnerabilityChecks.map((v, i) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {v.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">
                          {v.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-600 uppercase tracking-tight">
                      {v.category}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${v.risk === "Critical" ? "bg-rose-50 text-rose-700 border-rose-100" : v.risk === "High" ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                      >
                        {v.risk}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${v.status === "CLEARED" ? "bg-emerald-500" : scanning ? "bg-rose-500 animate-pulse" : "bg-slate-300"}`}
                        ></div>
                        <span className="text-[10px] font-black uppercase text-slate-700">
                          {v.status === "CLEARED"
                            ? "VERIFIED"
                            : scanning
                              ? "AUDITING"
                              : "WAITING"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1c24] text-white p-8 rounded-[32px] space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-48 h-48 text-rose-500" />
              </div>
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4" /> Remediation Engine
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">
                    Critical Fix Recommendation
                  </p>
                  <p className="text-[11px] font-medium text-slate-300 leading-relaxed uppercase">
                    Detected{" "}
                    <span className="text-white font-bold">
                      Broken Access Control
                    </span>{" "}
                    in node V-01. Implement JWT claim verification at the
                    gateway level.
                  </p>
                </div>
                <button
                  onClick={() => handleRemediate("GLOBAL_VECTOR")}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  Apply Automated Patch
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Security
                Intelligence
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Injection Resilience",
                    val: "65%",
                    status: "Warning",
                  },
                  { label: "Auth Integrity", val: "92%", status: "Secure" },
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {s.label}
                      </p>
                      <span className="text-xs font-black text-slate-900">
                        {s.val}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.status === "Secure" ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: s.val }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
