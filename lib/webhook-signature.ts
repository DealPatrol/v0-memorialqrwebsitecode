import { createHmac } from "node:crypto"

export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  const normalizedSignature = signature?.replace(/^sha256=/i, "") || ""
  if (!/^[a-f0-9]{64}$/i.test(normalizedSignature)) {
    return false
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest()
  const received = Buffer.from(normalizedSignature, "hex")
  let mismatch = received.length ^ expected.length
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected[index] ^ (received[index] ?? 0)
  }
  return mismatch === 0
}
