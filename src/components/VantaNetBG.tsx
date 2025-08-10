"use client";
import { useEffect, useRef, useState } from "react";

type VantaInstance = { destroy?: () => void; setOptions?: (opts: Record<string, unknown>) => void };

export default function VantaNetBG() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vanta, setVanta] = useState<VantaInstance | null>(null);

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const NET = (await import("vanta/dist/vanta.net.min")).default as (opts: Record<string, unknown>) => VantaInstance;
      if (!containerRef.current) return;

      const instance = NET({
        el: containerRef.current,
        THREE,
        color: 0x00ffaa,
        backgroundColor: 0x000000,
        points: 10.0,
        maxDistance: 22.0,
        spacing: 18.0,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
      });

      setVanta(instance);
      cleanup = () => instance?.destroy?.();
    })();

    return () => cleanup();
  }, []);

  function bump(intense: boolean) {
    if (!vanta?.setOptions) return;
    vanta.setOptions({
      maxDistance: intense ? 28 : 22,
      spacing: intense ? 16 : 18,
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => bump(true)}
      onMouseLeave={() => bump(false)}
      className="fixed inset-0 -z-10"
    />
  );
} 