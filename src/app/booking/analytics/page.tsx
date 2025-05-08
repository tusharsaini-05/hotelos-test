import type { Metadata } from "next"
import BookingAnalytics from "@/components/bookings/analytics/booking-analytics"

export const metadata: Metadata = {
  title: "Booking Analytics",
  description: "View and analyze hotel room bookings and occupancy rates",
}

export default function BookingAnalyticsPage() {
  return <BookingAnalytics />
}

