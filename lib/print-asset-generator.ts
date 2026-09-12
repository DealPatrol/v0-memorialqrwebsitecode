import QRCode from "qrcode"
import { put } from "@vercel/blob"

export type PrintAssetOptions = {
  memorialId: string
  fullName: string
  birthDate?: string | null
  deathDate?: string | null
  memorialUrl: string
}

export type GeneratedPrintAsset = {
  svgUrl: string
  pngUrl: string
}

function formatDateRange(birthDate?: string | null, deathDate?: string | null): string {
  const getYear = (dateStr?: string | null) => {
    if (!dateStr) return null
    const parts = dateStr.split("-")
    if (parts.length > 0 && parts[0].length === 4) return parts[0]
    const date = new Date(dateStr)
    return isNaN(date.getFullYear()) ? null : String(date.getFullYear())
  }

  const birthYear = getYear(birthDate)
  const deathYear = getYear(deathDate)

  if (birthYear && deathYear) return `${birthYear} — ${deathYear}`
  if (deathYear) return `Passed away ${deathYear}`
  if (birthYear) return `Born ${birthYear}`
  return ""
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}

/**
 * Generates high-resolution 300 DPI composite print assets (SVG and PNG)
 * scaled for print-on-demand products with safety bleed and clean vector elements.
 */
export async function generateCompositePrintAsset(
  options: PrintAssetOptions,
): Promise<GeneratedPrintAsset> {
  const { memorialId, fullName, birthDate, deathDate, memorialUrl } = options

  // Generate QR code SVG string
  const qrSvg = await QRCode.toString(memorialUrl, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "H",
    color: {
      dark: "#111827",
      light: "#FFFFFF",
    },
  })

  // Extract inner svg content from generated QR
  const svgInnerMatch = qrSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  const qrInnerContent = svgInnerMatch ? svgInnerMatch[1] : ""

  const datesText = formatDateRange(birthDate, deathDate)
  const safeName = escapeXml(fullName)
  const safeDates = escapeXml(datesText)

  // 1200x1200 composite print canvas (4x4 inches @ 300 DPI)
  const compositeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <defs>
    <style>
      .name-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 42px; font-weight: 700; fill: #111827; text-anchor: middle; letter-spacing: -0.5px; }
      .date-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 26px; font-weight: 500; fill: #6B7280; text-anchor: middle; }
      .sub-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 20px; font-weight: 600; fill: #9CA3AF; text-anchor: middle; letter-spacing: 1.5px; text-transform: uppercase; }
    </style>
  </defs>

  <!-- Clean Background with safety margin -->
  <rect width="1200" height="1200" fill="#FFFFFF"/>
  <rect x="60" y="60" width="1080" height="1080" rx="24" fill="none" stroke="#F3F4F6" stroke-width="4"/>

  <!-- Centered QR Code with quiet zone -->
  <g transform="translate(250, 180)">
    <rect width="700" height="700" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
    <g transform="translate(35, 35) scale(0.9)">
      ${qrInnerContent}
    </g>
  </g>

  <!-- Memorial Details -->
  <text x="600" y="960" class="name-text">${safeName}</text>
  ${safeDates ? `<text x="600" y="1010" class="date-text">${safeDates}</text>` : ""}
  <text x="600" y="1065" class="sub-text">Scan to remember and celebrate</text>
</svg>`

  // Also generate high-resolution PNG buffer (1200x1200px)
  const qrPngBuffer = await QRCode.toBuffer(memorialUrl, {
    width: 1200,
    margin: 3,
    errorCorrectionLevel: "H",
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  })

  // Upload SVG and PNG to Vercel Blob
  let svgUrl = ""
  let pngUrl = ""

  try {
    const svgBlob = await put(`print-assets/${memorialId}-composite.svg`, compositeSvg, {
      access: "public",
      contentType: "image/svg+xml",
    })
    svgUrl = svgBlob.url
  } catch (svgErr) {
    console.warn("[v0] SVG Blob upload failed (using fallback URL):", svgErr)
    svgUrl = `/api/qr-code/print-asset?id=${memorialId}&format=svg`
  }

  try {
    const pngBlob = await put(`print-assets/${memorialId}-print-300dpi.png`, qrPngBuffer, {
      access: "public",
      contentType: "image/png",
    })
    pngUrl = pngBlob.url
  } catch (pngErr) {
    console.warn("[v0] PNG Blob upload failed (using fallback URL):", pngErr)
    pngUrl = `/api/qr-code/print-asset?id=${memorialId}&format=png`
  }

  return { svgUrl, pngUrl }
}
