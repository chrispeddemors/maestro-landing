"use client";

import { useEffect } from "react";

export default function MouseGlow() {
  useEffect(() => {
    const root = document.body;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let targetX = curX;
    let targetY = curY;
    let raf: number | null = null;

    const apply = () => {
      root.style.setProperty("--x", `${curX}px`);
      root.style.setProperty("--y", `${curY}px`);
    };

    const onPointer = (e: PointerEvent) => { targetX = e.clientX; targetY = e.clientY; };
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) { targetX = t.clientX; targetY = t.clientY; } };
    const onResize = () => { targetX = window.innerWidth / 2; targetY = window.innerHeight / 2; };

    function tick() {
      // Trage, vloeiende lerp
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      apply();
      raf = requestAnimationFrame(tick);
    }

    // Init
    apply();

    if (!prefersReduced) {
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
} 