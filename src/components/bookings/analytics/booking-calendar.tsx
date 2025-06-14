"use client"

import { useState } from "react"
import { format, isSameMonth, isToday, isWeekend } from "date-fns"
import { cn } from "@/lib/utils"
import type { Booking, OccupancyData } from "./booking-analytics"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface BookingCalendarProps {
  bookings: Booking[]
  occupancyData: OccupancyData[]
  currentDate: Date
  isLoading: boolean
  onBookingClick: (booking: Booking) => void
  hotelId?: string
}

export default function BookingCalendar({
  bookings,
  occupancyData,
  currentDate,
  isLoading,
  onBookingClick,
  hotelId,
}: BookingCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Get the days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get the days in the current month
  const days = occupancyData.map((data) => data.date)

  // Get the first day of the month
  const firstDayOfMonth = days[0]
  const startingDayIndex = firstDayOfMonth.getDay()

  // Create an array of empty cells for the days before the first day of the month
  const emptyCells = Array.from({ length: startingDayIndex }, (_, i) => i)

  // Function to get the color based on occupancy percentage
  const getOccupancyColor = (percentage: number) => {
    if (percentage === 0) return "bg-gray-100"
    if (percentage < 30) return "bg-green-100"
    if (percentage < 60) return "bg-yellow-100"
    if (percentage < 80) return "bg-orange-100"
    return "bg-red-100"
  }

  // Function to get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      try {
        const checkIn = new Date(booking.checkInDate)
        const checkOut = new Date(booking.checkOutDate)
        return date >= checkIn && date <= checkOut
      } catch (e) {
        return false
      }
    })
  }

  // Function to get occupancy data for a specific date
  const getOccupancyForDate = (date: Date) => {
    return occupancyData.find((data) => {
      return (
        data.date.getDate() === date.getDate() &&
        data.date.getMonth() === date.getMonth() &&
        data.date.getFullYear() === date.getFullYear()
      )
    })
  }

  // Function to render the occupancy percentage for a date
  const renderOccupancy = (date: Date) => {
    const occupancy = getOccupancyForDate(date)
    if (!occupancy) return null

    return (
      <div className="text-xs font-medium mt-1">
        {occupancy.percentage}% ({occupancy.occupied}/{occupancy.occupied + occupancy.available})
      </div>
    )
  }

  // Function to render room type occupancy for a date
  const renderRoomTypeOccupancy = (date: Date) => {
    const occupancy = getOccupancyForDate(date)
    if (!occupancy || !occupancy.roomTypeOccupancy) return null

    return (
      <div className="mt-1 space-y-1">
        {Object.entries(occupancy.roomTypeOccupancy).map(([roomType, data]) => (
          <div key={roomType} className="text-[10px] flex justify-between">
            <span>{roomType}:</span>
            <span>
              {data.percentage}% ({data.occupied}/{data.total})
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Function to render bookings for a date
  const renderBookings = (date: Date) => {
    const dateBookings = getBookingsForDate(date)
    if (dateBookings.length === 0) return null

    return (
      <div className="mt-1 space-y-1">
        {dateBookings.slice(0, 2).map((booking) => (
          <Badge
            key={booking.id}
            variant="outline"
            className="text-[10px] px-1 py-0 cursor-pointer truncate max-w-full"
            onClick={(e) => {
              e.stopPropagation()
              onBookingClick(booking)
            }}
          >
            {booking.guest.firstName} {booking.guest.lastName}
          </Badge>
        ))}
        {dateBookings.length > 2 && (
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            +{dateBookings.length - 2} more
          </Badge>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}

        {emptyCells.map((i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-md"></div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isWeekendDay = isWeekend(day)
          const occupancy = getOccupancyForDate(day)
          const occupancyColor = occupancy ? getOccupancyColor(occupancy.percentage) : "bg-gray-100"

          return (
            <div
              key={day.toString()}
              className={cn(
                "h-24 p-1 rounded-md transition-colors border",
                isCurrentMonth ? occupancyColor : "bg-gray-50 text-gray-400",
                isToday(day) && "border-blue-500",
                isWeekendDay && "bg-opacity-70",
                "hover:border-blue-400 cursor-pointer overflow-hidden",
              )}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              title={format(day, "EEEE, MMMM d, yyyy")}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) && "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              {renderOccupancy(day)}
              {renderBookings(day)}
              {hoveredDate && hoveredDate.getDate() === day.getDate() && hoveredDate.getMonth() === day.getMonth() && (
                <div className="text-[10px] mt-1">
                  <div>
                    <span className="font-medium">Available:</span> {occupancy?.available || 0}
                  </div>
                  <div>
                    <span className="font-medium">Occupied:</span> {occupancy?.occupied || 0}
                  </div>
                  {renderRoomTypeOccupancy(day)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
