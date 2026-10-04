import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

/** Last commit date for a repo file, or the file mtime when git history is unavailable. */
export function fileLastModified(relativePath: string): Date {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim()
    if (iso) {
      const parsed = new Date(iso)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
  } catch {
    // Fall back to the file timestamp when git history is unavailable.
  }

  return fs.statSync(path.join(process.cwd(), relativePath)).mtime
}
