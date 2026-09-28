import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default async function Icon() {
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
          fontSize: 52,
          fontFamily: "Great Vibes",
          paddingTop: 8,
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
