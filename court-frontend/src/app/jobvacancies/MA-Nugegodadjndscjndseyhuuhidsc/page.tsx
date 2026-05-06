"use client";
import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Globe,
  ArrowRight,
  FileText,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Briefcase,
  BookOpen,
  Activity,
  Award,
  Calendar,
} from "lucide-react";

export default function JobApplicationPage() {
  const [showAuth, setShowAuth] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
    al_results: "",
    ol_english: "",
    ol_ict: "",
    skills: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState(
    "VERIFYING_CONNECTION...",
  );

  useEffect(() => {
    const auth = localStorage.getItem("ccid_auth_v2");
    if (auth) setShowAuth(false);
  }, []);

  const handleAuthorize = () => {
    localStorage.setItem("ccid_auth_v2", "authorized");
    setShowAuth(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted.");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  useEffect(() => {
    if (showAuth) return;
    setSecurityStatus("SECURE_UPLINK: ACTIVE");
  }, [showAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please upload your CV (PDF)");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/jobs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          fingerprint: {
            ua: navigator.userAgent,
            platform: navigator.platform,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const d = await res.json();
        throw new Error(d.error || "Submission failed");
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to process application at this moment. Please check your network.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Institutional Security Banner */}
      {showAuth && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-sm z-[5000] animate-in slide-in-from-bottom-5 duration-700">
          <div className="bg-[#002147] border-2 border-orange-500/30 p-6 shadow-2xl relative">
            <div className="flex gap-4 items-start">
              <Globe className="w-8 h-8 text-orange-500 shrink-0" />
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-white font-black uppercase text-sm">
                    Are you from Sri Lanka?
                  </h2>
                  <p className="text-[10px] text-blue-100 font-medium">
                    SLIIT requires confirmation of your region to initialize
                    security protocols and application eligibility checks.
                  </p>
                </div>
                <button
                  onClick={handleAuthorize}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-2.5 uppercase text-[10px] tracking-widest transition-all"
                >
                  Yes, I'm from Sri Lanka
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white font-sans text-[#002147] pb-20 selection:bg-orange-100 selection:text-orange-900">
        {/* SLIIT Header Overlay */}
        <div className="bg-[#f8fafd] border-b border-slate-200 py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <img src="/logo.png" alt="SLIIT" className="h-16" />
            <div className="text-center md:text-right space-y-1">
              <h1 className="text-xl font-black uppercase tracking-tighter">
                Vacancy Announcement
              </h1>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Sri Lanka Institute of Information Technology (SLIIT)
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-12 space-y-16">
          {/* Institutional Intro */}
          <section className="space-y-6">
            <div className="bg-blue-50/50 p-8 border-l-4 border-[#002147] rounded-r-2xl">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                "SLIIT is a leading non-state higher education institute in Sri
                Lanka, recognized globally for excellence in IT, Business, and
                Engineering education. At SLIIT, we empower individuals to
                thrive in a professional academic environment."
              </p>
            </div>

            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Position
                  </p>
                  <p className="text-sm font-black uppercase">
                    Management Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-sm font-black uppercase">
                    Nugegoda Branch
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Closing Date
                  </p>
                  <p className="text-sm font-black uppercase">18th May 2026</p>
                </div>
              </div>
            </div>
          </section>

          {/* Job Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" /> Key
                  Responsibilities
                </h3>
                <ul className="text-[11px] font-bold text-slate-600 space-y-3 pl-4">
                  <li className="flex gap-2">
                    <span>-</span> Assist in administrative and operational
                    processes
                  </li>
                  <li className="flex gap-2">
                    <span>-</span> Maintain documents and records systematically
                  </li>
                  <li className="flex gap-2">
                    <span>-</span> Coordinate events, workshops, and activities
                  </li>
                  <li className="flex gap-2">
                    <span>-</span> Handle official communication and office
                    support
                  </li>
                  <li className="flex gap-2">
                    <span>-</span> Perform duties assigned by management
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />{" "}
                  Qualifications
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                      G.C.E. A/L
                    </p>
                    <p className="text-[11px] font-bold">
                      Minimum of 3 passes (S) in any stream.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                      G.C.E. O/L
                    </p>
                    <p className="text-[11px] font-bold">
                      Good results in English and ICT required.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                      Experience
                    </p>
                    <p className="text-[11px] font-bold">
                      0–2 years relevant experience preferred.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#002147] px-8 py-5 flex items-center justify-between">
                <h3 className="text-white font-black uppercase text-xs tracking-widest">
                  Application Form
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-400 text-xs font-bold"
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-400 text-xs font-bold"
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        Phone
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-400 text-xs font-bold"
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        NIC Number
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-400 text-xs font-bold"
                        onChange={(e) =>
                          setFormState({ ...formState, nic: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      A/L Results
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Commerce: 3S"
                      className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-orange-400 text-xs font-bold"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          al_results: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      required
                      className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-xs font-bold"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          ol_english: e.target.value,
                        })
                      }
                    >
                      <option value="">O/L English</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="S">S</option>
                    </select>
                    <select
                      required
                      className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-xs font-bold"
                      onChange={(e) =>
                        setFormState({ ...formState, ol_ict: e.target.value })
                      }
                    >
                      <option value="">O/L ICT</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="S">S</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 border-dashed ${selectedFile ? "border-emerald-500 bg-emerald-50" : "border-slate-200"} rounded-2xl text-center space-y-1 group hover:border-orange-400 transition-all`}
                >
                  <p
                    className={`text-[9px] font-black uppercase ${selectedFile ? "text-emerald-700" : "text-slate-500"}`}
                  >
                    {selectedFile
                      ? `CV READY: ${selectedFile.name}`
                      : "Upload CV (PDF Only)"}
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="inline-block cursor-pointer text-[9px] font-black uppercase text-blue-500 hover:text-orange-600"
                  >
                    {selectedFile ? "Change Attachment" : "Select PDF File"}
                  </label>
                </div>

                {error && (
                  <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest text-center animate-pulse">
                    {error}
                  </p>
                )}

                {!submitted ? (
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#002147] hover:bg-[#f27024] text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3"
                  >
                    {loading
                      ? "PROCESSING APPLICATION..."
                      : "Submit Application"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="bg-emerald-600 text-white p-4 rounded-xl text-center">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Application Submitted
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Institutional Footer */}
          <footer className="pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  © 2026 Sri Lanka Institute of Information Technology
                </p>
                <p className="text-[9px] font-bold text-slate-400 max-w-xs leading-relaxed">
                  SLIIT is a leading higher education institute recognized by
                  the University Grants Commission (UGC) of Sri Lanka.
                </p>
              </div>
              <div className="flex gap-8 text-[9px] font-black uppercase text-slate-400">
                <span className="hover:text-orange-500 cursor-pointer">
                  Privacy Policy
                </span>
                <span className="hover:text-orange-500 cursor-pointer">
                  Confidentiality
                </span>
                <span className="hover:text-orange-500 cursor-pointer">
                  Careers Help
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
