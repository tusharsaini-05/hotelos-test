import type { Metadata } from "next"
import HotelDashboard from "@/components/dashbaord/hotel-dashboard"

export const metadata: Metadata = {
  title: "Hotel Analytics Dashboard",
  description: "Comprehensive analytics for hotel bookings, rooms, and revenue",
}

export default function DashboardPage() {
  return <HotelDashboard />
}
