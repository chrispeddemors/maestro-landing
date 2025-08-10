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
    <div
      ref={containerRef}
      onMouseEnter={() => bump(true)}
      onMouseLeave={() => bump(false)}
      className="fixed inset-0 -z-10"
      style={{ filter: "blur(8px)", transform: "translateZ(0)" }}
    />
  );
} 