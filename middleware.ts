import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const APEX_ORIGIN = "https://memorialsqr.com"

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]
  if (host === "www.memorialsqr.com") {
    const destination = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, APEX_ORIGIN)
    return NextResponse.redirect(destination, 301)
  }

  if (request.nextUrl.pathname === "/terms") {
    return NextResponse.redirect(new URL(`/terms-of-service${request.nextUrl.search}`, request.url), 301)
  }

  if (request.nextUrl.pathname === "/privacy") {
    return NextResponse.redirect(new URL(`/privacy-policy${request.nextUrl.search}`, request.url), 301)
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
