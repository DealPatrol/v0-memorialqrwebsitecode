import { Client, Environment } from "square"

let squareClient: Client | null = null

export function getSquareClient() {
  console.log("[v0] Getting Square client")

  if (!squareClient) {
    console.log("[v0] Initializing new Square client")

    if (!process.env.SQUARE_ACCESS_TOKEN) {
      throw new Error("SQUARE_ACCESS_TOKEN environment variable is not set")
    }

    if (!process.env.SQUARE_LOCATION_ID) {
      throw new Error("SQUARE_LOCATION_ID environment variable is not set")
    }

    const environment = process.env.SQUARE_ENVIRONMENT === "production" ? Environment.Production : Environment.Sandbox

    console.log("[v0] Square environment:", environment)

    try {
      squareClient = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment,
      })
      console.log("[v0] Square client initialized successfully")
    } catch (error: any) {
      console.error("[v0] Failed to initialize Square client:", error)
      throw new Error(`Failed to initialize Square client: ${error.message}`)
    }
  }

  return squareClient
}
