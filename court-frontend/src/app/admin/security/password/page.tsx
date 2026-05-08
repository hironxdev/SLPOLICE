"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import { Key, Copy, CheckCircle, AlertTriangle } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-all shrink-0"
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

function scorePassword(pw: string): {
  score: number;
  label: string;
  color: string;
  tips: string[];
} {
  let score = 0;
  const tips: string[] = [];
  if (pw.length >= 12) score += 2;
  else tips.push("Use at least 12 characters");
  if (pw.length >= 16) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  else tips.push("Add uppercase letters (A-Z)");
  if (/[a-z]/.test(pw)) score += 1;
  else tips.push("Add lowercase letters (a-z)");
  if (/[0-9]/.test(pw)) score += 1;
  else tips.push("Include numbers (0-9)");
  if (/[^A-Za-z0-9]/.test(pw)) score += 2;
  else tips.push("Add special characters (!@#$%)");
  if (/(.)\1{2,}/.test(pw)) {
    score -= 1;
    tips.push("Avoid repeating characters");
  }
  const label =
    score >= 7
      ? "STRONG"
      : score >= 5
        ? "MEDIUM"
        : score >= 3
          ? "WEAK"
          : "VERY WEAK";
  const color =
    score >= 7
      ? "text-emerald-600"
      : score >= 5
        ? "text-amber-600"
        : score >= 3
          ? "text-orange-600"
          : "text-rose-600";
  return { score: Math.max(0, Math.min(score, 8)), label, color, tips };
}

const hashcatModes = [
  {
    name: "Dictionary Attack (-a 0)",
    cmd: (h: string) =>
      `hashcat -a 0 -m 0 ${h || "<hash>"} /usr/share/wordlists/rockyou.txt`,
  },
  {
    name: "Rule-Based (-a 0 -r)",
    cmd: (h: string) =>
      `hashcat -a 0 -r /usr/share/hashcat/rules/best64.rule -m 0 ${h || "<hash>"}`,
  },
  {
    name: "Brute Force (-a 3)",
    cmd: (h: string) => `hashcat -a 3 -m 0 ${h || "<hash>"} ?a?a?a?a?a?a?a?a`,
  },
  {
    name: "Combination (-a 1)",
    cmd: (h: string) =>
      `hashcat -a 1 -m 0 ${h || "<hash>"} dict1.txt dict2.txt`,
  },
];

const policyItems = [
  { label: "Minimum 12 characters", level: "REQUIRED" },
  { label: "Uppercase + Lowercase required", level: "REQUIRED" },
  { label: "Minimum 1 special character", level: "REQUIRED" },
  { label: "No dictionary words", level: "REQUIRED" },
  { label: "No repeated characters (3+)", level: "RECOMMENDED" },
  { label: "Password history (last 10)", level: "RECOMMENDED" },
  { label: "Maximum age 90 days", level: "RECOMMENDED" },
  { label: "MFA enforced for all accounts", level: "CRITICAL" },
  { label: "No user-set password reuse", level: "CRITICAL" },
  { label: "Failed attempts lockout (5 tries)", level: "CRITICAL" },
];

export default function PasswordPage() {
  const [pw, setPw] = useState("");
  const [hash, setHash] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const result = pw ? scorePassword(pw) : null;

  return (
    <AuthorizationGate toolName="Password Security Audit Module (Hashcat · John · Policy)">
      <div className="p-4 md:p-8 lg:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-700 rounded-xl">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Password Security Module
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Strength Scoring · Hashcat Templates · Policy Audit
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold text-amber-700">
            Hashcat templates are for authorized corporate security auditing
            ONLY. Commands are generated for use on authorized assessment
            infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Password Strength */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Password Strength Analyzer
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter password to analyze (not stored)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-mono outline-none focus:border-purple-400 transition-all"
              />
              {result && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-700">
                      Strength
                    </span>
                    <span className={`text-sm font-black ${result.color}`}>
                      {result.label}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${result.score >= 7 ? "bg-emerald-500" : result.score >= 5 ? "bg-amber-500" : result.score >= 3 ? "bg-orange-500" : "bg-rose-500"}`}
                      style={{ width: `${(result.score / 8) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full ${i < result.score ? (result.score >= 7 ? "bg-emerald-500" : result.score >= 5 ? "bg-amber-500" : "bg-rose-500") : "bg-slate-100"}`}
                      />
                    ))}
                  </div>
                  {result.tips.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                        Recommendations
                      </p>
                      {result.tips.map((t) => (
                        <p
                          key={t}
                          className="text-[11px] font-medium text-rose-600"
                        >
                          • {t}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hashcat */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Hashcat Command Builder
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Paste target hash here"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-mono outline-none focus:border-purple-400 transition-all"
              />
              <div className="space-y-2">
                {hashcatModes.map((m) => (
                  <div
                    key={m.name}
                    className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-[10px] font-black text-purple-400 mb-1">
                        {m.name}
                      </p>
                      <code className="text-emerald-400 text-[10px] font-mono break-all">
                        {m.cmd(hash)}
                      </code>
                    </div>
                    <CopyButton text={m.cmd(hash)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Audit */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Password Policy Audit Checklist
            </h2>
            <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              {Object.values(checks).filter(Boolean).length}/
              {policyItems.length} Compliant
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {policyItems.map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!checks[item.label]}
                  onChange={(e) =>
                    setChecks({ ...checks, [item.label]: e.target.checked })
                  }
                  className="w-4 h-4 accent-purple-600 shrink-0"
                />
                <span className="flex-1 text-sm font-semibold text-slate-700">
                  {item.label}
                </span>
                <span
                  className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border shrink-0 ${item.level === "CRITICAL" ? "text-red-700 bg-red-50 border-red-200" : item.level === "REQUIRED" ? "text-orange-700 bg-orange-50 border-orange-200" : "text-blue-700 bg-blue-50 border-blue-200"}`}
                >
                  {item.level}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
