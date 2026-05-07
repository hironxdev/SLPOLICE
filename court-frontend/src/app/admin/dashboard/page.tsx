"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL, WS_URL } from "@/lib/config";
import {
  ShieldCheck,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  LogOut,
  RefreshCcw,
  Trash2,
  Terminal as TerminalIcon,
  ShieldAlert,
  Users,
} from "lucide-react";
import React from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";

function ForensicTerminal() {
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const xtermRef = React.useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: "#0f172a",
        foreground: "#f8fafc",
        cursor: "#fbbf24",
        selectionBackground: "rgba(251, 191, 36, 0.3)",
      },
      fontFamily: '"Fira Code", monospace',
      fontSize: 13,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    // Safely fit the terminal after a short delay to ensure DOM is ready and renderer is active
    const timer = setTimeout(() => {
      if (!term.element) return;
      try {
        // Double check visibility and renderer status
        const rect = term.element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          fitAddon.fit();
        }
      } catch (e) {
        console.warn("Terminal initial fit failed: ", e);
      }
    }, 1000); // 1s is safer for Turbopack/hydration

    const socket = io(WS_URL);

    socket.on("connect", () => {
      term.writeln(
        "\x1b[1;36m┌──(root㉿kali)-[PROVISIONING_SECURE_LINK]\x1b[0m",
      );
      term.writeln(
        "\x1b[1;36m└─# \x1b[0mEstablishing CCID Digital Sovereignty Layer...",
      );
      term.writeln("");
      term.writeln("\x1b[1;32m[SYSTEM] KALI ENVIRONMENT SYNCHRONIZED\x1b[0m");
      term.writeln(
        "\x1b[1;33mOPERATIONAL TOOLS: Python3, Go, C++, Rust, Node.js, Metasploit-v6\x1b[0m",
      );
      term.writeln(
        "\x1b[1;34mAUTHORIZATION: UNRESTRICTED CORE-NODE ACCESS\x1b[0m",
      );
      term.writeln("");
    });

    term.onData((data) => socket.emit("input", data));
    socket.on("output", (data) => term.write(data));

    xtermRef.current = term;

    const handleResize = () => {
      if (!term.element) return;
      try {
        const rect = term.element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          fitAddon.fit();
          socket.emit("resize", { cols: term.cols, rows: term.rows });
        }
      } catch (e) {
        // Silently catch resize errors to prevent runtime crash
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      socket.disconnect();
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden p-2 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 animate-pulse"></div>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
            Live Cyber Ops Terminal
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono italic">
          ROOTED ACCESS: HQ_POLICE_SRILANKA
        </span>
      </div>
      <div ref={terminalRef} className="h-[350px] md:h-[600px]" />
    </div>
  );
}

interface Visit {
  id: string;
  ip_address: string;
  user_agent: string;
  forensics?: any; // Legacy support
  geo_forensics?: {
    ip_based: {
      city: string;
      region: string;
      country: string;
      zip: string;
      latitude?: number;
      longitude?: number;
    };
    precision_gps?: {
      lat: number;
      lon: number;
      accuracy: number;
      altitude?: number;
      maps_link: string;
    };
  };
  external_identity?: {
    isp: string;
    org: string;
    asn: string;
    connection_type: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  source?: string;
  timestamp: string;
}

interface Request {
  id: string;
  name: string;
  national_id_hashed: string;
  court_order_number: string;
  court_date: string;
  explanation_type: string;
  explanation_text: string;
  status: string;
  created_at: string;
  phone_primary: string;
  phone_secondary?: string;
  requested_new_date?: string;
  ip_address?: string;
  user_agent?: string;
  forensics?: any;
  location?: {
    latitude: number;
    longitude: number;
    maps_url: string;
    accuracy: number;
  };
}

const SourceBadge = ({ source }: { source?: string }) => {
  if (!source)
    return <span className="text-[10px] text-slate-300 italic">Direct</span>;
  const isSliit = source === "SLIIT_JOB_GATEWAY";
  return (
    <span
      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
        isSliit
          ? "bg-orange-50 text-orange-700 border-orange-100"
          : "bg-blue-50 text-blue-700 border-blue-100"
      }`}
    >
      {source.replace(/_/g, " ")}
    </span>
  );
};

function VisitRow({ visit }: { visit: Visit }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const lat =
      visit.location?.latitude ||
      visit.location?.lat ||
      visit.geo_forensics?.precision_gps?.lat ||
      visit.forensics?.latitude;
    const lon =
      visit.location?.longitude ||
      visit.location?.lon ||
      visit.geo_forensics?.precision_gps?.lon ||
      visit.forensics?.longitude;

    if (lat && lon) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      )
        .then((res) => res.json())
        .then((data) => setAddress(data.display_name))
        .catch(() => {});
    }
  }, [visit.location, visit.geo_forensics, visit.forensics]);

  return (
    <tr className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">
            {new Date(visit.timestamp).toLocaleTimeString()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase">
            {new Date(visit.timestamp).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-mono font-semibold text-slate-600">
            {visit.ip_address}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <SourceBadge source={visit.source} />
      </td>
      <td className="px-6 py-4">
        {address ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                GPS Verified
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-700 leading-tight">
              {address}
            </p>
          </div>
        ) : visit.geo_forensics?.precision_gps || visit.location ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                Precision Uplink
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight italic">
              {visit.geo_forensics?.precision_gps?.lat?.toFixed(5)},{" "}
              {visit.geo_forensics?.precision_gps?.lon?.toFixed(5)}
            </p>
          </div>
        ) : visit.geo_forensics?.ip_based || visit.forensics ? (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-slate-700">
              {visit.geo_forensics?.ip_based?.city ||
                visit.forensics?.city_name ||
                "Unknown City"}
              {", "}
              {visit.geo_forensics?.ip_based?.region ||
                visit.forensics?.region_name ||
                ""}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {visit.geo_forensics?.ip_based?.country ||
                visit.forensics?.country_name}
            </p>
            {(visit as any).fingerprint?.status?.includes("FAILED") && (
              <p className="text-[8px] font-black text-rose-500 uppercase tracking-tighter mt-1">
                ⚠️ GPS:{" "}
                {(visit as any).fingerprint.status.replace("GPS_FAILED_", "")}
              </p>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            Location Trace Pending
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          {visit.external_identity?.isp ||
            visit.forensics?.isp ||
            visit.forensics?.as ||
            "Internal Network"}
        </span>
      </td>
      <td className="px-6 py-4">
        <p
          className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]"
          title={visit.user_agent}
        >
          {visit.user_agent}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        {(visit as any).location?.latitude || (visit as any).location?.lat ? (
          <a
            href={`https://www.google.com/maps?q=${(visit as any).location?.latitude || (visit as any).location?.lat},${(visit as any).location?.longitude || (visit as any).location?.lon}`}
            target="_blank"
            className="inline-flex p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all border border-blue-100"
            title="High-Precision GPS Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : visit.geo_forensics?.precision_gps?.lat ? (
          <a
            href={`https://www.google.com/maps?q=${visit.geo_forensics?.precision_gps?.lat},${visit.geo_forensics?.precision_gps?.lon}`}
            target="_blank"
            className="inline-flex p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all border border-blue-100"
            title="High-Precision GPS Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : visit.geo_forensics?.ip_based?.latitude ||
          visit.forensics?.latitude ? (
          <a
            href={`https://www.google.com/maps?q=${visit.geo_forensics?.ip_based?.latitude || visit.forensics?.latitude},${visit.geo_forensics?.ip_based?.longitude || visit.forensics?.longitude}`}
            target="_blank"
            className="inline-flex p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-all border border-slate-200"
            title="City-Level IP Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter opacity-40">
            No Trace
          </span>
        )}
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState<
    "requests" | "visits" | "terminal"
  >("requests");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/admin";
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/visits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/admin";
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) setVisits(data);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const syncAll = useCallback(async () => {
    // Silent background sync
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      };
      const [vRes, rRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/visits`, { headers }),
        fetch(`${API_URL}/api/v1/admin/requests`, { headers }),
      ]);

      if (vRes.ok) {
        const vData = await vRes.json();
        if (Array.isArray(vData)) setVisits(vData);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        if (Array.isArray(rData)) setRequests(rData);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initial fetch
    fetchRequests();
    fetchVisits();

    // Set up Real-Time Polling (3 seconds)
    const interval = setInterval(syncAll, 3000);
    return () => clearInterval(interval);
  }, [mounted, fetchRequests, fetchVisits, syncAll]);

  useEffect(() => {
    if (selectedRequest?.location) {
      setResolvedAddress("Resolving address...");
      const { latitude, longitude } = selectedRequest.location;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setResolvedAddress(data.display_name || "Address not found");
        })
        .catch(() => setResolvedAddress("Resolution failed"));
    } else {
      setResolvedAddress(null);
    }
  }, [selectedRequest]);

  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/requests/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (response.ok) {
        setRequests(
          (Array.isArray(requests) ? requests : []).map((r) =>
            r.id === id ? { ...r, status: newStatus } : r,
          ),
        );
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  const filteredRequests = (Array.isArray(requests) ? requests : []).filter(
    (r) => {
      const matchesFilter = filter === "All" || r.status === filter;
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.court_order_number.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    },
  );

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8">
      {/* Polished Government Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Intelligence Dashboard
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Cross-platform intelligence overview and incident coordination.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            System Status: Operational
          </span>
        </div>
      </div>
      {/* Stats & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Quick Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-slate-600">
                  {activeTab === "requests"
                    ? "Case File Submissions"
                    : "Intelligence Visitors"}
                </span>
                <span className="text-3xl font-bold text-slate-900">
                  {activeTab === "requests"
                    ? Array.isArray(requests)
                      ? requests.length
                      : 0
                    : Array.isArray(visits)
                      ? visits.length
                      : 0}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[60%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Control Center
            </h3>
            <div className="space-y-2">
              <button
                onClick={activeTab === "requests" ? fetchRequests : fetchVisits}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-all"
              >
                Sync {activeTab === "requests" ? "Database" : "Traffic"}{" "}
                <RefreshCcw className="w-4 h-4 text-blue-600" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition-all">
                Clear Audit Logs <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Tab Switcher - Scrollable on mobile */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-fit overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "requests" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveTab("visits")}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "visits" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
              Intel Feed
            </button>
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "terminal" ? "bg-[#0f172a] text-white shadow-sm border border-slate-800" : "text-slate-500 hover:text-slate-700"}`}
            >
              Cyber Ops
            </button>
          </div>

          {activeTab === "requests" ? (
            <>
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Filter records by name or reference ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium shadow-sm"
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "Pending", "Reviewed", "Archived"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        filter === f
                          ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* List Submissions - Horizontal Scroll for tables */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Submission Date</th>
                        <th className="px-6 py-4">Respondent</th>
                        <th className="px-6 py-4">Ref Number</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-20 text-center text-slate-400 animate-pulse font-semibold text-xs"
                          >
                            Synchronizing secure records...
                          </td>
                        </tr>
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-20 text-center text-slate-400 font-semibold text-xs"
                          >
                            No records found.
                          </td>
                        </tr>
                      ) : (
                        filteredRequests
                          .slice()
                          .reverse()
                          .map((req) => (
                            <tr
                              key={req.id}
                              className="hover:bg-slate-50/80 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-700">
                                    {new Date(
                                      req.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {new Date(
                                      req.created_at,
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold text-slate-900">
                                  {req.name}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <code className="bg-slate-100 px-2 py-1 rounded text-blue-700 text-[10px] font-bold font-mono">
                                  {req.court_order_number}
                                </code>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    req.status === "Pending"
                                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                                      : "bg-blue-50 text-blue-700 border border-blue-100"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full ${req.status === "Pending" ? "bg-amber-500" : "bg-blue-600"}`}
                                  ></span>
                                  {req.status}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setSelectedRequest(req)}
                                  className="p-2 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : activeTab === "terminal" ? (
            <ForensicTerminal />
          ) : (
            /* Visitor Intelligence Table */
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center font-sans">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-700">
                  Live Digital Sovereignty Monitoring
                </h3>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Real-time Feed Active
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Network ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Source
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Geolocation
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Service Provider
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        System Agent
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                        Trace
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visits.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-20 text-center text-slate-400 font-semibold text-xs italic"
                        >
                          No traffic records currently available.
                        </td>
                      </tr>
                    ) : (
                      visits
                        .filter((v) =>
                          (v.ip_address || "")
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                        )
                        .slice()
                        .reverse()
                        .map((visit) => (
                          <VisitRow key={visit.id} visit={visit} />
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Case File Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm text-slate-900">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_4px_#2563eb]"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Case Record: {selectedRequest.id.split("-")[0]}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 font-bold transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Respondent Full Name
                  </span>
                  <p className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedRequest.name}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Submission Status
                  </span>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedRequest.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                    Order Ref
                  </span>
                  <p className="text-sm font-mono text-blue-700 font-bold">
                    {selectedRequest.court_order_number}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                    Scheduled Date
                  </span>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(selectedRequest.court_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                    Submitted At
                  </span>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(selectedRequest.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Official Statement / Explanation
                </span>
                <div className="bg-blue-50/30 border border-blue-100 p-6 rounded-xl text-slate-700 text-sm leading-relaxed font-medium italic">
                  &quot;{selectedRequest.explanation_text}&quot;
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Contact Verification
                  </span>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Users size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          Primary Contact
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          {selectedRequest.phone_primary}
                        </p>
                      </div>
                    </div>
                    {selectedRequest.phone_secondary && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Users size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Secondary Contact
                          </p>
                          <p className="text-xs font-bold text-slate-700">
                            {selectedRequest.phone_secondary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedRequest.location && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Geographical Evidence
                    </span>
                    <a
                      href={selectedRequest.location.maps_url}
                      target="_blank"
                      className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all group"
                    >
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase">
                          Verify Location Map
                        </p>
                        <p className="text-[9px] text-emerald-600 font-medium">
                          Precision:{" "}
                          {selectedRequest.location.accuracy.toFixed(1)} meters
                        </p>
                      </div>
                    </a>

                    {resolvedAddress && (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest block mb-1">
                          Resolved Address
                        </span>
                        <p className="text-xs font-semibold text-slate-600 leading-tight">
                          {resolvedAddress}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Polished Tactical Forensics Section */}
              {selectedRequest.forensics && (
                <div className="space-y-4 pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                      Case Intelligence Report
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">
                      Network Analysis
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 divide-x divide-slate-200">
                      <div className="p-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Service Provider
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          {selectedRequest.forensics.isp || "Unknown"}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Access Method
                        </p>
                        <p className="text-xs font-bold text-slate-800 uppercase">
                          {selectedRequest.forensics.usage_type || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-200">
                      <div className="p-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Connection Identity
                        </p>
                        <p className="text-xs font-mono font-bold text-blue-700">
                          {selectedRequest.ip_address || "Hidden"}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Origin City
                        </p>
                        <p className="text-xs font-bold text-slate-800 uppercase">
                          {selectedRequest.forensics.city_name},{" "}
                          {selectedRequest.forensics.country_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button
                disabled={isUpdating || selectedRequest.status === "Reviewed"}
                onClick={() => updateStatus(selectedRequest.id, "Reviewed")}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all uppercase tracking-widest text-xs"
              >
                {isUpdating
                  ? "Storing Resolution..."
                  : "Mark as Officially Reviewed"}
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-8 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all uppercase text-[10px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
