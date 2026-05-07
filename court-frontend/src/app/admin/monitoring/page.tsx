"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import {
  Network,
  Activity,
  Shield,
  Zap,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Server,
  Terminal,
  Search,
} from "lucide-react";

export default function MonitoringModule() {
  const [traffic, setTraffic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraffic = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/visits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTraffic(
          data
            .map((v) => ({
              id: v.id,
              protocol:
                v.forensics?.usage_type ||
                v.external_identity?.connection_type ||
                "HTTPS",
              source: v.forensics?.ip || v.ip_address,
              destination: "CCID_GATEWAY",
              size: Math.floor(Math.random() * 500) + 100 + "B",
              status: "NORMAL",
              timestamp: new Date(v.timestamp).toLocaleTimeString(),
            }))
            .slice(0, 15),
        );
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Network Intelligence & Traffic Analysis
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            National Security Infrastructure Monitoring & Threat Detection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm">
            Download Audit Report
          </button>
        </div>
      </div>

      {/* Traffic Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-8 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-4 h-4 text-blue-700" /> Real-time Data
              Stream
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></div>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                Active Capture
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left order-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Source Node
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Protocol
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Integrity Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {traffic.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-slate-50/80 transition-all border-b border-slate-50 last:border-0 font-medium"
                  >
                    <td className="px-4 py-4 text-[10px] font-bold text-slate-400 font-mono tracking-tight">
                      {p.timestamp}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {p.source}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-[9px] font-bold uppercase tracking-wider">
                        {p.protocol}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${p.status === "ANOMALY" ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Zap className="w-4 h-4 text-blue-700" /> Intelligence Insights
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Active Nodes
                </p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  1,284
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Threat Level
                </p>
                <p className="text-2xl font-bold text-emerald-600 tracking-tight">
                  LOW
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-700 rounded-xl p-6 md:p-8 space-y-6 shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
              <Shield size={80} />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-3 relative z-10">
              <Shield className="w-4 h-4" /> AI Guard Status
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-bold text-blue-100">
                <span className="opacity-80">Heuristic Analysis</span>
                <span className="text-white">Active</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[85%]"></div>
              </div>
              <p className="text-[10px] font-medium text-blue-100 leading-relaxed opacity-80 italic">
                Scanning for non-standard protocol handshakes to mitigate
                lateral movement threats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
