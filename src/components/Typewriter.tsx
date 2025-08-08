"use client";

import { useEffect, useMemo, useRef } from "react";

type TypewriterProps = { text: string; className?: string };

export default function Typewriter({ text, className }: TypewriterProps) {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (prefersReduced) {
      node.textContent = text;
      return;
    }

    let lastTs = performance.now();
    let phase: "typing" | "hold" | "deleting" = "typing";
    let charCount = 0;
    let holdUntil = 0;
    // snelheden in tekens per seconde
    const typeRate = 14; // vloeiend maar rustig
    const deleteRate = 18;
    const holdMs = 10000; // 10s vasthouden
    const idleGapMs = 350; // korte pauze voor herstart
    let carry = 0; // fracties tillen we door naar de volgende frame

    const step = (ts: number) => {
      const dt = Math.min(0.066, (ts - lastTs) / 1000); // cap op ~15fps om sprongen te voorkomen
      lastTs = ts;

      if (phase === "typing") {
        carry += typeRate * dt;
        const inc = carry | 0; // floor
        if (inc > 0) {
          carry -= inc;
          const next = Math.min(text.length, charCount + inc);
          if (next !== charCount) {
            charCount = next;
            node.textContent = text.slice(0, charCount);
          }
          if (charCount === text.length) {
            phase = "hold";
            holdUntil = ts + holdMs;
            carry = 0;
          }
        }
      } else if (phase === "hold") {
        if (ts >= holdUntil) {
          phase = "deleting";
          carry = 0;
        }
      } else {
        // deleting
        carry += deleteRate * dt;
        const dec = carry | 0;
        if (dec > 0) {
          carry -= dec;
          const next = Math.max(0, charCount - dec);
          if (next !== charCount) {
            charCount = next;
            node.textContent = text.slice(0, charCount);
          }
          if (charCount === 0) {
            // kleine idle, daarna opnieuw typen
            phase = "typing";
            carry = 0;
            lastTs = ts + idleGapMs; // verschuif virtueel om korte pauze te geven
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    node.textContent = "";
    rafRef.current = requestAnimationFrame((ts) => {
      lastTs = ts;
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReduced, text]);

  return (
    <h1 className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span ref={nodeRef} />
      <span className="tw-cursor" aria-hidden />
    </h1>
  );
} 