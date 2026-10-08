import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon() {
  const script = await readFile(join(process.cwd(), "app/fonts/GreatVibes-Regular.ttf"))

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4b6891",
          color: "#ffffff",
          fontSize: 140,
          fontFamily: "Great Vibes",
          paddingTop: 24,
        }}
      >
        M
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Great Vibes", data: script, style: "normal", weight: 400 }],
    },
  )
}
