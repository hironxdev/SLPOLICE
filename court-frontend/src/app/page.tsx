"use client";
import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Gavel,
  ArrowRight,
  Lock,
  Clock,
  Search,
  ChevronDown,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronUp,
  MapPin,
  ExternalLink,
  Menu,
  Globe,
  X,
  ChevronRight,
  Fingerprint,
  Activity,
  Check,
  ShieldAlert,
  Users,
  Trophy,
  History,
  Play,
  Share2,
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"en" | "si" | "ta">("si");
  const [showAuth, setShowAuth] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [securityStatus, setSecurityStatus] = useState(
    "AWAITING_AUTHORIZATION...",
  );

  useEffect(() => {
    const auth = localStorage.getItem("ccid_auth_v2");
    if (auth) setShowAuth(false);

    // Auto Slider
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleAuthorize = () => {
    localStorage.setItem("ccid_auth_v2", "authorized");
    setShowAuth(false);
  };

  const t = {
    si: {
      title: "ශ්‍රී ලංකා පොලිස් CSEU",
      division: "පරිගණක අපරාධ විමර්ශන කොට්ඨාසය",
      applyBtn: "සෘජුව ඉදිරිපත් කරන්න",
      loginBtn: "නිලධාරී පිවිසුම",
    },
    en: {
      title: "OPENBIRD CYBER SECURITY ENGINNERING CSEU",
      division: "Computer Crime Investigation Division",
      applyBtn: "Submit Case Now",
      loginBtn: "Staff Portal Login",
    },
    ta: {
      title: "இலங்கை பொலிஸ் CSEU",
      division: "கணினி குற்றப் புலனாய்வுப் பிரிவு",
      applyBtn: "இப்பவே சமர்ப்பிக்கவும்",
      loginBtn: "அதிகாரி உள்நுழைவு",
    },
  }[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showAuth) return;
    setSecurityStatus("UPLINK_SUCCESS: SECURE_ENVIRONMENT");
  }, [showAuth]);

  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670",
      title: "MAY INTAKE 2026: FORENSIC SPECIALISTS",
      desc: "Apply now for specialized cybercrime investigation training and collaborative legal programs.",
      cta: "Apply Now",
    },
    {
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670",
      title: "SECURING THE DIGITAL FUTURE",
      desc: "Join the lead in Sri Lanka's digital sovereignty through advanced forensic intelligence.",
      cta: "Explore Research",
    },
    {
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670",
      title: "DATA DRIVEN JUSTICE",
      desc: "Official d-portal for court notices and citizen-led digital crime reporting.",
      cta: "Case Registry",
    },
  ];

  return (
    <>
      {/* (Auth Overlay remains from previous version for security) */}
      {showAuth && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-sm z-[5000] animate-in slide-in-from-bottom-10 duration-700 ease-out">
          <div className="bg-[#112240] border-2 border-blue-500/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-md">
            {/* Background scanning effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-400/50 animate-scan pointer-events-none"></div>

            <div className="flex gap-4 items-start">
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-400/20 shrink-0">
                <Globe className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-sm font-black text-white uppercase tracking-tighter">
                    Are you from Sri Lanka?
                  </h1>
                  <p className="text-[10px] text-blue-200 font-medium leading-relaxed">
                    SLIIT University requires Confirmation of your Region.
                  </p>
                </div>
                <button
                  onClick={handleAuthorize}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group"
                >
                  Yes, I'm from Sri Lanka
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white text-[#002147] font-sans selection:bg-[#fbbf24] selection:text-[#002147]">
        {/* TOP UTILITY BAR (SLIIT Style) */}
        <div className="bg-[#002147] h-10 hidden lg:flex items-center border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center h-full">
            <div className="flex items-center gap-4">
              <Facebook className="w-3.5 h-3.5 text-white/60 hover:text-white cursor-pointer" />
              <Instagram className="w-3.5 h-3.5 text-white/60 hover:text-white cursor-pointer" />
              <Youtube className="w-3.5 h-3.5 text-white/60 hover:text-white cursor-pointer" />
              <Twitter className="w-3.5 h-3.5 text-white/60 hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center gap-8 h-full">
              <a
                href="tel:+94117320641"
                className="flex items-center gap-2 text-[10px] font-bold text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-yellow-400" /> +94 11 732 0641
              </a>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[10px] font-bold text-white/80 hover:text-white border-l border-white/10 pl-6 h-full"
              >
                {t.loginBtn}{" "}
                <ArrowRight className="w-3 h-3 text-yellow-400 ml-1" />
              </Link>
              <Link
                href="/courtnotices"
                className="bg-[#f27024] px-6 h-full flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#d05c1b] transition-all"
              >
                {t.applyBtn} <ArrowRight className="w-3 h-3 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR */}
        <header
          className={`sticky top-0 z-[1000] bg-white transition-all ${isScrolled ? "shadow-xl py-2" : "py-4 md:py-6"}`}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CSEU Logo"
                className={`${isScrolled ? "h-12" : "h-16"} transition-all`}
              />
              <div className="border-l border-[#002147]/10 pl-3">
                <h1 className="text-xl font-black text-[#002147] tracking-tighter uppercase leading-none">
                  SL POLICE <span className="text-[#f27024]">CSEU</span>
                </h1>
                <p className="text-[8px] font-bold text-[#64748b] tracking-[0.2em] uppercase mt-0.5">
                  EST. 1866 • CYBER UNIT
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {[
                "RESEARCH",
                "INVESTIGATIONS",
                "TRAINING",
                "PUBLIC",
                "ABOUT",
              ].map((item) => (
                <div key={item} className="group relative">
                  <button className="flex items-center gap-1 text-[11px] font-black text-[#002147] uppercase tracking-widest hover:text-[#f27024] transition-colors">
                    {item}{" "}
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  </button>
                  {/* Subtle hover line */}
                  <div className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#f27024] group-hover:w-full transition-all duration-300"></div>
                </div>
              ))}
              <Search className="w-5 h-5 text-[#002147] hover:text-[#f27024] cursor-pointer" />
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#002147]"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* HERO SECTION (SLIIT Style Slider) */}
        <section className="relative h-[400px] md:h-[600px] overflow-hidden bg-slate-100">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${i === activeSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"}`}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#002147]/80 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl uppercase tracking-tighter">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-lg text-white/90 font-medium leading-relaxed drop-shadow-md">
                      {slide.desc}
                    </p>
                    <div className="pt-4 flex gap-4">
                      <Link
                        href="/courtnotices"
                        className="bg-[#f27024] px-8 py-4 text-xs font-black text-white uppercase tracking-widest hover:bg-white hover:text-[#002147] transition-all rounded shadow-2xl flex items-center group"
                      >
                        {slide.cta}{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Slider controls */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeSlide ? "w-10 bg-[#f27024]" : "w-4 bg-white/40 hover:bg-white"}`}
              />
            ))}
          </div>
        </section>

        {/* "Shape Your Future" Grid (Service Categories) */}
        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-black text-[#002147] tracking-tighter leading-[1.1]">
                Shape Your Defense, <br />
                <span className="text-[#f27024]">Secure the Evidence</span>
              </h3>
            </div>
            <div className="space-y-6">
              {[
                {
                  label: "Citizen Submissions",
                  cat: "Direct Case Reporting",
                  color: "text-[#f27024]",
                },
                {
                  label: "Forensic Analysis",
                  cat: "Advanced Audit Systems",
                  color: "text-[#002147]",
                },
                {
                  label: "Cyber Intelligence",
                  cat: "Threat Mitigation Unit",
                  color: "text-[#002147]",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group cursor-pointer flex items-center justify-between p-4 border-b border-slate-100 hover:border-[#f27024] transition-all"
                >
                  <div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${item.color} mb-1 opacity-70`}
                    >
                      {item.label}
                    </p>
                    <p className="text-lg font-black text-[#002147] group-hover:translate-x-2 transition-transform">
                      {item.cat}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#f27024] group-hover:translate-x-2 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Shield />,
                  label: "Cyber Security",
                  color: "bg-blue-50",
                },
                {
                  icon: <Activity />,
                  label: "Forensics",
                  color: "bg-emerald-50",
                },
                {
                  icon: <Gavel />,
                  label: "Legal Intake",
                  color: "bg-orange-50",
                },
                { icon: <Search />, label: "Audit Log", color: "bg-purple-50" },
                { icon: <Lock />, label: "Safe Access", color: "bg-rose-50" },
                {
                  icon: <Users />,
                  label: "Citizen Portal",
                  color: "bg-sky-50",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-2xl flex flex-col items-center justify-center gap-4 h-48 group shadow-sm hover:shadow-xl transition-all border border-slate-50 cursor-pointer ${item.color}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-[#002147] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#002147] text-center">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT STATS (SLIIT Style) */}
        <section className="bg-[#002147] py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-widest leading-none">
                25+ <br />
                <span className="text-[#f27024] text-2xl md:text-3xl tracking-normal">
                  Years of Operational Excellence
                </span>
              </h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed max-w-md italic">
                "A legacy of digital sovereignty with thousands of successful
                forensic recoveries and verified legal submissions."
              </p>
              <div className="flex gap-10 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">600+</p>
                  <p className="text-[9px] text-[#f27024] font-black uppercase tracking-widest">
                    Active Experts
                  </p>
                </div>
                <div className="text-center border-l border-white/10 pl-10">
                  <p className="text-3xl font-black text-white">40K+</p>
                  <p className="text-[9px] text-[#f27024] font-black uppercase tracking-widest">
                    Case Closures
                  </p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#f27024]/20 blur-2xl group-hover:bg-[#f27024]/30 transition-all"></div>
              <img
                src="https://images.unsplash.com/photo-1544391682-178c6a583bbd?q=80&w=2672"
                className="relative rounded-2xl shadow-2xl border-4 border-white/10"
                alt="Team"
              />
              <div className="absolute -bottom-8 -right-8 bg-[#f27024] p-10 rounded-2xl shadow-2xl hidden md:block">
                <Play className="w-10 h-10 text-white fill-current" />
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-COLUMN COMPREHENSIVE FOOTER */}
        <footer className="bg-[#f8fafd] pt-24 pb-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <img
                src="/logo.png"
                alt="CSEU"
                className="h-16 grayscale opacity-80"
              />
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase pr-10">
                Official Digital Sovereign Gateway for the Openbird Cyber
                Security Enginnering Computer Crime Investigation Division. EST
                1866.
              </p>
              <div className="flex gap-4">
                <Facebook className="p-2 w-8 h-8 bg-slate-200 text-[#002147] rounded hover:bg-[#f27024] hover:text-white transition-all cursor-pointer" />
                <Youtube className="p-2 w-8 h-8 bg-slate-200 text-[#002147] rounded hover:bg-[#f27024] hover:text-white transition-all cursor-pointer" />
                <Twitter className="p-2 w-8 h-8 bg-slate-200 text-[#002147] rounded hover:bg-[#f27024] hover:text-white transition-all cursor-pointer" />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-[#002147] uppercase tracking-widest border-l-4 border-[#f27024] pl-4">
                Operations
              </h4>
              <ul className="space-y-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Case Submissions
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Forensic Intelligence
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Threat Monitoring
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Officer Portal
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-[#002147] uppercase tracking-widest border-l-4 border-[#f27024] pl-4">
                Legal Support
              </h4>
              <ul className="space-y-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Court Date Finder
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Evidence Repository
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Judicial Verification
                </li>
                <li className="hover:text-[#f27024] cursor-pointer transition-colors">
                  Privacy Council
                </li>
              </ul>
            </div>

            <div className="space-y-6 text-[#002147]">
              <h4 className="text-sm font-black text-[#002147] uppercase tracking-widest border-l-4 border-[#f27024] pl-4">
                Intelligence Feed
              </h4>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <p className="text-[10px] font-bold text-slate-500 italic">
                  "Stay informed with the latest cyber threat reports and
                  advisory updates directly to your terminal."
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Official Email"
                    className="bg-slate-50 border-none text-[10px] p-3 w-full outline-none font-bold"
                  />
                  <button className="bg-[#f27024] p-3 text-white rounded">
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-100 pt-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              © 2026 OPENBIRD CYBER SECURITY ENGINNERING • CSEU OFFICIAL PORTAL
            </p>
            <div className="flex gap-10 text-[9px] font-black text-[#002147] uppercase tracking-widest">
              <span className="hover:text-[#f27024] cursor-pointer">
                SITEMAP
              </span>
              <span className="hover:text-[#f27024] cursor-pointer">
                VIRTUAL TOUR
              </span>
              <span className="hover:text-[#f27024] cursor-pointer">
                ACCESSIBILITY
              </span>
            </div>
          </div>
        </footer>

        {/* Global Styles for Marquee/Animations */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
}
