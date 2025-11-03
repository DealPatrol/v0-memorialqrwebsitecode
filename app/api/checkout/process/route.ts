import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email"

export async function POST(req: Request) {
  console.log("[v0] Processing checkout...")

  try {
    const formData = await req.formData()

    // Extract all form data
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
    const country = (formData.get("country") as string) || "US"

    // Add-ons
    const addonWoodenQr = formData.get("addonWoodenQr") === "true"
    const addonPicturePlaque = formData.get("addonPicturePlaque") === "true"
    const addonStoneQr = formData.get("addonStoneQr") === "true"
    const stoneEngravingText = formData.get("stoneEngravingText") as string

    // Payment
    const sourceId = formData.get("sourceId") as string
    const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)

    // Validate required fields
    if (
      !planType ||
      !plaqueColor ||
      !customerName ||
      !customerEmail ||
      !addressLine1 ||
      !city ||
      !state ||
      !zip ||
      !sourceId
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Handle picture upload if picture plaque is selected
    let picturePlaqueUrl = null
    if (addonPicturePlaque) {
      const pictureFile = formData.get("picturePlaqueFile") as File
      if (pictureFile) {
        const blob = await put(`picture-plaques/${Date.now()}-${pictureFile.name}`, pictureFile, {
          access: "public",
        })
        picturePlaqueUrl = blob.url
        console.log("[v0] Uploaded picture plaque image:", picturePlaqueUrl)
      }
    }

    // Generate unique order number
    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Calculate amounts
    const baseAmount = planType === "one-time" ? 12999 : 4999 // in cents
    let addonAmount = 0
    if (addonWoodenQr) addonAmount += 2997
    if (addonPicturePlaque) addonAmount += 3998
    if (addonStoneQr) addonAmount += 5699
    const totalAmountCents = baseAmount + addonAmount
    const monthlyAmountCents = planType === "monthly" ? 499 : null

    // Process payment with Square
    console.log("[v0] Processing payment with Square...")
    const paymentResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/square/create-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId,
          amount: totalAmount,
          orderId: orderNumber,
        }),
      },
    )

    const paymentData = await paymentResponse.json()

    if (!paymentData.success) {
      console.error("[v0] Payment failed:", paymentData.error)
      return NextResponse.json({ success: false, error: paymentData.error || "Payment failed" }, { status: 400 })
    }

    console.log("[v0] Payment successful:", paymentData.payment.id)

    // Create order in database
    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
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
        shipping_country: country,
        payment_id: paymentData.payment.id,
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
        monthly_amount_cents: monthlyAmountCents,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
    }

    console.log("[v0] Order created:", order.order_number)

    // Build product description for emails
    let productDescription = `${plaqueColor.charAt(0).toUpperCase() + plaqueColor.slice(1)} Memorial Plaque`
    const addons = []
    if (addonWoodenQr) addons.push("Wooden QR Code")
    if (addonPicturePlaque) addons.push("Picture Plaque")
    if (addonStoneQr) addons.push("Stone QR Code")
    if (addons.length > 0) {
      productDescription += ` + ${addons.join(", ")}`
    }

    // Send confirmation emails (don't block on failure)
    const emailData = {
      customerName,
      customerEmail,
      orderNumber: order.order_number,
      orderDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      productName: productDescription,
      amount: `$${(totalAmountCents / 100).toFixed(2)}`,
      shippingAddress: {
        line1: addressLine1,
        line2: addressLine2,
        city,
        state,
        zip,
      },
    }

    sendOrderConfirmationEmail(emailData).catch((error) => {
      console.error("[v0] Failed to send confirmation email:", error)
    })

    sendAdminOrderNotification(emailData).catch((error) => {
      console.error("[v0] Failed to send admin notification:", error)
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    })
  } catch (error) {
    console.error("[v0] Checkout processing error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
