"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import { 
  Wifi, 
  Signal, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  Target, 
  Activity, 
  RefreshCcw, 
  Server,
  Zap,
  Globe,
  MapPin,
  Cpu
} from "lucide-react";

export default function WirelessIntelligence() {
  const [networks, setNetworks] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(true);

  const performScan = async () => {
    setScanning(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/recon/wifi-scan`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      const data = await response.json();
      setNetworks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setScanning(false), 800);
    }
  };

  useEffect(() => {
    performScan();
    let interval: any;
    if (autoScan) {
      interval = setInterval(performScan, 15000);
    }
    return () => clearInterval(interval);
  }, [autoScan]);

  return (
    <div className="p-8 lg:p-12 space-y-10 font-sans">
      {/* Visual Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700/5 border border-blue-700/10 rounded-xl flex items-center justify-center">
              <Signal className={`w-6 h-6 text-blue-700 ${scanning ? 'animate-pulse' : ''}`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Wireless Signal Intelligence (WSI)</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Near-Field Frequency Analysis & Authorized Node Bridging</p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-8 px-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Scan Mode</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${autoScan ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{autoScan ? 'Adaptive Interval' : 'Manual Lock'}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sensitivity Range</p>
              <p className="text-[11px] font-bold text-slate-700 mt-1 uppercase tracking-tight">Standard (2.4/5GHz)</p>
            </div>
          </div>
          <button 
            onClick={performScan}
            disabled={scanning}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white p-3 rounded-lg transition-all shadow-md shadow-blue-100"
          >
            <RefreshCcw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
        {/* Main Scanner Matrix */}
        <div className="2xl:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Zap className="w-4 h-4 text-blue-700" /> Detected Wireless Vectors
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 border border-slate-100 rounded tracking-widest">NODES: {networks.length}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Source / SSID</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network ID (BSSID)</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strength</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cryptographic Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {networks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm font-medium italic">
                        Initializing environmental signal acquisition...
                      </td>
                    </tr>
                  ) : networks.map((net, i) => (
                    <tr key={i} className="group hover:bg-slate-50/70 transition-all border-l-2 border-transparent hover:border-blue-600">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-mono font-bold text-xs ${
                            net.security?.includes("Enterprise") || net.security?.includes("802.1x") 
                            ? 'bg-blue-50 text-blue-700 border-blue-100 outline outline-1 outline-blue-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {net.ssid?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{net.ssid}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Channel {net.channel || 'Auto'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {net.bssid || 'UNKNOWN_VECTOR'}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5 items-end h-3">
                            <div className="w-1 bg-blue-200 h-[30%]"></div>
                            <div className={`w-1 ${parseInt(net.signal) > 40 ? 'bg-blue-600' : 'bg-blue-200'} h-[50%]`}></div>
                            <div className={`w-1 ${parseInt(net.signal) > 70 ? 'bg-blue-600' : 'bg-blue-200'} h-[75%]`}></div>
                            <div className={`w-1 ${parseInt(net.signal) > 90 ? 'bg-blue-600' : 'bg-blue-200'} h-[100%]`}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{net.signal}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {net.security?.includes("WPA") || net.security?.includes("AES") ? (
                            <Lock size={12} className="text-emerald-500" />
                          ) : (
                            <Unlock size={12} className="text-rose-500" />
                          )}
                          <span className="text-[11px] font-bold text-slate-600">{net.security}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="px-4 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[10px] font-bold text-slate-500 hover:text-blue-700 uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95">
                          Audit Node
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#1a1c24] text-white p-8 rounded-2xl space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wifi className="w-48 h-48 text-blue-500" />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Node Triangulation
              </h3>
              <p className="text-[11px] font-medium text-slate-300 leading-relaxed uppercase">
                Performing geospatial fusion on detected MAC addresses across local gateways. Triangulation confidence: <span className="text-blue-400 font-bold">88.4%</span>
              </p>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter">
                  <span className="text-slate-400">Atmospheric Interference</span>
                  <span className="text-rose-400">12%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[12%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-8 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Authorized Attach
            </h3>
            <div className="space-y-4">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Administrative node bridging is currently in <span className="text-blue-700 font-bold">STANDBY</span>. Enter a warrant-backed credential set to initiate authorized attachment.
              </p>
              <div className="space-y-3">
                <input 
                  type="password" 
                  placeholder="AUTHORIZATION_KEY" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-emerald-400 transition-all shadow-inner"
                />
                <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">
                  Request Secure Bridge
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center gap-4 text-blue-700">
               <Cpu className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-wider">Hardware Matrix</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Host Adapter</span>
                  <span className="text-blue-700">Intel(R) Wi-Fi 6 AX201</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold border-t border-blue-100 pt-2 mt-2">
                  <span className="text-slate-500">Monitor Mode</span>
                  <span className="text-rose-600">UNSUPPORTED</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Signal Pulse */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${scanning ? 'opacity-5' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
      </div>
    </div>
  );
}
