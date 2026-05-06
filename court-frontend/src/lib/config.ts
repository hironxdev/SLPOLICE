// Centralized API configuration for SLIIT Job Portal & Intelligence Feed

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Production (RAILWAY SINGLE-SERVICE MODE)
    // By returning an empty string, the browser hits the same domain (relative)
    // The Next.js rewrite in next.config.ts will then proxy it to the backend.
    if (window.location.hostname.includes("railway.app")) {
      return "";
    }

    // 2. Localhost detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }
  }
  return "";
};

export const API_URL = getBaseUrl();
export const WS_URL = API_URL
  ? API_URL.replace("http", "ws")
  : "ws://localhost:8005";

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
