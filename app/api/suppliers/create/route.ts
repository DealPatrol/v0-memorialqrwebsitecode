import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { encryptString } from '@/lib/suppliers/encryption'

export async function POST(req: NextRequest) {
  try {
    const { name, description, apiType, apiKey, apiEndpoint, isPrimary } = await req.json()

    if (!name || !apiKey || !apiType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, apiKey, apiType' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')

    // Encrypt API key
    const encryptedKey = encryptString(apiKey)

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert([
        {
          name,
          slug,
          description,
          api_type: apiType,
          api_key_encrypted: encryptedKey,
          api_endpoint: apiEndpoint || null,
          is_active: true,
          is_primary: isPrimary || false,
          priority: isPrimary ? 100 : 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase error creating supplier:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ supplier }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating supplier:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
