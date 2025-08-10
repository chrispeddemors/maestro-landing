"use client";
import { useEffect, useRef, useState } from "react";

type VantaInstance = { destroy: () => void; setOptions: (opts: Record<string, unknown>) => void };

type NetOpts = { points: number; spacing: number; maxDistance: number; mouseControls: boolean; touchControls: boolean };

function calcOpts(width: number): NetOpts {
  if (width <= 360) {
    return { points: 6, spacing: 24, maxDistance: 18, mouseControls: false, touchControls: true };
  }
  if (width <= 480) {
    return { points: 7.5, spacing: 22, maxDistance: 18, mouseControls: false, touchControls: true };
  }
  if (width <= 768) {
    return { points: 8.5, spacing: 20, maxDistance: 20, mouseControls: false, touchControls: true };
  }
  // desktop
  return { points: 10, spacing: 18, maxDistance: 22, mouseControls: true, touchControls: true };
}

export default function VantaNetBG() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vanta, setVanta] = useState<VantaInstance | null>(null);

  // Subtiele rotatie: richting bepaald door laatste horizontale swipe/scroll
  const dirRef = useRef<number>(1); // -1 links, +1 rechts
  const angleDegRef = useRef<number>(0);
  const rafRotateRef = useRef<number | null>(null);
  const velDegPerSecRef = useRef<number>(0); // tijdelijke impuls die uitdempt

  // Reduced motion
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let cleanup = () => {};
    let resizeRaf: number | null = null;
    (async () => {
      const THREE = await import("three");
      const NET = (await import("vanta/dist/vanta.net.min")).default as (opts: Record<string, unknown>) => VantaInstance;
      if (!containerRef.current) return;

      const o = calcOpts(window.innerWidth);
      const instance = NET({
        el: containerRef.current,
        THREE,
        color: 0x00ffaa,
        backgroundColor: 0x000000,
        points: o.points,
        maxDistance: o.maxDistance,
        spacing: o.spacing,
        mouseControls: o.mouseControls,
        touchControls: o.touchControls,
        gyroControls: false,
      });

      setVanta(instance);
      cleanup = () => instance.destroy?.();

      const onResize = () => {
        if (!instance.setOptions) return;
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          const r = calcOpts(window.innerWidth);
          instance.setOptions({
            points: r.points,
            spacing: r.spacing,
            maxDistance: r.maxDistance,
            mouseControls: r.mouseControls,
            touchControls: r.touchControls,
          });
        });
      };
      window.addEventListener("resize", onResize);
      const prevCleanup = cleanup;
      cleanup = () => {
        window.removeEventListener("resize", onResize);
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        prevCleanup();
      };
    })();

    return () => cleanup();
  }, []);

  // Rotatie loop en gesture-detectie
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReduced) return;

    let lastTs = performance.now();
    const baseSpeedDegPerSec = 0.045; // subtiel sneller: ~2.7° per minuut
    const scale = 1.12; // licht ingezoomd om randgloed te voorkomen bij rotatie

    const step = (ts: number) => {
      const dt = Math.min(0.066, (ts - lastTs) / 1000);
      lastTs = ts;

      // basis + tijdelijke impuls die langzaam uitdempt
      const speed = dirRef.current * baseSpeedDegPerSec + velDegPerSecRef.current;
      angleDegRef.current += speed * dt;

      // demping: ~4s half-life bij 60fps
      const dampingPerFrameAt60 = 0.996;
      const frames = dt * 60;
      velDegPerSecRef.current *= Math.pow(dampingPerFrameAt60, frames);
      if (Math.abs(velDegPerSecRef.current) < 0.002) velDegPerSecRef.current = 0;

      // normaliseer voor stabiliteit
      if (angleDegRef.current > 360) angleDegRef.current -= 360;
      if (angleDegRef.current < -360) angleDegRef.current += 360;

      el.style.transform = `translateZ(0) scale(${scale}) rotate(${angleDegRef.current}deg)`;
      rafRotateRef.current = requestAnimationFrame(step);
    };

    rafRotateRef.current = requestAnimationFrame(step);

    // Input listeners om richting vast te leggen
    const onWheel = (e: WheelEvent) => {
      // horizontaal: zoals voorheen
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 1) {
        dirRef.current = e.deltaX > 0 ? 1 : -1;
        return;
      }
      // verticaal: nudge (down => rechts)
      if (Math.abs(e.deltaY) > 2) {
        dirRef.current = e.deltaY > 0 ? 1 : -1;
        const magnitude = Math.min(1, Math.abs(e.deltaY) / 60);
        velDegPerSecRef.current += (e.deltaY > 0 ? 1 : -1) * 0.25 * magnitude;
      }
    };

    let touchStartX: number | null = null;
    let touchStartY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches && e.touches.length ? e.touches[0].clientX : null;
      touchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX == null || touchStartY == null) return;
      const t = e.touches && e.touches.length ? e.touches[0] : null;
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;

      // horizontaal bepaalt nog steeds de richting
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        dirRef.current = dx < 0 ? 1 : -1; // swipe links => rechtsom draaien
        return;
      }

      // verticaal: swipe up (dy < 0) => scroll down => rechtsom draaien
      if (Math.abs(dy) > 8) {
        const toRight = dy < 0; // swipe up
        dirRef.current = toRight ? 1 : -1;
        const magnitude = Math.min(1, Math.abs(dy) / 80);
        velDegPerSecRef.current += (toRight ? 1 : -1) * 0.28 * magnitude; // iets sterker op touch
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as EventListener);
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      if (rafRotateRef.current) cancelAnimationFrame(rafRotateRef.current);
      // reset transform
      el.style.transform = "translateZ(0)";
    };
  }, [prefersReduced]);

  function bump(intense: boolean) {
    if (!vanta) return;
    const w = window.innerWidth;
    const base = calcOpts(w);
    vanta.setOptions({
      maxDistance: intense ? base.maxDistance + 4 : base.maxDistance,
      spacing: intense ? Math.max(14, base.spacing - 2) : base.spacing,
    });
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={containerRef}
        onMouseEnter={() => bump(true)}
        onMouseLeave={() => bump(false)}
        className="absolute -inset-[14%]"
        style={{ filter: "blur(12px)", transform: "translateZ(0)", transformOrigin: "center" }}
      />
    </div>
  );
} 