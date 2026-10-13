import { getResend } from "@/lib/resend"
import { SUPPORT_EMAIL } from "@/lib/site"

export type ClaimMail = {
  to: string
  petName: string
  claimUrl: string
  scanUrl: string
}

export type ClaimEmailSender = (mail: ClaimMail) => Promise<void>

export function claimEmailText(mail: ClaimMail): string {
  return [
    `A memorial page for ${mail.petName} is ready for you to claim.`,
    "",
    "The keepsake's QR code opens this page. Use the link below to sign in and add photos, videos, the story, and guestbook messages.",
    mail.claimUrl,
    "",
    `Anyone who scans the code can see the page: ${mail.scanUrl}`,
    "",
    `Questions: ${SUPPORT_EMAIL}`,
  ].join("\n")
}

export async function sendClaimEmail(mail: ClaimMail, sender?: ClaimEmailSender): Promise<void> {
  if (sender) {
    await sender(mail)
    return
  }
  const resend = getResend()
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialsqr.com>",
    to: mail.to,
    replyTo: SUPPORT_EMAIL,
    subject: `Claim the memorial page for ${mail.petName}`,
    text: claimEmailText(mail),
  })
  if (error) throw new Error(error.message)
}
