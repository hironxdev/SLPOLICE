// Centralized API configuration for SLIIT Job Portal & Intelligence Feed
// IMPORTANT: For Railway hosting, set NEXT_PUBLIC_API_URL in your variables.

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Manual override for production
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost detection (SLIIT Portal specifically uses Port 8005)
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8005";
    }

    // 3. Fallback: Use relative origin
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
