import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maestro AI Solutions — Coming Soon",
  description: "Agentic AI, orchestrated by the Maestro. We’re launching soon.",
  metadataBase: new URL("https://maestro-ai.nl"),
  openGraph: {
    title: "Maestro AI Solutions — Coming Soon",
    description: "Agentic AI, orchestrated by the Maestro.",
    url: "https://maestro-ai.nl",
    siteName: "Maestro AI Solutions",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "Maestro AI Solutions" },
    ],
    type: "website",
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
