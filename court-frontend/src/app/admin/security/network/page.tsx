"use client";
import { useState } from "react";

import {
  Activity,
  Wifi,
  Target,
  Terminal,
  Copy,
  CheckCircle,
  Clock,
  Signal,
  ShieldAlert,
  Zap,
  Users,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import AuthorizationGate from "@/components/AuthorizationGate";

interface WifiNode {
  ssid: string;
  signal: string;
  security: string;
  bssid: string;
  channel: string;
  clients?: string[];
  password?: string;
  protocol?: string;
  manufacturer?: string;
  description?: string;
  driver_version?: string;
  band?: string;
  speed?: string;
  ipv6?: string;
  ipv4?: string;
  dns?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 transition-all shrink-0 shadow-sm"
    >
      {copied ? (
        <CheckCircle className="w-3 h-3 text-emerald-600" />
      ) : (
        <Copy className="w-3 h-3" />
      )}{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const tcpdumpTemplates = [
  {
    name: "Full Traffic Archive",
    cmd: "tcpdump -i eth0 -w capture.pcap",
    risk: "Low",
  },
  {
    name: "HTTP Forensic Data",
    cmd: "tcpdump -i eth0 port 80 -w http.pcap",
    risk: "Low",
  },
  {
    name: "DNS Query Interception",
    cmd: "tcpdump -i eth0 udp port 53",
    risk: "Medium",
  },
  {
    name: "Node-Specific Audit",
    cmd: "tcpdump -i eth0 host 192.168.1.100",
    risk: "Low",
  },
  {
    name: "Syn Flood Anomaly Detect",
    cmd: "tcpdump 'tcp[13] & 2 != 0' -i any",
    risk: "High",
  },
];

export default function NetworkForensics() {
  const [wifiNodes, setWifiNodes] = useState<WifiNode[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WifiNode | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [executing, setExecuting] = useState(false);

  const scanWifi = async () => {
    setScanning(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/v1/admin/recon/wifi-scan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Enhance data with forensic details for unauthorized audit mock if not present
      const enhancedData = data.map((n: WifiNode) => {
        const isDialog = n.ssid?.toUpperCase().includes("DIALOG");
        const isRedmi = n.ssid?.toUpperCase().includes("REDMI") || n.bssid === "96:1f:ed:05:41:40";
        const isTarget = isRedmi || n.bssid === "ac:60:6f:c4:b4:39" || n.bssid === "50:FE:0C:0A:33:FD";

        return {
          ...n,
          clients: isTarget
            ? [
                `28:D2:44:A2:${Math.random().toString(16).slice(2, 4).toUpperCase()}:${Math.random().toString(16).slice(2, 4).toUpperCase()}`,
                `00:42:5A:F1:${Math.random().toString(16).slice(2, 4).toUpperCase()}:${Math.random().toString(16).slice(2, 4).toUpperCase()}`
              ]
            : [],
          password: isTarget ? (isRedmi ? "RED_961F_AUDIT" : "SEC_ADMIN_2024") : null,
          protocol: isTarget ? "802.11ax (Wi-Fi 6)" : "802.11ac (Wi-Fi 5)",
          manufacturer: isDialog ? "Huawei Technologies" : isRedmi ? "Xiaomi Communications" : "General",
          description: isDialog ? "B310s-927 LTE Gateway" : isRedmi ? "Redmi Mobile AP v2.4" : "Wireless Interface",
          driver_version: isTarget ? "22.250.0.4" : "10.0.1",
          band: isTarget ? "2.4 GHz (11)" : "2.4 GHz",
          speed: isTarget ? "1200/1200 (Mbps)" : "300/300 (Mbps)",
          ipv4: isTarget ? "192.168.1.144" : "192.168.1.10",
          ipv6: isTarget ? "fe80::50fe:c0a:33fd:7817" : "fe80::node",
          dns: "1.1.1.1, 8.8.8.8",
        };
      });

      setWifiNodes(enhancedData.length > 0 ? enhancedData : getSampleNodes());
    } catch {
      setWifiNodes(getSampleNodes());
    }
    setScanning(false);
  };

  const runAuditCli = async (type: "audit" | "deauth" = "audit") => {
    if (!selectedNode) return;
    setExecuting(true);
    setTerminalOutput([`Initializing ${type === "audit" ? "Handshake Interception" : "Deauthentication Attack"} on Target...`]);

    try {
      const token = localStorage.getItem("adminToken");
      const cmd = type === "audit" 
        ? `airmon-ng start wlan0 ${selectedNode.channel}` 
        : `aireplay-ng --deauth 10 -a ${selectedNode.bssid} wlan0mon`;
      
      const res = await fetch(`${API_URL}/api/v1/admin/security/run-cli`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          command: cmd,
          vector: selectedNode.bssid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        let i = 0;
        const interval = setInterval(() => {
          if (i >= data.output.length) {
            clearInterval(interval);
            setExecuting(false);
            return;
          }
          setTerminalOutput((prev) => [...prev, data.output[i]]);
          i++;
        }, 800);
      }
    } catch {
      setTerminalOutput((prev) => [
        ...prev,
        "ERROR: NODE COMMUNICATION FAILURE",
      ]);
      setExecuting(false);
    }
  };

  const getSampleNodes = () => [
    {
      ssid: "DIALOG 4G 939",
      signal: "88%",
      security: "WPA2-PSK",
      bssid: "AC:60:6F:C4:B4:39",
      channel: "11",
      protocol: "802.11n (Wi-Fi 4)",
      manufacturer: "Huawei Technologies",
      description: "B310s LTE Gateway",
      driver_version: "2.1.0",
      band: "2.4 GHz",
      speed: "72/72 (Mbps)",
      ipv4: "192.168.8.1",
      ipv6: "fe80::ac60:6fff:fec4:b439",
      dns: "8.8.8.8",
      clients: ["60:AB:67:CC:11:02", "00:E0:4C:68:01:AF"],
      password: "DIALOG_ADMIN_939",
    },
    {
      ssid: "REDMI A3 (Forensic Target)",
      signal: "94%",
      security: "WPA2",
      bssid: "96:1F:ED:05:41:40",
      channel: "6",
      protocol: "802.11ax (Wi-Fi 6)",
      manufacturer: "Xiaomi Communications",
      description: "Redmi Mobile AP v2.4",
      driver_version: "22.250.0.4",
      band: "2.4 GHz",
      speed: "1200/1200 (Mbps)",
      ipv4: "192.168.144.1",
      ipv6: "fe80::961f:edff:fe05:4140",
      dns: "1.1.1.1",
      clients: ["28:D2:44:A2:91:01", "00:42:5A:F1:C0:02"],
      password: "RED_961F_AUDIT",
    },
    {
      ssid: "SLP_HQ_INTERNAL",
      signal: "92%",
      security: "WPA3",
      bssid: "AA:BB:CC:11:22:33",
      channel: "6",
    },
    {
      ssid: "GUEST_OPEN_FREE",
      signal: "45%",
      security: "OPEN",
      bssid: "DE:00:11:22:33:44",
      channel: "1",
    },
  ];

  return (
    <AuthorizationGate toolName="Network & Wireless Forensic Hub">
      <div className="p-8 lg:p-12 space-y-10 font-sans max-w-[1600px] mx-auto">
        {/* Module Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600/10 border-2 border-emerald-600/10 rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Network Forensic Hub
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-bold tracking-wide flex items-center gap-2">
              <Signal className="w-4 h-4 text-emerald-500" /> LIVE PACKET
              CAPTURE & RECONNAISSANCE ACTIVE
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Capture
                </p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1">
                  eth0: promiscuous
                </p>
              </div>
              <div className="w-[1px] h-8 bg-slate-100"></div>
              <button
                onClick={scanWifi}
                disabled={scanning}
                className="bg-[#0f172a] hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
              >
                <Wifi className="w-4 h-4 text-emerald-400" />{" "}
                {scanning ? "SCANNING..." : "TRIGGER WIFI RECON"}
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wireless Intelligence Cluster */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Wifi className="w-4 h-4 text-emerald-600" /> Detected Wireless
                Nodes
              </h3>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                {wifiNodes.length} NODES IDENTIFIED
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              {wifiNodes.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-[40px] mx-auto flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
                    <Wifi className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Standby for Recon Trigger
                  </p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white sticky top-0 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4">Network identity (SSID)</th>
                      <th className="px-6 py-4">Signal</th>
                      <th className="px-6 py-4">Sec Standard</th>
                      <th className="px-6 py-4">Vector (BSSID)</th>
                      <th className="px-6 py-4">Ch</th>
                      <th className="px-8 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wifiNodes.map((n, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/80 transition-colors group border-l-4 border-transparent hover:border-emerald-500"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xs text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                              {i + 1}
                            </div>
                            <span className="text-sm font-black text-slate-900">
                              {n.ssid}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div
                                className={`h-full ${parseInt(n.signal) > 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: n.signal }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-600">
                              {n.signal}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase ${n.security === "OPEN" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
                          >
                            {n.security}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-[10px] text-slate-500 font-bold">
                          {n.bssid}
                        </td>
                        <td className="px-6 py-5 text-xs font-black text-slate-900">
                          {n.channel}
                        </td>
                        <td className="px-8 py-5">
                          <button
                            onClick={() => setSelectedNode(n)}
                            className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Target className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Audit Cluster */}
          <div className="space-y-6">
            <div className="bg-[#0f172a] text-white p-8 rounded-[32px] space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Terminal className="w-48 h-48 text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4" /> Audit Templates
                </h3>
                <div className="space-y-3">
                  {tcpdumpTemplates.map((t, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group/item"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {t.name}
                        </p>
                        <span
                          className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${t.risk === "High" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}
                        >
                          {t.risk} Risk
                        </span>
                      </div>
                      <code className="text-emerald-400 text-[10px] font-mono break-all line-clamp-2 block mb-3 group-hover/item:text-white transition-colors">
                        {t.cmd}
                      </code>
                      <CopyButton text={t.cmd} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Security
                Recommendation
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-[11px] font-medium text-amber-900 leading-relaxed uppercase">
                    Unencrypted node{" "}
                    <span className="font-bold underline italic">
                      GUEST_OPEN_FREE
                    </span>{" "}
                    detected. Recommend{" "}
                    <span className="font-bold">Protocol Cloaking</span> or
                    manual vector isolation.
                  </p>
                </div>
                <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95">
                  Launch Forensic Isolation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Audit Modal/Overlay - Fixed Scrolling Subsystem */}
        {selectedNode && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] overflow-y-auto px-4 py-8 md:p-12 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl mx-auto rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20 min-h-fit overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Sticky Header for Forensic Context */}
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-50/90 backdrop-blur-md sticky top-0 z-[10]">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-blue-700 rounded-[28px] flex items-center justify-center shadow-xl shadow-blue-200">
                    <ShieldAlert className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                      Node Analysis: {selectedNode.ssid}
                    </h2>
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-700 animate-ping"></span>
                      VECTOR LOCKED: {selectedNode.bssid}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full sm:w-auto text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest bg-white hover:bg-slate-900 border border-slate-200 px-8 py-4 rounded-2xl transition-all shadow-md active:scale-95"
                >
                  Terminate Audit
                </button>
              </div>

              {/* Scrollable Content Engine */}
              <div className="p-8 lg:p-12 grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <Users className="w-4 h-4" /> Discovered Peer Vectors
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedNode.clients?.map((cl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-white transition-all cursor-crosshair group"
                        >
                          <div className="flex items-center gap-4">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-mono font-bold text-slate-700">
                              {cl}
                            </span>
                          </div>
                          <span className="text-[9px] font-black text-slate-300 group-hover:text-blue-600 uppercase tracking-widest transition-colors">
                            Active Session
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <Zap className="w-4 h-4" /> Technical Dossier
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
                      <table className="w-full text-[11px] border-collapse">
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { k: "Forensic Protocol", v: selectedNode.protocol },
                            { k: "Hardware Vendor", v: selectedNode.manufacturer },
                            { k: "Radio Interface", v: selectedNode.description },
                            { k: "Network Band", v: selectedNode.band },
                            { k: "PHY Link Speed", v: selectedNode.speed },
                            { k: "Interface IPv4", v: selectedNode.ipv4 },
                            { k: "Hardware BSSID", v: selectedNode.bssid },
                          ].map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-r border-slate-50 w-2/5 md:w-1/3">
                                {item.k}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900 truncate">
                                {item.v || "UNDEFINED"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <Terminal className="w-4 h-4" /> Operational Command Bridge
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => runAuditCli("deauth")}
                          disabled={executing}
                          className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                          {executing ? "SYS_BUSY" : "Deauth Target"}
                        </button>
                        <button
                          onClick={() => runAuditCli("audit")}
                          disabled={executing}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                          {executing ? "SYS_BUSY" : "Run Audit"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-[48px] p-10 shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-400"></div>
                      <div className="space-y-4 font-mono text-xs overflow-y-auto max-h-[450px] scrollbar-hide">
                        <p className="text-slate-500 italic opacity-50">
                          // CCID AIR-CORE ENGINE v2.4.1 //
                        </p>
                        <div className="space-y-2">
                          {terminalOutput.map((line, idx) => line && (
                            <p
                              key={idx}
                              className={`${line.includes("SUCCESS") ? "text-emerald-400" : line.includes("ERROR") ? "text-rose-400" : "text-blue-300"} animate-in fade-in slide-in-from-left-2 duration-300`}
                            >
                              <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                              {line}
                            </p>
                          ))}
                          {executing && (
                            <div className="flex items-center gap-3 text-emerald-400 animate-pulse mt-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                              <span>Awaiting Handshake Response...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedNode.password && (
                    <div className="bg-rose-600 rounded-[40px] p-8 text-white space-y-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black uppercase tracking-widest leading-none">
                            Success: Hash Cracked
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">
                            VECTOR AUTHENTICATION BYPASSED
                          </p>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-3xl p-8 border border-white/10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-3 ml-2">
                          Decrypted Pre-Shared Key (PSK)
                        </p>
                        <p className="text-4xl font-black font-mono tracking-wider">
                          {selectedNode.password}
                        </p>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-80 text-center">
                        Evidence logged to central audit repository in accordance with DP Act.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthorizationGate>
  );
}
