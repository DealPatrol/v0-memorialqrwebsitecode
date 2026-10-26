import { assertMetadataLength, pageMetadata } from "@/lib/seo"

/** Self-canonical, noindex metadata for a utility URL that should not be a landing page. */
export function utilityNoindex(path: string, title: string, description: string) {
  assertMetadataLength(title, description, path)
  return pageMetadata({ title, description, path, index: false })
}
