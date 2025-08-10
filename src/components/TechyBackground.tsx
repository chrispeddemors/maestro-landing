"use client";
import React, { useRef } from "react";

export default function TechyBackground({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", x.toString());
    el.style.setProperty("--my", y.toString());
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-screen overflow-hidden"
      style={{
        transform: "perspective(1200px) rotateX(calc(var(--my,0)*4deg)) rotateY(calc(var(--mx,0)*-4deg))",
        transition: "transform 200ms ease",
      }}
    >
      {/* animated gradient layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(0,255,170,0.25), transparent 40%), radial-gradient(800px 400px at 90% 20%, rgba(80,200,255,0.18), transparent 40%), radial-gradient(1000px 500px at 50% 100%, rgba(60,255,120,0.15), transparent 45%)",
          filter: "saturate(120%) blur(0.2px)",
          animation: "bg-pan 18s linear infinite",
          backgroundSize: "200% 200%",
        }}
      />
      {/* subtle tech grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 24px 24px",
        }}
      />
      {/* noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 0 0.35 0'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "140px 140px",
        }}
      />

      {/* content sits above */}
      <div className="relative z-10">{children}</div>

      <style jsx global>{`
        @keyframes bg-pan {
          0% { background-position: 0% 0%, 100% 0%, 50% 100%; }
          50% { background-position: 100% 100%, 0% 100%, 50% 0%; }
          100% { background-position: 0% 0%, 100% 0%, 50% 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] { animation: none !important; }
        }
      `}</style>
    </div>
  );
} 