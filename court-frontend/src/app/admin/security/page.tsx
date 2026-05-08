"use client";
import Link from "next/link";
import AuthorizationGate from "@/components/AuthorizationGate";
import {
  Shield,
  Globe,
  Key,
  HardDrive,
  FileBarChart,
  ShieldCheck,
  Terminal,
  AlertTriangle,
  ChevronRight,
  Activity,
  Lock,
  Radar,
  Eye,
  Code,
  Cpu,
  BookOpen,
} from "lucide-react";

const modules = [
  {
    id: "recon",
    title: "Reconnaissance",
    subtitle: "Nmap · Shodan · OSINT",
    description:
      "Network scanning, asset discovery, subdomain enumeration and OSINT aggregation.",
    icon: <Radar className="w-7 h-7" />,
    color: "from-blue-600 to-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-700",
    href: "/admin/security/recon",
    badge: "NETWORK",
  },
  {
    id: "vulns",
    title: "Vulnerability Assessment",
    subtitle: "CVSS · OpenVAS · Nikto",
    description:
      "Vulnerability tracking with severity scoring, remediation workflows, and compliance.",
    icon: <ShieldCheck className="w-7 h-7" />,
    color: "from-rose-600 to-rose-800",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconColor: "text-rose-700",
    href: "/admin/security/vulns",
    badge: "VULNERABILITY",
  },
  {
    id: "websec",
    title: "Web Security Testing",
    subtitle: "OWASP ZAP · API Testing",
    description:
      "Automated web scanning, API request builder, and OWASP Top 10 test workflows.",
    icon: <Globe className="w-7 h-7" />,
    color: "from-orange-600 to-orange-800",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconColor: "text-orange-700",
    href: "/admin/security/websec",
    badge: "WEB",
  },
  {
    id: "network",
    title: "Network Analysis",
    subtitle: "Wireshark · tcpdump · WiFi",
    description:
      "Traffic analysis, protocol breakdown, WiFi node scanning, and anomaly detection.",
    icon: <Activity className="w-7 h-7" />,
    color: "from-emerald-600 to-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-700",
    href: "/admin/security/network",
    badge: "NETWORK",
  },
  {
    id: "password",
    title: "Password Security",
    subtitle: "Hashcat · John · Policy Audit",
    description:
      "Password strength assessment, policy audit, and authorized cracking command templates.",
    icon: <Key className="w-7 h-7" />,
    color: "from-purple-600 to-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconColor: "text-purple-700",
    href: "/admin/security/password",
    badge: "CREDENTIAL",
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    subtitle: "Autopsy · Volatility · FTK",
    description:
      "Disk analysis, memory forensics, artifact extraction, and evidence timeline viewer.",
    icon: <HardDrive className="w-7 h-7" />,
    color: "from-slate-600 to-slate-800",
    bg: "bg-slate-50",
    border: "border-slate-200",
    iconColor: "text-slate-700",
    href: "/admin/security/forensics",
    badge: "FORENSICS",
  },
  {
    id: "reversing",
    title: "Reverse Engineering",
    subtitle: "Ghidra · x64dbg · Cutter",
    description:
      "Binary analysis, malware sandboxing, and static/dynamic reverse engineering workflows.",
    icon: <Code className="w-7 h-7" />,
    color: "from-pink-600 to-pink-800",
    bg: "bg-pink-50",
    border: "border-pink-200",
    iconColor: "text-pink-700",
    href: "/admin/security/reversing",
    badge: "MALWARE",
  },
  {
    id: "reports",
    title: "Reports & Compliance",
    subtitle: "PCI DSS · GDPR · ISO 27001",
    description:
      "Generate executive reports, run compliance checklists, and track remediation trends.",
    icon: <FileBarChart className="w-7 h-7" />,
    color: "from-teal-600 to-teal-800",
    bg: "bg-teal-50",
    border: "border-teal-200",
    iconColor: "text-teal-700",
    href: "/admin/security/reports",
    badge: "COMPLIANCE",
  },
  {
    id: "kb",
    title: "Knowledge Base",
    subtitle: "Defensive Research · KB",
    description:
      "Educational resources on WiFi security protocols, defensive monitoring, and authorized audit flows.",
    icon: <BookOpen className="w-7 h-7" />,
    color: "from-blue-600 to-indigo-800",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    iconColor: "text-indigo-700",
    href: "/admin/security/kb",
    badge: "RESEARCH",
  },
];

const stats = [
  { label: "Modules Active", value: "9", icon: <Cpu className="w-4 h-4" /> },
  {
    label: "Authorization Protocol",
    value: "MFA",
    icon: <Lock className="w-4 h-4" />,
  },
  { label: "Audit Logging", value: "ON", icon: <Eye className="w-4 h-4" /> },
  {
    label: "Encryption",
    value: "AES-256",
    icon: <Shield className="w-4 h-4" />,
  },
];

export default function SecurityHubPage() {
  return (
    <AuthorizationGate toolName="CSEU Security Assessment Hub">
      <div className="p-4 md:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-700 rounded-xl shadow-lg shadow-blue-200">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Security Assessment Hub
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Cybersecurity Assessment Control Interface (CSEU) — Authorized
                Personnel Only
              </p>
            </div>
          </div>
        </div>

        {/* Legal Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-0.5">
              Legal Notice — Openbird Cyber Security Enginnering CSEU
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              All security tools on this platform are for{" "}
              <strong>
                authorized forensic investigation and penetration testing only
              </strong>
              . Actions are logged under Computer Crimes Act No. 24 of 2007.
              Unauthorized use will be prosecuted.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Security Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {modules.map((mod) => (
              <Link key={mod.id} href={mod.href} className="group block">
                <div
                  className={`h-full bg-white border ${mod.border} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${mod.color}`}
                  />
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 ${mod.bg} rounded-xl ${mod.iconColor}`}
                      >
                        {mod.icon}
                      </div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-full">
                        {mod.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {mod.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {mod.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${mod.iconColor} group-hover:gap-2 transition-all`}
                    >
                      Launch Tool <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
