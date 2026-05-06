"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Attack {
  id: string;
  source_ip: string;
  source_country: string;
  target_country: string;
  attack_type: string;
  severity: string;
  timestamp: string;
}

// Simple Coordinate Mapping for Demo (Center of countries)
const COORDINATES: Record<string, { x: number; y: number }> = {
  US: { x: 200, y: 150 },
  CN: { x: 700, y: 180 },
  RU: { x: 650, y: 120 },
  BR: { x: 300, y: 350 },
  IN: { x: 650, y: 220 },
  LK: { x: 660, y: 260 }, // Focused Point
  GB: { x: 480, y: 130 },
  DE: { x: 500, y: 135 },
  IR: { x: 580, y: 180 },
  KP: { x: 740, y: 175 },
};

export default function AttackMap({ attacks }: { attacks: Attack[] }) {
  const [activeLines, setActiveLines] = useState<Attack[]>([]);

  useEffect(() => {
    // Keep only the most recent 10 attacks for the map animation to avoid clutter
    setActiveLines(attacks.slice(0, 10));
  }, [attacks]);

  return (
    <div className="relative w-full aspect-video bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Background World Map (Simplified SVG) */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full opacity-20 pointer-events-none"
      >
        <rect width="1000" height="500" fill="#020617" />
        {/* Placeholder for world map path - in production we use a real TopoJSON path */}
        <circle cx="200" cy="150" r="10" fill="#334155" /> {/* US */}
        <circle cx="700" cy="180" r="10" fill="#334155" /> {/* CN */}
        <circle cx="660" cy="260" r="12" fill="#ef4444" className="animate-pulse" /> {/* LK */}
      </svg>

      {/* Live Animated Arcs */}
      <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {activeLines.map((attack) => {
            const start = COORDINATES[attack.source_country] || { x: 0, y: 0 };
            const end = COORDINATES[attack.target_country] || { x: 0, y: 0 };
            
            const midX = (start.x + end.x) / 2;
            const midY = Math.min(start.y, end.y) - 50; // Curve elevation

            const color = 
              attack.severity === "CRITICAL" ? "#ef4444" : 
              attack.severity === "HIGH" ? "#f97316" : 
              "#3b82f6";

            return (
              <React.Fragment key={attack.id}>
                {/* Arc Line */}
                <motion.path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  stroke={color}
                  strokeWidth="1.5"
                  fill="transparent"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                {/* Impact Ripple */}
                <motion.circle
                  cx={end.x}
                  cy={end.y}
                  r="0"
                  stroke={color}
                  strokeWidth="2"
                  fill="transparent"
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: 30, opacity: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Overlay: Data Stream */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 max-w-xs transition-all">
          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Live Target Log</h4>
          <div className="space-y-1.5">
            {attacks.slice(0, 3).map((a) => (
              <div key={a.id} className="text-[9px] font-mono text-slate-300 flex items-center gap-2">
                <span className="text-rose-500 underline">{a.source_country}</span>
                <span className="text-white/20">→</span>
                <span className="text-emerald-500 font-bold">{a.target_country}</span>
                <span className="text-slate-500 text-[8px] truncate">{a.attack_type}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-right">
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Sovereign Node Active: SRI_LANKA</span>
           </div>
           <p className="text-[9px] text-slate-500 font-medium">Real-time regional telemetry link synchronized.</p>
        </div>
      </div>
    </div>
  );
}
