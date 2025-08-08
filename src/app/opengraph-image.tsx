import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f14",
          backgroundImage:
            "radial-gradient(60% 60% at 50% 40%, rgba(24, 225, 255, 0.18), transparent 60%)",
          color: "#e6f0f3",
          fontSize: 72,
          letterSpacing: -1,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 24,
            color: "#9edff0",
            fontWeight: 600,
          }}
        >
          Maestro AI Solutions
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 28,
            color: "#9edff0",
            fontWeight: 500,
          }}
        >
          Agentic AI, orchestrated by the Maestro.
        </div>
        <div
          style={{
            width: "75%",
            textAlign: "center",
            background: "linear-gradient(90deg, #22d3ee, #60a5fa)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Maestro AI Solutions
        </div>
      </div>
    ),
    { ...size }
  );
} 