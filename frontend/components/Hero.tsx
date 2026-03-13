"use client";

import { useEffect, useState } from "react";
import GlitchText from "@/components/GlitchText";
import CollabCursors from "@/components/CollabCursors";
import Link from "next/link";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] overflow-hidden pt-32">
      {/* Badge */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[12px] md:px-[16px] bg-[#1A1A1A] border-2 border-[#8bfb25]">
        <div className="w-[8px] h-[8px] bg-[#8bfb25] shrink-0 animate-pulse" />
        <span className="font-ibm-mono text-[9px] md:text-[11px] font-bold text-[#8bfb25] tracking-[1px] md:tracking-[2px] whitespace-nowrap">
          [LIVE] // AI THREAT INTEL v2.0
        </span>
      </div>

      <div className="h-8 md:h-[32px]" />

      {/* Headline */}
      <h1 className="font-grotesk text-[clamp(28px,8vw,80px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center w-full max-w-[1100px]">
        <GlitchText text="DETECT THREATS" speed={45} delay={100} />
        <br />
        <GlitchText text="WITH AI." speed={45} delay={400} />
      </h1>
      <h1 className="font-grotesk text-[clamp(28px,8vw,80px)] font-bold text-[#8bfb25] tracking-[-1px] leading-none text-center w-full max-w-[1100px]">
        <GlitchText text="REAL-TIME PROTECTION." speed={45} delay={700} />
      </h1>

      <div className="h-8 md:h-[32px]" />

      {/* Subheading */}
      <p className="font-ibm-mono text-[13px] md:text-[15px] text-[#888888] tracking-[1px] leading-[1.6] text-center w-full max-w-[800px]">
        THE UNIFIED SECURITY DASHBOARD TO DETECT PHISHING, ANALYZE FAKE NEWS, AND SPOT DEEPFAKES.
        <br />
        POWERED BY CUSTOM MACHINE LEARNING & GEMINI MULTIMODAL AI.
      </p>

      <div className="h-10 md:h-[48px]" />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <Link href="/scanner" className="flex items-center justify-center w-full sm:w-[220px] h-[56px] bg-[#8bfb25] hover:bg-[#aefc60] transition-colors shadow-[0_0_15px_rgba(139,251,37,0.4)]">
          <span className="font-grotesk text-[13px] font-bold text-[#0A0A0A] tracking-[2px]">
            START SCANNING
          </span>
        </Link>
        <Link href="/dashboard" className="flex items-center justify-center w-full sm:w-[200px] h-[56px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors">
          <span className="font-ibm-mono text-[13px] text-[#888888] tracking-[2px]">
            THREAT DASHBOARD &gt;
          </span>
        </Link>
      </div>

      <div className="h-6 md:h-[24px]" />

      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[2px] text-center">
        URL PHISHING // FAKE NEWS NLP // MEDIA FORENSICS
      </p>

      <div className="h-12 md:h-[64px]" />

      {/* Animated Cybersecurity Dashboard SVG */}
      <div
        className="w-full max-w-[1100px] bg-[#0F0F0F] overflow-hidden"
        style={{ border: "2px solid #2D2D2D" }}
      >
        <ThreatInterfaceSVG mounted={mounted} />
      </div>

      <CollabCursors />
    </section>
  );
}

/* ──────────────────────────────── SVG ──────────────────────────────── */

const layers = [
  { label: "AI ENGINE", color: "#8bfb25", indent: 0, active: true },
  { label: "URL SCANNER", color: "#888", indent: 12 },
  { label: "RISK METER", color: "#FF3366", indent: 12 },
  { label: "NLP MODULE", color: "#888", indent: 12 },
  { label: "VISION PIPELINE", color: "#3399FF", indent: 12 },
  { label: "DB ACCESS", color: "#3399FF", indent: 24 },
  { label: "DASHBOARD UI", color: "#FF6B35", indent: 0 },
];

const inspectProps = [
  { key: "SCANS", val: "24,059" },
  { key: "MODEL", val: "GEMINI 2.5" },
  { key: "STATUS", val: "ACTIVE" },
  { key: "THREAT LVL", val: "CRITICAL", swatch: "#FF3366" },
  { key: "LATENCY", val: "42ms" },
];

const tokens = [
  { name: "safe", hex: "#8bfb25" },
  { name: "warning", hex: "#FFD600" },
  { name: "critical", hex: "#FF3366" },
  { name: "neutral", hex: "#F5F5F0" },
  { name: "bg-surface", hex: "#111111" },
];

function ThreatInterfaceSVG({ mounted }: { mounted: boolean }) {
  return (
    <>
      <style>{`
        @keyframes hero-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hero-scan { 0%{transform:translateY(-580px)} 100%{transform:translateY(580px)} }
        @keyframes hero-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes hero-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-700px)} }
        .hero-cursor { animation: hero-blink 1.1s step-end infinite; }
        .hero-scan { animation: hero-scan 4s linear infinite; }
        .hero-pulse { animation: hero-pulse 2s ease-in-out infinite; }
        .hero-ticker-track { animation: hero-ticker 14s linear infinite; }
      `}</style>

      <svg
        viewBox="0 0 1100 580"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <rect width="1100" height="580" fill="#0F0F0F" />
        <rect className="hero-scan" x="0" y="0" width="1100" height="6" fill="rgba(139,251,37,0.05)" />

        {/* Grid dots */}
        {Array.from({ length: 22 }, (_, c) =>
          Array.from({ length: 12 }, (_, r) => (
            <circle key={`d${c}-${r}`} cx={c * 50 + 25} cy={r * 50 + 25} r="1" fill="#1A1A1A" />
          ))
        )}

        {/* ── LEFT PANEL ── */}
        <rect x="0" y="0" width="200" height="580" fill="#111111" />
        <line x1="200" y1="0" x2="200" y2="580" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="0" y="0" width="200" height="36" fill="#161616" />
        <text x="12" y="23" fontFamily="monospace" fontSize="9" fill="#8bfb25" letterSpacing={2} fontWeight="700">SERVICES</text>

        {layers.map((l, i) => {
          const y = 36 + i * 32;
          return (
            <g
              key={i}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(6px)",
                transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
              }}
            >
              {l.active && <rect x="0" y={y} width="200" height="32" fill="#1E1E1E" />}
              {l.active && <rect x="0" y={y} width="2" height="32" fill="#8bfb25" />}
              <circle cx={20 + l.indent} cy={y + 16} r="3" fill={l.color} opacity="0.8" />
              <text x={32 + l.indent} y={y + 20} fontFamily="monospace" fontSize="9" fill={l.active ? "#F5F5F0" : "#555"} letterSpacing={0.5}>
                {l.label}
              </text>
            </g>
          );
        })}

        {/* ── RIGHT PANEL ── */}
        <rect x="899" y="0" width="201" height="580" fill="#111111" />
        <line x1="899" y1="0" x2="899" y2="580" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="899" y="0" width="201" height="36" fill="#161616" />
        <text x="912" y="23" fontFamily="monospace" fontSize="9" fill="#8bfb25" letterSpacing={2} fontWeight="700">LIVE METRICS</text>

        {inspectProps.map((p, i) => {
          const y = 56 + i * 26;
          return (
            <g
              key={i}
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.4s ease ${0.1 + i * 0.06}s`,
              }}
            >
              <text x="912" y={y} fontFamily="monospace" fontSize="8" fill="#555" letterSpacing={1}>{p.key}</text>
              {p.swatch && <rect x="970" y={y - 9} width="10" height="10" fill={p.swatch} rx="1" />}
              <text x={p.swatch ? "986" : "970"} y={y} fontFamily="monospace" fontSize="8" fill="#888" letterSpacing={0.5}>{p.val}</text>
            </g>
          );
        })}

        <line x1="899" y1="278" x2="1100" y2="278" stroke="#222" strokeWidth="1" />
        <text x="912" y="300" fontFamily="monospace" fontSize="9" fill="#8bfb25" letterSpacing={2} fontWeight="700">STATUS LOGS</text>

        {tokens.map((t, i) => {
          const y = 316 + i * 28;
          return (
            <g key={i}>
              <rect x="912" y={y} width="12" height="12" fill={t.hex} rx="1" />
              <text x="932" y={y + 10} fontFamily="monospace" fontSize="8" fill="#666" letterSpacing={0.5}>{t.name}</text>
            </g>
          );
        })}

        {/* ── CENTER CANVAS ── */}
        <rect x="200" y="0" width="700" height="36" fill="#141414" />
        <line x1="200" y1="36" x2="900" y2="36" stroke="#2D2D2D" strokeWidth="1" />

        {/* Mock Network Map/Threat Graph */}
        <rect x="280" y="90" width="540" height="380" fill="#0A0A0A" stroke="#8bfb25" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="280" y="84" fontFamily="monospace" fontSize="8" fill="#8bfb25" letterSpacing={1}>THREAT NETWORK MAP</text>

        {/* Node connections */}
        <path d="M 400 180 Q 450 150 500 200 T 600 250" stroke="#FFD600" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M 400 350 L 500 280 L 650 300" stroke="#FF3366" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.8"/>
        
        <circle cx="400" cy="180" r="10" fill="#8bfb25" />
        <circle cx="500" cy="200" r="14" fill="#FFD600" className="hero-pulse" />
        <circle cx="600" cy="250" r="12" fill="#8bfb25" />
        
        <circle cx="400" cy="350" r="18" fill="#FF3366" />
        <text x="382" y="380" fontFamily="monospace" fontSize="9" fill="#FF3366">PHISHING</text>
        
        <circle cx="500" cy="280" r="8" fill="#F5F5F0" />
        <circle cx="650" cy="300" r="10" fill="#FFD600" />
        <text x="635" y="325" fontFamily="monospace" fontSize="9" fill="#FFD600">DEEPFAKE</text>

        <rect x="300" y="110" width="120" height="30" fill="#161616" stroke="#FF3366" />
        <text x="310" y="128" fontFamily="monospace" fontSize="8" fill="#FF3366">DETECTED SPAM: 99%</text>
        
        {/* Ticker */}
        <line x1="200" y1="514" x2="900" y2="514" stroke="#2D2D2D" strokeWidth="1" />
        <rect x="200" y="515" width="700" height="32" fill="#0F0F0F" />
        <clipPath id="tickerClip">
          <rect x="200" y="515" width="700" height="32" />
        </clipPath>
        <g clipPath="url(#tickerClip)">
          <g className="hero-ticker-track">
            {["NODE 1: SAFE", "NODE 2: SAFE", "IP 192.x: MALICIOUS", "URL: PHISHING DETECTED", "IMAGE: FAKE", "AUDIO: NORMAL", "TEXT: CREDIBLE", "NODE 1: SAFE", "IP 192.x: MALICIOUS"].map((name, i) => (
              <g key={`t${i}`}>
                <circle cx={220 + i * 130} cy="531" r="3" fill="#8bfb25" opacity="0.5" />
                <text x={230 + i * 130} y="535" fontFamily="monospace" fontSize="8" fill="#444" letterSpacing={1.5}>{name}</text>
              </g>
            ))}
          </g>
        </g>

        {/* Status bar */}
        <line x1="200" y1="547" x2="900" y2="547" stroke="#222" strokeWidth="1" />
        <rect x="200" y="548" width="700" height="32" fill="#0D0D0D" />
        <circle className="hero-pulse" cx="220" cy="564" r="4" fill="#FF3366" />
        <text x="232" y="568" fontFamily="monospace" fontSize="8" fill="#555" letterSpacing={1}>THREAT DETECTED</text>
        <text x="360" y="568" fontFamily="monospace" fontSize="8" fill="#333" letterSpacing={1}>12 SCANS/SEC</text>
        
      </svg>
    </>
  );
}
