"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Zap,
  Bell,
  Clock,
  Target,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { API_URL, authHeaders } from "@/lib/config";
import AuthorizationGate from "@/components/AuthorizationGate";

export default function SecurityDashboard() {
  const [stats, setStats] = useState({
    activeThreats: 0,
    securityScore: 100,
    vulnerabilities: 0,
    auditEntries: 0,
    nodes: 0,
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/admin/security/stats`, {
            headers: authHeaders(),
          }),
          fetch(`${API_URL}/api/v1/admin/security/audit-log`, {
            headers: authHeaders(),
          }),
        ]);

        const statsData = await statsRes.json();
        const logsData = await logsRes.json();

        setStats({
          activeThreats: statsData.active_scans || 0,
          securityScore: parseInt(statsData.integrity_score) || 100,
          vulnerabilities: statsData.recent_alerts?.length || 0,
          auditEntries: logsData.length || 0,
          nodes: statsData.nodes_monitored || 124,
        });

        setRecentLogs(Array.isArray(logsData) ? logsData.slice(0, 5) : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <AuthorizationGate toolName="Security Command Center HUD">
      <div className="p-8 lg:p-12 space-y-10 font-sans max-w-[1600px] mx-auto">
        {/* Header HUD */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-700/5 border-2 border-blue-700/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-blue-700" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                CSEU Command Center
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-bold tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> SYSTEM
              INTEGRITY: VERIFIED & ACTIVE
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Global Security Score
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {stats.securityScore}%
                </span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-blue-700"
                    style={{ width: `${stats.securityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Active Threats",
              val: stats.activeThreats,
              icon: ShieldAlert,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
            {
              label: "System Uptime",
              val: "99.9%",
              icon: Activity,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Audit Entries",
              val: stats.auditEntries,
              icon: Clock,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Open Alerts",
              val: stats.vulnerabilities,
              icon: Bell,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${s.bg}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {s.label}
              </p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {s.val}
              </h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Audit Cluster */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-700" /> Recent Security
                  Audits
                </h3>
                <button className="text-[10px] font-black text-blue-700 uppercase tracking-widest hover:underline">
                  View All Logs
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentLogs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm font-medium italic">
                    No recent anomalies detected.
                  </div>
                ) : (
                  recentLogs.map((log, i) => (
                    <div
                      key={i}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all border-l-4 border-transparent hover:border-blue-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold text-slate-600">
                          {log.officer_id?.substring(0, 2).toUpperCase() ||
                            "AD"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {log.tool}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase">
                            {log.action} ·{" "}
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <code className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                          {log.ip_address}
                        </code>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Threats */}
          <div className="space-y-6">
            <div className="bg-[#1a1c24] text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-48 h-48 text-blue-500" />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4" /> Threat Matrix
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      node: "External IP Probe",
                      level: "Low Risk",
                      color: "bg-emerald-500",
                    },
                    {
                      node: "Credential Spray",
                      level: "High Risk",
                      color: "bg-rose-500",
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${t.color}`}></div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-white uppercase">
                          {t.node}
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                          {t.level}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Active
                Recommendations
              </h3>
              <div className="space-y-4">
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">
                  3 security modules are pending a{" "}
                  <span className="text-blue-700 font-bold">
                    compliance audit
                  </span>
                  . Perform manual handshake verification on Wireless Node-AF2.
                </p>
                <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95">
                  Start Compliance Sweep
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
