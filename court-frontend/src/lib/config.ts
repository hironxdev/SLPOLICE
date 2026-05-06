// Centralized API configuration for SLIIT Job Portal (Two-Service Mode)

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Priority: Use the Backend URL from Railway Variables
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost fallback
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }

    // 3. Fallback: Use relative origin (for single-service mode)
    return "";
  }
  return "http://localhost:8005";
};

export const API_URL = getBaseUrl();

const getWsUrl = () => {
  if (typeof window === "undefined") return "ws://localhost:8005";
  if (API_URL) {
    // If it's a full URL, convert it to ws/wss
    return API_URL.replace("http", "ws");
  }
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
