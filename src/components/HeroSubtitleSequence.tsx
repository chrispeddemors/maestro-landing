"use client";

import Typewriter from "./Typewriter";

export default function HeroSubtitleSequence({ className = "" }: { className?: string }) {
  const slogan = "Orchestrating Agentic AI Solutions";
  return (
    <Typewriter
      text={slogan}
      className={className}
      ellipsis={true}
      ellipsisIncludeBlank={false}
      ellipsisIntervalMs={8000 / 6}
      typeRate={18}
      deleteRate={27}
      holdMs={8000}
      loop={true}
      idleGapMs={2000}
    />
  );
} 