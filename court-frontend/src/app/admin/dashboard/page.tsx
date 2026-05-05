"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  LogOut,
  RefreshCcw,
  Trash2,
} from "lucide-react";

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

function VisitRow({ visit }: { visit: Visit }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const lat =
      visit.geo_forensics?.precision_gps?.lat || visit.location?.latitude;
    const lon =
      visit.geo_forensics?.precision_gps?.lon || visit.location?.longitude;

    if (lat && lon) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      )
        .then((res) => res.json())
        .then((data) => setAddress(data.display_name))
        .catch(() => {});
    }
  }, [visit.location, visit.geo_forensics]);

  return (
    <tr className="hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-300">
            {new Date(visit.timestamp).toLocaleTimeString()}
          </span>
          <span className="text-[9px] text-slate-600 font-bold uppercase">
            {new Date(visit.timestamp).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-rose-500" />
          <span className="text-xs font-mono font-bold text-white tracking-tight">
            {visit.ip_address}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        {address ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                GPS Verified
              </span>
            </div>
            <p className="text-[10px] font-bold text-white leading-tight">
              {address}
            </p>
          </div>
        ) : visit.geo_forensics?.precision_gps || visit.location ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                Precision Uplink
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 leading-tight italic">
              {visit.geo_forensics?.precision_gps?.lat?.toFixed(5)},{" "}
              {visit.geo_forensics?.precision_gps?.lon?.toFixed(5)}
            </p>
          </div>
        ) : visit.geo_forensics?.ip_based || visit.forensics ? (
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-200">
              {visit.geo_forensics?.ip_based?.city ||
                visit.forensics?.city_name ||
                "Unknown City"}
              {", "}
              {visit.geo_forensics?.ip_based?.region ||
                visit.forensics?.region_name ||
                ""}
            </p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
              {visit.geo_forensics?.ip_based?.country ||
                visit.forensics?.country_name}
            </p>
          </div>
        ) : (
          <span className="text-[10px] text-slate-600 italic animate-pulse">
            Geo-Trace Failed
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-bold text-sky-400 bg-sky-400/5 px-2 py-1 rounded border border-sky-400/10">
          {visit.external_identity?.isp ||
            visit.forensics?.isp ||
            visit.forensics?.as ||
            "Internal / Unknown"}
        </span>
      </td>
      <td className="px-6 py-4">
        <p
          className="text-[9px] text-slate-500 font-medium truncate max-w-[150px]"
          title={visit.user_agent}
        >
          {visit.user_agent}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        {visit.geo_forensics?.precision_gps?.lat ? (
          <a
            href={`https://www.google.com/maps?q=${visit.geo_forensics.precision_gps.lat},${visit.geo_forensics.precision_gps.lon}`}
            target="_blank"
            className="inline-flex p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all border border-emerald-500/20"
            title="High-Precision GPS Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : visit.location?.latitude ? (
          <a
            href={`https://www.google.com/maps?q=${visit.location.latitude},${visit.location.longitude}`}
            target="_blank"
            className="inline-flex p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all border border-emerald-500/20"
            title="High-Precision GPS Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : visit.geo_forensics?.ip_based?.latitude ||
          visit.forensics?.latitude ? (
          <a
            href={`https://www.google.com/maps?q=${visit.geo_forensics?.ip_based?.latitude || visit.forensics?.latitude},${visit.geo_forensics?.ip_based?.longitude || visit.forensics?.longitude}`}
            target="_blank"
            className="inline-flex p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all border border-rose-500/20"
            title="City-Level IP Trace"
          >
            <MapPin className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-[10px] text-slate-700 font-bold uppercase tracking-tighter opacity-40">
            N/A Trace
          </span>
        )}
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "visits">("requests");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/admin/requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
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
      const response = await fetch(
        "http://localhost:8000/api/v1/admin/visits",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
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

  useEffect(() => {
    if (activeTab === "requests") fetchRequests();
    else fetchVisits();
  }, [activeTab, fetchRequests, fetchVisits]);

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
        `http://localhost:8000/api/v1/admin/requests/${id}/status`,
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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Top Sidebar / Header */}
      <nav className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500/20 p-2 rounded-lg border border-sky-500/30">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-widest uppercase text-white">
                CCID Legal Registry
              </h1>
              <p className="text-[10px] text-sky-500/60 font-bold uppercase tracking-tighter">
                Administrative Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400">
              <Clock className="w-3 h-3 text-sky-500" />
              {mounted && new Date().toLocaleDateString()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10">
        {/* Stats & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-400">
                    {activeTab === "requests"
                      ? "Total Submissions"
                      : "Total Visitors"}
                  </span>
                  <span className="text-3xl font-black text-white">
                    {activeTab === "requests"
                      ? Array.isArray(requests)
                        ? requests.length
                        : 0
                      : Array.isArray(visits)
                        ? visits.length
                        : 0}
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 w-[60%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                Operations
              </h3>
              <div className="space-y-2">
                <button
                  onClick={
                    activeTab === "requests" ? fetchRequests : fetchVisits
                  }
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-sm font-bold transition-all"
                >
                  Refresh {activeTab === "requests" ? "Submissions" : "Traffic"}{" "}
                  <RefreshCcw className="w-4 h-4 text-sky-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-sm font-bold transition-all">
                  Clear Audit Logs <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Tab Switcher */}
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 w-fit">
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "requests" ? "bg-sky-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
              >
                Court Submissions
              </button>
              <button
                onClick={() => setActiveTab("visits")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "visits" ? "bg-rose-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
              >
                Visitor Intelligence
              </button>
            </div>

            {activeTab === "requests" ? (
              <>
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by name or order number..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["All", "Pending", "Reviewed", "Archived"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                          filter === f
                            ? "bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20"
                            : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Submissions */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-[#0f172a] text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Submission Date</th>
                        <th className="px-6 py-4">Respondent</th>
                        <th className="px-6 py-4">Order Ref</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-20 text-center text-slate-500 animate-pulse font-black uppercase text-[10px]"
                          >
                            Scanning Encrypted Database...
                          </td>
                        </tr>
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-20 text-center text-slate-500 font-bold uppercase text-[10px]"
                          >
                            No matching submissions found
                          </td>
                        </tr>
                      ) : (
                        filteredRequests
                          .slice()
                          .reverse()
                          .map((req) => (
                            <tr
                              key={req.id}
                              className="hover:bg-slate-800/30 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-300">
                                    {new Date(
                                      req.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-[10px] text-slate-500 tracking-tighter">
                                    {new Date(
                                      req.created_at,
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-bold text-white uppercase tracking-tight">
                                  {req.name}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <code className="bg-slate-800 px-2 py-1 rounded text-sky-400 text-[10px] font-black uppercase">
                                  {req.court_order_number}
                                </code>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    req.status === "Pending"
                                      ? "bg-amber-500/10 text-amber-500"
                                      : "bg-sky-500/10 text-sky-500"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full ${req.status === "Pending" ? "bg-amber-500" : "bg-sky-500"}`}
                                  ></span>
                                  {req.status}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setSelectedRequest(req)}
                                  className="p-2 hover:bg-sky-500/20 rounded-lg transition-all group-hover:scale-110 active:scale-95"
                                >
                                  <ChevronRight className="w-4 h-4 text-sky-500" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Visitor Intelligence Table */
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center text-sans">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                    Live Visitor Forensic Stream
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      Real-time Monitoring
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-800/20">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Timestamp
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          IP Forensics
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Geo-Location
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Carrier / ISP
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          System
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                          Trace
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {visits.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-20 text-center text-slate-500 font-bold italic"
                          >
                            No forensic traffic logged yet.
                          </td>
                        </tr>
                      ) : (
                        visits
                          .filter((v) =>
                            v.ip_address
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
      </main>

      <footer className="max-w-[1600px] mx-auto p-10 border-t border-slate-800 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Secure Clearance Level 4 Required | © 2026 CCID CYBER COMMAND
          </p>
          <div className="flex gap-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Global Link Uplink Online
            </span>
          </div>
        </div>
      </footer>

      {/* Request Detail Modal overlay */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-slate-200">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">
                  File Detail: {selectedRequest.id.split("-")[0]}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-500 hover:text-white font-bold"
              >
                ESC
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Respondent Name
                  </span>
                  <p className="text-xl font-bold text-white uppercase">
                    {selectedRequest.name}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Status
                  </span>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        selectedRequest.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-sky-500/10 text-sky-500"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-1">
                    Order Ref
                  </span>
                  <p className="text-sm font-mono text-sky-400 font-bold">
                    {selectedRequest.court_order_number}
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-1">
                    Original Date
                  </span>
                  <p className="text-sm font-bold text-slate-300">
                    {new Date(selectedRequest.court_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-1">
                    Submission Time
                  </span>
                  <p className="text-sm font-bold text-slate-300">
                    {new Date(selectedRequest.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">
                  Legal Explanation Details
                </span>
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-slate-300 text-sm leading-relaxed italic">
                  &quot;{selectedRequest.explanation_text}&quot;
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">
                    Contact & Verification
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-bold w-12">
                        Primary:
                      </span>
                      <span className="text-slate-300 font-mono underline">
                        {selectedRequest.phone_primary}
                      </span>
                    </div>
                    {selectedRequest.phone_secondary && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-bold w-12">
                          Sec:
                        </span>
                        <span className="text-slate-300 font-mono">
                          {selectedRequest.phone_secondary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedRequest.location && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">
                      Geolocation Data
                    </span>
                    <a
                      href={selectedRequest.location.maps_url}
                      target="_blank"
                      className="flex items-center gap-3 p-3 bg-sky-500/5 border border-sky-500/20 rounded-xl hover:bg-sky-500/10 transition-colors group"
                    >
                      <MapPin className="w-5 h-5 text-sky-500" />
                      <div>
                        <p className="text-[10px] font-black text-sky-400 uppercase">
                          View on Digital Map
                        </p>
                        <p className="text-[9px] text-slate-500">
                          Accuracy:{" "}
                          {selectedRequest.location.accuracy.toFixed(1)}m
                        </p>
                      </div>
                    </a>

                    {resolvedAddress && (
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">
                          Resolved Street Address
                        </span>
                        <p className="text-xs font-bold text-slate-100 leading-relaxed italic">
                          {resolvedAddress}
                        </p>
                      </div>
                    )}

                    <div className="h-32 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://maps.google.com/maps?q=${selectedRequest.location.latitude},${selectedRequest.location.longitude}&z=14&output=embed`}
                        className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              {/* Forensic Section */}
              <div className="space-y-4 pt-6 border-t border-slate-800/50">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">
                  Police Forensic Metadata
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        Source IP Address
                      </p>
                      <p className="text-xs font-mono text-white font-bold">
                        {selectedRequest.ip_address || "NOT LOGGED"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center">
                      <Search className="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        System Fingerprint
                      </p>
                      <p className="text-[9px] text-slate-300 font-medium truncate max-w-[200px]">
                        {selectedRequest.user_agent || "NOT CAPTURED"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Forensic Intelligence Section */}
              {selectedRequest.forensics && (
                <div className="space-y-4 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">
                      Advanced Forensic Intelligence Report
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      Provided by IP2Location Intelligence
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Network & Carrier Analysis
                      </p>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[8px] font-bold text-emerald-500 uppercase">
                          Live Trace Active
                        </span>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-10">
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          ISP / Provider
                        </p>
                        <p className="text-sm font-bold text-sky-400">
                          {selectedRequest.forensics.isp || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          Network Type
                        </p>
                        <p className="text-sm font-bold text-white uppercase">
                          {selectedRequest.forensics.usage_type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          Carrier Brand
                        </p>
                        <p className="text-sm font-bold text-white uppercase">
                          {selectedRequest.forensics.mobile_brand ||
                            "Broadband/Static"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          Regional Intelligence
                        </p>
                        <p className="text-sm font-bold text-white uppercase">
                          {selectedRequest.forensics.city_name},{" "}
                          {selectedRequest.forensics.country_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          Elevation / MSL
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          {selectedRequest.forensics?.elevation || 0} meters
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Lateral
                          Network Nodes
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedRequest.forensics?.internal_nodes?.length >
                          0 ? (
                            selectedRequest.forensics.internal_nodes.map(
                              (node: string) => (
                                <span
                                  key={node}
                                  className="text-[9px] font-mono bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20"
                                >
                                  {node}
                                </span>
                              ),
                            )
                          ) : (
                            <p className="text-[9px] text-slate-600 italic">
                              No nodes detected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex gap-4">
              <button
                disabled={isUpdating || selectedRequest.status === "Reviewed"}
                onClick={() => updateStatus(selectedRequest.id, "Reviewed")}
                className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white font-black py-4 rounded-2xl shadow-xl shadow-sky-900/20 transition-all uppercase tracking-widest text-xs"
              >
                {isUpdating ? "Processing..." : "Mark as Reviewed"}
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-8 border border-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 transition-colors uppercase text-[10px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
