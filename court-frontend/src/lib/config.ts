// Centralized API configuration for SLIIT Job Portal & Intelligence Feed
// IMPORTANT: For Railway hosting, ensure you set NEXT_PUBLIC_API_URL in your variables.

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Check for manual environment variable (High Priority)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }

    // 3. Railway-to-Railway smart detection
    // If your frontend is 'slit.up.railway.app', this tries to find 'slit-backend.up.railway.app'
    if (window.location.hostname.includes("railway.app")) {
      return window.location.origin.replace("slit", "slit-backend");
    }

    // 4. Fallback: Use the current domain
    return window.location.origin;
  }
  return "http://localhost:8005";
};

export const API_URL = getBaseUrl();
export const WS_URL = API_URL.replace("http", "ws");

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
