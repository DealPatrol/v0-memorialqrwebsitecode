import { notFound } from "next/navigation"

/** Rewrite target for empty utility URLs. The response status is 404. */
export default function SeoNotFoundPage() {
  notFound()
}
