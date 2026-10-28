import { HolidayRemembranceView } from "@/components/holiday-remembrance-view"
import { EXAMPLE_MEMORIAL_NAME } from "@/lib/example-memorial"
import { exampleHolidayRemembrance, holidayMetadataInput } from "@/lib/holiday-remembrance"
import { EXAMPLE_HOLIDAY_PATH } from "@/lib/memorial-urls"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  holidayMetadataInput({
    path: EXAMPLE_HOLIDAY_PATH,
    fullName: EXAMPLE_MEMORIAL_NAME,
    sample: true,
  }),
)

export default function ExampleHolidayRemembrancePage() {
  return <HolidayRemembranceView content={exampleHolidayRemembrance()} />
}
