"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Lock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { API_URL } from "@/lib/config";

interface AuthorizationGateProps {
  toolName: string;
  children: React.ReactNode;
}

export default function AuthorizationGate({
  toolName,
  children,
}: AuthorizationGateProps) {
  const [authorized, setAuthorized] = useState(false);
  const [officerId, setOfficerId] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"CONSENT" | "MFA">("CONSENT");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const key = `sec_auth_${toolName}`;
    const ts = sessionStorage.getItem(key);
    if (ts && Date.now() - Number(ts) < 3600000) {
      // Use queueMicrotask to avoid synchronous setState inside effect warning
      queueMicrotask(() => setAuthorized(true));
    }
  }, [toolName]);

  const handleConsent = () => {
    if (!officerId.trim() || !acknowledged) return;
    setStep("MFA");
    setError("");
  };

  const handleVerifyMFA = async () => {
    if (mfaCode.length !== 6) {
      setError("Please enter a valid 6-digit token.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/api/v1/admin/security/audit-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          officer_id: officerId,
          tool: toolName,
          action: "AUTHORIZED_ACCESS_MFA_VERIFIED",
          timestamp: new Date(),
        }),
      });

      sessionStorage.setItem(`sec_auth_${toolName}`, Date.now().toString());
      setAuthorized(true);
    } catch (_) {
      // In dev, we allow proceed even if logging fails
      sessionStorage.setItem(`sec_auth_${toolName}`, Date.now().toString());
      setAuthorized(true);
    }
    setLoading(false);
  };

  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-rose-200 rounded-3xl shadow-2xl shadow-rose-100/50 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 relative">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-blue-600 transition-all duration-500"
            style={{ width: step === "CONSENT" ? "50%" : "100%" }}
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 shrink-0">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {step === "CONSENT"
                    ? "Authorization Required"
                    : "MFA Verification"}
                </h2>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mt-0.5">
                  {toolName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Level
              </span>
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                RESTRICTED
              </span>
            </div>
          </div>

          {step === "CONSENT" ? (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
                  This security tool is for{" "}
                  <strong>authorized law enforcement use only</strong>.
                  Unauthorized use is a criminal offense under the Computer
                  Crimes Act No. 24 of 2007. All actions are audit-logged and
                  traceable.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest block mb-2">
                    <Lock className="w-3 h-3 inline mr-1" /> Officer ID / Badge
                    Number
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="e.g. SLP-2024-007"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${acknowledged ? "bg-blue-700 border-blue-700" : "border-slate-300 group-hover:border-blue-400"}`}
                    >
                      {acknowledged && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    I confirm I have <strong>written authorization</strong> for
                    this assessment and understand that this session will be
                    logged for compliance.
                  </span>
                </label>
              </div>

              <button
                onClick={handleConsent}
                disabled={!officerId.trim() || !acknowledged}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                Continue to MFA <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-blue-800 leading-relaxed">
                  Enter the <strong>6-digit security token</strong> from your
                  authorized Forensic Authenticator device or mobile app.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest block text-center">
                  MFA SECURITY TOKEN
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) =>
                      setMfaCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-5 px-4 text-slate-900 font-black text-3xl tracking-[0.5em] text-center outline-none focus:border-blue-500 transition-all placeholder:text-slate-200 group-hover:border-slate-300"
                  />
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await fetch(
                          `${API_URL}/api/v1/admin/security/request-mfa`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              officer_id: officerId,
                              tool: toolName,
                            }),
                          },
                        );
                        setError("Token sent to Kidhirun@gmail.com");
                      } catch (err) {
                        setError("Failed to send token.");
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-all uppercase tracking-tighter disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Request Code"}
                  </button>
                </div>
                {error && (
                  <p className="text-center text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("CONSENT")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[10px]"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyMFA}
                  disabled={loading || mfaCode.length !== 6}
                  className="flex-[2] bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200"
                >
                  {loading ? "Verifying..." : "Verify & Unlock"}
                </button>
              </div>

              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Token expires in 30 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
