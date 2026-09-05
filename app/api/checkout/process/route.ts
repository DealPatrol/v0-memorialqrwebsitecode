import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import { generateQRCodeBuffer } from "@/lib/qr-code"
import { getStoreProduct } from "@/lib/store-products"
import { fulfillVoiceKeychain } from "@/lib/printify"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      // New individual product fields
      planType,
      items,
      package: packageOrProductId,
      productName,
      productPrice,
      monthlyFee,

      // Shared fields
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      paymentId,
      customization,
      cardId,
      squareCustomerId,

      // Old package fields (keep for backwards compatibility)
      plaqueColor,
      boxPersonalization,
      addonWoodenQr,
      addonPicturePlaque,
      addonStoneQR,
      stoneEngravingText,
      picturePlaqueUrl,
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !addressLine1 || !city || !state || !zip || !paymentId) {
      const missing = []
      if (!customerName) missing.push("customerName")
      if (!customerEmail) missing.push("customerEmail")
      if (!addressLine1) missing.push("addressLine1")
      if (!city) missing.push("city")
      if (!state) missing.push("state")
      if (!zip) missing.push("zip")
      if (!paymentId) missing.push("paymentId")

      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      )
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const purchasedItems = Array.isArray(items)
      ? items
          .map((item) => {
            const product = getStoreProduct(String(item.id))
            const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1))
            return product ? { product, quantity } : null
          })
          .filter(Boolean)
      : []

    let totalAmountCents = 0
    let monthlyAmountCents = 0
    let finalProductName = productName || "Memorial QR Product"
    let finalPlanType = planType || "individual-product"

    if (planType === "individual-product" && purchasedItems.length > 0) {
      totalAmountCents = purchasedItems.reduce(
        (sum, item) => sum + Math.round(item!.product.price * 100) * item!.quantity,
        0,
      )
      monthlyAmountCents = 499
      finalProductName = purchasedItems.map((item) => item!.product.name).join(", ")
    } else {
      // Legacy package purchase
      const packagePrices: Record<string, number> = {
        basic: 8989,
        standard: 12989,
        premium: 19989,
      }
      const baseAmount = packagePrices[packageOrProductId as string] || packagePrices.standard

      let addonAmount = 0
      if (addonWoodenQr) addonAmount += 1989
      if (addonPicturePlaque) addonAmount += 2989
      if (addonStoneQR) addonAmount += 3998
      totalAmountCents = baseAmount + addonAmount
      monthlyAmountCents = 499 // $4.99/month
      finalProductName = `Memorial QR ${packageOrProductId || "standard"} Package${plaqueColor ? ` - ${plaqueColor} plaque` : ""}`
      finalPlanType = "package"
    }

    const supabaseAuth = await createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    const userId = user?.id || null
    const finalSquareCustomerId = squareCustomerId || user?.user_metadata?.square_customer_id || null

    console.log("[v0] Processing checkout - User ID:", userId, "Square Customer ID:", finalSquareCustomerId)

    const supabase = createServiceRoleClient()

    let subscriptionId = null
    let subscriptionStatus = null

    // Only create subscription if monthly fee exists and payment info is available
    // Note: In future enhancement, check if customer already has subscription for this memorial
    if (monthlyAmountCents > 0 && cardId && finalSquareCustomerId) {
      console.log("[v0] Creating monthly subscription for memorial hosting (per-memorial, not per-product)...")

      try {
        const subscriptionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/square/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: finalSquareCustomerId,
              cardId: cardId,
              planVariationId: process.env.SQUARE_SUBSCRIPTION_PLAN_ID,
              orderId: orderNumber,
            }),
          },
        )

        const subscriptionData = await subscriptionResponse.json()

        if (subscriptionData.success) {
          subscriptionId = subscriptionData.subscription.id
          subscriptionStatus = subscriptionData.subscription.status
          console.log("[v0] Subscription created successfully:", subscriptionId)
        } else {
          console.error("[v0] Subscription creation failed:", subscriptionData.error)
          // Don't fail the order if subscription fails - store can follow up manually
        }
      } catch (subError) {
        console.error("[v0] Subscription creation error:", subError)
        // Don't fail the order if subscription fails
      }
    }

    const orderData = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address_line1: addressLine1,
      shipping_address_line2: addressLine2 || null,
      shipping_city: city,
      shipping_state: state,
      shipping_zip: zip,
      shipping_country: "CA",
      payment_id: paymentId,
      payment_status: "completed",
      amount_cents: totalAmountCents,
      monthly_amount_cents: monthlyAmountCents,
      currency: "CAD",
      product_type: finalPlanType,
      product_name: finalProductName,
      quantity: purchasedItems.reduce((sum, item) => sum + item!.quantity, 0) || 1,
      status: "processing",
      special_instructions: customization || boxPersonalization || null,
      plan_type: finalPlanType,
      subscription_id: subscriptionId,
      subscription_plan_id: process.env.SQUARE_SUBSCRIPTION_PLAN_ID || null,

      // Keep legacy fields for backwards compatibility
      plaque_color: plaqueColor || null,
      box_personalization: boxPersonalization || null,
      addon_wooden_qr: addonWoodenQr || false,
      addon_picture_plaque: addonPicturePlaque || false,
      addon_stone_qr: addonStoneQR || false,
      stone_engraving_text: stoneEngravingText || null,
      picture_plaque_url: picturePlaqueUrl || null,

      user_id: userId,
      square_customer_id: finalSquareCustomerId,
    }

    const { data: order, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("[v0] Database error creating order:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      )
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not created" }, { status: 500 })
    }

    console.log("[v0] Order created successfully:", order.order_number)

    const primaryProduct = purchasedItems[0]?.product
    let memorial = null
    let qrCodeUrl: string | null = null

    if (primaryProduct) {
      const slug = `memorial-${order.order_number.toLowerCase()}`
      const { data: createdMemorial, error: memorialError } = await supabase
        .from("memorials")
        .insert({
          slug,
          full_name: "Memorial setup in progress",
          user_id: userId,
          package_type: primaryProduct.memorialType,
          product_type: primaryProduct.memorialType,
          theme: "classic",
        })
        .select()
        .single()

      if (memorialError || !createdMemorial) {
        console.error("[v0] Failed to reserve memorial:", memorialError)
        return NextResponse.json(
          { success: false, error: "Payment succeeded, but memorial setup could not be reserved. Contact support." },
          { status: 500 },
        )
      }

      memorial = createdMemorial
      const memorialUrl = `https://www.memorialsqr.com/memorial/${createdMemorial.slug}`

      try {
        const qrCode = await generateQRCodeBuffer(memorialUrl)
        const qrBlob = await put(`qr-codes/${createdMemorial.slug}.png`, qrCode, {
          access: "public",
          contentType: "image/png",
          addRandomSuffix: false,
        })
        qrCodeUrl = qrBlob.url
        await supabase.from("memorials").update({ qr_code_url: qrBlob.url }).eq("id", createdMemorial.id)
      } catch (qrError) {
        console.error("[v0] QR generation failed:", qrError)
      }

      await supabase
        .from("orders")
        .update({ memorial_id: createdMemorial.id })
        .eq("id", order.id)

      if (qrCodeUrl && primaryProduct.memorialType === "voice-keychain") {
        try {
          const fulfillment = await fulfillVoiceKeychain({
            orderNumber: order.order_number,
            quantity: orderData.quantity,
            qrCodeUrl,
            address: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              address1: addressLine1,
              address2: addressLine2,
              city,
              region: state,
              zip,
              country: "CA",
            },
          })
          await supabase
            .from("orders")
            .update({
              fulfillment_provider: "printify",
              fulfillment_id: fulfillment.fulfillmentId,
              fulfillment_status: fulfillment.status,
            })
            .eq("id", order.id)
        } catch (fulfillmentError) {
          console.error("[v0] Printify fulfillment failed:", fulfillmentError)
          await supabase
            .from("orders")
            .update({ fulfillment_provider: "printify", fulfillment_status: "failed" })
            .eq("id", order.id)
        }
      }
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail: customerEmail,
          customerName: customerName,
          productName: finalProductName,
          amount: (totalAmountCents / 100).toFixed(2),
          monthlyFee: (monthlyAmountCents / 100).toFixed(2),
        }),
      })
    } catch (emailError) {
      console.error("[v0] Failed to send order confirmation email:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        memorialId: memorial?.id || null,
        memorialSlug: memorial?.slug || null,
        memorialType: primaryProduct?.memorialType || "standard",
      },
    })
  } catch (error: any) {
    console.error("[v0] Checkout processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown server error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/checkout/process" })
}
