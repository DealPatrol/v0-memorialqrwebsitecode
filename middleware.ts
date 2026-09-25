import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return await updateSession(request)
  }

  // For all other routes, just continue
  return
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
