"use client";

import { useState } from "react";
import {
  Terminal,
  Map as MapIcon,
  Crosshair,
  Radar,
  Activity,
  Cpu,
  Mail,
  Shield,
  Menu,
  X,
  Bell,
  ChevronRight,
  Wifi,
  Lock,
  Eye,
} from "lucide-react";

type NavItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "radar",
    icon: Radar,
    label: "Tracking",
    color: "text-cyan-400",
    activeBg: "bg-cyan-500/15",
    activeText: "text-cyan-300",
    activeBorder: "border-cyan-500/30",
  },
  {
    id: "activity",
    icon: Activity,
    label: "Activity",
    color: "text-emerald-400",
    activeBg: "bg-emerald-500/15",
    activeText: "text-emerald-300",
    activeBorder: "border-emerald-500/30",
  },
  {
    id: "mail",
    icon: Mail,
    label: "Email",
    color: "text-violet-400",
    activeBg: "bg-violet-500/15",
    activeText: "text-violet-300",
    activeBorder: "border-violet-500/30",
  },
  {
    id: "terminal",
    icon: Terminal,
    label: "Terminal",
    color: "text-amber-400",
    activeBg: "bg-amber-500/15",
    activeText: "text-amber-300",
    activeBorder: "border-amber-500/30",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("radar");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeNav = NAV_ITEMS.find((n) => n.id === activeTab)!;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col selection:bg-cyan-500/30 overflow-hidden">
      {/* ─── TOP HEADER ─── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/8 bg-neutral-950/95 backdrop-blur-md z-30 sticky top-0">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all active:scale-95"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="p-2 md:p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.12)] flex-shrink-0">
            <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-base md:text-xl font-bold tracking-wider text-white leading-none">
              CSEU
              <span className="hidden sm:inline"> COMMAND CENTER</span>
            </h1>
            <p className="text-[10px] md:text-xs text-cyan-500/60 uppercase tracking-widest font-mono leading-none mt-0.5">
              Forensic Intel Hub
            </p>
          </div>
        </div>

        {/* Right: Status + Bell */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] md:text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow inline-block" />
            SECURE
          </span>
          {/* Mobile: just the dot indicator */}
          <span className="sm:hidden w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />

          <button className="relative p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      {/* ─── BODY: SIDEBAR (desktop) + CONTENT ─── */}
      <div className="flex flex-1 min-h-0 relative">
        {/* ─── MOBILE DRAWER OVERLAY ─── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─── */}
        <aside
          className={`
            fixed md:relative top-0 left-0 h-full md:h-auto z-20
            w-64 md:w-16 lg:w-56
            bg-neutral-950 md:bg-transparent border-r border-white/8 md:border-white/5
            flex flex-col gap-1
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            pt-20 md:pt-4 px-3 md:px-2 lg:px-3
            shadow-2xl md:shadow-none
          `}
        >
          {/* Nav items */}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full rounded-xl px-3 py-3 md:py-2.5 lg:py-3
                  text-left transition-all duration-200 active:scale-95
                  ${
                    isActive
                      ? `${item.activeBg} ${item.activeText} border ${item.activeBorder}`
                      : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? item.color : ""}`}
                />
                <span className="text-sm font-medium md:hidden lg:block truncate">
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ml-auto md:hidden lg:block ${item.color} opacity-70`}
                  />
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-white/5 my-2" />

          {/* Extra links */}
          <button className="flex items-center gap-3 w-full rounded-xl px-3 py-3 md:py-2.5 lg:py-3 text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border border-transparent transition-all">
            <Cpu className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium md:hidden lg:block">
              AI Analytics
            </span>
          </button>
          <button className="flex items-center gap-3 w-full rounded-xl px-3 py-3 md:py-2.5 lg:py-3 text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border border-transparent transition-all">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium md:hidden lg:block">
              Security
            </span>
          </button>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-4">
          <div className="p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5 max-w-6xl mx-auto">
            {/* ── TRACKING TAB ── */}
            {activeTab === "radar" && (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Active Targets",
                      value: "3",
                      color: "text-cyan-400",
                      bg: "bg-cyan-500/5 border-cyan-500/15",
                    },
                    {
                      label: "Geo-Locks",
                      value: "12",
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/5 border-emerald-500/15",
                    },
                    {
                      label: "Alerts",
                      value: "2",
                      color: "text-rose-400",
                      bg: "bg-rose-500/5 border-rose-500/15",
                    },
                    {
                      label: "Uptime",
                      value: "99.8%",
                      color: "text-violet-400",
                      bg: "bg-violet-500/5 border-violet-500/15",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-xl border p-3 md:p-4 ${stat.bg}`}
                    >
                      <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-mono mb-1">
                        {stat.label}
                      </p>
                      <p
                        className={`text-xl md:text-2xl font-bold ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Live Tracking Map */}
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-white/5">
                    <h2 className="text-sm md:text-base font-semibold flex items-center gap-2 tracking-wide">
                      <MapIcon className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />
                      LIVE TARGET TRACKING
                    </h2>
                    <span className="text-[10px] md:text-xs font-mono bg-cyan-500/10 px-2 py-1 rounded text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                      SAT-LINK: ACTIVE
                    </span>
                  </div>
                  {/* Map body */}
                  <div className="aspect-video bg-black/50 relative overflow-hidden flex items-center justify-center">
                    {/* Grid lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
                    {/* Rotating ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[140%] rounded-full border border-cyan-500/10 border-t-cyan-400/40 animate-[spin_8s_linear_infinite] opacity-60" />
                    {/* Center radar */}
                    <div className="z-10 text-center space-y-3">
                      <Radar className="w-10 h-10 md:w-14 md:h-14 text-cyan-400 mx-auto animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                      <p className="text-[10px] md:text-xs font-mono text-cyan-400/60 uppercase tracking-widest">
                        Waiting for telemetry...
                      </p>
                    </div>
                    {/* Target blip */}
                    <div className="absolute top-[30%] left-[40%] flex flex-col items-center gap-1 opacity-80">
                      <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute" />
                      <div className="w-3 h-3 bg-rose-500 rounded-full relative z-10" />
                      <span className="text-[9px] md:text-[10px] font-mono text-rose-400 bg-black/70 px-1.5 py-0.5 rounded mt-1">
                        TRG-Alpha
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Predictions — Mobile: full width, collapsible feel */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-xl">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <h2 className="text-xs font-bold tracking-widest text-neutral-400 mb-4 flex items-center gap-2 uppercase">
                    <Cpu className="w-4 h-4 text-purple-400" /> AI Predictive
                    Analytics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                    <div className="p-3 md:p-4 bg-purple-500/5 border border-purple-500/20 border-l-2 border-l-purple-500 rounded-xl hover:bg-purple-500/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs text-purple-400 font-mono">
                          TRG-ALPHA
                        </h3>
                        <span className="text-[10px] text-purple-500/50 font-mono">
                          94% CONF.
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        High probability of network switch to untracked WiFi.
                        Recommend GPS polling every 30s.
                      </p>
                    </div>
                    <div className="p-3 md:p-4 bg-rose-500/5 border border-rose-500/20 border-l-2 border-l-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs text-rose-400 font-mono">
                          DEVICE ALERT
                        </h3>
                        <span className="text-[10px] text-rose-500/50 font-mono">
                          CRITICAL
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Encrypted transmission detected. Initiating payload
                        capture via backend port.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── EMAIL TRACE TAB ── */}
            {activeTab === "mail" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm md:text-base font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-violet-400" /> Active Email
                    Traces
                  </h2>
                  <span className="text-[10px] font-mono bg-violet-500/10 px-2 py-1 rounded text-violet-400 border border-violet-500/20">
                    GEO-IP: LINKED
                  </span>
                </div>

                {/* Table — responsive */}
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-3 border-b border-white/5 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                    <span>Target</span>
                    <span>Last Proxied IP</span>
                    <span className="text-right">Resolved Location</span>
                  </div>
                  {/* Rows */}
                  {[
                    {
                      email: "suspect1@example.com",
                      ip: "192.45.XX.XX",
                      loc: "Colombo, Sri Lanka",
                      status: "resolved",
                    },
                    {
                      email: "ghost@proton.me",
                      ip: "Awaiting...",
                      loc: "Pending",
                      status: "pending",
                    },
                    {
                      email: "anon44@tutanota.com",
                      ip: "Resolving...",
                      loc: "Resolving",
                      status: "resolving",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 px-4 sm:px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors font-mono text-xs"
                    >
                      {/* Mobile: stacked label */}
                      <span className="text-[10px] text-neutral-500 sm:hidden">
                        Target
                      </span>
                      <span className="text-cyan-400/90 truncate">
                        {row.email}
                      </span>

                      <div className="flex items-center gap-2 sm:block">
                        <span className="text-[10px] text-neutral-500 sm:hidden">
                          IP:{" "}
                        </span>
                        <span
                          className={
                            row.status === "pending" ||
                            row.status === "resolving"
                              ? "text-neutral-500 opacity-60"
                              : "text-neutral-300"
                          }
                        >
                          {row.ip}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="text-[10px] text-neutral-500 sm:hidden">
                          Location:{" "}
                        </span>
                        <span
                          className={`${
                            row.status === "resolved"
                              ? "text-emerald-400"
                              : "text-neutral-500 opacity-60"
                          }`}
                        >
                          {row.loc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add trace button */}
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-mono hover:bg-violet-500/20 transition-all active:scale-95">
                  <Mail className="w-4 h-4" /> Add New Trace
                </button>
              </div>
            )}

            {/* ── ACTIVITY TAB ── */}
            {activeTab === "activity" && (
              <div className="space-y-4">
                <h2 className="text-sm md:text-base font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> System
                  Activity
                </h2>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  {[
                    {
                      time: "13:45:02",
                      msg: "New connection from 10.0.0.14",
                      type: "info",
                    },
                    {
                      time: "13:44:51",
                      msg: "Target TRG-Alpha geo-locked: Colombo",
                      type: "success",
                    },
                    {
                      time: "13:44:20",
                      msg: "Encrypted stream intercepted — port 8443",
                      type: "warn",
                    },
                    {
                      time: "13:43:55",
                      msg: "Service worker heartbeat OK",
                      type: "info",
                    },
                    {
                      time: "13:43:10",
                      msg: "Failed auth attempt from 185.220.XX.XX",
                      type: "error",
                    },
                    {
                      time: "13:42:47",
                      msg: "Listening on port 5000",
                      type: "info",
                    },
                  ].map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          entry.type === "success"
                            ? "bg-emerald-400"
                            : entry.type === "warn"
                              ? "bg-amber-400"
                              : entry.type === "error"
                                ? "bg-rose-500"
                                : "bg-cyan-500/60"
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-neutral-500 block">
                          {entry.time}
                        </span>
                        <span className="text-xs text-neutral-300 break-words">
                          {entry.msg}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TERMINAL TAB ── */}
            {activeTab === "terminal" && (
              <div className="space-y-4">
                <h2 className="text-sm md:text-base font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" /> Extraction Log
                  Terminal
                </h2>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-[10px] font-mono text-neutral-500">
                      ccid-shell ~ extraction.log
                    </span>
                  </div>
                  <div className="font-mono text-[11px] md:text-xs text-emerald-400/80 space-y-2 p-4 min-h-[220px] md:min-h-[280px] bg-black/40 relative">
                    <p className="opacity-50">
                      01:04:15 &gt; Service worker established
                    </p>
                    <p className="opacity-70">
                      01:04:18 &gt; Listening on port 5000...
                    </p>
                    <p className="text-cyan-400/80">
                      01:04:22 &gt; Socket.IO handshake: OK
                    </p>
                    <p className="text-emerald-300">
                      01:04:25 &gt; Waiting for payload transmission...
                    </p>
                    <p className="opacity-40">
                      01:04:30 &gt; Heartbeat ping [200ms]
                    </p>
                    <p className="text-amber-400/80">
                      01:04:35 &gt; WARN: Proxy rotation detected
                    </p>
                    <p className="text-emerald-300">
                      01:04:40 &gt; Re-locking target coordinates...
                    </p>
                    <div className="flex items-center gap-1 text-emerald-400 mt-2">
                      <span>&gt;</span>
                      <span className="animate-blink">█</span>
                    </div>
                    {/* fade at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Network status cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      icon: Wifi,
                      label: "Network Link",
                      value: "ACTIVE",
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/5 border-emerald-500/15",
                    },
                    {
                      icon: Eye,
                      label: "Surveillance",
                      value: "ONLINE",
                      color: "text-cyan-400",
                      bg: "bg-cyan-500/5 border-cyan-500/15",
                    },
                    {
                      icon: Lock,
                      label: "Encryption",
                      value: "AES-256",
                      color: "text-violet-400",
                      bg: "bg-violet-500/5 border-violet-500/15",
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.label}
                        className={`rounded-xl border p-3 flex items-center gap-3 ${card.bg}`}
                      >
                        <div
                          className={`p-2 rounded-lg bg-white/5 ${card.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                            {card.label}
                          </p>
                          <p
                            className={`text-sm font-bold font-mono ${card.color}`}
                          >
                            {card.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-neutral-950/95 backdrop-blur-md border-t border-white/8 flex items-center justify-around px-2 pt-2 pb-safe pb-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-90 min-w-[52px] ${
                isActive
                  ? `${item.activeBg} ${item.activeText}`
                  : "text-neutral-500"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : ""}`} />
              <span className="text-[9px] font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
