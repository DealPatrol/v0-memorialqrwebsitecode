import { NextRequest, NextResponse } from 'next/server'
import { getSupplierClient } from '@/lib/suppliers'

export async function POST(req: NextRequest) {
  try {
    const { apiType, apiKey, apiEndpoint } = await req.json()

    if (!apiType || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'Missing apiType or apiKey' },
        { status: 400 }
      )
    }

    // Get the supplier client
    const client = getSupplierClient(apiType, apiKey, apiEndpoint)

    // Test the connection
    const result = await client.testConnection()

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error testing supplier connection:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Connection test failed',
    })
  }
}
