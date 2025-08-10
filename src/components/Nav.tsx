import Link from "next/link";
import logo3 from "@/img/3.svg";

function getAssetUrl(mod: unknown): string {
  return typeof mod === "string" ? mod : (mod as { src?: string })?.src ?? "";
}

export default function Nav() {
  const url = getAssetUrl(logo3);
  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex items-center gap-3 px-5 py-4 md:px-8 md:py-5">
        <Link href="/" className="group flex items-center gap-3 focus:outline-none" aria-label="Home">
          <div
            aria-hidden
            className="h-7 w-7 md:h-8 md:w-8 drop-shadow-[0_0_10px_rgba(30,167,255,0.25)] group-hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.45)] transition-[filter] duration-200"
            style={{
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
          <span className="text-white/92 font-semibold tracking-tight whitespace-nowrap">
            <span>Maestro</span> <span className="text-white/70">AI Solutions</span>
          </span>
          <span className="sr-only">Home</span>
        </Link>
      </nav>
    </header>
  );
} 