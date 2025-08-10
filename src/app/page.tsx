"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import VantaNetBG from "@/components/VantaNetBG";
import Typewriter from "@/components/Typewriter";
import ScrollChevron from "@/components/ScrollChevron";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import orchestrateBg from "@/img/orchestrate-bg.json";
import composeBg from "@/img/compose-bg.json";
import automateBg from "@/img/automate-bg.json";
import logo3 from "@/img/3.svg";

function getAssetUrl(mod: unknown): string {
  return typeof mod === "string" ? mod : (mod as { src?: string })?.src ?? "";
}

function LogoGlyph({ className = "" }: { className?: string }) {
  const url = getAssetUrl(logo3);
  return (
    <div
      aria-hidden
      className={className}
      style={{
        aspectRatio: "1 / 1",
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "#ffffff",
      }}
    />
  );
}

export default function Home() {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const automateRef = useRef<LottieRefCurrentProps | null>(null);
  const composeRef = useRef<LottieRefCurrentProps | null>(null);
  const orchestrateRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    // Automate 200% trager
    automateRef.current?.setSpeed?.(0.5);
    // Compose 40% trager => 0.6x
    composeRef.current?.setSpeed?.(0.6);
    // Orchestrate 20% trager => 0.8x
    orchestrateRef.current?.setSpeed?.(0.8);
  }, [prefersReduced]);

  return (
    <>
      <VantaNetBG />
      <ScrollChevron />

      <main data-snap-container="true" className="relative text-white h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-contain">
        {/* HERO met logo */}
        <section className="h-[100vh] grid place-items-center px-6 snap-center snap-always">
          <div className="flex flex-col items-center gap-8 md:gap-10 -translate-y-[40%] md:translate-y-0">
            <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row">
              <LogoGlyph className="h-[clamp(140px,22vw,320px)] w-[clamp(140px,22vw,320px)]" />
              <div className="text-center md:text-left">
                <div className="text-[clamp(44px,6.8vw,100px)] font-extrabold tracking-tight leading-[0.95]">
                  Maestro AI
                </div>
                {/* Reservering om layout shift te voorkomen tijdens wegvegen */}
                <div className="mt-2 min-h-[1.4em] leading-tight">
                  <Typewriter
                    text="Orchestrating Agentic AI Solutions"
                    className="text-[clamp(16px,2.8vw,26px)] font-medium text-white/85"
                    ellipsis={true}
                    typeRate={14}
                    deleteRate={27}
                    holdMs={20000}
                    ellipsisIntervalMs={360}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: COMPOSE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          {/* Grote Lottie als achtergrond */}
          {!prefersReduced && (
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] compose-bg">
              <Lottie lottieRef={composeRef} animationData={composeBg as unknown as object} loop autoplay className="w-full h-full" />
            </div>
          )}
          <div className="max-w-5xl text-center -translate-y-[40%] md:translate-y-0">
            <motion.h2 className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight luxury-breathe">Compose</motion.h2>
            <motion.p
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              We craft the perfect score of AI agents, workflows, and logic—tailored to your business.
            </motion.p>
          </div>
        </section>

        {/* Section 2: ORCHESTRATE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          {!prefersReduced && (
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] orchestrate-bg">
              <Lottie lottieRef={orchestrateRef} animationData={orchestrateBg as unknown as object} loop autoplay className="w-full h-full" />
            </div>
          )}
          <div className="max-w-5xl text-center -translate-y-[40%] md:translate-y-0">
            <motion.h2 className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight luxury-breathe">Orchestrate</motion.h2>
            <motion.p
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              We conduct every element in flawless harmony, ensuring each part plays at the right moment.
            </motion.p>
          </div>
        </section>

        {/* Section 3: AUTOMATE */}
        <section className="relative h-[100vh] grid place-items-center px-6 snap-center snap-always overflow-hidden">
          {!prefersReduced && (
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]" style={{ transform: "scale(1.5) translate(-10%, -2%)", transformOrigin: "center", willChange: "transform" }}>
              <Lottie lottieRef={automateRef} animationData={automateBg as unknown as object} loop autoplay className="w-full h-full" />
            </div>
          )}
          <div className="max-w-5xl text-center -translate-y-[40%] md:translate-y-0">
            <motion.h2 className="text-[clamp(56px,8.2vw,120px)] font-extrabold tracking-tight luxury-breathe">Automate</motion.h2>
            <motion.p
              className="mt-4 text-[clamp(16px,2.4vw,26px)] text-white/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              We set the performance on autopilot—delivering results without missing a beat.
            </motion.p>
          </div>
        </section>

        {/* Footer: twee regels, boven bold, onder typewriter zonder loop */}
        <section className="h-[100vh] grid place-items-center px-6 snap-center snap-always">
          <div className="w-full max-w-4xl text-center -translate-y-[40%] md:translate-y-0">
            <motion.p
              className="text-[clamp(28px,4.6vw,64px)] font-semibold tracking-[0.6px] text-[#f5f5f5]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Something Intelligent Is In The Making.
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
                  text="Coming Soon..."
                  className="text-[clamp(18px,3.2vw,36px)] font-normal text-[#d1d5db]"
                  ellipsis={false}
                  typeRate={11.11}
                  deleteRate={9999}
                  holdMs={1000}
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
