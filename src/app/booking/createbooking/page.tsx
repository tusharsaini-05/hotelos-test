import type { Metadata } from "next"
import CreateBooking from "@/components/bookings/createbooking/create-booking"

export const metadata: Metadata = {
  title: "Booking Management",
  description: "Create and manage hotel room bookings",
}

export default function BookingPage() {
  return <CreateBooking />
}

