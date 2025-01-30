"use client"

import { motion } from "framer-motion"
import { Calendar, Menu, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Booking {
  id: string
  name: string
  guests: number
  bookingId: string
  dates: string
  rooms: string
  nights: string
  payment: string
  amount: string
  status: string
}

const bookings: { previous: Booking[]; today: Booking[] } = {
  previous: [
    {
      id: "1",
      name: "Tom Smith",
      guests: 2,
      bookingId: "AIQK0914",
      dates: "28 Mar - 29 Mar",
      rooms: "2 Rooms",
      nights: "1 Night",
      payment: "Pay at Hotel",
      amount: "$ 1000",
      status: "Walk In",
    },
  ],
  today: [
    {
      id: "2",
      name: "Sumeet",
      guests: 2,
      bookingId: "UDNX1483",
      dates: "29 Mar - 30 Mar",
      rooms: "1 Room",
      nights: "1 Night",
      payment: "Pay at Hotel",
      amount: "$ 400",
      status: "Walk In",
    },
  ],
}

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void
}

export function BookingsList({ onSelectBooking }: BookingsListProps) {
  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming" className="bg-red-500 text-white data-[state=active]:bg-red-600">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="inhouse">In House</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <BookingsSection
        title="Previous"
        subtitle="1 Booking - 2 Rooms"
        bookings={bookings.previous}
        onSelectBooking={onSelectBooking}
      />

      <BookingsSection
        title="Today"
        subtitle="3 Bookings - 3 Rooms"
        bookings={bookings.today}
        onSelectBooking={onSelectBooking}
        showDownload
      />
    </div>
  )
}

interface BookingsSectionProps {
  title: string
  subtitle: string
  bookings: Booking[]
  onSelectBooking: (bookingId: string) => void
  showDownload?: boolean
}

function BookingsSection({ title, subtitle, bookings, onSelectBooking, showDownload = false }: BookingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {showDownload && (
          <Button variant="ghost" className="text-red-500 hover:text-red-600">
            <Printer className="mr-2 h-4 w-4" />
            Download Today's Arrival
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b bg-gray-50 p-4 text-sm font-medium text-gray-500">
          <div>NAME</div>
          <div>BOOKING ID</div>
          <div>ROOM NIGHTS</div>
          <div>PAYMENTS</div>
          <div>BOOKING INFO</div>
        </div>

        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
            className="grid cursor-pointer grid-cols-5 gap-4 p-4"
            onClick={() => onSelectBooking(booking.id)}
          >
            <div>
              <div className="font-medium">{booking.name}</div>
              <div className="text-sm text-gray-500">{booking.guests} Guests</div>
            </div>
            <div>
              <div className="font-medium">{booking.bookingId}</div>
              <div className="text-sm text-gray-500">{booking.dates}</div>
            </div>
            <div>
              <div>{booking.rooms}</div>
              <div className="text-sm text-gray-500">{booking.nights}</div>
            </div>
            <div>
              <div>{booking.payment}</div>
              <div className="text-sm text-gray-500">{booking.amount}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{booking.status}</span>
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

