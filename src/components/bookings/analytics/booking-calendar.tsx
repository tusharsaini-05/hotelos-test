"use client"

import React, { useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { ChevronDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Booking, OccupancyData } from "./booking-analytics"

interface RoomWithBookings {
  roomNumber: string;
  roomId?: string;
  floor: number;
  type: string;
  bookings: Booking[];
}

interface BookingCalendarProps {
  bookings: Booking[];
  occupancyData: OccupancyData[];
  currentDate: Date;
  isLoading: boolean;
  onBookingClick: (booking: Booking) => void;
}

export default function BookingCalendar({
  bookings,
  occupancyData,
  isLoading,
  onBookingClick,
}: BookingCalendarProps) {
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<string[]>([])

  // Group rooms by type
  const roomsByType: Record<string, RoomWithBookings[]> = bookings.reduce((acc, booking) => {
    const roomType = booking.roomType || "Unknown"
    if (!acc[roomType]) {
      acc[roomType] = []
    }

    // Check if room is already in the array
    const existingRoom = acc[roomType].find((r) => r.roomNumber === booking.roomNumber)
    if (!existingRoom) {
      acc[roomType].push({
        roomNumber: booking.roomNumber,
        roomId: booking.roomId,
        floor: booking.floor,
        type: roomType,
        bookings: [booking],
      })
    } else {
      existingRoom.bookings.push(booking)
    }

    return acc
  }, {} as Record<string, RoomWithBookings[]>)

  // Sort rooms by number within each type
  Object.keys(roomsByType).forEach((type) => {
    roomsByType[type].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
  })

  const toggleRoomType = (roomType: string) => {
    setExpandedRoomTypes((prev) =>
      prev.includes(roomType) ? prev.filter((type) => type !== roomType) : [...prev, roomType],
    )
  }

  // Get days for the calendar view
  const days = occupancyData

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Handle the case with no bookings
  if (Object.keys(roomsByType).length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-muted-foreground">No bookings found for the selected period and filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50 border-y">
            <th className="p-3 text-left font-medium w-32">ROOMS</th>
            {days.map((day, index) => (
              <th key={index} className="p-3 text-center font-medium min-w-[120px]">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">{format(day.date, "EEE d")}</span>
                  <span className="text-sm font-bold">{day.percentage}%</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(roomsByType).map(([roomType, rooms]) => (
            <React.Fragment key={roomType}>
              <tr className="border-b hover:bg-muted/30 cursor-pointer">
                <td 
                  className="p-3 font-medium flex items-center gap-1" 
                  onClick={() => toggleRoomType(roomType)}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedRoomTypes.includes(roomType) ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span>{roomType}</span>
                </td>
                {days.map((day, dayIndex) => {
                  const roomsOfType = rooms.length
                  const bookedRooms = rooms.filter((room) =>
                    room.bookings.some((booking) => {
                      try {
                        const checkIn = parseISO(booking.checkInDate)
                        const checkOut = parseISO(booking.checkOutDate)
                        return day.date >= checkIn && day.date <= checkOut
                      } catch (e) {
                        console.error("Date parsing error:", e)
                        return false
                      }
                    }),
                  ).length

                  const available = roomsOfType - bookedRooms
                  const displayText =
                    available === 0 ? "0" : available > 0 ? `+${available}` : `-${Math.abs(available)}`

                  return (
                    <td key={dayIndex} className="p-3 text-center">
                      <span
                        className={`
                        ${available > 0 ? "text-green-600" : available < 0 ? "text-red-600" : "text-gray-500"}
                        font-medium
                      `}
                      >
                        {displayText}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {expandedRoomTypes.includes(roomType) &&
                rooms.map((room) => (
                  <tr key={`${roomType}-${room.roomNumber}`} className="border-b hover:bg-muted/20">
                    <td className="p-3 pl-8 text-sm">
                      {room.roomNumber} 
                      <span className="text-xs text-muted-foreground ml-2">
                        (Floor {room.floor})
                      </span>
                    </td>
                    
                    {days.map((day, dayIndex) => {
                      const bookingsForDay = room.bookings.filter((booking) => {
                        try {
                          const checkIn = parseISO(booking.checkInDate)
                          const checkOut = parseISO(booking.checkOutDate)
                          return day.date >= checkIn && day.date <= checkOut
                        } catch (e) {
                          console.error("Date parsing error:", e)
                          return false
                        }
                      })

                      return (
                        <td key={dayIndex} className="p-0 relative h-12">
                          {bookingsForDay.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400">
                              Available
                            </div>
                          ) : (
                            bookingsForDay.map((booking, i) => {
                              try {
                                const isCheckIn = isSameDay(parseISO(booking.checkInDate), day.date)
                                const isCheckOut = isSameDay(parseISO(booking.checkOutDate), day.date)

                                // Determine the color based on booking status
                                let bgColor = "bg-green-200"
                                if (booking.bookingStatus === "CONFIRMED") bgColor = "bg-green-200"
                                if (booking.bookingStatus === "CHECKED_IN") bgColor = "bg-blue-200"
                                if (booking.bookingStatus === "PENDING") bgColor = "bg-amber-200"
                                if (booking.bookingStatus === "CANCELLED") bgColor = "bg-red-200"
                                if (booking.bookingStatus === "CHECKED_OUT") bgColor = "bg-gray-200"

                                return (
                                  <div
                                    key={`booking-${booking.id || i}`}
                                    className={`
                                    ${bgColor} p-1 text-xs cursor-pointer
                                    ${isCheckIn ? "rounded-l-md border-l-4 border-l-green-600" : ""}
                                    ${isCheckOut ? "rounded-r-md border-r-4 border-r-green-600" : ""}
                                    h-full flex items-center justify-center
                                  `}
                                    onClick={() => onBookingClick(booking)}
                                    title={`${booking.guest.firstName} ${booking.guest.lastName} - ${booking.bookingStatus}`}
                                  >
                                    {booking.guest.firstName} {booking.guest.lastName}
                                  </div>
                                )
                              } catch (e) {
                                console.error("Error rendering booking:", e)
                                return null
                              }
                            })
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}