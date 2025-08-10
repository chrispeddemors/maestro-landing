"use client";

import { useEffect, useMemo, useRef } from "react";

type TypewriterProps = {
  text: string;
  className?: string;
  ellipsis?: boolean;
  typeRate?: number; // chars per second
  deleteRate?: number; // chars per second
  holdMs?: number; // how long to hold the full text before deleting
  ellipsisIntervalMs?: number; // step speed for ellipsis
  loop?: boolean; // whether to loop type/delete cycles
};

export default function Typewriter({
  text,
  className,
  ellipsis = true,
  typeRate: typeRateProp = 14,
  deleteRate: deleteRateProp = 18,
  holdMs: holdMsProp = 10000,
  ellipsisIntervalMs: ellipsisIntervalMsProp = 360,
  loop = true,
}: TypewriterProps) {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const textRef = useRef<HTMLSpanElement | null>(null);
  const dotsRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = textRef.current;
    const dots = dotsRef.current;
    if (!node) return;

    if (prefersReduced) {
      node.textContent = text;
      if (dots) dots.textContent = "";
      return;
    }

    let lastTs = performance.now();
    let phase: "typing" | "hold" | "deleting" = "typing";
    let charCount = 0;
    let holdUntil = 0;

    const typeRate = typeRateProp;
    const deleteRate = deleteRateProp;
    const holdMs = holdMsProp;
    const idleGapMs = 350; // small pause before restart
    let carry = 0; // fractional char progress carried between frames

    // Ellipsis state
    const ellipsisIntervalMs = ellipsisIntervalMsProp;
    let ellipsisLastTick = 0;
    let ellipsisCount = 0; // 0..3
    let ellipsisDir: 1 | -1 = 1; // grow then shrink: . .. ... .. .

    const step = (ts: number) => {
      const dt = Math.min(0.066, (ts - lastTs) / 1000);
      lastTs = ts;

      if (phase === "typing") {
        carry += typeRate * dt;
        const inc = carry | 0;
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
            ellipsisLastTick = ts;
            ellipsisCount = 1;
            ellipsisDir = 1;
            if (dots && ellipsis) dots.textContent = ".";
            else if (dots) dots.textContent = "";
          } else if (dots) {
            dots.textContent = "";
          }
        }
      } else if (phase === "hold") {
        // animate ellipsis
        if (dots && ellipsis && ts - ellipsisLastTick >= ellipsisIntervalMs) {
          ellipsisLastTick = ts;
          ellipsisCount += ellipsisDir;
          if (ellipsisCount >= 3) {
            ellipsisCount = 3;
            ellipsisDir = -1;
          } else if (ellipsisCount <= 1) {
            ellipsisCount = 1;
            ellipsisDir = 1;
          }
          dots.textContent = ".".repeat(ellipsisCount);
        }
        if (ts >= holdUntil) {
          if (!loop) {
            // stop animation, keep final state
            return;
          }
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
          if (dots) dots.textContent = "";
          if (charCount === 0) {
            // small idle, then restart typing
            phase = "typing";
            carry = 0;
            lastTs = ts + idleGapMs;
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    node.textContent = "";
    if (dots) dots.textContent = "";
    rafRef.current = requestAnimationFrame((ts) => {
      lastTs = ts;
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReduced, text, ellipsis, typeRateProp, deleteRateProp, holdMsProp, ellipsisIntervalMsProp, loop]);

  return (
    <h1 className={className} aria-label={text} style={{ position: "relative", display: "inline-block" }}>
      <span className="sr-only">{text}</span>
      {/* Invisible placeholder reserves size to prevent layout shift */}
      <span aria-hidden className="opacity-0 select-none pointer-events-none">{text}</span>
      {/* Overlay actual typing on top of the placeholder */}
      <span aria-hidden style={{ position: "absolute", inset: 0, whiteSpace: "nowrap" }}>
        <span ref={textRef} />
        {ellipsis ? <span ref={dotsRef} /> : <span className="tw-cursor" />}
      </span>
    </h1>
  );
} 