import Typewriter from "@/components/Typewriter";
import VantaNetBG from "@/components/VantaNetBG";
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
  return (
    <>
      <VantaNetBG />
      <main className="grid min-h-screen place-items-center text-white pt-16 md:pt-20">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row">
            <LogoGlyph className="h-[clamp(140px,22vw,320px)] w-[clamp(140px,22vw,320px)]" />
            <div className="text-center md:text-left">
              <div className="text-[clamp(44px,6.8vw,100px)] font-extrabold tracking-tight leading-[0.95]">
                Maestro AI
              </div>
              <div className="mt-2 text-[clamp(16px,2.8vw,26px)] font-medium text-white/85">
                Compose · Orchestrate · Automate
              </div>
            </div>
          </div>

          <Typewriter
            text="Coming soon"
            className="mt-2 text-[clamp(30px,5.4vw,66px)] font-extrabold tracking-tight text-white"
          />
        </div>
      </main>
    </>
  );
}
