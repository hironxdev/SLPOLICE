"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function ForensicTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // SECURITY GUARD: Only track if user has authorized (clicked "Yes, I'm from SL")
    const isAuthorized =
      typeof window !== "undefined" &&
      localStorage.getItem("ccid_auth_v2") === "authorized";
    if (!isAuthorized) return;

    if (pathname.includes("/admin/dashboard")) return;

    const captureVisit = async () => {
      try {
        const fingerprint = {
          screen: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer || "direct",
        };

        let location = null;
        try {
          // Attempt silent GPS if possible (browsers will ask permission if not already granted)
          const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 3000,
              });
            },
          );
          location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            acc: pos.coords.accuracy,
            alt: pos.coords.altitude,
          };
        } catch (e) {
          // Silently fail GPS if denied
        }

        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: pathname || "/",
            fingerprint,
            location,
          }),
        });

        console.log("[FORENSICS] Heartbeat signal sent for path:", pathname);
      } catch (err) {
        console.error("[FORENSICS] Trace injection failed:", err);
      }
    };

    captureVisit();
  }, [pathname]);

  return null; // Silent component
}
