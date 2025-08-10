import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maestro AI — Compose · Orchestrate · Automate",
  description: "We design, orchestrate, and automate intelligent AI solutions.",
  metadataBase: new URL("https://maestro-ai.nl"),
  openGraph: {
    title: "Maestro AI — Compose · Orchestrate · Automate",
    description: "We design, orchestrate, and automate intelligent AI solutions.",
    url: "https://maestro-ai.nl",
    siteName: "Maestro AI",
    images: [
      {
        url: "https://maestro-ai.nl/og-maestro-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Maestro AI — Compose · Orchestrate · Automate",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://maestro-ai.nl/og-maestro-v2.jpg"],
    title: "Maestro AI — Compose · Orchestrate · Automate",
    description: "We design, orchestrate, and automate intelligent AI solutions.",
  },
  other: {
    "color-scheme": "dark",
  },
};

export const viewport = {
  themeColor: "#0b0f14",
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-cyan-400/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
