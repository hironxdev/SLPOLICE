// Legacy API Client for CCID Main Suite
export const API_URL = "http://localhost:8005"; // Synchronized with new Forensic Port

export const apiHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
