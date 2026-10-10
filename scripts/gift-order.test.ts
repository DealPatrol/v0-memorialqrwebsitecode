import assert from "node:assert/strict"
import { test } from "node:test"
import { priceCart } from "../lib/checkout-pricing"
import { PET_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { giftIntentList } from "../lib/gift-intent"
import { buildManualFulfillmentNotice } from "../lib/manual-fulfillment-email"
import {
  giftBuyerSentences,
  giftNoticeLines,
  giftOrderColumns,
  initialOrderInsertPlan,
  packageRecipientName,
  parseGiftOrder,
  readGift,
  relaxOrderInsert,
} from "../lib/gift-order"

test("a gift stores the recipient and message without changing the catalog price", () => {
  const parsed = parseGiftOrder({
    isGift: true,
    recipientName: "  Grace Hopper ",
    giftMessage: "  With love from the team. ",
    shipToRecipient: true,
  })
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.equal(parsed.gift.recipientName, "Grace Hopper")
  assert.equal(parsed.gift.giftMessage, "With love from the team.")
  assert.equal(parsed.gift.shipToRecipient, true)
  assert.equal(giftOrderColumns(parsed.gift)?.is_gift, true)
  assert.equal("price" in (giftOrderColumns(parsed.gift) || {}), false)

  const cart = priceCart([{ id: PET_MEMORIAL_PLAQUE_ID, quantity: 1, price: 1, isGift: true }], {})
  assert.ok(cart)
  assert.equal(cart.amountCents, 2999)
})

test("gift details are rejected when the name or message is unusable", () => {
  assert.equal(parseGiftOrder({ isGift: true, recipientName: "  ", giftMessage: "", shipToRecipient: false }).ok, false)
  assert.equal(parseGiftOrder({ isGift: true, recipientName: "Ada", giftMessage: "x".repeat(281), shipToRecipient: false }).ok, false)
  assert.equal(parseGiftOrder({ isGift: "yes", recipientName: "Ada" }).ok, false)
  const plain = parseGiftOrder({ isGift: false, recipientName: "Ignored", giftMessage: "Nope", shipToRecipient: true })
  assert.equal(plain.ok, true)
  if (!plain.ok) return
  assert.equal(plain.gift.isGift, false)
  assert.equal(giftOrderColumns(plain.gift), null)
  assert.deepEqual(giftBuyerSentences(plain.gift), [])
})

test("the package name is the recipient only when we ship to them", () => {
  const toRecipient = {
    customer_name: "Ada Lovelace",
    is_gift: true,
    recipient_name: "Grace Hopper",
    gift_message: "Thinking of you",
    gift_ship_to_recipient: true,
  }
  assert.equal(packageRecipientName(toRecipient), "Grace Hopper")
  assert.match(giftNoticeLines(toRecipient).join("\n"), /Ship the package to the recipient at the shipping address/)
  assert.match(giftBuyerSentences(readGift(toRecipient))[0], /ship the keepsake to Grace Hopper/)

  const handDelivered = { ...toRecipient, gift_ship_to_recipient: false }
  assert.equal(packageRecipientName(handDelivered), "Ada Lovelace")
  assert.match(giftNoticeLines(handDelivered).join("\n"), /Ship the package to the buyer at the shipping address/)
})

test("a missing gift column falls back onto fulfillment_data, and a gift is never dropped", () => {
  const missingColumn = { code: "PGRST204", message: "Could not find the 'is_gift' column of 'orders' in the schema cache" }
  const missingPod = { code: "PGRST204", message: "Could not find the 'fulfillment_data' column of 'orders' in the schema cache" }
  const plan = relaxOrderInsert(initialOrderInsertPlan(), missingColumn, true)
  assert.equal(typeof plan, "object")
  if (typeof plan !== "object") return
  assert.equal(plan.giftColumns, false)
  assert.equal(plan.giftInFulfillment, true)
  assert.equal(relaxOrderInsert(plan, missingPod, true), "unsaved-gift")

  const stored = readGift({
    fulfillment_data: {
      schema_version: 1,
      gift: { isGift: true, recipientName: "Grace Hopper", giftMessage: "With love", shipToRecipient: true },
    },
  })
  assert.equal(stored.recipientName, "Grace Hopper")
  assert.equal(packageRecipientName({ customer_name: "Ada", fulfillment_data: { gift: stored } }), "Grace Hopper")
})

test("the make-and-ship email shows the gift message and the recipient on the label", () => {
  const notice = buildManualFulfillmentNotice(
    {
      order: {
        order_number: "MQR-GIFT",
        customer_name: "Ada Lovelace",
        customer_email: "ada@example.com",
        customer_phone: null,
        shipping_address_line1: "9 Navy Way",
        shipping_address_line2: null,
        shipping_city: "Arlington",
        shipping_state: "VA",
        shipping_zip: "22201",
        special_instructions: "Grace Hopper\n1906-1992\ngold",
        is_gift: true,
        recipient_name: "Grace Hopper",
        gift_message: "With love from Ada",
        gift_ship_to_recipient: true,
      },
      lines: [],
      memorialUrl: null,
      printFileUrl: null,
      memorialError: null,
    },
    {},
  )
  assert.match(notice.subject, /gift for Grace Hopper/)
  assert.match(notice.text, /9 Navy Way/)
  assert.match(notice.text, /Grace Hopper/)
  assert.match(notice.text, /With love from Ada/)
  assert.match(notice.text, /Grace Hopper\n1906-1992\ngold/)
  assert.equal(notice.text.startsWith("Make and ship"), true)
})

test("each gift page tells the buyer they can ship it as a gift", () => {
  assert.ok(giftIntentList.length >= 2 && giftIntentList.length <= 8)
  for (const page of giftIntentList) {
    const faq = page.faqs.map((item) => `${item.question} ${item.answer}`).join("\n")
    assert.match(faq, /address/)
    assert.match(faq, /gift/)
    assert.match(faq, /not engraved|not printed on the plaque|not the engraving/)
  }
})
