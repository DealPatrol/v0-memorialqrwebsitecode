import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { extractYouTubeId } from "../lib/youtube"
import {
  audioNeedsConversion,
  checkMediaFile,
  contentTypeFor,
  isApproved,
  MEDIA_LIMITS,
  mediaFolder,
  musicKind,
  musicYouTubeId,
  safeFileName,
  safeMediaUrl,
  videoMayNeedConversion,
} from "../lib/media/shared"
import { createCreatorToken, createProcessToken, verifyCreatorToken, verifyProcessToken } from "../lib/media/creator-token"
import { rateLimit, resetRateLimits } from "../lib/media/rate-limit"
import { parseProbe, planVideo } from "../lib/media/transcode"

const MB = 1024 * 1024

describe("YouTube links", () => {
  it("reads every common link shape", () => {
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
      "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=RD",
      "https://youtu.be/dQw4w9WgXcQ?si=abc",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/live/dQw4w9WgXcQ?feature=share",
      "youtube.com/watch?v=dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
    ]) {
      assert.equal(extractYouTubeId(url), "dQw4w9WgXcQ", url)
    }
  })
  it("rejects non-YouTube and malformed links", () => {
    for (const url of ["https://vimeo.com/123", "https://youtube.com/watch?v=short", "https://evil.com/watch?v=dQw4w9WgXcQ", "", "not a url"]) {
      assert.equal(extractYouTubeId(url), null, url)
    }
  })
})

describe("media file checks", () => {
  it("enforces the advertised limits", () => {
    assert.equal(MEDIA_LIMITS.video, 100 * MB)
    assert.equal(MEDIA_LIMITS.audio, 20 * MB)
    assert.equal(checkMediaFile({ name: "a.mp4", type: "video/mp4", size: 99 * MB }, "video").ok, true)
    assert.equal(checkMediaFile({ name: "a.mp4", type: "video/mp4", size: 101 * MB }, "video").ok, false)
    assert.equal(checkMediaFile({ name: "a.mp3", type: "audio/mpeg", size: 21 * MB }, "audio").ok, false)
  })
  it("accepts phone formats even when the browser reports no type", () => {
    assert.equal(contentTypeFor({ name: "Voicemail.amr", type: "" }, "audio"), "audio/amr")
    assert.equal(checkMediaFile({ name: "call.3gp", type: "", size: MB }, "audio").ok, true)
    assert.equal(contentTypeFor({ name: "call.3gp", type: "video/3gpp" }, "audio"), "video/3gpp")
    assert.equal(contentTypeFor({ name: "IMG_0001.MOV", type: "" }, "video"), "video/quicktime")
    assert.equal(checkMediaFile({ name: "IMG_0001.MOV", type: "video/quicktime", size: 60 * MB }, "video").ok, true)
    assert.equal(checkMediaFile({ name: "notes.pdf", type: "application/pdf", size: MB }, "audio").ok, false)
  })
  it("flags formats that need converting", () => {
    assert.equal(audioNeedsConversion("voicemail.amr"), true)
    assert.equal(audioNeedsConversion("https://x/a.3gp?download=1"), true)
    assert.equal(audioNeedsConversion("song.mp3"), false)
    assert.equal(audioNeedsConversion("memo.m4a"), false)
    assert.equal(videoMayNeedConversion("IMG_0001.MOV"), true)
    assert.equal(videoMayNeedConversion("clip.webm"), false)
  })
  it("builds safe blob paths", () => {
    assert.equal(mediaFolder("audio", "voicemail"), "voicemails")
    assert.equal(mediaFolder("audio", "song"), "music")
    assert.equal(mediaFolder("video"), "videos")
    assert.equal(safeFileName("../../Mom's call (1).amr"), "Mom_s_call_1_.amr")
  })
})

describe("music kinds", () => {
  it("uses the kind column when present", () => {
    assert.equal(musicKind({ kind: "voicemail", audio_url: "https://x/a.mp3" }), "voicemail")
    assert.equal(musicKind({ kind: "video", audio_url: "https://youtu.be/dQw4w9WgXcQ" }), "video")
  })
  it("infers kind on databases without the column", () => {
    assert.equal(musicKind({ audio_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }), "song")
    assert.equal(musicKind({ audio_url: "https://s.public.blob.vercel-storage.com/memorials/id/voicemails/a.m4a" }), "voicemail")
    assert.equal(musicKind({ audio_url: "https://x/call.amr" }), "voicemail")
    assert.equal(musicKind({ audio_url: "https://x/a.m4a", title: "Dad's voicemail" }), "voicemail")
    assert.equal(musicKind({ audio_url: "https://x/a.mp3", title: "Amazing Grace" }), "song")
  })
  it("finds YouTube IDs from the link when youtube_id is missing", () => {
    assert.equal(musicYouTubeId({ audio_url: "https://youtu.be/dQw4w9WgXcQ" }), "dQw4w9WgXcQ")
    assert.equal(musicYouTubeId({ audio_url: "https://x/a.mp3" }), null)
  })
  it("treats rows without a status as approved", () => {
    assert.equal(isApproved({}), true)
    assert.equal(isApproved({ status: "approved" }), true)
    assert.equal(isApproved({ status: "pending" }), false)
    assert.equal(isApproved({ status: "rejected" }), false)
  })
})

describe("creator token", () => {
  const env = { MEDIA_UPLOAD_SECRET: "test-secret" } as NodeJS.ProcessEnv
  it("verifies only for the same memorial and before expiry", () => {
    const now = Date.now()
    const token = createCreatorToken("mem-1", now, env)!
    assert.equal(verifyCreatorToken("mem-1", token, now, env), true)
    assert.equal(verifyCreatorToken("mem-2", token, now, env), false)
    assert.equal(verifyCreatorToken("mem-1", token, now + 7 * 3600 * 1000, env), false)
    assert.equal(verifyCreatorToken("mem-1", `${token}x`, now, env), false)
    assert.equal(verifyCreatorToken("mem-1", null, now, env), false)
  })
})

describe("rate limit", () => {
  it("blocks after the limit and recovers after the window", () => {
    resetRateLimits()
    const start = 1_000_000
    for (let i = 0; i < 3; i++) assert.equal(rateLimit("ip", 3, 1000, start + i).ok, true)
    assert.equal(rateLimit("ip", 3, 1000, start + 10).ok, false)
    assert.equal(rateLimit("ip", 3, 1000, start + 2000).ok, true)
  })
})

describe("video conversion plan", () => {
  it("re-wraps H.264 MOV, re-encodes HEVC, leaves MP4 H.264 alone", () => {
    const h264 = parseProbe("Stream #0:0(und): Video: h264 (High) (avc1)\n Stream #0:1(und): Audio: aac (LC)")
    const hevc = parseProbe("Duration: 00:00:12.50, start\n Stream #0:0: Video: hevc (Main) (hvc1)\n Stream #0:1: Audio: aac")
    assert.equal(hevc.durationSeconds, 12.5)
    assert.equal(planVideo(h264, "mov"), "remux")
    assert.equal(planVideo(h264, "mp4"), "none")
    assert.equal(planVideo(hevc, "mov"), "transcode")
    assert.equal(planVideo(hevc, "mp4"), "transcode")
    assert.equal(planVideo(parseProbe("Video: h263\n Audio: amr_nb"), "3gp"), "transcode")
  })
})

describe("process tokens", () => {
  it("are bound to one row and expire", () => {
    const env = { MEDIA_UPLOAD_SECRET: "test-secret" }
    const now = Date.UTC(2026, 0, 1)
    const token = createProcessToken("videos", "row-1", now, env)!
    assert.equal(verifyProcessToken("videos", "row-1", token, now, env), true)
    assert.equal(verifyProcessToken("videos", "row-2", token, now, env), false)
    assert.equal(verifyProcessToken("music", "row-1", token, now, env), false)
    assert.equal(verifyProcessToken("videos", "row-1", token, now + 31 * 60 * 1000, env), false)
    assert.equal(verifyProcessToken("videos", "row-1", undefined, now, env), false)
  })
})

describe("safeFileName", () => {
  it("never leaves encoded or traversal characters", () => {
    for (const name of ["foo%2f%2e%2e%2fx.mov", "../../x.mov", "a/b\\c.mov", "..mov", "a..b.mov"]) {
      const cleaned = safeFileName(name)
      assert.match(cleaned, /^[\w-][\w.-]*$/)
      assert.ok(!cleaned.includes("/") && !cleaned.includes("%") && !cleaned.includes(".."))
    }
  })
})

describe("safeMediaUrl", () => {
  it("allows https and site paths only", () => {
    assert.equal(safeMediaUrl("https://x.public.blob.vercel-storage.com/a.mp4"), "https://x.public.blob.vercel-storage.com/a.mp4")
    assert.equal(safeMediaUrl("/glenda-beach-walk.jpeg"), "/glenda-beach-walk.jpeg")
    for (const bad of ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "data:text/html,x", "//evil.com/x", "/\\evil.com", "http://x.com/a.mp4", "", null]) {
      assert.equal(safeMediaUrl(bad), null, String(bad))
    }
  })
})
