"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import {
  BookOpen,
  ShieldCheck,
  Wifi,
  Activity,
  AlertCircle,
  CheckCircle,
  Copy,
  FileText,
  ChevronRight,
} from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all"
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

const wifiProtocols = [
  {
    name: "WPA3 (Latest)",
    desc: "Uses SAE (Simultaneous Authentication of Equals) for stronger handshake protection.",
    security: "EXCELLENT",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    details:
      "Immune to offline dictionary attacks. Mandatory for modern high-security police infrastructure.",
  },
  {
    name: "WPA2-AES",
    desc: "Standard encryption using CCMP/AES.",
    security: "STRONG",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    details:
      "Secure if strong password is used. Vulnerable to KRACK if not patched.",
  },
  {
    name: "WPA-Enterprise",
    desc: "Uses RADIUS/802.1X for individual user authentication.",
    security: "ENTERPRISE",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    details:
      "Centralized credential management. Best for base-level office deployments.",
  },
  {
    name: "Open WiFi",
    desc: "No encryption or password.",
    security: "DANGEROUS",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    details:
      "Traffic is sent in plain text. Vulnerable to sniffing and MitM attacks. Never use for official duty.",
  },
];

const anomalyTemplates = [
  {
    category: "Traffic Sniffing",
    templates: [
      {
        name: "Detect Unknown MACs",
        cmd: "tcpdump -e -i eth1 | awk '{print $2}' | sort | uniq",
        desc: "Identify devices not on the approved asset inventory.",
      },
      {
        name: "Spot Cleartext Passwords",
        cmd: "tcpdump -i eth0 -A 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)'",
        desc: "Monitor for insecure HTTP POST requests containing credentials.",
      },
    ],
  },
  {
    category: "Rogue Activity",
    templates: [
      {
        name: "Detect ARP Spoofing",
        cmd: "arpwatch -i eth0",
        desc: "Automated monitoring for MAC-to-IP address mapping changes.",
      },
      {
        name: "Monitor Unusual Ports",
        cmd: "tcpdump -i any 'not port 80 and not port 443 and not port 22'",
        desc: "Filter out standard traffic to find command & control (C2) callbacks.",
      },
    ],
  },
];

const auditSteps = [
  {
    title: "Asset Discovery",
    desc: "Run a full Nmap scan to identify all live hosts and their services.",
  },
  {
    title: "Vulnerability Mapping",
    desc: "Compare services against known CVE databases (NIST/NVD).",
  },
  {
    title: "Credential Audit",
    desc: "Test for default or weak credentials on management interfaces (SSH, Web).",
  },
  {
    title: "Policy Validation",
    desc: "Verify if security controls match the organization's hardening guides.",
  },
  {
    title: "Reporting",
    desc: "Document findings with remediation steps (Fix, Workaround, or Risk Acceptance).",
  },
];

export default function KnowledgeHubPage() {
  const [activeTab, setActiveTab] = useState<"wifi" | "anomaly" | "audit">(
    "wifi",
  );

  return (
    <AuthorizationGate toolName="Defensive Knowledge Base & KB">
      <div className="p-4 md:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-700 rounded-2xl shadow-lg shadow-blue-200">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Defensive Knowledge Base
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Educational resources, protocol analysis, and defensive
              methodology
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 w-fit">
          {[
            {
              id: "wifi",
              label: "WiFi Protocols",
              icon: <Wifi className="w-4 h-4" />,
            },
            {
              id: "anomaly",
              label: "Anomaly Detection",
              icon: <Activity className="w-4 h-4" />,
            },
            {
              id: "audit",
              label: "Audit Methodology",
              icon: <FileText className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab === "wifi" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-base font-black text-blue-900 uppercase tracking-wide">
                    Why Wireless Security Matters
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed max-w-3xl">
                    Wireless networks are the primary vector for unauthorized
                    access. Understanding protocols is the first line of
                    defense.
                    <strong> Open WiFi</strong> allows anyone within range to
                    capture your plain-text traffic (names, passwords, cookies).
                    Always ensure <strong>WPA3</strong> or{" "}
                    <strong>WPA2-AES</strong> encryption is enforced on police
                    networks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {wifiProtocols.map((p) => (
                  <div
                    key={p.name}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-black text-slate-900">
                        {p.name}
                      </h4>
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${p.color}`}
                      >
                        {p.security}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {p.desc}
                    </p>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Impact
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {p.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "anomaly" && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <h3 className="text-base font-black text-emerald-900 uppercase tracking-wide mb-2">
                  Network Monitoring for Defense
                </h3>
                <p className="text-sm text-emerald-800">
                  Using <code>tcpdump</code> and <code>Wireshark</code> to
                  identify unauthorized anomalies. Focus on identifying
                  patterns, not just capturing data. These templates are
                  designed for <strong>blue-team forensic monitoring</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {anomalyTemplates.map((cat) => (
                  <div
                    key={cat.category}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-700" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                        {cat.category}
                      </h4>
                    </div>
                    <div className="p-4 space-y-4">
                      {cat.templates.map((t) => (
                        <div key={t.name} className="space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {t.name}
                          </p>
                          <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-3">
                            <code className="text-emerald-400 text-xs font-mono break-all">
                              {t.cmd}
                            </code>
                            <CopyButton text={t.cmd} />
                          </div>
                          <p className="text-[11px] text-slate-400 italic">
                            Target: {t.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8 space-y-8">
              <div className="max-w-3xl">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  Authorized Audit Methodology
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  The systematic approach used by forensic analysts to identify
                  misconfigurations for fix documentation.
                </p>
              </div>

              <div className="relative space-y-12 pl-4">
                {/* Vertical Line */}
                <div className="absolute left-[30px] top-0 bottom-0 w-1 bg-slate-100" />

                {auditSteps.map((step, i) => (
                  <div key={step.title} className="relative flex gap-8 group">
                    <div className="relative z-10 w-10 h-10 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-blue-700 group-hover:text-blue-700 transition-all">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-wide mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">
                    Audit Results Report
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Capture findings using the Reports module for legal
                    documentation.
                  </p>
                </div>
                <button className="bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
                  Generate Audit Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthorizationGate>
  );
}
