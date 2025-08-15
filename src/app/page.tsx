"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import VantaNetBG from "@/components/VantaNetBG";
import Typewriter from "@/components/Typewriter";
import ScrollChevron from "@/components/ScrollChevron";
import HeroSubtitleSequence from "@/components/HeroSubtitleSequence";
import { useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import orchestrateBg from "@/img/orchestrate-bg.json";
import composeBg from "@/img/compose-bg.json";
import automateBg from "@/img/automate-bg.json";
import logo3 from "@/img/3.svg";
import type { CSSProperties } from "react";

function getAssetUrl(mod: unknown): string {
  return typeof mod === "string" ? mod : (mod as { src?: string })?.src ?? "";
}

function LogoGlyph({ className = "" }: { className?: string }) {
  const url = getAssetUrl(logo3);
  return (
    <img
      aria-hidden
      src={url}
      alt=""
      className={className + " logo-glyph"}
      style={{ display: "block" }}
    />
  );
}

export default function Home() {
  const [bgReady, setBgReady] = useState(false);
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const automateRef = useRef<LottieRefCurrentProps | null>(null);
  const composeRef = useRef<LottieRefCurrentProps | null>(null);
  const orchestrateRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      // Toon still frame zonder animatie
      composeRef.current?.goToAndStop?.(1, true);
      orchestrateRef.current?.goToAndStop?.(1, true);
      automateRef.current?.goToAndStop?.(1, true);
      return;
    }
    // Normale (vertraagde) animatiesnelheden
    composeRef.current?.setSpeed?.(0.6 * 0.5);      // -> 0.30x
    orchestrateRef.current?.setSpeed?.(0.8 * 0.5);  // -> 0.40x
    automateRef.current?.setSpeed?.(0.5 * 0.7);     // -> 0.35x
  }, [prefersReduced]);

  return (
    <>
      <VantaNetBG onReady={() => setBgReady(true)} />
      <ScrollChevron />

      <main className="relative text-white h-screen overflow-hidden">
        {/* HERO met logo en Coming Soon */}
        <section className="h-[100vh] grid place-items-center px-6">
          <div className="flex flex-col items-center gap-16 md:gap-20 -translate-y-[15%] md:translate-y-0" style={{ opacity: bgReady ? 1 : 0, transition: "opacity 240ms ease-out" }}>
            {/* Logo en titel sectie */}
            <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row">
              <LogoGlyph className="h-[clamp(140px,22vw,320px)] w-[clamp(140px,22vw,320px)]" />
              <div className="text-center md:text-left">
                <div className="text-[clamp(44px,6.8vw,100px)] font-extrabold tracking-tight leading-[0.95] title-responsive">
                  Maestro AI
                </div>
                {/* Subtitle direct onder titel */}
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                >
                  <div className="min-h-[1.4em] leading-tight">
                    <Typewriter
                      text="Orchestrating Agentic AI Solutions"
                      className="text-[clamp(16px,2.8vw,26px)] font-medium text-white/85"
                      ellipsis={true}
                      ellipsisIncludeBlank={false}
                      ellipsisIntervalMs={720}
                      typeRate={16}
                      deleteRate={27}
                      holdMs={2000}
                      loop={true}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Coming Soon footer - BEHOUDEN */}
      <footer className="sticky bottom-0 z-10">
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Bottom bar */}
        <motion.div
          className="backdrop-blur-sm bg-black/30 px-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-[1200px] flex items-center justify-center gap-3">
            {/* Status dot */}
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60 status-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1.4 }}
            />
            
            {/* Coming Soon text */}
            <span className="text-[clamp(14px,1.6vw,18px)] font-medium text-white/90">
              Coming Soon
            </span>
          </div>
        </motion.div>
      </footer>
    </>
  );
}
