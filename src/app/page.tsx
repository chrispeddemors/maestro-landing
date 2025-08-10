import Image from "next/image";
import Typewriter from "@/components/Typewriter";
import VantaNetBG from "@/components/VantaNetBG";
import logo from "@/img/logo.png";

export default function Home() {
  return (
    <>
      <VantaNetBG />
      <main className="grid min-h-screen place-items-center text-center text-white">
        <div className="flex flex-col items-center">
          <div className="relative w-[min(92vw,440px)]">
            <Image src={logo} alt="Maestro AI Solutions logo" priority className="h-auto w-full select-none" />
          </div>
          <Typewriter text="Coming soon" className="mt-7 text-[clamp(40px,6vw,84px)] font-extrabold tracking-tight text-white" />
        </div>
      </main>
    </>
  );
}
