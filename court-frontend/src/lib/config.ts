// Centralized API configuration for CCID Intelligence Suite
// When deploying to web hosting, set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL
// in your hosting provider's environment variable settings.

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

export const apiHeaders = (token?: string | null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  return apiHeaders(token);
};
