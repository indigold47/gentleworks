import { ImageResponse } from "next/og";

export const alt = "Gentle Works — Architecture & Design Studio in Atlanta, GA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error(`Could not load font: ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [serif, sans] = await Promise.all([
    loadGoogleFont("Instrument Serif"),
    loadGoogleFont("Inter"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f1ea",
          color: "#2b2a26",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Serif",
            fontSize: 180,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <span>Gentle</span>
          <span style={{ opacity: 0.5, margin: "0 0.25em" }}>·</span>
          <span>Works</span>
        </div>
        <div
          style={{
            fontFamily: "Inter",
            marginTop: 48,
            fontSize: 24,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          Architecture & Design Studio · Atlanta, GA
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Inter", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
