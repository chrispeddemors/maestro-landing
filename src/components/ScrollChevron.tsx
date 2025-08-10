"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  scrollContainerSelector?: string;
};

export default function ScrollChevron({ scrollContainerSelector = 'main[data-snap-container="true"]' }: Props) {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [visible, setVisible] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const currentIdxRef = useRef(0);

  useEffect(() => {
    const container = document.querySelector(scrollContainerSelector) as HTMLElement | null;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll("section")) as HTMLElement[];
    sectionsRef.current = sections;

    const indexByEl = new Map<HTMLElement, number>();
    sections.forEach((el, idx) => indexByEl.set(el, idx));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = indexByEl.get(e.target as HTMLElement) ?? 0;
            currentIdxRef.current = idx;
            setVisible(idx < sections.length - 1);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    sections.forEach((el) => io.observe(el));

    // Initial state
    currentIdxRef.current = 0;
    setVisible(sections.length > 1);

    return () => io.disconnect();
  }, [scrollContainerSelector]);

  function handleClick() {
    const sections = sectionsRef.current;
    const idx = currentIdxRef.current;
    const next = sections[idx + 1];
    if (next && next.scrollIntoView) {
      next.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to next section"
      onClick={handleClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 p-3 bg-transparent border-0"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        aria-hidden
        className={prefersReduced ? "opacity-80" : "opacity-80 animate-chevron-float"}
      >
        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
} 