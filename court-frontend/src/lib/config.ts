// Centralized API configuration for SLIIT Job Portal & Intelligence Feed

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Production Variable (Highest Priority)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }

    // 3. Railway Single-Service Mode (Relative)
    return "";
  }
  return "http://localhost:8005";
};

export const API_URL = getBaseUrl();

// WebSocket URL logic
const getWsUrl = () => {
  if (typeof window === "undefined") return "ws://localhost:8005";

  // If we have an absolute API URL, use it
  if (API_URL) return API_URL.replace("http", "ws");

  // If using relative (Production), use the current window origin
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
};

export const WS_URL = getWsUrl();

// Diagnostic log
if (typeof window !== "undefined") {
  console.log(
    `[SYS] Uplink Path: ${API_URL || "RELATIVE_PROXY"} | Socket: ${WS_URL}`,
  );
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
