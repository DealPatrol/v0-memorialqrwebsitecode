import { Client, Environment } from "square"

let squareClient: Client | null = null

export function getSquareClient() {
  if (!squareClient) {
    squareClient = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      environment: process.env.SQUARE_ENVIRONMENT === "production" ? Environment.Production : Environment.Sandbox,
    })
  }
  return squareClient
}
