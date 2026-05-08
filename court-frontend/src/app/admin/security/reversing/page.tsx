"use client";
import { useState } from "react";
import AuthorizationGate from "@/components/AuthorizationGate";
import { Code, Copy, CheckCircle } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg border border-pink-200 transition-all shrink-0"
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

const tools = [
  {
    name: "Ghidra",
    subtitle: "NSA Binary Analysis Framework",
    color: "border-pink-200 bg-pink-50",
    titleColor: "text-pink-700",
    steps: [
      "1. Launch Ghidra → New Project → Import Binary",
      "2. Double-click binary → Auto-analyze (select all options)",
      "3. Navigate Functions window → look for main() / suspicious fn names",
      "4. Use Decompiler panel (right side) to read pseudo-C code",
      "5. Add comments / labels to suspicious blocks, export findings",
    ],
    cmds: [
      {
        label: "Headless Analysis",
        cmd: "analyzeHeadless /project/path ProjectName -import /path/to/binary -postScript /scripts/ExportFunctions.py",
      },
      {
        label: "Strings Dump",
        cmd: "strings -n 8 suspicious_binary | grep -E '(http|password|key|shell|exec)'",
      },
    ],
  },
  {
    name: "x64dbg",
    subtitle: "Windows Userland Debugger",
    color: "border-rose-200 bg-rose-50",
    titleColor: "text-rose-700",
    steps: [
      "1. Open x64dbg → File → Open → Select target executable",
      "2. Set breakpoint on EntryPoint: bp <entrypoint_address>",
      "3. F9 to run → F8 to step over → F7 to step into",
      "4. Monitor stack, registers, and memory in real-time panels",
      "5. Dump unpacked binary: Right-click memory → Dump to file",
    ],
    cmds: [
      { label: "PE Header Info", cmd: "pe-sieve.exe --pid <PID> --dump all" },
      {
        label: "Process Hollowing Check",
        cmd: "hollows_hunter.exe /pid <PID>",
      },
    ],
  },
  {
    name: "Malware Sandbox",
    subtitle: "Automated Dynamic Analysis",
    color: "border-slate-200 bg-slate-50",
    titleColor: "text-slate-700",
    steps: [
      "1. Upload sample to Cuckoo Sandbox / Any.run / Triage",
      "2. Select environment: Windows 10 64-bit, Internet: off",
      "3. Set timeout: 120s → Submit for analysis",
      "4. Review: Behavioral report, network IOCs, file drops",
      "5. Export YARA rule / IOC list for threat hunting",
    ],
    cmds: [
      {
        label: "Cuckoo Submit",
        cmd: "cuckoo submit --timeout 120 /path/to/sample.exe",
      },
      { label: "YARA Scan", cmd: "yara -r /yara/rules/ suspicious_directory/" },
    ],
  },
];

export default function ReversingPage() {
  const [pastedDisasm, setPastedDisasm] = useState("");

  return (
    <AuthorizationGate toolName="Reverse Engineering Module (Ghidra · x64dbg · Sandbox)">
      <div className="p-4 md:p-8 lg:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-600 rounded-xl">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Reverse Engineering Module
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Ghidra · x64dbg · Malware Sandbox · YARA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className={`p-4 border-b ${t.color}`}>
                <h3 className={`text-sm font-black ${t.titleColor}`}>
                  {t.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {t.subtitle}
                </p>
              </div>
              <div className="p-4 space-y-3">
                <ol className="space-y-1.5">
                  {t.steps.map((s, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-medium text-slate-600 leading-relaxed"
                    >
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="space-y-2">
                  {t.cmds.map((c) => (
                    <div
                      key={c.label}
                      className="bg-slate-900 rounded-xl p-3 flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="text-[9px] font-black text-pink-400 mb-1 uppercase tracking-wider">
                          {c.label}
                        </p>
                        <code className="text-emerald-400 text-[10px] font-mono break-all">
                          {c.cmd}
                        </code>
                      </div>
                      <CopyButton text={c.cmd} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disassembly paste */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Disassembly / Decompiler Output
            </h2>
          </div>
          <div className="p-5">
            <textarea
              rows={10}
              value={pastedDisasm}
              onChange={(e) => setPastedDisasm(e.target.value)}
              placeholder="Paste Ghidra decompiler output, IDA disassembly, or x64dbg trace logs here for case documentation..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-emerald-400 text-xs font-mono outline-none resize-none focus:border-pink-500 transition-all"
            />
            {pastedDisasm && (
              <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold">
                  {pastedDisasm.split("\n").length} lines of disassembly
                  documented for case file
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}
