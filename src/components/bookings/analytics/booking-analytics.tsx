"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, Filter, RefreshCw, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookingCalendar from "./booking-calendar"
import BookingDetails from "./booking-details"
import { generateMockBookings } from "./mock-data"

export default function BookingAnalytics() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  // Filter states
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be a GraphQL query using the provided queries
        // For example: const { data } = await client.query({ query: GET_BOOKINGS, variables: { ... } });

        // Using mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData = generateMockBookings(currentDate)
        setBookings(mockData)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [currentDate])

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const handleCloseDetails = () => {
    setShowBookingDetails(false)
    setSelectedBooking(null)
  }

  const handleRefresh = () => {
    // Refetch bookings
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData = generateMockBookings(currentDate)
        setBookings(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }

  // Calculate days for the current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate occupancy percentages for each day
  const occupancyData = daysInMonth.map((day) => {
    const dayBookings = bookings.filter((booking) => {
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      return day >= checkIn && day <= checkOut
    })

    // Assuming 20 rooms total for this example
    const totalRooms = 20
    const occupiedRooms = dayBookings.length
    const percentage = Math.round((occupiedRooms / totalRooms) * 100)

    return {
      date: day,
      percentage,
      available: totalRooms - occupiedRooms,
    }
  })

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <div className="flex items-center border rounded-md p-1 ml-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{format(currentDate, "MMM yyyy")}</h2>
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Floors</span>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Room Type</span>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Room Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Housekeeping Status</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="dirty">Dirty</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <BookingCalendar
            bookings={bookings}
            occupancyData={occupancyData}
            currentDate={currentDate}
            isLoading={isLoading}
            onBookingClick={handleBookingClick}
          />
        </CardContent>
      </Card>

      {showBookingDetails && selectedBooking && (
        <BookingDetails booking={selectedBooking} onClose={handleCloseDetails} />
      )}
    </div>
  )
}

