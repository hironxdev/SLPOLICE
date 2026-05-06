// Centralized API configuration for CCID Intelligence Suite
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
      return "http://localhost:8000";
    }

    // 3. Fallback: Use relative path if on the same domain
    // This prevents the "Unexpected token <" error by hitting the current host's API route
    return window.location.origin;
  }
  return "http://localhost:8000";
};

export const API_URL = getBaseUrl();
// WS_URL should match the API domain
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
