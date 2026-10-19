import { spawn } from "node:child_process"
import { chmod, copyFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

/**
 * Server-side conversion of phone recordings into formats every browser plays,
 * using a static ffmpeg build (@ffmpeg-installer/ffmpeg) inside a Vercel function:
 *   - Android voicemails (AMR/3GP), CAF, OGG/Opus, etc.  -> M4A (AAC)
 *   - iPhone MOV / HEVC, Android 3GP, AVI, MKV            -> MP4 (H.264 + AAC)
 * H.264 MOV files are only re-wrapped (fast, no quality loss); HEVC is re-encoded.
 */

export type Probe = { videoCodec: string | null; audioCodec: string | null; durationSeconds: number | null }

let cachedPath: string | null = null

export async function ffmpegPath(): Promise<string> {
  if (cachedPath) return cachedPath
  // Loaded lazily: the package throws at import time when its binary is missing.
  const installed = process.env.FFMPEG_PATH || (await installerPath()) || (await tracedBinaryPath())
  if (!installed) throw new Error("ffmpeg binary not available")
  try {
    await chmod(installed, 0o755)
    cachedPath = installed
  } catch {
    // Read-only file system: copy the binary somewhere writable and make it executable.
    const tmp = "/tmp/ffmpeg"
    await stat(tmp).catch(async () => {
      await copyFile(installed, tmp)
      await chmod(tmp, 0o755)
    })
    cachedPath = tmp
  }
  return cachedPath
}

async function installerPath(): Promise<string | null> {
  try {
    const mod = (await import("@ffmpeg-installer/ffmpeg")) as { default?: { path: string }; path?: string }
    return mod.default?.path || mod.path || null
  } catch {
    return null
  }
}

/** The binary shipped via outputFileTracingIncludes (pnpm layout), used when the installer cannot resolve it. */
async function tracedBinaryPath(): Promise<string | null> {
  const pnpmDir = path.join(process.cwd(), "node_modules", ".pnpm")
  const dirs = await readdir(pnpmDir).catch(() => [] as string[])
  for (const dir of dirs) {
    if (!dir.startsWith(`@ffmpeg-installer+${process.platform}-${process.arch}`)) continue
    const bin = path.join(pnpmDir, dir, "node_modules", "@ffmpeg-installer", `${process.platform}-${process.arch}`, "ffmpeg")
    if (await stat(bin).then((st) => st.isFile()).catch(() => false)) return bin
  }
  return null
}

/**
 * Uploaded bytes are untrusted: only read local files (no http/concat/playlist fetches)
 * and only demux real media containers.
 */
export const INPUT_GUARD = [
  "-protocol_whitelist",
  "file",
  "-format_whitelist",
  "mov,mp4,m4a,3gp,3g2,mj2,amr,amrnb,amrwb,matroska,webm,avi,ogg,wav,mp3,aac,flac,caf,aiff",
]

function run(bin: string, args: string[], timeoutMs: number): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] })
    let stderr = ""
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-20000)
    })
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs)
    child.on("error", (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on("close", (code) => {
      clearTimeout(timer)
      resolve({ code, stderr })
    })
  })
}

export function parseProbe(stderr: string): Probe {
  const video = stderr.match(/Stream #[^\n]*Video: ([a-z0-9_]+)/i)
  const audio = stderr.match(/Stream #[^\n]*Audio: ([a-z0-9_]+)/i)
  const duration = stderr.match(/Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/)
  return {
    videoCodec: video ? video[1].toLowerCase() : null,
    audioCodec: audio ? audio[1].toLowerCase() : null,
    durationSeconds: duration ? Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]) : null,
  }
}

export async function probe(input: string): Promise<Probe> {
  const bin = await ffmpegPath()
  const { stderr } = await run(bin, ["-hide_banner", ...INPUT_GUARD, "-i", input], 30_000)
  return parseProbe(stderr)
}

export type VideoPlan = "none" | "remux" | "transcode"

/** Decide what a video needs so Chrome, Firefox, Safari and phones all play it. */
export function planVideo(p: Probe, extension: string): VideoPlan {
  const browserAudio = !p.audioCodec || p.audioCodec === "aac" || p.audioCodec === "mp3"
  if (p.videoCodec === "h264" && browserAudio) {
    return extension === "mp4" || extension === "m4v" ? "none" : "remux"
  }
  if (p.videoCodec === "vp8" || p.videoCodec === "vp9") return extension === "webm" ? "none" : "transcode"
  return "transcode"
}

export async function convertVideo(input: string, output: string, plan: Exclude<VideoPlan, "none">, timeoutMs: number) {
  const bin = await ffmpegPath()
  const args =
    plan === "remux"
      ? ["-y", "-hide_banner", ...INPUT_GUARD, "-i", input, "-map", "0:v:0", "-map", "0:a:0?", "-c", "copy", "-movflags", "+faststart", output]
      : [
          "-y",
          "-hide_banner",
          ...INPUT_GUARD,
          "-i",
          input,
          "-map",
          "0:v:0",
          "-map",
          "0:a:0?",
          "-c:v",
          "libx264",
          "-preset",
          "veryfast",
          "-crf",
          "24",
          "-pix_fmt",
          "yuv420p",
          // Fit inside 1280x1280 keeping the aspect ratio (portrait phone videos stay portrait).
          "-vf",
          "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-ac",
          "2",
          "-movflags",
          "+faststart",
          output,
        ]
  const { code, stderr } = await run(bin, args, timeoutMs)
  if (code !== 0) throw new Error(`ffmpeg video ${plan} failed: ${stderr.split("\n").slice(-4).join(" ")}`)
}

export async function convertAudio(input: string, output: string, voicemail: boolean, timeoutMs: number) {
  const bin = await ffmpegPath()
  const args = [
    "-y",
    "-hide_banner",
    ...INPUT_GUARD,
    "-i",
    input,
    "-vn",
    "-c:a",
    "aac",
    "-b:a",
    voicemail ? "96k" : "160k",
    ...(voicemail ? ["-ac", "1", "-ar", "44100"] : []),
    "-movflags",
    "+faststart",
    output,
  ]
  const { code, stderr } = await run(bin, args, timeoutMs)
  if (code !== 0) throw new Error(`ffmpeg audio failed: ${stderr.split("\n").slice(-4).join(" ")}`)
}
