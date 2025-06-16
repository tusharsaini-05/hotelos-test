"use client"

import { useState } from "react"
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Booking } from "./booking-analytics"

interface BookingCalendarGridProps {
  bookings: Booking[]
  currentDate: Date
  isLoading: boolean
  onBookingClick: (booking: Booking) => void
  onDateChange: (date: Date) => void
  onRefresh: () => void
  totalRooms: number
}

export default function BookingCalendarGrid({
  bookings,
  currentDate,
  isLoading,
  onBookingClick,
  onDateChange,
  onRefresh,
  totalRooms = 20,
}: BookingCalendarGridProps) {
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  // Get calendar days based on view mode
  const getCalendarDays = () => {
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const calendarStart = startOfWeek(monthStart)
      const calendarEnd = endOfWeek(monthEnd)
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }
  }

  const calendarDays = getCalendarDays()

  // Calculate occupancy for each day
  const getDayData = (day: Date) => {
    const dayBookings = bookings.filter((booking) => {
      try {
        const checkIn = parseISO(booking.checkInDate)
        const checkOut = parseISO(booking.checkOutDate)
        return day >= checkIn && day < checkOut
      } catch (e) {
        console.error("Date parsing error:", e)
        return false
      }
    })

    const occupiedRooms = dayBookings.length
    const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    return {
      bookings: dayBookings,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      occupancyPercentage,
    }
  }

  const getOccupancyBackgroundColor = (percentage: number) => {
    if (percentage === 0) return "bg-white"
    if (percentage <= 20) return "bg-yellow-50"
    if (percentage <= 40) return "bg-yellow-100"
    if (percentage <= 60) return "bg-yellow-200"
    if (percentage <= 80) return "bg-yellow-300"
    return "bg-yellow-400"
  }

  const getBookingColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "CHECKED_OUT":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
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
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {viewMode === "month" ? format(currentDate, "MMM yyyy") : format(currentDate, "MMM d, yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
          <div className="flex items-center border rounded-md">
            <Button variant={viewMode === "month" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("month")}>
              Month
            </Button>
            <Button variant={viewMode === "week" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("week")}>
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayData = getDayData(day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[140px] p-3 border-r border-b last:border-r-0
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : getOccupancyBackgroundColor(dayData.occupancyPercentage)}
                  ${isToday ? "ring-2 ring-blue-400" : ""}
                  hover:opacity-80 transition-all
                `}
              >
                {/* Date Header - Remove Badge */}
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{format(day, "d")}</span>
                </div>

                {/* Single Occupancy Percentage Display */}
                <div className="text-center mb-2">
                  <div
                    className={`text-lg font-bold ${dayData.occupancyPercentage > 0 ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {dayData.occupancyPercentage}%
                  </div>
                </div>

                {/* Room Count Display */}
                <div className="text-center">
                  <div
                    className={`text-sm font-semibold ${dayData.occupiedRooms > 0 ? "text-gray-700" : "text-gray-400"}`}
                  >
                    ({dayData.occupiedRooms}/{totalRooms})
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Occupancy Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>0%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-gray-300 rounded"></div>
          <span>1-20%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-gray-300 rounded"></div>
          <span>21-40%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border border-gray-300 rounded"></div>
          <span>41-60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-300 border border-gray-300 rounded"></div>
          <span>61-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 border border-gray-300 rounded"></div>
          <span>81-100%</span>
        </div>
      </div>
    </div>
  )
}
