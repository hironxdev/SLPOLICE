// Centralized API configuration for SLIIT Job Portal & Intelligence Feed

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // FORCE RELATIVE MODE ON RAILWAY
    // If we are on a railway.app domain, we MUST use the internal proxy (relative path)
    if (window.location.hostname.includes("railway.app")) {
      return "";
    }

    // 1. Production Variable (For external backends only)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }
  }
  return "http://localhost:8005";
};

export const API_URL = getBaseUrl();

const getWsUrl = () => {
  if (typeof window === "undefined") return "ws://localhost:8005";
  if (API_URL) return API_URL.replace("http", "ws");
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
};

export const WS_URL = getWsUrl();

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
