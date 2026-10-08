/**
 * Hero heading metrics in the document head. The main Tailwind sheet is still
 * render-blocking, so this does not bypass that wait. It does give the LCP
 * heading an explicit size, weight, and color as soon as this style is parsed.
 */
export const HERO_LCP_CSS =
  ".hero-lcp{font-family:ui-sans-serif,system-ui,sans-serif;font-weight:700;line-height:1.15;color:#1f1f1f;font-size:2.25rem;margin:0 0 1.5rem}"
