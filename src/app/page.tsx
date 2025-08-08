import ChipBox from "@/components/ChipBox";
import Typewriter from "@/components/Typewriter";
import MouseGlow from "@/components/MouseGlow";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white">
      <MouseGlow />
      <div className="relative z-10 grid min-h-screen place-items-center p-4">
        <div className="flex flex-col items-center text-center">
          <ChipBox lines={{ title: "Maestro", subtitle: "AI Solutions" }} />
          <Typewriter
            text="Coming soon"
            className="mt-7 text-[clamp(40px,6vw,84px)] font-extrabold tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]"
          />
        </div>
      </div>
    </main>
  );
}
