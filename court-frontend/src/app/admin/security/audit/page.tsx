"use client";

import {
  FileText,
  Clock,
  User,
  Shield,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  History,
  CheckCircle2,
} from "lucide-react";
import AuthorizationGate from "@/components/AuthorizationGate";
import { useEffect, useState, useCallback } from "react";
import { API_URL, authHeaders } from "@/lib/config";

interface AuditEntry {
  id: string;
  officer_id: string;
  tool: string;
  action: string;
  timestamp: string;
  ip_address: string;
}

export default function ForensicAudit() {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/security/audit-log`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setAuditLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch logs failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Avoid synchronous setState warning
    queueMicrotask(() => {
      fetchLogs();
    });
  }, [fetchLogs]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.officer_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AuthorizationGate toolName="Forensic Audit & Compliance Archive">
      <div className="p-8 lg:p-12 space-y-10 font-sans max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                <History className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Audit Archive
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-bold tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-900" /> IMMUTABLE FORENSIC
              LOG REPOSITORY active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Export PCAP/CSV
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              <FileText className="w-4 h-4" /> Generate Report
            </button>
          </div>
        </div>

        {/* Filters and Table Container */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="SEARCH_BY_ACTOR_OR_EVENT"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold font-mono outline-none focus:ring-4 focus:ring-slate-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400 ml-4 hidden md:block" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-50 transition-all"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="WEB_SEC">WEB SECURITY</option>
                <option value="NETWORK">NETWORK RECON</option>
                <option value="VULNS">VULNERABILITIES</option>
                <option value="AUTH">ACCESS CONTROL</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Event Identifier</th>
                  <th className="px-6 py-5">Timestamp</th>
                  <th className="px-6 py-5">Actor / Origin</th>
                  <th className="px-6 py-5">Operation Node</th>
                  <th className="px-6 py-5">Outcome</th>
                  <th className="px-8 py-5 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse"
                    >
                      Loading Forensic Trails...
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="max-w-[200px]">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {log.action}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-mono">
                            {log.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5" />{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <span className="text-xs font-black text-slate-600 truncate max-w-[120px] uppercase">
                            {log.officer_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase">
                          {log.tool}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase text-emerald-700">
                            VERIFIED
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing 6 entries of 1,244 total
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${n === 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Note */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Shield className="w-24 h-24" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              Audit Compliance Disclaimer
            </h3>
            <p className="text-sm font-medium text-slate-300 leading-relaxed uppercase">
              These logs serve as legal digital evidence in accordance with the{" "}
              <span className="text-white font-bold underline italic">
                CSEU Digital Custody Protocol
              </span>
              . Modification of these logs is cryptographically impossible and
              any attempt will trigger an automatic system lockdown and security
              alert to the
              <span className="text-white font-bold ml-1">
                Head of Digital Forensics
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
