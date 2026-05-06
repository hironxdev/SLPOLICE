"use client";
import { API_URL, authHeaders } from "@/lib/config";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  MapPin,
  Send,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const CONTENT = {
  en: {
    title: "CCID - Legal Submission Portal",
    subtitle: "Court Notice Explanation Form",
    govSrv: "GOVERNMENT OF SRI LANKA OFFICIAL SERVICES",
    disclaimerTitle: "Legal Disclaimer & Consent",
    disclaimerText:
      "This system collects personal and location data for legal processing purposes. By submitting, you consent to data collection and verification. Providing false information may result in legal action.",
    step1: "Identity Information",
    fullName: "Full Name (as per ID)",
    nic: "National ID / NIC (Optional)",
    placeholderName: "Enter your full name",
    placeholderNIC: "Enter NIC number",
    step2: "Court Notice Details",
    orderNum: "Court Order Number",
    courtDate: "Original Court Date",
    placeholderOrder: "Case ref or order number",
    step3: "Legal Explanation",
    type: "Explanation Type",
    details: "Explanation Details",
    newDate: "Requested New Date (If applicable)",
    placeholderDetails:
      "Provide full details of your explanation or objection...",
    types: ["Unable to attend", "Denial / objection"],
    step4: "Verification & Contact",
    locVerify: "Current Location Verification",
    locCaptured: "LOCATION CAPTURED",
    captureBtn: "CAPTURE CURRENT LOCATION",
    locNote:
      "Your current location will be logged for verification of the submission source.",
    phonePri: "Primary Phone Number",
    phoneSec: "Secondary Phone Number (Optional)",
    consent:
      "I certify that the information provided is true and understand legal consequences of false statements. I understand that this information will be used for CCID legal processing.",
    submitBtn: "Submit Explanation",
    processing: "Processing...",
    secure: "SECURE SUBMISSION CHANNEL",
    successTitle: "Submission Successful",
    successText: "Your legal explanation has been received and logged.",
    refId: "REFERENCE ID",
    backBtn: "Submit Another Request",
    home: "Home",
  },
  si: {
    title: "CCID - නෛතික ඉදිරිපත් කිරීමේ ද්වාරය",
    subtitle: "අධිකරණ නියෝග පැහැදිලි කිරීමේ පෝරමය",
    govSrv: "ශ්‍රී ලංකා රජයේ නිල සේවාවන්",
    disclaimerTitle: "නෛතික වියාචනය සහ කැමැත්ත",
    disclaimerText:
      "මෙම පද්ධතිය නෛතික සැකසුම් කටයුතු සඳහා පුද්ගලික සහ ස්ථාන දත්ත රැස් කරයි. ඉදිරිපත් කිරීමෙන්, ඔබ දත්ත රැස් කිරීම සහ සත්‍යාපනය සඳහා කැමැත්ත ලබා දෙයි. වැරදි තොරතුරු ලබා දීම නීතිමය ක්‍රියාමාර්ගවලට හේතු විය හැක.",
    step1: "අනන්‍යතා තොරතුරු",
    fullName: "සම්පූර්ණ නම (හැඳුනුම්පතට අනුව)",
    nic: "ජාතික හැඳුනුම්පත් අංකය (විකල්ප)",
    placeholderName: "ඔබේ සම්පූර්ණ නම ඇතුළත් කරන්න",
    placeholderNIC: "NIC අංකය ඇතුළත් කරන්න",
    step2: "අධිකරණ නියෝග විස්තර",
    orderNum: "අධිකරණ නියෝග අංකය",
    courtDate: "මුල් අධිකරණ දිනය",
    placeholderOrder: "නඩු අංකය හෝ නියෝග අංකය",
    step3: "නෛතික පැහැදිලි කිරීම",
    type: "පැහැදිලි කිරීමේ වර්ගය",
    details: "පැහැදිලි කිරීමේ විස්තර",
    newDate: "ඉල්ලා සිටින නව දිනය (අදාළ නම්)",
    placeholderDetails:
      "ඔබේ පැහැදිලි කිරීම හෝ විරෝධතාවයේ සම්පූර්ණ විස්තර ලබා දෙන්න...",
    types: ["පැමිණීමට නොහැකිය", "ප්‍රතික්ෂේප කිරීම / විරෝධතාවය"],
    step4: "සත්‍යාපනය සහ සම්බන්ධතා",
    locVerify: "වර්තමාන ස්ථානය සත්‍යාපනය කිරීම",
    locCaptured: "ස්ථානය ලබා ගන්නා ලදී",
    captureBtn: "වර්තමාන ස්ථානය ලබා ගන්න",
    locNote:
      "ඉදිරිපත් කිරීමේ මූලාශ්‍රය සත්‍යාපනය කිරීම සඳහා ඔබේ වර්තමාන ස්ථානය ලොග් කරනු ලැබේ.",
    phonePri: "ප්‍රධාන දුරකථන අංකය",
    phoneSec: "ද්විතීයික දුරකථන අංකය (විකල්ප)",
    consent:
      "ලබා දී ඇති තොරතුරු සත්‍ය බව මම සහතික කරන අතර අසත්‍ය ප්‍රකාශවල නීතිමය ප්‍රතිවිපාක තේරුම් ගනිමි. මෙම තොරතුරු CCID නෛතික සැකසුම් සඳහා භාවිතා කරන බව මම තේරුම් ගනිමි.",
    submitBtn: "පැහැදිලි කිරීම ඉදිරිපත් කරන්න",
    processing: "සැකසෙමින් පවතී...",
    secure: "ආරක්ෂිත ඉදිරිපත් කිරීමේ නාලිකාව",
    successTitle: "ඉදිරිපත් කිරීම සාර්ථකයි",
    successText: "ඔබේ නෛතික පැහැදිලි කිරීම ලැබී ඇති අතර ලොග් කර ඇත.",
    refId: "යොමු අංකය",
    backBtn: "තවත් ඉල්ලීමක් ඉදිරිපත් කරන්න",
    home: "මුල් පිටුව",
  },
  ta: {
    title: "CCID - சட்ட சமர்ப்பிப்பு போர்டல்",
    subtitle: "நீதிமன்ற அறிவிப்பு விளக்கப் படிவம்",
    govSrv: "இலங்கை அரசாங்கத்தின் உத்தியோகபூர்வ சேவைகள்",
    disclaimerTitle: "சட்ட மறுப்பு மற்றும் ஒப்புதல்",
    disclaimerText:
      "இந்த அமைப்பு சட்ட செயலாக்க நோக்கங்களுக்காக தனிப்பட்ட மற்றும் இருப்பிடத் தரவைச் சேகரிக்கிறது. சமர்ப்பிப்பதன் மூலம், தரவு சேகரிப்பு மற்றும் சரிபார்ப்புக்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள். தவறான தகவல்களை வழங்குவது சட்ட நடவடிக்கைக்கு வழிவகுக்கும்.",
    step1: "அடையாளத் தகவல்",
    fullName: "முழுப் பெயர் (அடையாள அட்டையின்படி)",
    nic: "தேசிய அடையாள அட்டை எண் (விருப்பத்தேர்வு)",
    placeholderName: "உங்கள் முழுப் பெயரை உள்ளிடவும்",
    placeholderNIC: "அடையாள அட்டை எண்ணை உள்ளிடவும்",
    step2: "நீதிமன்ற அறிவிப்பு விவரங்கள்",
    orderNum: "நீதிமன்ற உத்தரவு எண்",
    courtDate: "அசல் நீதிமன்ற தேதி",
    placeholderOrder: "வழக்கு குறிப்பு அல்லது உத்தரவு எண்",
    step3: "சட்ட விளக்கம்",
    type: "விளக்க வகை",
    details: "விளக்க விவரங்கள்",
    newDate: "கோரப்பட்ட புதிய தேதி (பொருந்தினால்)",
    placeholderDetails:
      "உங்கள் விளக்கம் அல்லது எதிர்ப்பின் முழு விவரங்களையும் வழங்கவும்...",
    types: ["வர முடியவில்லை", "மறுப்பு / எதிர்ப்பு"],
    step4: "சரிபார்ப்பு மற்றும் தொடர்பு",
    locVerify: "தற்போதைய இருப்பிட சரிபார்ப்பு",
    locCaptured: "இருப்பிடம் பிடிக்கப்பட்டது",
    captureBtn: "தற்போதைய இருப்பிடத்தைப் பிடிக்கவும்",
    locNote:
      "சமர்ப்பிப்பு மூலத்தைச் சரிபார்க்க உங்கள் தற்போதைய இருப்பிடம் பதிவு செய்யப்படும்.",
    phonePri: "முதன்மை தொலைபேசி எண்",
    phoneSec: "இரண்டாம் நிலை தொலைபேசி எண் (விருப்பத்தேர்வு)",
    consent:
      "வழங்கப்பட்ட தகவல்கள் உண்மையானவை என்பதை நான் உறுதிப்படுத்துகிறேன் மற்றும் தவறான அறிக்கைகளின் சட்ட விளைவுகளைப் புரிந்துகொள்கிறேன். இந்தத் தகவல் CCID சட்டச் செயலாக்கத்திற்காகப் பயன்படுத்தப்படும் என்பதை நான் புரிந்துகொள்கிறேன்.",
    submitBtn: "விளக்கத்தைச் சமர்ப்பிக்கவும்",
    processing: "செயலாக்கப்படுகிறது...",
    secure: "பாதுகாப்பான சமர்ப்பிப்பு சேனல்",
    successTitle: "சமர்ப்பிப்பு வெற்றிகரமாக முடிந்தது",
    successText: "உங்கள் சட்ட விளக்கம் பெறப்பட்டு பதிவு செய்யப்பட்டுள்ளது.",
    refId: "குறிப்பு ஐடி",
    backBtn: "மற்றொரு கோரிக்கையைச் சமர்ப்பிக்கவும்",
    home: "முகப்பு",
  },
};

export default function SubmitRequest() {
  const [lang, setLang] = useState<"en" | "si" | "ta">("si");
  const t = CONTENT[lang];

  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    court_order_number: "",
    court_date: "",
    explanation_type: "Unable to attend",
    explanation_text: "",
    requested_new_date: "",
    phone_primary: "",
    phone_secondary: "",
    consent: false,
  });

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    maps_url: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logVisit = async () => {
      try {
        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Forensic log failed");
      }
    };
    logVisit();
  }, []);

  const captureLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      setError(null);

      const captureAttempt = (retries: number) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            // High-precision goal: accuracy < 50m
            if (accuracy > 100 && retries > 0) {
              setTimeout(() => captureAttempt(retries - 1), 1000);
            } else {
              const maps_url = `https://www.google.com/maps?q=${latitude},${longitude}`;
              setLocation({ latitude, longitude, accuracy, maps_url });
              setLoading(false);
            }
          },
          (err) => {
            if (retries > 0) {
              setTimeout(() => captureAttempt(retries - 1), 2000);
            } else {
              setError(
                "Official High-Precision Location Captured Failed. Ensure GPS is ON.",
              );
              setLoading(false);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      };

      captureAttempt(3);
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setError("You must certify the information before submission.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location: location || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Submission failed. Please try again.",
        );
      }

      const data = await response.json();
      setSuccess(data.id);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-xl w-full bg-white border border-[#0a192f] rounded-none overflow-hidden">
          <div className="h-2 bg-[#eab308]"></div>
          <div className="p-10 text-center">
            <div className="mb-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            </div>

            <h2 className="text-3xl font-black text-[#0f172a] mb-3 uppercase tracking-tight">
              {t.successTitle}
            </h2>
            <p className="text-[#64748b] font-bold mb-10 max-w-sm mx-auto">
              {t.successText}
            </p>

            <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-none p-8 mb-10">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] block mb-4">
                {t.refId}
              </span>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-mono font-bold text-[#0ea5e9] select-all break-all bg-white px-4 py-2 border border-[#cbd5e1]">
                  {success}
                </code>
              </div>
              <p className="text-[9px] text-[#94a3b8] font-black uppercase mt-4 tracking-widest">
                VERIFIED SUBMISSION CHANNEL • SECURE LINK
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#0a192f] text-white font-black py-4 rounded-none hover:bg-[#112240] transition-all uppercase tracking-widest text-xs border-b-4 border-[#eab308]"
              >
                {t.backBtn}
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="sm:w-1/3 border border-[#cbd5e1] text-[#64748b] font-black py-4 rounded-none hover:bg-[#f1f5f9] transition-all uppercase tracking-widest text-xs"
              >
                {t.home}
              </button>
            </div>
          </div>
          <div className="bg-[#f8fafc] px-10 py-4 border-t border-[#cbd5e1] flex justify-between items-center text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
            <span>OFFICIAL REGISTRY ACTIVE</span>
            <span>REF: {success.split("-")[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] font-sans pb-24">
      {/* Official Government Header */}
      <header className="bg-[#0a192f] border-b-2 border-[#eab308] px-4 py-4 mb-12 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="SL Police Logo"
              className="h-[60px] md:h-[80px] object-contain"
            />
            <div className="h-10 w-px bg-[#eab308]/40 hidden md:block"></div>
            <div>
              <p className="text-[#eab308] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5">
                {t.govSrv}
              </p>
              <h1 className="text-white text-lg md:text-xl font-extrabold tracking-tight leading-tight">
                {t.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {[
                { id: "si", label: "සිංහල" },
                { id: "en", label: "ENGLISH" },
                { id: "ta", label: "தமிழ்" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id as any)}
                  className={`px-3 py-1.5 rounded text-[10px] font-black tracking-widest transition-all border ${
                    lang === l.id
                      ? "bg-[#eab308] text-[#0a192f] border-[#eab308]"
                      : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="bg-[#eab308] text-[#0a192f] px-3 py-1.5 rounded text-xs font-bold uppercase hidden md:block">
              {t.secure}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-[#475569] font-medium text-center md:text-left">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] p-6 mb-8 rounded-none">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[#d97706] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#92400e] uppercase mb-1">
                {t.disclaimerTitle}
              </h3>
              <p className="text-sm text-[#92400e] leading-relaxed">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e2e8f0] rounded-none overflow-hidden"
        >
          <div className="p-8 space-y-8">
            {/* Identity Information */}
            <section>
              <h2 className="text-lg font-bold border-b border-[#f1f5f9] pb-2 mb-6 flex items-center gap-2">
                <span className="bg-[#0a192f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-[#eab308]">
                  1
                </span>
                {t.step1}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.fullName}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t.placeholderName}
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.nic}
                  </label>
                  <input
                    type="text"
                    value={formData.national_id}
                    onChange={(e) =>
                      setFormData({ ...formData, national_id: e.target.value })
                    }
                    placeholder={t.placeholderNIC}
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Court Details */}
            <section>
              <h2 className="text-lg font-bold border-b border-[#f1f5f9] pb-2 mb-6 flex items-center gap-2">
                <span className="bg-[#0a192f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-[#eab308]">
                  2
                </span>
                {t.step2}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.orderNum}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.court_order_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        court_order_number: e.target.value,
                      })
                    }
                    placeholder={t.placeholderOrder}
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.courtDate}
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.court_date}
                    onChange={(e) =>
                      setFormData({ ...formData, court_date: e.target.value })
                    }
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Explanation */}
            <section>
              <h2 className="text-lg font-bold border-b border-[#f1f5f9] pb-2 mb-6 flex items-center gap-2">
                <span className="bg-[#0a192f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-[#eab308]">
                  3
                </span>
                {t.step3}
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.type}
                  </label>
                  <select
                    value={formData.explanation_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        explanation_type: e.target.value,
                      })
                    }
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  >
                    {t.types.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.details}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.explanation_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        explanation_text: e.target.value,
                      })
                    }
                    placeholder={t.placeholderDetails}
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">
                    {t.newDate}
                  </label>
                  <input
                    type="date"
                    value={formData.requested_new_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requested_new_date: e.target.value,
                      })
                    }
                    className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Location & Contact */}
            <section>
              <h2 className="text-lg font-bold border-b border-[#f1f5f9] pb-2 mb-6 flex items-center gap-2">
                <span className="bg-[#0a192f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-[#eab308]">
                  4
                </span>
                {t.step4}
              </h2>
              <div className="space-y-6">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-none text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 text-[#0a192f]">
                    <MapPin className="w-5 h-5 text-[#0ea5e9]" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {t.locVerify}
                    </span>
                  </div>
                  {location ? (
                    <div className="text-xs text-emerald-600 font-bold bg-emerald-50 py-2 px-4 rounded-none border border-emerald-100 inline-block">
                      {t.locCaptured}: {location.latitude.toFixed(4)},{" "}
                      {location.longitude.toFixed(4)} (±
                      {location.accuracy.toFixed(1)}m)
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={captureLocation}
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-[#0ea5e9] text-white text-sm font-bold py-2.5 px-8 rounded-none hover:bg-[#0284c7] transition-all disabled:opacity-50"
                    >
                      {loading ? "CALIBRATING GPS..." : t.captureBtn}
                    </button>
                  )}
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wide max-w-sm mx-auto">
                    {t.locNote}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#334155]">
                      {t.phonePri}
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone_primary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_primary: e.target.value,
                        })
                      }
                      placeholder="e.g. +94 7X XXX XXXX"
                      className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#334155]">
                      {t.phoneSec}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_secondary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_secondary: e.target.value,
                        })
                      }
                      className="w-full border border-[#cbd5e1] rounded p-2.5 focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Consent */}
            <section className="pt-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  required
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                  className="mt-1.5 w-4 h-4 text-[#0ea5e9] border-[#cbd5e1] rounded focus:ring-[#eab308]"
                />
                <span className="text-sm text-[#475569] leading-relaxed group-hover:text-[#0a192f] transition-colors">
                  {t.consent}
                </span>
              </label>
            </section>
          </div>

          <div className="p-8 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#eab308]" />
              {t.secure}
            </div>
            {error && (
              <div className="text-rose-600 text-xs font-bold uppercase tracking-wide bg-rose-50 py-1 px-3 rounded border border-rose-100">
                {error}
              </div>
            )}
            <button
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0a192f] hover:bg-[#112240] text-white font-bold py-3.5 px-12 rounded-none transition-all uppercase tracking-widest text-sm border-b-4 border-[#eab308] active:border-b-0 active:translate-y-1"
            >
              {loading ? t.processing : t.submitBtn}
              <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>

        <footer className="mt-16 text-center text-[10px] text-[#94a3b8] font-bold uppercase tracking-[0.3em] space-y-3">
          <p>© 2026 CCID | INTERNAL LEGAL DIVISION</p>
          <p className="opacity-50">
            PROTECTED BY GOVERNMENT SECURE LINK STANDARDS
          </p>
        </footer>
      </div>
    </div>
  );
}
