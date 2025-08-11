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

      <main data-snap-container="true" className="relative text-white h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-contain">
        {/* HERO met logo */}
        <section className="h-[100vh] grid place-items-center px-6 snap-center snap-always">
          <div className="flex flex-col items-center gap-8 md:gap-10 -translate-y-[30%] md:translate-y-0" style={{ opacity: bgReady ? 1 : 0, transition: "opacity 240ms ease-out" }}>
            <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row">
              <LogoGlyph className="h-[clamp(140px,22vw,320px)] w-[clamp(140px,22vw,320px)]" />
              <div className="text-center md:text-left">
                <div className="text-[clamp(44px,6.8vw,100px)] font-extrabold tracking-tight leading-[0.95]">
                  Maestro AI
                </div>
                {/* Reservering om layout shift te voorkomen tijdens wegvegen */}
                <div className="mt-2 min-h-[1.4em] leading-tight">
                  <HeroSubtitleSequence className="text-[clamp(16px,2.8vw,26px)] font-medium text-white/85" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: COMPOSE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] md:opacity-[0.16] compose-bg section-bg-blur">
            <Lottie lottieRef={composeRef} animationData={composeBg as unknown as object} loop={!prefersReduced} autoplay className="w-full h-full" />
            <div
              className="bg-glow-overlay hidden md:block"
              style={{
                "--glow-dur": "22s",
                "--glow-delay": "3s",
              } as CSSProperties as unknown as Record<string, string>}
            >
              <span />
            </div>
          </div>
          <div className="relative z-10 max-w-5xl text-center -translate-y-[30%] md:translate-y-0">
            <motion.h2
              className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight title-glow"
              initial={{ opacity: 0, y: 6, letterSpacing: "0.02em" }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: "0.03em" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              Compose
            </motion.h2>
            <motion.div
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typewriter
                text="Define the plan"
                className="inline"
                ellipsis={true}
                ellipsisIncludeBlank={false}
                ellipsisIntervalMs={720}
                typeRate={16}
                deleteRate={27}
                holdMs={Infinity}
                loop={false}
              />
            </motion.div>
          </div>
        </section>

        {/* Section 2: ORCHESTRATE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] md:opacity-[0.14] orchestrate-bg section-bg-blur">
            <Lottie lottieRef={orchestrateRef} animationData={orchestrateBg as unknown as object} loop={!prefersReduced} autoplay className="w-full h-full" />
            <div
              className="bg-glow-overlay hidden md:block"
              style={{
                "--glow-dur": "24s",
                "--glow-delay": "7s",
              } as CSSProperties as unknown as Record<string, string>}
            >
              <span />
            </div>
          </div>
          <div className="relative z-10 max-w-5xl text-center -translate-y-[30%] md:translate-y-0">
            <motion.h2
              className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight title-glow"
              initial={{ opacity: 0, y: 6, letterSpacing: "0.02em" }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: "0.03em" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              Orchestrate
            </motion.h2>
            <motion.div
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typewriter
                text="Make it all work together"
                className="inline"
                ellipsis={true}
                ellipsisIncludeBlank={false}
                ellipsisIntervalMs={720}
                typeRate={16}
                deleteRate={27}
                holdMs={Infinity}
                loop={false}
              />
            </motion.div>
          </div>
        </section>

        {/* Section 3: AUTOMATE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] md:opacity-[0.14] automate-bg section-bg-blur">
            <Lottie lottieRef={automateRef} animationData={automateBg as unknown as object} loop={!prefersReduced} autoplay className="w-full h-full" />
            <div
              className="bg-glow-overlay hidden md:block"
              style={{
                "--glow-dur": "26s",
                "--glow-delay": "11s",
              } as CSSProperties as unknown as Record<string, string>}
            >
              <span />
            </div>
            {/* Fireworks-like multi-colored bulbs */}
            <div className="automate-fireworks">
              <span className="dot" style={{ left: "8%", top: "22%", "--fw-delay": "0s", "--fw-dur": "20s", "--x": "0px", "--y": "0px", "--fw-color": "rgba(56,242,154,0.18)" } as unknown as Record<string, string>} />
              <span className="dot small" style={{ right: "12%", top: "14%", "--fw-delay": "4s", "--fw-dur": "22s", "--x": "-20px", "--y": "10px", "--fw-color": "rgba(59,130,246,0.18)" } as unknown as Record<string, string>} />
              <span className="dot large" style={{ left: "26%", bottom: "12%", "--fw-delay": "9s", "--fw-dur": "24s", "--x": "15px", "--y": "-10px", "--fw-color": "rgba(244,63,94,0.18)" } as unknown as Record<string, string>} />
              <span className="dot" style={{ left: "60%", top: "28%", "--fw-delay": "13s", "--fw-dur": "21s", "--x": "-10px", "--y": "-6px", "--fw-color": "rgba(250,204,21,0.18)" } as unknown as Record<string, string>} />
              <span className="dot small" style={{ right: "26%", bottom: "18%", "--fw-delay": "16s", "--fw-dur": "19s", "--x": "6px", "--y": "-8px", "--fw-color": "rgba(147,51,234,0.18)" } as unknown as Record<string, string>} />
            </div>
          </div>
          <div className="relative z-10 max-w-5xl text-center -translate-y-[30%] md:translate-y-0">
            <motion.h2
              className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight title-glow"
              initial={{ opacity: 0, y: 6, letterSpacing: "0.02em" }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: "0.03em" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              Automate
            </motion.h2>
            <motion.div
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typewriter
                text="Run it for you, 24/7"
                className="inline"
                ellipsis={true}
                ellipsisIncludeBlank={false}
                ellipsisIntervalMs={720}
                typeRate={16}
                deleteRate={27}
                holdMs={Infinity}
                loop={false}
              />
            </motion.div>
          </div>
        </section>

        {/* Footer: twee regels, boven bold, onder typewriter zonder loop */}
        <section className="h-[100vh] grid place-items-center px-6 snap-center snap-always">
          <div className="w-full max-w-4xl text-center -translate-y-[30%] md:translate-y-0">
            <motion.p
              className="text-[clamp(28px,4.6vw,64px)] font-semibold tracking-[0.6px] text-[#f5f5f5]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Something Intelligent is in the Making
            </motion.p>
            <motion.div
              className="mt-4 grid place-items-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              {/* reserve ruimte om layout shift te voorkomen */}
              <div className="min-h-[1.6em] leading-tight">
                <Typewriter
                  text="Coming Soon"
                  className="inline"
                  ellipsis={true}
                  ellipsisIncludeBlank={false}
                  ellipsisIntervalMs={720}
                  typeRate={16}
                  deleteRate={27}
                  holdMs={Infinity}
                  loop={false}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
