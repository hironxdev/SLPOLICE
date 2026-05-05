import {
  Terminal,
  Map as MapIcon,
  Crosshair,
  Radar,
  Activity,
  Cpu,
  Mail,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-4 lg:p-8 selection:bg-cyan-500/30">
      <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Crosshair className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">
              CCID COMMAND CENTER
            </h1>
            <p className="text-sm text-cyan-500/60 uppercase tracking-widest font-mono">
              Trace Location & Extraction Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
            LINK SECURE
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-1 border border-neutral-800 rounded-2xl flex flex-row md:flex-col gap-4 p-4 items-center bg-neutral-900/50 justify-start">
          <button className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:bg-cyan-500/20 transition-all">
            <Radar className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-lg text-neutral-500 hover:text-white transition-colors hover:bg-white/5">
            <Activity className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-lg text-neutral-500 hover:text-white transition-colors hover:bg-white/5">
            <Terminal className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-lg text-neutral-500 hover:text-white transition-colors hover:bg-white/5">
            <Mail className="w-6 h-6" />
          </button>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-6">
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.cyan.900/15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-lg font-semibold flex items-center gap-2 tracking-wide">
                <MapIcon className="w-5 h-5 text-cyan-400" /> LIVE TARGET
                TRACKING
              </h2>
              <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-cyan-400 border border-cyan-500/20">
                SAT-LINK: ACTIVE
              </span>
            </div>
            <div className="aspect-video bg-black/50 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] rounded-full border border-cyan-500/10 animate-[spin_8s_linear_infinite] border-t-cyan-400/40 opacity-70"></div>

              <div className="z-10 text-center space-y-4">
                <Radar className="w-14 h-14 text-cyan-400 mx-auto animate-pulse filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                <p className="text-sm font-mono text-cyan-400/60 uppercase tracking-widest">
                  Waiting for incoming telemetry...
                </p>
              </div>

              {/* Mock Blip */}
              <div className="absolute top-[30%] left-[40%] text-rose-500 flex flex-col items-center gap-1 opacity-80">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-rose-500 rounded-full relative z-10"></div>
                <span className="text-[10px] font-mono text-rose-400 bg-black/60 px-1 rounded">
                  TRG-Alpha
                </span>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 tracking-wide">
                <Mail className="w-5 h-5 text-cyan-400" /> ACTIVE EMAIL TRACES
              </h2>
              <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-cyan-400 border border-cyan-500/20">
                GEO-IP: LINKED
              </span>
            </div>
            <div className="bg-black/50 rounded-xl border border-white/5 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 text-neutral-500">
                <span>TARGET</span>
                <span>LAST PROXIED IP</span>
                <span>RESOLVED LOC</span>
              </div>
              <div className="flex justify-between items-center text-cyan-400/80">
                <span className="truncate w-1/3">suspect1@example.com</span>
                <span className="w-1/3 text-center">192.45.XX.XX</span>
                <span className="w-1/3 text-right text-emerald-400">
                  Colombo, Sri Lanka
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-400 opacity-50">
                <span className="truncate w-1/3">ghost@proton.me</span>
                <span className="w-1/3 text-center">Awaiting...</span>
                <span className="w-1/3 text-right">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-sm font-bold tracking-widest text-neutral-400 mb-5 flex items-center gap-2 uppercase">
              <Cpu className="w-4 h-4 text-purple-400" /> AI Predict Analytics
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 border-l-2 border-l-purple-500 rounded-xl hover:bg-purple-500/10 transition-colors">
                <h3 className="text-xs text-purple-400 font-mono mb-1.5 flex justify-between items-center">
                  <span>TRG-ALPHA</span>
                  <span className="text-[10px] text-purple-500/50">
                    94% CONFIDENCE
                  </span>
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  High probability of network switch to untracked WiFi today.
                  Recommend forcing GPS polling every 30s.
                </p>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 border-l-2 border-l-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors">
                <h3 className="text-xs text-rose-400 font-mono mb-1.5">
                  DEVICE ALERT
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Encrypted transmission detected. Initiating Python payload
                  simulator logic via backend port.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest text-neutral-400 mb-4 flex items-center gap-2 uppercase px-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> Extraction Log
            </h2>
            <div className="font-mono text-[11px] text-emerald-400/80 space-y-2.5 h-48 overflow-hidden relative bg-black/40 p-3 rounded-lg border border-black">
              <p className="opacity-50">
                01:04:15 &gt; Service worker established
              </p>
              <p className="opacity-70">
                01:04:18 &gt; Listening on port 5000...
              </p>
              <p className="text-emerald-300">
                &gt; Waiting for payload transmission...
              </p>
              <div className="absolute flex gap-1 items-center bottom-3 left-3 text-emerald-400 animate-pulse">
                <span>_</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
