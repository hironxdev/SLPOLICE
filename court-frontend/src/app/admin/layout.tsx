"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Target, 
  ShieldAlert, 
  Database, 
  Network, 
  FileSearch, 
  Terminal, 
  Settings, 
  Radar, 
  Zap,
  Activity,
  History,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Fingerprint,
  Wifi,
  Signal
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Auth check (basic)
    const token = localStorage.getItem("adminToken");
    if (!token && !pathname.includes("/admin/login") && pathname !== "/admin") {
      // router.push("/admin"); // Uncomment if strict auth is needed
    }
  }, [pathname]);

  if (!mounted) return null;

  const isLoginPage = pathname === "/admin" || pathname.includes("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const modules = [
    { title: "Command Center", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", category: "CORE" },
    { title: "Geospatial Intel (MVLTS)", icon: <Radar size={20} />, path: "/admin/mvlts", category: "INTELLIGENCE" },
    { title: "OSINT Recon Hub", icon: <Target size={20} />, path: "/admin/intelligence-gathering", category: "INTELLIGENCE" },
    { title: "Forensic Email Lookup", icon: <Fingerprint size={20} />, path: "/admin/intelligence", category: "INTELLIGENCE" },
    { title: "Network Monitoring", icon: <Network size={20} />, path: "/admin/monitoring", category: "OPERATIONS" },
    { title: "Evidence Vault", icon: <Database size={20} />, path: "/admin/forensics", category: "OPERATIONS" },
    { title: "Incident Response", icon: <ShieldAlert size={20} />, path: "/admin/incident-response", category: "OPERATIONS" },
    { title: "Threat Monitoring", icon: <Activity size={20} />, path: "/admin/threat-intel", category: "OPERATIONS" },
    { title: "Wireless Intelligence", icon: <Wifi size={20} />, path: "/admin/wireless", category: "OPERATIONS" },
    { title: "System Logs", icon: <Terminal size={20} />, path: "/admin/logs", category: "SYSTEM" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
      {/* Refined Government Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-72' : 'w-20'} h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 z-[100] flex flex-col shadow-sm`}
      >
        {/* Sidebar Header - Official Branding */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="shrink-0">
            <ShieldCheck className="w-9 h-9 text-blue-700" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left duration-300">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">CCID Intelligence</h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Sri Lanka Police</p>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {["CORE", "INTELLIGENCE", "OPERATIONS", "SYSTEM"].map(cat => (
            <div key={cat} className="space-y-2">
              {isSidebarOpen && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-1">{cat}</p>
              )}
              <div className="space-y-0.5">
                {modules.filter(m => m.category === cat).map(m => (
                  <Link 
                    key={m.path}
                    href={m.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative ${
                      pathname === m.path 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`${pathname === m.path ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {m.icon}
                    </div>
                    {isSidebarOpen && (
                      <span className="text-sm">{m.title}</span>
                    )}
                    {pathname === m.path && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-700 rounded-r-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all font-medium"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Polished Navigation Bar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-[90] px-8 flex items-center justify-between shadow-sm">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search records, intelligence, or operations..."
              className="w-full bg-slate-100 border-none rounded-full py-2 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_4px_rgba(37,99,235,0.5)]"></div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider uppercase">Live Operations</span>
            </div>
            
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
            </button>

            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-200">
                JD
              </div>
              <div className="hidden xl:block">
                <p className="text-[11px] font-bold text-slate-900 leading-none">Admin User</p>
                <p className="text-[9px] font-medium text-slate-500 mt-1 uppercase tracking-wider">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with constrained width for readability */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
