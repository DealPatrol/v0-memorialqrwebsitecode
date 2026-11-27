import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildObituary, obituaryPage, type ObituaryInput } from "../lib/obituary"
import { publicPages } from "../lib/seo"

const base: ObituaryInput = {
  fullName: "Margaret Ellis",
  nickname: "Peggy",
  age: "81",
  town: "Cullman, Alabama",
  dateOfDeath: "November 2, 2026",
  circumstance: "peacefully at home",
  birthPlace: "Hanceville",
  parents: "Ruth and Harold Pruitt",
  lifeDetails: "she taught second grade\nShe grew tomatoes nobody could match.",
  survivedBy: "her husband, Don, and her sister, June",
  precededBy: "her parents",
  service: "Visitation will be Friday from 5 to 7 PM",
  donations: "the church music fund",
  includeMemorialLink: true,
}

describe("obituary writer", () => {
  it("writes the five parts in order", () => {
    const { full } = buildObituary(base)
    assert.match(full, /^Margaret “Peggy” Ellis, 81, of Cullman, Alabama, died peacefully at home on November 2, 2026\./)
    const order = ["was born in Hanceville to Ruth and Harold Pruitt", "She taught second grade.", "is survived by", "preceded in death by", "Visitation will be", "In lieu of flowers", "[memorial page link]"]
    let last = -1
    for (const piece of order) {
      const at = full.indexOf(piece)
      assert.ok(at > last, `${piece} out of order`)
      last = at
    }
  })

  it("leaves placeholders, not invented details, when fields are empty", () => {
    const empty = buildObituary({ ...base, fullName: "", nickname: "", age: "", town: "", dateOfDeath: "", circumstance: "", birthPlace: "", parents: "", lifeDetails: "", survivedBy: "", precededBy: "", service: "", donations: "", includeMemorialLink: false })
    assert.equal(empty.full, "[Full name] died on [date].")
    assert.equal(empty.short, "[Full name] died on [date].")
  })

  it("keeps SEO and honesty rules", () => {
    assert.equal(publicPages.obituaryTemplate.path, "/obituary-template")
    assert.ok(obituaryPage.title.length <= 60)
    assert.ok(obituaryPage.description.length <= 155)
    assert.match(obituaryPage.exampleNote, /made up/)
    const ai = obituaryPage.faqs.find((faq) => /AI/.test(faq.question))
    assert.ok(ai && /^No\./.test(ai.answer))
  })
})
