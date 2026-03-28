import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient()

    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('[v0] Error fetching suppliers:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
