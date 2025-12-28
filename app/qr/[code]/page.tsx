import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"

interface PageProps {
  params: {
    code: string
  }
}

export default async function QRRedirectPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  // Find the QR code
  const { data: qrCode, error: qrError } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("unique_code", params.code)
    .single()

  if (qrError || !qrCode) {
    redirect("/qr-not-found")
  }

  // Track visit
  await supabase.from("visitors").insert({
    memorial_id: qrCode.memorial_id,
    ip_address: "qr-scan",
    user_agent: "qr-scan",
  })

  // Redirect to the memorial page
  redirect(`/memorial/${qrCode.memorial_id}`)
}
