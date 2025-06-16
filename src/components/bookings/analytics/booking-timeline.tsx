"use client"

import { useState, useMemo } from "react"
import { format, addDays, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Booking, Room } from "./booking-analytics"

interface BookingTimelineProps {
  bookings: Booking[]
  rooms: Room[]
  currentDate: Date
  isLoading: boolean
  onBookingClick: (booking: Booking) => void
  onDateChange: (date: Date) => void
  onRefresh: () => void
  daysToShow?: number
}

interface RoomWithBookings extends Room {
  bookings: Booking[]
}

interface RoomTypeGroup {
  roomType: string
  rooms: RoomWithBookings[]
  isExpanded: boolean
}

export default function BookingTimeline({
  bookings,
  rooms,
  currentDate,
  isLoading,
  onBookingClick,
  onDateChange,
  onRefresh,
  daysToShow = 7,
}: BookingTimelineProps) {
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(
    new Set(["STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL"]),
  )

  // Generate date range for the timeline
  const dateRange = useMemo(() => {
    const dates = []
    for (let i = 0; i < daysToShow; i++) {
      dates.push(addDays(currentDate, i))
    }
    return dates
  }, [currentDate, daysToShow])

  // Group rooms by type and attach bookings
  const roomTypeGroups = useMemo(() => {
    const groups: { [key: string]: RoomTypeGroup } = {}

    // Initialize room type groups
    rooms.forEach((room) => {
      if (!groups[room.roomType]) {
        groups[room.roomType] = {
          roomType: room.roomType,
          rooms: [],
          isExpanded: expandedRoomTypes.has(room.roomType),
        }
      }
    })

    // Add rooms to groups with their bookings
    rooms.forEach((room) => {
      const roomBookings = bookings.filter((booking) => {
        // Check if booking is assigned to this room
        if (booking.roomIds?.includes(room.id)) return true

        // Check roomTypeBookings for room assignments
        if (booking.roomTypeBookings) {
          return booking.roomTypeBookings.some(
            (rtb) => rtb.roomType === room.roomType && rtb.roomIds?.includes(room.id),
          )
        }

        // Fallback: match by room number if available
        return booking.roomNumber === room.roomNumber
      })

      groups[room.roomType].rooms.push({
        ...room,
        bookings: roomBookings,
      })
    })

    // Sort rooms within each group by room number
    Object.values(groups).forEach((group) => {
      group.rooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }))
    })

    return Object.values(groups).sort((a, b) => a.roomType.localeCompare(b.roomType))
  }, [rooms, bookings, expandedRoomTypes])

  // Calculate occupancy for each date
  const getDateOccupancy = (date: Date) => {
    const dayBookings = bookings.filter((booking) => {
      try {
        const checkIn = parseISO(booking.checkInDate)
        const checkOut = parseISO(booking.checkOutDate)
        return isWithinInterval(date, { start: checkIn, end: checkOut })
      } catch (e) {
        return false
      }
    })

    const totalRooms = rooms.length
    const occupiedRooms = dayBookings.length
    const percentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    return {
      occupied: occupiedRooms,
      total: totalRooms,
      percentage,
      available: totalRooms - occupiedRooms,
    }
  }

  // Get room occupancy for a specific date and room
  const getRoomOccupancy = (room: Room, date: Date) => {
    const dayBookings =
      room.bookings?.filter((booking) => {
        try {
          const checkIn = parseISO(booking.checkInDate)
          const checkOut = parseISO(booking.checkOutDate)
          return isWithinInterval(date, { start: checkIn, end: checkOut })
        } catch (e) {
          return false
        }
      }) || []

    return {
      occupied: dayBookings.length,
      total: room.maxOccupancy || 1,
      bookings: dayBookings,
    }
  }

  const toggleRoomType = (roomType: string) => {
    const newExpanded = new Set(expandedRoomTypes)
    if (newExpanded.has(roomType)) {
      newExpanded.delete(roomType)
    } else {
      newExpanded.add(roomType)
    }
    setExpandedRoomTypes(newExpanded)
  }

  const handlePreviousWeek = () => {
    onDateChange(addDays(currentDate, -7))
  }

  const handleNextWeek = () => {
    onDateChange(addDays(currentDate, 7))
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  // Get booking bar style and position for a room across the timeline
  const getRoomBookingBars = (room: RoomWithBookings) => {
    const bars: Array<{
      booking: Booking
      left: string
      width: string
      guestName: string
      status: string
    }> = []

    room.bookings.forEach((booking) => {
      try {
        const checkIn = parseISO(booking.checkInDate)
        const checkOut = parseISO(booking.checkOutDate)

        // Find start and end positions within our date range
        const startIndex = dateRange.findIndex((date) => isSameDay(date, checkIn) || date >= checkIn)
        const endIndex = dateRange.findIndex((date) => isSameDay(date, checkOut) || date > checkOut)

        if (startIndex === -1) return // Booking starts after our range

        const actualStartIndex = Math.max(0, startIndex)
        const actualEndIndex = endIndex === -1 ? dateRange.length : Math.min(endIndex, dateRange.length)

        if (actualEndIndex > actualStartIndex) {
          const width = ((actualEndIndex - actualStartIndex) / dateRange.length) * 100
          const left = (actualStartIndex / dateRange.length) * 100

          // Create guest name display
          const guestName = `${booking.guest.firstName} ${booking.guest.lastName}`

          bars.push({
            booking,
            left: `${left}%`,
            width: `${width}%`,
            guestName,
            status: booking.bookingStatus,
          })
        }
      } catch (e) {
        console.error("Error processing booking:", e)
      }
    })

    return bars
  }

  const getBookingColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-400 hover:bg-green-500 border-green-500"
      case "CHECKED_IN":
        return "bg-blue-400 hover:bg-blue-500 border-blue-500"
      case "PENDING":
        return "bg-yellow-400 hover:bg-yellow-500 border-yellow-500"
      case "CANCELLED":
        return "bg-red-400 hover:bg-red-500 border-red-500"
      case "CHECKED_OUT":
        return "bg-gray-400 hover:bg-gray-500 border-gray-500"
      default:
        return "bg-green-400 hover:bg-green-500 border-green-500"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with date navigation */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{format(currentDate, "MMM yyyy")}</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextWeek}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {/* Timeline container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Room types and numbers */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">ROOMS</h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            {roomTypeGroups.map((group) => (
              <div key={group.roomType} className="mb-4">
                {/* Room type header */}
                <button
                  onClick={() => toggleRoomType(group.roomType)}
                  className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
                >
                  {group.isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium text-sm text-orange-600">{group.roomType}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {group.rooms.length}
                  </Badge>
                </button>

                {/* Room numbers */}
                {group.isExpanded && (
                  <div className="ml-6 space-y-1">
                    {group.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between py-2 px-2 text-sm hover:bg-gray-100 rounded"
                      >
                        <span className="font-medium">{room.roomNumber}</span>
                        {room.bookings && room.bookings.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {room.bookings.length}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Timeline grid */}
        <div className="flex-1 overflow-auto">
          {/* Date headers */}
          <div className="sticky top-0 bg-white border-b z-10">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {dateRange.map((date) => {
                const occupancy = getDateOccupancy(date)
                const isToday = isSameDay(date, new Date())

                return (
                  <div
                    key={date.toISOString()}
                    className={cn("bg-white p-3 text-center", isToday && "bg-blue-50 border-blue-200")}
                  >
                    <div className="text-xs text-gray-500 mb-1">{format(date, "EEE")}</div>
                    <div className="text-lg font-semibold mb-1">{format(date, "d")}</div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs mb-1",
                        occupancy.percentage >= 80
                          ? "bg-red-100 text-red-800"
                          : occupancy.percentage >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {occupancy.percentage}%
                    </Badge>
                    <div className="text-xs text-gray-600">
                      ({occupancy.occupied}/{occupancy.total})
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Room rows with bookings */}
          <div className="relative">
            {roomTypeGroups.map((group) => (
              <div key={group.roomType}>
                {group.isExpanded &&
                  group.rooms.map((room) => {
                    const bookingBars = getRoomBookingBars(room)

                    return (
                      <div
                        key={room.id}
                        className="relative border-b border-gray-100 hover:bg-gray-50"
                        style={{ height: "60px" }}
                      >
                        {/* Grid lines */}
                        <div className="absolute inset-0 grid grid-cols-7 gap-px bg-gray-100">
                          {dateRange.map((date) => (
                            <div key={date.toISOString()} className="bg-white" />
                          ))}
                        </div>

                        {/* Booking bars */}
                        {bookingBars.map((bar, index) => (
                          <div
                            key={`${bar.booking.id}-${index}`}
                            className={cn(
                              "absolute top-2 bottom-2 rounded-md border-2 cursor-pointer transition-all duration-200 flex items-center px-2 text-white text-sm font-medium shadow-sm hover:shadow-md",
                              getBookingColor(bar.booking.bookingStatus),
                            )}
                            style={{ left: bar.left, width: bar.width }}
                            onClick={() => onBookingClick(bar.booking)}
                            title={`${bar.guestName} - ${bar.status}\nRoom: ${room.roomNumber}\nCheck-in: ${format(parseISO(bar.booking.checkInDate), "MMM d")}\nCheck-out: ${format(parseISO(bar.booking.checkOutDate), "MMM d")}`}
                          >
                            <span className="truncate text-xs font-semibold">
                              {bar.guestName} - {bar.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
