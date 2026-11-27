"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { buildObituary, type ObituaryInput } from "@/lib/obituary"

const FIELDS: Array<{ key: keyof ObituaryInput; label: string; placeholder: string; long?: boolean }> = [
  { key: "fullName", label: "Full name", placeholder: "Margaret Ellis" },
  { key: "nickname", label: "Nickname (optional)", placeholder: "Peggy" },
  { key: "age", label: "Age", placeholder: "81" },
  { key: "town", label: "Town they lived in", placeholder: "Cullman, Alabama" },
  { key: "dateOfDeath", label: "Date they died", placeholder: "November 2, 2026" },
  { key: "circumstance", label: "How or where (optional)", placeholder: "peacefully at home, surrounded by family" },
  { key: "birthPlace", label: "Where they were born", placeholder: "Hanceville" },
  { key: "parents", label: "Parents", placeholder: "Ruth and Harold Pruitt" },
  { key: "lifeDetails", label: "Their life, one detail per line", placeholder: "She taught second grade for 31 years\nShe played piano at church every Sunday", long: true },
  { key: "survivedBy", label: "Survived by", placeholder: "her husband of 58 years, Don; her children, Karen and Steve; five grandchildren", long: true },
  { key: "precededBy", label: "Preceded in death by", placeholder: "her parents and her brother, Earl" },
  { key: "service", label: "Service details, one per line", placeholder: "Visitation will be Friday, November 6, from 5 to 7 PM\nThe funeral will be Saturday at 11 AM", long: true },
  { key: "donations", label: "Donations in lieu of flowers (optional)", placeholder: "the church music fund" },
]

const EMPTY: ObituaryInput = {
  fullName: "",
  nickname: "",
  age: "",
  town: "",
  dateOfDeath: "",
  circumstance: "",
  birthPlace: "",
  parents: "",
  lifeDetails: "",
  survivedBy: "",
  precededBy: "",
  service: "",
  donations: "",
  includeMemorialLink: true,
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        })
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  )
}

export function ObituaryWriter() {
  const [input, setInput] = useState<ObituaryInput>(EMPTY)
  const draft = useMemo(() => buildObituary(input), [input])
  const set = (key: keyof ObituaryInput, value: string | boolean) => setInput((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6 rounded-lg border border-border bg-background p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className={field.long ? "sm:col-span-2" : undefined}>
            <Label htmlFor={`obit-${field.key}`}>{field.label}</Label>
            {field.long ? (
              <Textarea
                id={`obit-${field.key}`}
                rows={3}
                placeholder={field.placeholder}
                value={String(input[field.key])}
                onChange={(e) => set(field.key, e.target.value)}
              />
            ) : (
              <Input
                id={`obit-${field.key}`}
                placeholder={field.placeholder}
                value={String(input[field.key])}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={input.includeMemorialLink} onChange={(e) => set("includeMemorialLink", e.target.checked)} />
        Add a line for the memorial page link
      </label>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Full obituary draft</h3>
        <p className="whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-4 text-foreground" aria-live="polite">
          {draft.full}
        </p>
        <CopyButton text={draft.full} label="Copy the full obituary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Short version for the newspaper, program or a post</h3>
        <p className="whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-4 text-foreground">{draft.short}</p>
        <CopyButton text={draft.short} label="Copy the short version" />
      </div>
      <p className="text-sm text-muted-foreground">
        This fills a template with what you type. It is not an AI writer, and nothing you type leaves your browser. Read it aloud and change
        anything that does not sound like your family.
      </p>
    </div>
  )
}
