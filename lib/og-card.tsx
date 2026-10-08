import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export async function memorialOgImage(input: { kicker: string; title: string; subtitle: string }) {
  const script = await readFile(join(process.cwd(), "app/fonts/GreatVibes-Regular.ttf"))

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1c2838 0%, #4b6891 70%)",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", opacity: 0.85 }}>
          {input.kicker}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontFamily: "Great Vibes",
            lineHeight: 1.05,
            marginTop: 18,
            maxWidth: 980,
          }}
        >
          {input.title}
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 28, maxWidth: 980, lineHeight: 1.3 }}>{input.subtitle}</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Great Vibes", data: script, style: "normal", weight: 400 }],
    },
  )
}
