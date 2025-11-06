import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Extract form data
    const planType = formData.get("planType") as string
    const plaqueColor = formData.get("plaqueColor") as string
    const boxPersonalization = formData.get("boxPersonalization") as string
    const customerName = formData.get("customerName") as string
    const customerEmail = formData.get("customerEmail") as string
    const customerPhone = formData.get("customerPhone") as string
    const addressLine1 = formData.get("addressLine1") as string
    const addressLine2 = formData.get("addressLine2") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const zip = formData.get("zip") as string
    const paymentId = formData.get("paymentId") as string

    // Add-ons
    const addonWoodenQr = formData.get("addonWoodenQr") === "true"
    const addonPicturePlaque = formData.get("addonPicturePlaque") === "true"
    const addonStoneQr = formData.get("addonStoneQr") === "true"
    const stoneEngravingText = formData.get("stoneEngravingText") as string

    // Handle picture upload
    let picturePlaqueUrl = null
    if (addonPicturePlaque) {
      const pictureFile = formData.get("picturePlaqueFile") as File
      if (pictureFile) {
        const blob = await put(`picture-plaques/${Date.now()}-${pictureFile.name}`, pictureFile, {
          access: "public",
        })
        picturePlaqueUrl = blob.url
      }
    }

    // Generate order number
    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Calculate amounts
    const baseAmount = 200 // $2.00 in cents
    let addonAmount = 0
    if (addonWoodenQr) addonAmount += 2997
    if (addonPicturePlaque) addonAmount += 3998
    if (addonStoneQr) addonAmount += 5699
    const totalAmountCents = baseAmount + addonAmount

    // Create order in database
    const supabase = createServiceRoleClient()

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address_line1: addressLine1,
        shipping_address_line2: addressLine2,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
        shipping_country: "US",
        payment_id: paymentId,
        payment_status: "completed",
        amount_cents: totalAmountCents,
        currency: "USD",
        product_type: "memorial_package",
        product_name: `Memorial QR Package - ${plaqueColor} plaque`,
        status: "processing",
        plan_type: planType,
        plaque_color: plaqueColor,
        box_personalization: boxPersonalization,
        addon_wooden_qr: addonWoodenQr,
        addon_picture_plaque: addonPicturePlaque,
        addon_stone_qr: addonStoneQr,
        stone_engraving_text: stoneEngravingText,
        picture_plaque_url: picturePlaqueUrl,
        monthly_amount_cents: planType === "monthly" ? 200 : null,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
