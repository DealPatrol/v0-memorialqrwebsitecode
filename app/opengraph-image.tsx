import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "MemorialsQR — Digital memorials that last forever"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>
          Digital memorial pages
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontFamily: "Great Vibes",
            lineHeight: 1,
            marginTop: 16,
          }}
        >
          MemorialsQR
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 28 }}>Digital memorials that last forever</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Great Vibes", data: script, style: "normal", weight: 400 }],
    },
  )
}
