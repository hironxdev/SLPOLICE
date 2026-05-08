// Legacy API Client for CSEU Main Suite
export const API_URL = "http://localhost:8005"; // Synchronized with new Forensic Port

export const apiHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/**
 * [FORENSIC_BRIDGE] Unified Fetch Wrapper with Auth Synthesis
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  
  // Auto-route to V1 Unified Intelligence Gateway
  const path = endpoint.startsWith("/api/v1") ? endpoint : `/api/v1${endpoint}`;
  
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...apiHeaders(token),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.message || `System Linkage Error: ${response.status}`);
  }

  const data = await response.json();

  // Legacy Normalization Shims
  if (endpoint.includes('login')) {
    return {
      token: data.access_token || data.token,
      user: data.user || { role: 'admin', username: 'admin' }
    };
  }

  return data;
};
