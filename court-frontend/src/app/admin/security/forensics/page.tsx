"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import { HardDrive, Copy, CheckCircle, Upload, Clock } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all shrink-0"
    >
      {copied ? (
        <CheckCircle className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const workflows = [
  {
    tool: "Autopsy (Disk Analysis)",
    color: "border-blue-200 bg-blue-50",
    titleColor: "text-blue-700",
    steps: [
      "1. Launch Autopsy → Create New Case → Enter case name & officer ID",
      "2. Add Data Source → Disk Image → Browse to .E01 or .dd image",
      "3. Enable Ingest Modules: File Type ID, Hash Lookup, Keyword Search",
      "4. Run Analysis → Review Results in tree panel",
      "5. Tag evidence → Generate HTML/PDF report",
    ],
    cmd: `autopsy --nosplashscreen --openCase /path/to/case.aut`,
  },
  {
    tool: "Volatility (Memory Analysis)",
    color: "border-purple-200 bg-purple-50",
    titleColor: "text-purple-700",
    steps: [
      "1. Identify memory profile: vol.py -f mem.raw imageinfo",
      "2. List processes: vol.py -f mem.raw --profile=Win10x64 pslist",
      "3. Network connections: vol.py -f mem.raw --profile=Win10x64 netscan",
      "4. Extract registry hives: vol.py -f mem.raw --profile=Win10x64 hivelist",
      "5. Dump suspicious process: vol.py -f mem.raw --profile=Win10x64 memdump -p <PID>",
    ],
    cmd: `vol.py -f memory.raw --profile=Win10x64_19041 pslist`,
  },
  {
    tool: "FTK Imager (Evidence Capture)",
    color: "border-emerald-200 bg-emerald-50",
    titleColor: "text-emerald-700",
    steps: [
      "1. Launch FTK Imager → File → Create Disk Image",
      "2. Select source type: Physical Drive / Logical Drive / Image File",
      "3. Choose destination format: E01 (Expert Witness) for court use",
      "4. Set case info: Officer name, case number, evidence number",
      "5. Verify hash (MD5+SHA1) after capture → Export for chain of custody",
    ],
    cmd: `ftkimager /source /dev/sdb /dest /evidence/disk.E01 --verify`,
  },
];

interface TimelineEvent {
  time: string;
  type: string;
  description: string;
  severity: "critical" | "high" | "medium" | "info";
}

const SEVERITY_STYLE: Record<string, string> = {
  critical: "text-red-700 bg-red-50 border-red-200",
  high: "text-orange-700 bg-orange-50 border-orange-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  info: "text-blue-700 bg-blue-50 border-blue-200",
};

export default function ForensicsPage() {
  const [pastedArtifacts, setPastedArtifacts] = useState("");
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      time: "2026-05-08 08:41:22",
      type: "FILE_ACCESS",
      description: "Suspicious file access: C:\\Windows\\Temp\\rat.exe",
      severity: "critical",
    },
    {
      time: "2026-05-08 08:39:15",
      type: "NETWORK",
      description: "Outbound connection to 185.220.101.45:4444 (C2 suspect)",
      severity: "high",
    },
    {
      time: "2026-05-08 08:35:01",
      type: "REGISTRY",
      description: "Registry key created: HKCU\\Run\\SystemUpdate",
      severity: "high",
    },
    {
      time: "2026-05-08 08:30:00",
      type: "LOGIN",
      description: "Successful login from new IP: 112.134.21.90",
      severity: "medium",
    },
  ]);
  const [newEvent, setNewEvent] = useState({
    time: "",
    type: "",
    description: "",
    severity: "info" as const,
  });
  const [showAdd, setShowAdd] = useState(false);

  const addEvent = () => {
    if (!newEvent.description) return;
    setEvents([
      { ...newEvent, time: newEvent.time || new Date().toISOString() },
      ...events,
    ]);
    setNewEvent({ time: "", type: "", description: "", severity: "info" });
    setShowAdd(false);
  };

  return (
    <AuthorizationGate toolName="Digital Forensics Module (Autopsy · Volatility · FTK)">
      <div className="p-4 md:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-700 rounded-xl">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                Digital Forensics Module
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Autopsy · Volatility · FTK Imager · Evidence Timeline
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Clock className="w-4 h-4" /> Add Timeline Event
          </button>
        </div>

        {/* Tool Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {workflows.map((w) => (
            <div
              key={w.tool}
              className={`bg-white border rounded-2xl shadow-sm overflow-hidden`}
            >
              <div className={`p-4 border-b ${w.color}`}>
                <h3 className={`text-sm font-black ${w.titleColor}`}>
                  {w.tool}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <ol className="space-y-2">
                  {w.steps.map((s, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-medium text-slate-600 leading-relaxed"
                    >
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-2">
                  <code className="text-emerald-400 text-[10px] font-mono break-all">
                    {w.cmd}
                  </code>
                  <CopyButton text={w.cmd} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Event */}
        {showAdd && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Add Timeline Event
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Timestamp
                </label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  placeholder="2026-05-08 10:00:00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-mono outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Event Type
                </label>
                <input
                  type="text"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                  placeholder="e.g. FILE_ACCESS, NETWORK"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Describe the forensic event"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Severity
                </label>
                <select
                  value={newEvent.severity}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      severity: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold outline-none"
                >
                  {["critical", "high", "medium", "info"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addEvent}
                className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
              >
                Add Event
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="text-xs font-black text-slate-500 px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Evidence Timeline
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 ${e.severity === "critical" ? "bg-red-500 border-red-300" : e.severity === "high" ? "bg-orange-500 border-orange-300" : e.severity === "medium" ? "bg-amber-500 border-amber-300" : "bg-blue-500 border-blue-300"}`}
                  />
                  {i < events.length - 1 && (
                    <div className="w-px flex-1 bg-slate-100 mt-1 min-h-[24px]" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">
                      {e.time}
                    </span>
                    <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {e.type}
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${SEVERITY_STYLE[e.severity]}`}
                    >
                      {e.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {e.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artifact Paste */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Paste Artifact / Log Output
            </h2>
          </div>
          <div className="p-5">
            <textarea
              rows={8}
              value={pastedArtifacts}
              onChange={(e) => setPastedArtifacts(e.target.value)}
              placeholder="Paste Autopsy report, Volatility pslist, FTK log entries, or Velociraptor artifacts here for documentation..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-emerald-400 text-xs font-mono outline-none resize-none focus:border-slate-500 transition-all"
            />
            {pastedArtifacts && (
              <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold">
                  {pastedArtifacts.split("\n").length} lines of artifact data
                  captured for case file
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
