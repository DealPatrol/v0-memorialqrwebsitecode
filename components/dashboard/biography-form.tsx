"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

export function BiographyForm({ memorialId, biography }: { memorialId: string; biography: string | null }) {
  const [value, setValue] = useState(biography ?? "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function save() {
    setSaving(true)
    setMessage("")
    const supabase = createClient()
    const { error } = await supabase.from("memorials").update({ biography: value.trim() }).eq("id", memorialId)
    setSaving(false)
    setMessage(error ? "The story was not saved. Try again." : "Saved.")
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Life story</CardTitle>
        <CardDescription>This text appears on the public memorial page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={value} onChange={(event) => setValue(event.target.value)} rows={6} maxLength={4000} />
        <div className="flex items-center gap-3">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save story"}
          </Button>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
