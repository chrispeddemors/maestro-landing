"use client";

import { useEffect, useRef } from "react";

type ChipBoxProps = { lines?: { title: string; subtitle?: string } };

export default function ChipBox({ lines }: ChipBoxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current!;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let alive = true;
    function schedule() {
      if (!alive) return;
      const delay = 5000 + Math.random() * 2000;  // 5–7s
      const dur = 900 + Math.random() * 300;      // 900–1200ms
      el.style.setProperty("--pulse-delay", `${delay}ms`);
      el.style.setProperty("--pulse-dur", `${dur}ms`);
      el.classList.add("pulsing");
      setTimeout(() => el.classList.remove("pulsing"), dur);
      setTimeout(schedule, delay);
    }
    const id = setTimeout(schedule, 1000);
    return () => { alive = false; clearTimeout(id); };
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="chip chip-pulse relative w_[min(46vw,220px)] h_[min(46vw,220px)] w-[min(46vw,220px)] h-[min(46vw,220px)] rounded-2xl bg-[#0F141B] border border-white/10 shadow-[inset_0_0_40px_rgba(56,242,154,0.08),0_25px_80px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.45)] overflow-hidden"
      >
        <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(56,242,154,0.08)] chip-outline" />
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(120px_120px_at_0%_0%,rgba(56,242,154,0.15),transparent_60%),radial-gradient(120px_120px_at_100%_0%,rgba(56,242,154,0.12),transparent_60%),radial-gradient(120px_120px_at_0%_100%,rgba(56,242,154,0.12),transparent_60%),radial-gradient(120px_120px_at_100%_100%,rgba(56,242,154,0.12),transparent_60%)]" />
        <div className="matrix absolute inset-[12%] rounded-xl overflow-hidden">
          <div className="absolute inset-0 mix-blend-overlay opacity-12"
               style={{ backgroundImage:
                 "repeating-linear-gradient(0deg,rgba(56,242,154,0.18)_0_2px,transparent_2px_18px),repeating-linear-gradient(90deg,rgba(56,242,154,0.18)_0_2px,transparent_2px_18px)" }} />
          <div className="scan absolute inset-0" />
        </div>
        <div className="relative h-full w-full grid place-items-center select-none text-center">
          {lines ? (
            <div>
              <div className="text-[clamp(18px,3.6vw,38px)] font-semibold text-white/92 leading-tight">{lines.title}</div>
              {lines.subtitle && (
                <div className="text-[clamp(12px,2.4vw,18px)] font-semibold text-white/85 mt-1">{lines.subtitle}</div>
              )}
            </div>
          ) : (
            <div className="text-[clamp(18px,3.4vw,36px)] font-semibold text-white/92">Maestro AI</div>
          )}
        </div>
      </div>
    </div>
  );
} 