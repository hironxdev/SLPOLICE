// Centralized API configuration for SLIIT Job Portal & Intelligence Feed

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Production Variable (RAILWAY DASHBOARD)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost fallback
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }

    // 3. Absolute Fallback
    // This uses your Current Website URL. If your backend is in the same project, this is usually correct.
    return window.location.origin;
  }
  return "http://localhost:8005";
};

export const API_URL = getBaseUrl();
export const WS_URL = API_URL.replace("http", "ws");

// Diagnostic log for deployment debugging
if (typeof window !== "undefined") {
  console.log(`[SYS] Intelligence Uplink Target: ${API_URL}`);
}

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
