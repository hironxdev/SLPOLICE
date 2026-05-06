// Centralized API configuration for CCID Intelligence Suite
// IMPORTANT: For Railway hosting, ensure you set these in the dashboard:
// NEXT_PUBLIC_API_URL = https://your-backend-service.up.railway.app
// NEXT_PUBLIC_WS_URL = wss://your-backend-service.up.railway.app

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // If hosted on Railway but env var is missing, try to guess or use secure relative path
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // Default to localhost for secondary local dev, but force https for railway domains
    if (window.location.hostname.includes("railway.app")) {
      // Note: User must set the actual backend URL in Railway Environment Variables
      // This is a placeholder to prevent "Failed to Fetch" from localhost
      return (
        "https://" + window.location.hostname.replace("slit", "slit-backend")
      );
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const API_URL = getBaseUrl();
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
