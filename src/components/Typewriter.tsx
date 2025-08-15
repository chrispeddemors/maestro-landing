"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TypewriterProps = {
  texts: string[];
  className?: string;
  ellipsis?: boolean;
  typeRate?: number; // chars per second
  deleteRate?: number; // chars per second
  holdMs?: number; // how long to hold the full text before deleting
  ellipsisIntervalMs?: number; // step speed for ellipsis
  ellipsisIncludeBlank?: boolean; // whether the ellipsis loop includes a blank step
  loop?: boolean; // whether to loop type/delete cycles
  onHoldComplete?: () => void; // called once after hold finishes when loop is false
  deleteAfterHold?: boolean; // when true and loop is false, perform delete phase after hold
  onDeleteComplete?: () => void; // called once after delete finishes when deleteAfterHold
  idleGapMs?: number; // pause before restarting typing when looping
};

export default function Typewriter({
  texts,
  className,
  ellipsis = true,
  typeRate: typeRateProp = 14,
  deleteRate: deleteRateProp = 18,
  holdMs: holdMsProp = 10000,
  ellipsisIntervalMs: ellipsisIntervalMsProp = 360,
  ellipsisIncludeBlank = true,
  loop = true,
  onHoldComplete,
  deleteAfterHold = false,
  onDeleteComplete,
  idleGapMs: idleGapMsProp = 350,
}: TypewriterProps) {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const textRef = useRef<HTMLSpanElement | null>(null);
  const dotsRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const node = textRef.current;
    const dots = dotsRef.current;
    if (!node) return;

    if (prefersReduced) {
      node.textContent = texts[currentTextIndex];
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
    const idleGapMs = idleGapMsProp; // configurable pause before restart
    let carry = 0; // fractional char progress carried between frames

    // Ellipsis state
    const ellipsisIntervalMs = ellipsisIntervalMsProp;
    let ellipsisLastTick = 0;
    let ellipsisCount = ellipsisIncludeBlank ? 0 : 1; // start blank or with one dot

    const currentText = texts[currentTextIndex];

    const step = (ts: number) => {
      const dt = Math.min(0.066, (ts - lastTs) / 1000);
      lastTs = ts;

      if (phase === "typing") {
        carry += typeRate * dt;
        const inc = carry | 0;
        if (inc > 0) {
          carry -= inc;
          const next = Math.min(currentText.length, charCount + inc);
          if (next !== charCount) {
            charCount = next;
            node.textContent = currentText.slice(0, charCount);
          }
          if (charCount === currentText.length) {
            phase = "hold";
            holdUntil = ts + holdMs;
            carry = 0;
            ellipsisLastTick = ts;
            ellipsisCount = ellipsisIncludeBlank ? 1 : 1; // start met één punt
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
          if (ellipsisIncludeBlank) {
            // . -> .. -> ... -> (blank) -> repeat
            ellipsisCount = (ellipsisCount + 1) % 4; // 0..3 cyclisch
            dots.textContent = ellipsisCount === 0 ? "" : ".".repeat(ellipsisCount);
          } else {
            // . -> .. -> ... -> . -> .. -> ... (no blank)
            ellipsisCount = ellipsisCount + 1;
            if (ellipsisCount > 3) ellipsisCount = 1;
            dots.textContent = ".".repeat(ellipsisCount);
          }
        }
        if (ts >= holdUntil) {
          if (!loop) {
            if (deleteAfterHold) {
              phase = "deleting";
              carry = 0;
            } else {
              // stop animation, keep final state and notify once
              onHoldComplete?.();
              return;
            }
          } else {
            // Na 3 cycli van puntjes, ga naar deleting
            const cyclesCompleted = Math.floor((ts - holdUntil) / (3 * ellipsisIntervalMs));
            if (cyclesCompleted >= 3) {
              phase = "deleting";
              carry = 0;
            }
          }
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
            node.textContent = currentText.slice(0, charCount);
          }
          if (dots) dots.textContent = "";
          if (charCount === 0) {
            if (deleteAfterHold && !loop) {
              onDeleteComplete?.();
              return;
            }
            // small idle, then restart typing with next text
            phase = "typing";
            carry = 0;
            lastTs = ts + idleGapMs;
            // Move to next text
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            return; // Restart the animation with new text
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
  }, [prefersReduced, texts, currentTextIndex, ellipsis, typeRateProp, deleteRateProp, holdMsProp, ellipsisIntervalMsProp, ellipsisIncludeBlank, loop, onHoldComplete, deleteAfterHold, onDeleteComplete, idleGapMsProp]);

  return (
    <h1 className={className} aria-label={texts[currentTextIndex]} style={{ position: "relative", display: "inline-block" }}>
      <span className="sr-only">{texts[currentTextIndex]}</span>
      {/* Invisible placeholder reserves size to prevent layout shift - use longest text */}
      <span aria-hidden className="opacity-0 select-none pointer-events-none">
        {texts.reduce((longest, current) => current.length > longest.length ? current : longest, texts[0])}
      </span>
      {/* Overlay actual typing on top of the placeholder */}
      <span aria-hidden style={{ position: "absolute", inset: 0, whiteSpace: "nowrap" }}>
        <span ref={textRef} />
        {ellipsis ? <span ref={dotsRef} /> : <span className="tw-cursor" />}
      </span>
    </h1>
  );
} 