import type { Metadata } from "next"
import HotelSettingsPage from "@/components/Hotels/hotel-settings-page"

export const metadata: Metadata = {
  title: "Hotel Settings",
  description: "Manage your hotel properties and settings",
}

export default function Page() {
  return <HotelSettingsPage />
}

