"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import { FileBarChart, Download, CheckCircle, TrendingUp } from "lucide-react";

const complianceFrameworks = [
  {
    name: "PCI DSS",
    version: "v4.0",
    color: "border-blue-200",
    titleColor: "text-blue-700",
    bg: "bg-blue-50",
    items: [
      "Install and maintain network security controls",
      "Do not use vendor-supplied defaults (passwords, settings)",
      "Protect stored cardholder data (encryption at rest)",
      "Encrypt transmission of cardholder data over open networks",
      "Protect all systems against malware — update AV regularly",
      "Develop and maintain secure systems and software",
      "Restrict access to system components by business need",
      "Identify users and authenticate access to system components",
      "Restrict physical access to cardholder data",
      "Log all access to system components and cardholder data",
      "Test security of systems and networks regularly",
      "Support information security with organizational policies",
    ],
  },
  {
    name: "GDPR",
    version: "EU 2016/679",
    color: "border-emerald-200",
    titleColor: "text-emerald-700",
    bg: "bg-emerald-50",
    items: [
      "Lawful basis documented for all personal data processing",
      "Privacy notices provided at point of data collection",
      "Data subject rights implemented (access, erasure, portability)",
      "Records of processing activities (ROPA) maintained",
      "Privacy impact assessments (DPIA) completed where needed",
      "Data breach notification within 72 hours to supervisory authority",
      "Data retention policies defined and enforced",
      "Data Processing Agreements signed with all processors",
    ],
  },
  {
    name: "ISO 27001",
    version: "2022",
    color: "border-purple-200",
    titleColor: "text-purple-700",
    bg: "bg-purple-50",
    items: [
      "Information security policy defined and communicated",
      "Risk assessment methodology documented and applied",
      "Asset inventory maintained and classified",
      "Access control policy implemented (least privilege)",
      "Cryptographic controls policy enforced",
      "Physical security perimeters and entry controls active",
      "Change management procedures followed",
      "Business continuity and incident response plans tested",
      "Supplier relationships security requirements documented",
      "Internal audits scheduled and completed",
    ],
  },
  {
    name: "HIPAA",
    version: "Security Rule",
    color: "border-rose-200",
    titleColor: "text-rose-700",
    bg: "bg-rose-50",
    items: [
      "Access controls: unique user ID, emergency access procedure",
      "Audit controls: hardware, software, and activity logs",
      "Integrity controls: ePHI not improperly altered or destroyed",
      "Transmission security: encryption for ePHI in transit",
      "Risk analysis conducted and documented",
      "Contingency plan: data backup, disaster recovery",
      "Business Associate Agreements (BAA) in place",
      "Workforce training on security awareness completed",
    ],
  },
];

export default function ReportsPage() {
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>(
    {},
  );
  const [reportTitle, setReportTitle] = useState(
    "CSEU Security Assessment Report",
  );
  const [reportScope, setReportScope] = useState("");
  const [findings, setFindings] = useState("");
  const [activeFramework, setActiveFramework] = useState("PCI DSS");

  const getScore = (fw: string) => {
    const items = complianceFrameworks.find((f) => f.name === fw)?.items || [];
    const completed = items.filter((i) => checks[fw]?.[i]).length;
    return {
      completed,
      total: items.length,
      pct: Math.round((completed / items.length) * 100),
    };
  };

  const generateReport = () => {
    const lines: string[] = [
      `# ${reportTitle}`,
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Classification:** CONFIDENTIAL — Openbird Cyber Security Enginnering CSEU`,
      ``,
      `## Scope`,
      reportScope || "Not specified",
      ``,
      `## Compliance Summary`,
    ];
    complianceFrameworks.forEach((fw) => {
      const s = getScore(fw.name);
      lines.push(
        `- **${fw.name}**: ${s.completed}/${s.total} controls compliant (${s.pct}%)`,
      );
    });
    lines.push(`\n## Key Findings\n`, findings || "None documented.");
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ccid_report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const fw = complianceFrameworks.find((f) => f.name === activeFramework)!;
  const score = getScore(activeFramework);

  return (
    <AuthorizationGate toolName="Reports & Compliance Module">
      <div className="p-4 md:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-700 rounded-xl">
              <FileBarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                Reports & Compliance
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                PCI DSS · GDPR · ISO 27001 · HIPAA · Report Generator
              </p>
            </div>
          </div>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report (.md)
          </button>
        </div>

        {/* Summary Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {complianceFrameworks.map((fw) => {
            const s = getScore(fw.name);
            return (
              <button
                key={fw.name}
                onClick={() => setActiveFramework(fw.name)}
                className={`text-left border rounded-xl p-4 transition-all ${activeFramework === fw.name ? `${fw.color} ${fw.bg} ring-2 ring-offset-1` : "bg-white border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-xs font-black ${activeFramework === fw.name ? fw.titleColor : "text-slate-700"}`}
                  >
                    {fw.name}
                  </span>
                  <span className={`text-[10px] font-bold ${fw.titleColor}`}>
                    {s.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.pct >= 80 ? "bg-emerald-500" : s.pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {s.completed}/{s.total} controls
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Compliance Checklist */}
          <div
            className={`bg-white border ${fw.color} rounded-2xl shadow-sm overflow-hidden`}
          >
            <div
              className={`p-5 border-b ${fw.color} ${fw.bg} flex items-center justify-between`}
            >
              <div>
                <h2
                  className={`text-sm font-black ${fw.titleColor} uppercase tracking-wide`}
                >
                  {fw.name} Controls
                </h2>
                <p className="text-[10px] text-slate-500">{fw.version}</p>
              </div>
              <span
                className={`text-[10px] font-black ${fw.titleColor} ${fw.bg} border ${fw.color} px-2.5 py-1 rounded-full`}
              >
                {score.pct}% Compliant
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {fw.items.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!checks[fw.name]?.[item]}
                    onChange={(e) =>
                      setChecks({
                        ...checks,
                        [fw.name]: {
                          ...checks[fw.name],
                          [item]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded accent-teal-600 shrink-0"
                  />
                  <span className="text-[12px] font-medium text-slate-700 leading-relaxed">
                    {item}
                  </span>
                  {checks[fw.name]?.[item] && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Report Builder */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Report Builder
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:border-teal-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Assessment Scope
                </label>
                <textarea
                  rows={3}
                  value={reportScope}
                  onChange={(e) => setReportScope(e.target.value)}
                  placeholder="e.g. Internal network at HQ, applications hosted on Railway, court portal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-teal-400 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                  Key Findings
                </label>
                <textarea
                  rows={5}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="Document critical vulnerabilities, exposure risks, and remediation recommendations..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-teal-400 transition-all resize-none"
                />
              </div>

              {/* Summary preview */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">
                  Compliance Summary Preview
                </p>
                {complianceFrameworks.map((f) => {
                  const s = getScore(f.name);
                  return (
                    <div
                      key={f.name}
                      className="flex justify-between text-xs font-semibold text-slate-700"
                    >
                      <span>{f.name}</span>
                      <span
                        className={
                          s.pct >= 80
                            ? "text-emerald-600"
                            : s.pct >= 50
                              ? "text-amber-600"
                              : "text-rose-600"
                        }
                      >
                        {s.completed}/{s.total} ({s.pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={generateReport}
                className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-teal-200"
              >
                <Download className="w-4 h-4" /> Export Full Report as Markdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
