"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import {
  Radar,
  Copy,
  CheckCircle,
  Target,
  Globe,
  Network,
  Search,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

const nmapProfiles = [
  {
    name: "Quick Scan",
    cmd: (t: string) => `nmap -T4 -F ${t}`,
    desc: "Fast scan of top 100 ports",
  },
  {
    name: "Service Version",
    cmd: (t: string) => `nmap -sV -sC -T4 ${t}`,
    desc: "Detects service versions and runs default scripts",
  },
  {
    name: "OS Detection",
    cmd: (t: string) => `nmap -O -T4 ${t}`,
    desc: "Attempts to determine the OS of the target",
  },
  {
    name: "Full Port Scan",
    cmd: (t: string) => `nmap -p- -T4 ${t}`,
    desc: "Scans all 65535 ports",
  },
  {
    name: "Stealth SYN Scan",
    cmd: (t: string) => `nmap -sS -T2 --open ${t}`,
    desc: "Low-profile half-open SYN scan",
  },
  {
    name: "UDP Scan",
    cmd: (t: string) => `nmap -sU -T4 --top-ports 100 ${t}`,
    desc: "Scan top 100 UDP ports",
  },
  {
    name: "Aggressive",
    cmd: (t: string) => `nmap -A -T4 ${t}`,
    desc: "OS, version, scripts, traceroute — requires authorization",
  },
  {
    name: "Vuln Scripts",
    cmd: (t: string) => `nmap --script=vuln -T4 ${t}`,
    desc: "Run vulnerability NSE scripts",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all"
    >
      {copied ? (
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-700">{icon}</div>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ReconPage() {
  const [target, setTarget] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(nmapProfiles[0]);
  const [results, setResults] = useState("");
  const [shodanKey, setShodanKey] = useState("");
  const [shodanQuery, setShodanQuery] = useState("");
  const [osintTarget, setOsintTarget] = useState("");
  const [osintType, setOsintType] = useState<"subdomain" | "email" | "domain">(
    "subdomain",
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const osintCommands = {
    subdomain: (t: string) => [
      `amass enum -d ${t}`,
      `subfinder -d ${t}`,
      `assetfinder --subs-only ${t}`,
    ],
    email: (t: string) => [
      `theHarvester -d ${t} -b google`,
      `theHarvester -d ${t} -b linkedin`,
      `theHarvester -d ${t} -b bing`,
    ],
    domain: (t: string) => [
      `whois ${t}`,
      `dig +short ${t} ANY`,
      `dnsx -d ${t} -a -aaaa -ns -mx`,
    ],
  };

  const generatedCmd = target
    ? selectedProfile.cmd(target)
    : selectedProfile.cmd("<target>");

  return (
    <AuthorizationGate toolName="Reconnaissance Module (Nmap · Shodan · OSINT)">
      <div className="p-4 md:p-8 lg:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-700 rounded-xl">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Reconnaissance Module
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Nmap · Shodan · OSINT · Subdomain Enumeration
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold text-amber-700">
            Authorized forensic use only. Commands are generated for execution
            on authorized assessment infrastructure — not executed directly on
            this server.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Nmap Scanner */}
          <SectionCard
            title="Nmap Network Scanner"
            icon={<Network className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Target IP / CIDR / Hostname
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 192.168.1.0/24 or target.example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono"
                />
              </div>

              {/* Scan Profile Picker */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Scan Profile
                </label>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 hover:border-blue-300 transition-all"
                >
                  <span>{selectedProfile.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                  />
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden">
                    {nmapProfiles.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setSelectedProfile(p);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex flex-col items-start px-4 py-3 hover:bg-blue-50 text-left transition-all ${selectedProfile.name === p.name ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}
                      >
                        <span className="text-xs font-bold">{p.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {p.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Generated Command */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Generated Command
                </label>
                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-3">
                  <code className="text-emerald-400 text-xs font-mono break-all">
                    {generatedCmd}
                  </code>
                  <CopyButton text={generatedCmd} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  {selectedProfile.desc}
                </p>
              </div>

              {/* Results */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Paste Scan Results
                </label>
                <textarea
                  rows={8}
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Paste your nmap output here for documentation..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-emerald-400 text-xs font-mono outline-none resize-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </SectionCard>

          {/* OSINT Panel */}
          <SectionCard
            title="OSINT Aggregation"
            icon={<Search className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Target Domain
                </label>
                <input
                  type="text"
                  value={osintTarget}
                  onChange={(e) => setOsintTarget(e.target.value)}
                  placeholder="e.g. example.gov.lk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Recon Type
                </label>
                <div className="flex gap-2">
                  {(["subdomain", "email", "domain"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOsintType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${osintType === t ? "bg-blue-700 border-blue-700 text-white" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                  Command Templates
                </label>
                {osintCommands[osintType](osintTarget || "<domain>").map(
                  (cmd, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <code className="text-emerald-400 text-xs font-mono break-all">
                        {cmd}
                      </code>
                      <CopyButton text={cmd} />
                    </div>
                  ),
                )}
              </div>
            </div>
          </SectionCard>

          {/* Shodan Integration */}
          <SectionCard
            title="Shodan Asset Discovery"
            icon={<Globe className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Shodan API Key
                </label>
                <input
                  type="password"
                  value={shodanKey}
                  onChange={(e) => setShodanKey(e.target.value)}
                  placeholder="Enter your Shodan API Key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Search Query
                </label>
                <input
                  type="text"
                  value={shodanQuery}
                  onChange={(e) => setShodanQuery(e.target.value)}
                  placeholder='e.g. country:LK org:"Sri Lanka Telecom"'
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono"
                />
              </div>
              <div className="bg-slate-900 rounded-xl p-4">
                <code className="text-emerald-400 text-xs font-mono">
                  shodan search --fields ip_str,port,org,country_name "
                  {shodanQuery || "<query>"}"
                </code>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Quick Dork Templates
                </label>
                <div className="space-y-1.5">
                  {[
                    "port:22 country:LK",
                    'org:"Dialog" port:23',
                    "ssl.cert.subject.CN:*.gov.lk",
                    'http.title:"camera" country:LK',
                  ].map((d) => (
                    <button
                      key={d}
                      onClick={() => setShodanQuery(d)}
                      className="w-full text-left px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Risk Summary */}
          <SectionCard
            title="Asset Risk Scoring"
            icon={<Target className="w-4 h-4" />}
          >
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Paste Nmap/Shodan results to auto-score exposed assets. Risk
                bands: Critical (0-400 ports) → High → Medium → Low.
              </p>
              {[
                {
                  label: "Open Ports Detected",
                  value: results ? results.match(/open/g)?.length || 0 : "-",
                  risk: "HIGH",
                  color: "text-rose-700 bg-rose-50 border-rose-200",
                },
                {
                  label: "Scan Profile",
                  value: selectedProfile.name,
                  risk: "INFO",
                  color: "text-blue-700 bg-blue-50 border-blue-200",
                },
                {
                  label: "Target Assets",
                  value: target || "Not set",
                  risk: "INFO",
                  color: "text-slate-600 bg-slate-50 border-slate-200",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between p-3 rounded-xl border bg-slate-50"
                >
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {s.label}
                    </p>
                    <p className="text-sm font-black text-slate-900 mt-0.5 font-mono">
                      {String(s.value)}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${s.color}`}
                  >
                    {s.risk}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AuthorizationGate>
  );
}
