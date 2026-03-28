import { type NextRequest, NextResponse } from "next/server"
import { sendNewAccountNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userName, userEmail, accountType } = body

    if (!userName || !userEmail || !accountType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Sending new account notification:", { userName, userEmail, accountType })

    await sendNewAccountNotification({
      userName,
      userEmail,
      accountType,
      signupDate: new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in notify-new-account API:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
