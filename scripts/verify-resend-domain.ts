import { Resend } from "resend"

async function verifyResendDomain() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY environment variable is not set")
    process.exit(1)
  }

  const resend = new Resend(apiKey)

  try {
    // First, list all domains to find memorialsqr.com
    console.log("🔍 Fetching domains...")
    const { data: domains } = await resend.domains.list()

    if (!domains || domains.length === 0) {
      console.log("⚠️  No domains found. Please add memorialsqr.com in your Resend dashboard first.")
      console.log("   Visit: https://resend.com/domains")
      process.exit(0)
    }

    console.log("\n📋 Found domains:")
    domains.forEach((domain) => {
      console.log(`   - ${domain.name} (${domain.status})`)
    })

    // Find memorialsqr.com domain
    const memorialDomain = domains.find((d) => d.name === "memorialsqr.com" || d.name.includes("memorialsqr"))

    if (!memorialDomain) {
      console.log("\n⚠️  memorialsqr.com not found in your Resend account.")
      console.log("   Add it at: https://resend.com/domains")
      process.exit(0)
    }

    console.log(`\n🔄 Verifying domain: ${memorialDomain.name}`)

    // Attempt to verify the domain
    const { data: verifyResult, error } = await resend.domains.verify(memorialDomain.id)

    if (error) {
      console.error("\n❌ Verification failed:", error.message)
      console.log("\n📝 Make sure you have added these DNS records to your domain registrar:")
      console.log("   1. SPF record (TXT)")
      console.log("   2. DKIM record (TXT)")
      console.log("   3. DMARC record (TXT)")
      console.log("\n   Get the exact records from: https://resend.com/domains")
      process.exit(1)
    }

    console.log("\n✅ Domain verification successful!")
    console.log("   Status:", verifyResult)
    console.log("\n🎉 You can now send emails from @memorialsqr.com addresses")
  } catch (error) {
    console.error("\n❌ Error:", error.message)
    process.exit(1)
  }
}

verifyResendDomain()
