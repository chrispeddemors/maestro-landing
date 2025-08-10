import Typewriter from "@/components/Typewriter";
import VantaNetBG from "@/components/VantaNetBG";

export default function Home() {
  return (
    <>
      <VantaNetBG />
      <main className="grid min-h-screen place-items-center text-center text-white">
        <div className="flex flex-col items-center">
          <Typewriter text="Coming soon" className="text-[clamp(40px,6vw,84px)] font-extrabold tracking-tight text-white" />
        </div>
      </main>
    </>
  );
}
