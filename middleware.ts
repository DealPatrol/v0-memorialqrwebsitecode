import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return await updateSession(request)
  }

  // For all other routes, just continue
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
