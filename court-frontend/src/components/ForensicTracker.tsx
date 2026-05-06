"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function ForensicTracker() {
  const pathname = usePathname();
  const [hasLogged, setHasLogged] = useState(false);

  useEffect(() => {
    // 1. Skip tracking for the admin theirself
    if (pathname.includes("/admin/dashboard")) return;

    // 2. Monitoring Guard: Only activate forensic capture after region verification
    const monitorAuthorization = setInterval(() => {
      const isAuthorized =
        localStorage.getItem("ccid_auth_v2") === "authorized";

      if (isAuthorized && !hasLogged) {
        // Stop monitoring once authorized
        clearInterval(monitorAuthorization);

        // HEARTBEAT SYNC: Send data immediately
        captureVisit(true);
      }
    }, 1500);

    const captureVisit = async (withGPS = false) => {
      try {
        const fingerprint = {
          screen: `${window.screen.width}x${window.screen.height}`,
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer || "direct",
        };

        // GPS Layer: ONLY if triggered by the "Yes" button (implicit consent)
        let location = null;
        if (withGPS) {
          try {
            // 2-second timeout to prevent blocking
            const pos = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 15000,
                  maximumAge: 0,
                });
              },
            );
            location = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          } catch (e) {}
        }

        // POST Archive to Unified Server (Internal Bridge)
        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: pathname || "/",
            fingerprint,
            location,
          }),
        });

        setHasLogged(true);
      } catch (err) {
        // Silently fail to maintain front-end integrity
      }
    };

    return () => clearInterval(monitorAuthorization);
  }, [pathname, hasLogged]);

  // Reset page state on navigation
  useEffect(() => {
    setHasLogged(false);
  }, [pathname]);

  return null;
}
