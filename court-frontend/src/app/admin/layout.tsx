"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  ShieldAlert,
  Database,
  Network,
  Terminal,
  Radar,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Fingerprint,
  Wifi,
  Signal,
  Shield,
  Globe,
  Key,
  HardDrive,
  Code,
  FileBarChart,
  ScanSearch,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationCenter from "@/components/NotificationCenter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // On mobile, sidebar should be closed by default
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    // Auth check (basic)
    const token = localStorage.getItem("adminToken");
    if (!token && !pathname.includes("/admin/login") && pathname !== "/admin") {
      // router.push("/admin"); // Uncomment if strict auth is needed
    }
  }, [pathname]);

  if (!mounted) return null;

  const isLoginPage =
    pathname === "/admin" || pathname.includes("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const modules = [
    {
      title: "Command Center",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
      category: "CORE",
    },
    {
      title: "Geospatial Intel (MVLTS)",
      icon: <Radar size={20} />,
      path: "/admin/mvlts",
      category: "INTELLIGENCE",
    },
    {
      title: "OSINT Recon Hub",
      icon: <Target size={20} />,
      path: "/admin/intelligence-gathering",
      category: "INTELLIGENCE",
    },
    {
      title: "Forensic Email Lookup",
      icon: <Fingerprint size={20} />,
      path: "/admin/intelligence",
      category: "INTELLIGENCE",
    },
    {
      title: "Network Monitoring",
      icon: <Network size={20} />,
      path: "/admin/monitoring",
      category: "OPERATIONS",
    },
    {
      title: "Evidence Vault",
      icon: <Database size={20} />,
      path: "/admin/forensics",
      category: "OPERATIONS",
    },
    {
      title: "Incident Response",
      icon: <ShieldAlert size={20} />,
      path: "/admin/incident-response",
      category: "OPERATIONS",
    },
    {
      title: "Threat Monitoring",
      icon: <Activity size={20} />,
      path: "/admin/threat-intel",
      category: "OPERATIONS",
    },
    {
      title: "Wireless Intelligence",
      icon: <Wifi size={20} />,
      path: "/admin/wireless",
      category: "OPERATIONS",
    },
    {
      title: "System Logs",
      icon: <Terminal size={20} />,
      path: "/admin/logs",
      category: "SYSTEM",
    },
    // ── SECURITY COMMAND CENTER ──
    {
      title: "Security Dashboard",
      icon: <ShieldCheck size={20} />,
      path: "/admin/security/dashboard",
      category: "SECURITY",
    },
    {
      title: "Web Security Lab",
      icon: <Globe size={20} />,
      path: "/admin/security/websec",
      category: "SECURITY",
    },
    {
      title: "Network & Wireless",
      icon: <Wifi size={20} />,
      path: "/admin/security/network",
      category: "SECURITY",
    },
    {
      title: "Vulnerability Scan",
      icon: <ShieldAlert size={20} />,
      path: "/admin/security/vulns",
      category: "SECURITY",
    },
    {
      title: "Audit Logs",
      icon: <FileBarChart size={20} />,
      path: "/admin/security/audit",
      category: "SECURITY",
    },
    {
      title: "Knowledge Hub",
      icon: <BookOpen size={20} />,
      path: "/admin/security/kb",
      category: "SECURITY",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  const NavContent = () => (
    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
      {["CORE", "INTELLIGENCE", "OPERATIONS", "SYSTEM", "SECURITY"].map(
        (cat) => (
          <div key={cat} className="space-y-2">
            {(isSidebarOpen || isMobileMenuOpen) && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-1">
                {cat}
              </p>
            )}
            <div className="space-y-0.5">
              {modules
                .filter((m) => m.category === cat)
                .map((m) => (
                  <Link
                    key={m.path}
                    href={m.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative ${
                      pathname === m.path
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div
                      className={`${pathname === m.path ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600"}`}
                    >
                      {m.icon}
                    </div>
                    {(isSidebarOpen || isMobileMenuOpen) && (
                      <span className="text-sm">{m.title}</span>
                    )}
                    {pathname === m.path && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-700 rounded-r-full"></div>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        ),
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Refined Government Sidebar - Desktop */}
      <aside
        className={`hidden md:flex ${isSidebarOpen ? "w-72" : "w-20"} h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 z-[100] flex-col shadow-sm`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="shrink-0">
            <ShieldCheck className="w-9 h-9 text-blue-700" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left duration-300">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                CSEU Intelligence
              </h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Openbird Cyber Security Enginnering
              </p>
            </div>
          )}
        </div>
        <NavContent />
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
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

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[120] transition-transform duration-300 md:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-700" />
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                CSEU Intel
              </h1>
              <p className="text-[9px] font-medium text-slate-500 uppercase">
                Police HQ
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <NavContent />
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Polished Navigation Bar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-[90] px-4 md:px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Signal size={20} className="rotate-90" />
            </button>
            <div className="flex-1 max-w-xl relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
            {/* Mobile Small Branding */}
            <div className="flex items-center gap-2 sm:hidden">
              <ShieldCheck className="w-6 h-6 text-blue-700" />
              <span className="text-sm font-bold text-slate-800">CSEU</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Live Ops
              </span>
            </div>

            <NotificationCenter />

            <div className="flex items-center gap-2 md:gap-3 pl-2">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-md shadow-blue-200">
                JD
              </div>
              <div className="hidden lg:block whitespace-nowrap">
                <p className="text-[11px] font-bold text-slate-900 leading-none">
                  Admin User
                </p>
                <p className="text-[9px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with constrained width for readability */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
