/** Print QR codes black on white, at 300 DPI, never under 1 inch. */

export const PRINT_DPI = 300
export const MIN_QR_INCHES = 1

/** Pixels for a square QR so it stays sharp at `inches` when printed at 300 DPI. */
export function qrPixelSize(inches: number): number {
  const size = Math.max(MIN_QR_INCHES, inches)
  return Math.round(size * PRINT_DPI)
}

/**
 * Printify scales an image relative to the placeholder width.
 * Assumes the narrower plausible print width so the code cannot print under the minimum
 * when the real blank is larger than that width.
 */
export function qrPlaceholderScale(minInches: number, printWidthInches: number): number {
  const inches = Math.max(MIN_QR_INCHES, minInches)
  const width = printWidthInches > 0 ? printWidthInches : inches
  return Math.min(1, inches / width)
}

/** At least 1.25 inches at 300 DPI, and at least 900px so the code stays sharp when scaled. */
export const QR_PRINT_PIXELS = Math.max(900, qrPixelSize(1.25))
