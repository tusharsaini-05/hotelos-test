import type { Metadata } from "next"
import CreateBooking from "../../../components/bookings/create-bookings"

export const metadata: Metadata = {
  title: "Booking Management",
  description: "Create and manage hotel room bookings",
}

export default function BookingPage() {
  return <CreateBooking />
}
                                 
