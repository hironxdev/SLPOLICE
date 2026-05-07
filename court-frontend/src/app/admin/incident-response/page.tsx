"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Zap,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  ArrowRight,
  Filter,
  Activity,
  Target,
} from "lucide-react";

export default function IncidentResponse() {
  const [activeCases, setActiveCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/incidents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActiveCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Incident Response
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage active security threats and execute responder playbooks.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-rose-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-sm shadow-rose-100">
            <Zap size={18} /> Emergency Lockdown
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Active Incident List */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Active Threat
                Feed
              </h3>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                  <Filter size={14} /> Filter by Severity
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-20 text-center text-slate-400 text-sm font-medium animate-pulse">
                  Retrieving incident data from central database...
                </div>
              ) : activeCases.length === 0 ? (
                <div className="p-20 text-center text-slate-400 text-sm font-medium">
                  No active incidents detected.
                </div>
              ) : (
                activeCases.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-8 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              incident.severity === "CRITICAL"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {incident.severity}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {incident.id}
                          </span>
                          <div className="flex items-center gap-2 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${incident.status === "CONTAINING" ? "bg-rose-500 animate-pulse" : "bg-blue-600"}`}
                            ></div>
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                              {incident.status}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {incident.name}
                        </h4>
                        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />{" "}
                            {incident.assigned}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />{" "}
                            {incident.time} elapsed
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all">
                          View Brief
                        </button>
                        <button className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-100">
                          Open Case Board <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side Metrics/Playbooks */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600" /> Tactical Playbooks
            </h3>
            <div className="space-y-3">
              {[
                { name: "Malware Containment", level: "L3" },
                { name: "Data Breach Response", level: "L4" },
                { name: "Network Isolation", level: "L2" },
                { name: "Ransomware Recovery", level: "L5" },
              ].map((pb) => (
                <button
                  key={pb.name}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                >
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">
                    {pb.name}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                    {pb.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-8 space-y-4 shadow-xl shadow-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Strike Ready
              </h3>
            </div>
            <p className="text-xs font-medium text-blue-100 leading-relaxed">
              Tactical Response Teams are standing by for national security
              mitigation orders.
            </p>
            <button className="w-full py-2 bg-white text-blue-700 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors">
              Deploy Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
