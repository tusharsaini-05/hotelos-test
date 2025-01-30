"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookingsList } from "@/components/bookings/booking-list"
import { BookingDetails } from "@/components/bookings/booking-details"
import { useLayout } from "@/providers/layout-providers"

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const { isSidebarOpen } = useLayout()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      {selectedBooking ? (
        <BookingDetails bookingId={selectedBooking} onBack={() => setSelectedBooking(null)} />
      ) : (
        <BookingsList onSelectBooking={setSelectedBooking} />
      )}
    </motion.div>
  )
}
