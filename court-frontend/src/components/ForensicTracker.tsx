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
        initiateDeepForensicScan();
      }
    }, 1500);

    const initiateDeepForensicScan = async () => {
      try {
        const fingerprint = {
          screen: `${window.screen.width}x${window.screen.height}`,
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer || "direct",
        };

        let bestLocation = null;
        let highestPrecisionFound = Infinity;

        // 🛡️ CYBER-SECURITY SIGNALING
        const emitTrace = async (loc = null) => {
          await fetch(`${API_URL}/api/v1/forensics/log-visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: pathname || "/",
              fingerprint,
              location: loc, // We only send this if it passes our precision test
            }),
          });
        };

        if ("geolocation" in navigator) {
          // 🛰️ STAGE 1: INITIATE SATELLITE HANDSHAKE (25 seconds)
          const watcher = navigator.geolocation.watchPosition(
            (pos) => {
              const accuracy = pos.coords.accuracy;
              console.log(
                `[FORENSICS] Tracking signal received. Precision: ${accuracy.toFixed(1)}m`,
              );

              // DATA SCIENCE FILTER:
              // Rejection Threshold: 70 meters.
              // Any accuracy > 70m is usually a "ISP Guess" or "Cell Tower Guess".
              // High-End GPS is usually < 20m.
              if (accuracy < 70 && accuracy < highestPrecisionFound) {
                highestPrecisionFound = accuracy;
                bestLocation = {
                  lat: pos.coords.latitude,
                  lon: pos.coords.longitude,
                };
                console.log(
                  "[FORENSICS] TARGET LOCKED: High-Precision Coordinates Archived.",
                );
              }
            },
            () => {},
            {
              enableHighAccuracy: true,
              timeout: 25000,
              maximumAge: 0,
            },
          );

          // 🛰️ STAGE 2: BURN-IN PERIOD
          // Give the hardware time to lock onto actual GPS satellites overhead.
          setTimeout(async () => {
            navigator.geolocation.clearWatch(watcher);

            // Re-verify: If after 15 seconds we only have "Colombo level" precision (>100m)
            // we treat it as an invalid trace for high-end forensics.
            if (highestPrecisionFound > 100) {
              console.warn(
                "[FORENSICS] WARNING: Low Precision detected. Signal may be an ISP spoof.",
              );
            }

            await emitTrace(bestLocation);
            setHasLogged(true);
          }, 15000); // 15 second lock-on window
        } else {
          await emitTrace();
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
