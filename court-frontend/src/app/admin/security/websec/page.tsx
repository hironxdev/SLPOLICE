"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import {
  Globe,
  Copy,
  CheckCircle,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Target,
  Zap,
  Cpu,
  ShieldAlert,
  Code as CodeIcon,
  AlertCircle,
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
      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all shrink-0"
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

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
const METHOD_COLORS: Record<Method, string> = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
  PUT: "bg-amber-50 text-amber-700 border-amber-200",
  PATCH: "bg-purple-50 text-purple-700 border-purple-200",
  DELETE: "bg-rose-50 text-rose-700 border-rose-200",
};

const owaspTests = [
  {
    id: "A01",
    name: "Broken Access Control",
    test: "Try accessing /admin without auth token",
    risk: "CRITICAL",
  },
  {
    id: "A02",
    name: "Cryptographic Failures",
    test: "Check SSL/TLS version: nmap --script=ssl-enum-ciphers",
    risk: "HIGH",
  },
  {
    id: "A03",
    name: "Injection (SQLi / XSS)",
    test: "Payload: ' OR 1=1-- and <script>alert(1)</script>",
    risk: "CRITICAL",
  },
  {
    id: "A04",
    name: "Insecure Design",
    test: "Review business logic for missing rate limits",
    risk: "HIGH",
  },
  {
    id: "A05",
    name: "Security Misconfiguration",
    test: "Check exposed .env, /admin, /phpinfo.php",
    risk: "HIGH",
  },
  {
    id: "A06",
    name: "Vulnerable Components",
    test: "Run: npm audit / pip check / nmap --script=vuln",
    risk: "MEDIUM",
  },
  {
    id: "A07",
    name: "Auth Failures",
    test: "Test default creds, brute force, JWT none alg",
    risk: "CRITICAL",
  },
  {
    id: "A08",
    name: "Software & Data Integrity",
    test: "Verify dependency checksums and SBOM",
    risk: "MEDIUM",
  },
  {
    id: "A09",
    name: "Logging & Monitoring Failures",
    test: "Trigger 10 failed logins — check for alerting",
    risk: "MEDIUM",
  },
  {
    id: "A10",
    name: "Server-Side Request Forgery",
    test: "SSRF: Try url=http://127.0.0.1:80 in API params",
    risk: "HIGH",
  },
];

const zapProfiles = [
  { name: "Spider / Crawl", cmd: (t: string) => `zap-cli spider ${t}` },
  {
    name: "Active Scan",
    cmd: (t: string) => `zap-cli active-scan --scanners all ${t}`,
  },
  { name: "Ajax Spider", cmd: (t: string) => `zap-cli ajax-spider ${t}` },
  {
    name: "Full Automated Scan",
    cmd: (t: string) => `zap-baseline.py -t ${t} -r report.html`,
  },
];

export default function WebSecPage() {
  const [target, setTarget] = useState("");
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([
    { key: "Content-Type", val: "application/json" },
  ]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const h = Object.fromEntries(headers.map((h) => [h.key, h.val]));
      const opts: RequestInit = { method, headers: h };
      if (body && method !== "GET") opts.body = body;
      const res = await fetch(url, opts);
      const text = await res.text();
      setResponse(`HTTP ${res.status} ${res.statusText}\n\n${text}`);
    } catch (e: unknown) {
      setResponse(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
    setLoading(false);
  };

  return (
    <AuthorizationGate toolName="Web Security Testing Module (OWASP ZAP · API Testing)">
      <div className="p-4 md:p-8 lg:p-10 space-y-10 font-sans max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600/10 border border-orange-600/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Web Security Lab
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-bold tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> AUTHORIZED
              FORENSIC AUDITING ACTIVE
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-8 px-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Audit Standard
                </p>
                <p className="text-[11px] font-black text-slate-900 mt-1 uppercase tracking-tight">
                  OWASP TOP 10 (2024)
                </p>
              </div>
              <div className="h-8 w-[1px] bg-slate-100"></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Node Integrity
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-black text-slate-900 uppercase">
                    Secure Bridge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ZAP Scanner */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden group">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-slate-100/50 transition-colors">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" /> Automated
                Discovery
              </h2>
              <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                OWASP ZAP BRIDGE
              </span>
            </div>
            <div className="p-6 space-y-5">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="https://target-endpoint.gov"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold font-mono outline-none focus:border-orange-400 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                {zapProfiles.map((p) => (
                  <div
                    key={p.name}
                    className="bg-[#0f172a] rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/5 hover:border-orange-500/30 transition-all group/item"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-orange-500" /> {p.name}
                      </p>
                      <code className="text-orange-400 text-[11px] font-mono break-all line-clamp-1 block">
                        {p.cmd(target || "TARGET_NODE")}
                      </code>
                    </div>
                    <CopyButton text={p.cmd(target || "TARGET_NODE")} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Tester */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-700" /> Request Interrogator
              </h2>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                HANDSHAKE AUDIT
              </span>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex gap-3">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                  className="bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-xs font-black uppercase tracking-wider outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner cursor-pointer"
                >
                  {(["GET", "POST", "PUT", "PATCH", "DELETE"] as Method[]).map(
                    (m) => (
                      <option key={m} className="font-bold">
                        {m}
                      </option>
                    ),
                  )}
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.gateway.gov/v1/auth"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm font-mono font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Headers UI */}
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    HTTP Headers
                  </p>
                  <button
                    onClick={() =>
                      setHeaders([...headers, { key: "", val: "" }])
                    }
                    className="text-[9px] font-black text-blue-700 bg-white px-2 py-1 border border-blue-100 rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-blue-50 transition-all uppercase"
                  >
                    <Plus className="w-3 h-3" /> Add Vector
                  </button>
                </div>
                <div className="space-y-2">
                  {headers.map((h, i) => (
                    <div
                      key={i}
                      className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-300"
                    >
                      <input
                        value={h.key}
                        onChange={(e) => {
                          const n = [...headers];
                          n[i].key = e.target.value;
                          setHeaders(n);
                        }}
                        placeholder="Header-Key"
                        className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-[11px] font-mono font-bold outline-none focus:border-blue-300 shadow-sm"
                      />
                      <input
                        value={h.val}
                        onChange={(e) => {
                          const n = [...headers];
                          n[i].val = e.target.value;
                          setHeaders(n);
                        }}
                        placeholder="Value-Set"
                        className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-[11px] font-mono font-bold outline-none focus:border-blue-300 shadow-sm"
                      />
                      <button
                        onClick={() =>
                          setHeaders(headers.filter((_, j) => j !== i))
                        }
                        className="p-2.5 text-slate-300 hover:text-rose-600 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {method !== "GET" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Payload Payload (JSON/DATA)
                  </p>
                  <textarea
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"auth_token": "SESS_CCID_..."}'
                    className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-5 text-blue-400 text-xs font-mono outline-none resize-none shadow-2xl"
                  />
                </div>
              )}

              <button
                onClick={sendRequest}
                disabled={!url || loading}
                className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                <Send className="w-4 h-4" />{" "}
                {loading
                  ? "INITIALIZING HANDSHAKE..."
                  : "EXECUTE AUDIT REQUEST"}
              </button>

              {response && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    Response Cluster
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 tracking-tighter">
                      DATA_EXTRACT_SUCCESS
                    </span>
                  </p>
                  <pre className="bg-[#0f172a] rounded-2xl p-6 text-emerald-400 text-[11px] font-mono overflow-auto max-h-60 border border-white/5 shadow-2xl">
                    {response}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audit Forensic Clusters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                SQLi Auditing
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase">
              Simulating SQL injection vectors against authorized database
              nodes.
              <span className="block mt-2 text-[10px] font-black text-rose-700">
                Audit Status: TESTING_ENABLED
              </span>
            </p>
            <div className="space-y-2">
              <code className="block p-3 bg-slate-900 rounded-xl text-emerald-400 text-[10px] font-mono border border-white/5">
                &apos; OR 1=1 --
              </code>
              <button className="w-full py-3 border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">
                Launch SQL Auditor
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <CodeIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                XSS Interrogation
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase">
              Analyzing DOM persistence and script sanitization across input
              vectors.
              <span className="block mt-2 text-[10px] font-black text-amber-700">
                Audit Status: ACTIVE_MONITOR
              </span>
            </p>
            <div className="space-y-2">
              <code className="block p-3 bg-slate-900 rounded-xl text-emerald-400 text-[10px] font-mono border border-white/5">
                &lt;script&gt;alert(1)&lt;/script&gt;
              </code>
              <button className="w-full py-3 border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">
                Deploy XSS Probe
              </button>
            </div>
          </div>

          <div className="bg-[#1a1c24] text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-16 -right-16 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-48 h-48 text-rose-500" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Compliance Shield
              </h3>
              <p className="text-[11px] font-medium text-slate-300 leading-relaxed uppercase">
                All tests are recorded in the{" "}
                <span className="text-white font-bold">
                  Forensic Log Archive
                </span>
                . Unauthorized use is strictly prohibited under the CSEU Digital
                Evidence Act.
              </p>
              <div className="pt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[85%] animate-pulse"></div>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Auditing Assurance: 85%
              </p>
            </div>
          </div>
        </div>

        {/* OWASP Top 10 Checklist */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" /> Compliance
                Checklist
              </h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-wider">
                OWASP Application Security Verification Standard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full tracking-widest">
                {Object.values(checks).filter(Boolean).length}/
                {owaspTests.length} NODES VERIFIED
              </span>
              <button
                onClick={() => setChecks({})}
                className="p-2 text-slate-400 hover:text-rose-600 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {owaspTests.map((t) => (
              <label
                key={t.id}
                className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!checks[t.id]}
                  onChange={(e) =>
                    setChecks({ ...checks, [t.id]: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 accent-orange-600 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black text-slate-400 font-mono">
                      {t.id}
                    </span>
                    <p
                      className={`text-sm font-bold ${checks[t.id] ? "line-through text-slate-400" : "text-slate-900"}`}
                    >
                      {t.name}
                    </p>
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        t.risk === "CRITICAL"
                          ? "text-red-700 bg-red-50 border-red-200"
                          : t.risk === "HIGH"
                            ? "text-orange-700 bg-orange-50 border-orange-200"
                            : "text-amber-700 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {t.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {t.test}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
