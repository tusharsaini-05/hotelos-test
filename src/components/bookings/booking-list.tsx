"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Calendar, Printer, Search, RefreshCw, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { useHotelContext } from "@/providers/hotel-provider"
import type React from "react"
import type { Booking } from "@/graphql/types/booking"
import RoomAssignmentSection from "./roomAssignmentSection"
import { gql, useMutation } from "@apollo/client"

const CHECK_IN_BOOKING_MUTATION = gql`
  mutation CheckInBooking($bookingId: String!) {
    checkInBooking(bookingId: $bookingId) {
      id
      bookingStatus
      checkInTime
    }
  }
`

const CHECK_OUT_BOOKING_MUTATION = gql`
  mutation CheckOutBooking($bookingId: String!) {
    checkoutBooking(bookingId: $bookingId)
  }
`

interface BookingsSectionProps {
  title: string
  subtitle: string
  bookings: Booking[]
  onSelectBooking: (bookingId: string) => void
  showDownload?: boolean
  onDownload?: () => void
  calculateNights: (checkInDate: string, checkOutDate: string) => number
  countAssignedRoomsInBooking: (booking: Booking) => number
  formatDateRange: (checkIn: string, checkOut: string) => string
}

enum RoomType {
  STANDARD = "standard",
  DELUXE = "deluxe",
  SUITE = "suite",
  EXECUTIVE = "executive",
  PRESIDENTIAL = "presidential",
}

enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void
}

type BookingCategory = "confirmed" | "checked_in" | "checked_out"

export function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [activeTab, setActiveTab] = useState<"confirmed" | "checked_in" | "checked_out">("confirmed")

  const [bookings, setBookings] = useState<{
    confirmed: Booking[]
    checked_in: Booking[]
    checked_out: Booking[]
  }>({
    confirmed: [],
    checked_in: [],
    checked_out: [],
  })
  const [loading, setLoading] = useState(true)
  const [emailSearch, setEmailSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const { selectedHotel } = useHotelContext()

  // GraphQL endpoint
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

  const handleTabChange = (value: string) => {
    setActiveTab(value as BookingCategory)
  }

  useEffect(() => {
    fetchBookings()
  }, [activeTab, selectedHotel])

  const fetchBookings = async () => {
    if (!selectedHotel?.id) return

    setLoading(true)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query bookings($hotelId:String){
                bookings(hotelId:$hotelId){
                  id
                  hotelId
                  bookingNumber
                  guest{
                    firstName
                    lastName
                    email
                  }
                  roomTypeBookings{
                    roomType
                    numberOfRooms
                    roomIds
                  }
                  checkInDate 
                  checkOutDate
                  bookingStatus
                  paymentStatus
                  totalAmount
                  numberOfGuests
                  createdAt
                }
          }
          `,
          variables: {
            hotelId: `${selectedHotel?.id}`,
            limit: 100,
          },
        }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      const allBookings = result.data.bookings || []
      console.log("Fetched bookings:", allBookings)

      // Filter bookings by status
      const categorizedBookings = {
        confirmed: allBookings.filter((booking: Booking) => booking.bookingStatus === "CONFIRMED"),
        checked_in: allBookings.filter((booking: Booking) => booking.bookingStatus === "CHECKED_IN"),
        checked_out: allBookings.filter(
          (booking: Booking) =>
            booking.bookingStatus === "CHECKED_OUT" ||
            booking.bookingStatus === "CANCELLED" ||
            booking.bookingStatus === "NO_SHOW",
        ),
      }
      console.log("Categorized bookings:", categorizedBookings)
      setBookings(categorizedBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!emailSearch.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email to search",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetBookingsByGuest($guestEmail: String!, $limit: Int, $offset: Int) {
              bookingsByGuest(
                guestEmail: $guestEmail,
                limit: $limit,
                offset: $offset
              ) {
                id
                bookingNumber
                hotelId
                guest {
                  firstName
                  lastName
                  email
                }
                checkInDate
                checkOutDate
                roomTypeBookings{
                    roomType
                    numberOfRooms
                    roomIds
                 }
                bookingStatus
                paymentStatus
                totalAmount
                numberOfGuests
                createdAt
              }
            }
          `,
          variables: {
            guestEmail: emailSearch,
            limit: 10,
            offset: 0,
          },
        }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      const searchResults = result.data.bookingsByGuest || []

      // Categorize search results
      const categorizedResults = {
        confirmed: searchResults.filter((booking: Booking) => booking.bookingStatus === "CONFIRMED"),
        checked_in: searchResults.filter((booking: Booking) => booking.bookingStatus === "CHECKED_IN"),
        checked_out: searchResults.filter(
          (booking: Booking) =>
            booking.bookingStatus === "CHECKED_OUT" ||
            booking.bookingStatus === "CANCELLED" ||
            booking.bookingStatus === "NO_SHOW",
        ),
      }

      setBookings(categorizedResults)

      toast({
        title: "Search Results",
        description: `Found ${searchResults.length} bookings for ${emailSearch}`,
      })
    } catch (error) {
      console.error("Error searching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to search bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setEmailSearch("")
    fetchBookings()
  }

  // Get today's and previous bookings for display
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")

  const todayBookings = bookings[activeTab].filter((booking: Booking) => {
    const checkInDateStr = booking.checkInDate.split("T")[0]
    return checkInDateStr === todayStr
  })

  const previousBookings = bookings[activeTab].filter((booking: Booking) => {
    const checkInDateStr = booking.checkInDate.split("T")[0]
    return checkInDateStr < todayStr
  })

  const upcomingBookings = bookings[activeTab].filter((booking: Booking) => {
    const checkInDateStr = booking.checkInDate.split("T")[0]
    return checkInDateStr > todayStr
  })

  // Calculate booking room
  const countAssignedRoomsInBooking = (booking: Booking): number => {
    return booking.roomTypeBookings.reduce((total, rtb) => total + (rtb.roomIds?.length || 0), 0)
  }

  // Calculate room counts
  const calculateRooms = (bookingsList: Booking[]) => {
    return bookingsList.reduce((total, booking) => {
      const roomsInBooking = booking.roomTypeBookings.reduce((sum, rtb) => sum + rtb.numberOfRooms, 0)
      return total + roomsInBooking
    }, 0)
  }

  const todayRoomCount = calculateRooms(todayBookings)
  const previousRoomCount = calculateRooms(previousBookings)
  const upcomingRoomCount = calculateRooms(upcomingBookings)

  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    if (!checkInDate || !checkOutDate) return 1

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays || 1
  }

  // Function to format the date range for display
  const formatDateRange = (checkIn: string, checkOut: string): string => {
    try {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      return `${format(checkInDate, "dd MMM")} - ${format(checkOutDate, "dd MMM")}`
    } catch (e) {
      return "Invalid dates"
    }
  }

  // Handle download
  const handleDownloadTodaysArrivals = () => {
    const headers = ["Booking ID", "Guest Name", "Email", "Dates", "Rooms", "Nights", "Payment", "Amount", "Status"]

    const csvData = todayBookings.map((booking: any) => [
      booking.bookingNumber,
      `${booking.guest.firstName} ${booking.guest.lastName}`,
      booking.guest.email,
      formatDateRange(booking.checkInDate, booking.checkOutDate),
      `${booking.numberOfRooms || 1} ${booking.numberOfRooms === 1 ? "Room" : "Rooms"}`,
      `${calculateNights(booking.checkInDate, booking.checkOutDate)} ${
        calculateNights(booking.checkInDate, booking.checkOutDate) === 1 ? "Night" : "Nights"
      }`,
      booking.paymentStatus === "PAID" ? "Paid" : "Pay at Hotel",
      `₹${Number(booking.totalAmount).toLocaleString()}`,
      booking.bookingStatus,
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `todays_arrivals_${format(today, "yyyy-MM-dd")}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by email"
              className="w-64"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={emailSearch ? handleClearSearch : handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : emailSearch ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="confirmed" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            confirmed ({bookings.confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="checked_in" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            checked_in ({bookings.checked_in.length})
          </TabsTrigger>
          <TabsTrigger value="checked_out" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            checked_out ({bookings.checked_out.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          {upcomingBookings.length > 0 && (
            <BookingsSection
              title="Upcoming"
              subtitle={`${upcomingBookings.length} ${
                upcomingBookings.length === 1 ? "Booking" : "Bookings"
              } - ${upcomingRoomCount} ${upcomingRoomCount === 1 ? "Room" : "Rooms"}`}
              bookings={upcomingBookings}
              onSelectBooking={onSelectBooking}
              calculateNights={calculateNights}
              countAssignedRoomsInBooking={countAssignedRoomsInBooking}
              formatDateRange={formatDateRange}
            />
          )}

          {todayBookings.length > 0 && (
            <BookingsSection
              title="Today"
              subtitle={`${todayBookings.length} ${
                todayBookings.length === 1 ? "Booking" : "Bookings"
              } - ${todayRoomCount} ${todayRoomCount === 1 ? "Room" : "Rooms"}`}
              bookings={todayBookings}
              onSelectBooking={onSelectBooking}
              showDownload
              onDownload={handleDownloadTodaysArrivals}
              calculateNights={calculateNights}
              countAssignedRoomsInBooking={countAssignedRoomsInBooking}
              formatDateRange={formatDateRange}
            />
          )}

          {previousBookings.length > 0 && (
            <BookingsSection
              title="Previous"
              subtitle={`${previousBookings.length} ${
                previousBookings.length === 1 ? "Booking" : "Bookings"
              } - ${previousRoomCount} ${previousRoomCount === 1 ? "Room" : "Rooms"}`}
              bookings={previousBookings}
              onSelectBooking={onSelectBooking}
              calculateNights={calculateNights}
              countAssignedRoomsInBooking={countAssignedRoomsInBooking}
              formatDateRange={formatDateRange}
            />
          )}

          {bookings[activeTab].length === 0 && (
            <div className="text-center p-12 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-700">No bookings found</h3>
              <p className="text-gray-500 mt-2">There are no {activeTab} bookings to display.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function BookingsSection({
  title,
  subtitle,
  bookings,
  onSelectBooking,
  showDownload = false,
  onDownload,
  calculateNights,
  countAssignedRoomsInBooking,
  formatDateRange,
}: BookingsSectionProps) {
  const { toast } = useToast()
  const [checkInBooking] = useMutation(CHECK_IN_BOOKING_MUTATION)
  const [checkOutBooking] = useMutation(CHECK_OUT_BOOKING_MUTATION)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleCheckIn = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLoadingId(bookingId)

    try {
      const { data } = await checkInBooking({
        variables: { bookingId },
        update: (cache, { data }) => {
          if (data?.checkInBooking) {
            cache.modify({
              id: cache.identify(data.checkInBooking),
              fields: {
                bookingStatus: () => "CHECKED_IN",
                checkInTime: () => new Date().toISOString(),
              },
            })
          }
        },
      })

      if (data?.checkInBooking) {
        toast({
          title: "Success",
          description: "Booking checked in successfully",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check in booking",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handleCheckOut = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLoadingId(bookingId)

    try {
      const { data } = await checkOutBooking({
        variables: { bookingId },
        update: (cache, { data }) => {
          if (data?.checkOutBooking?.success) {
            cache.modify({
              id: `Booking:${bookingId}`,
              fields: {
                bookingStatus: () => "CHECKED_OUT",
                checkOutTime: () => new Date().toISOString(),
              },
            })
          }
        },
      })

      if (data?.checkOutBooking?.success) {
        toast({
          title: "Success",
          description: "Booking checked out successfully",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check out booking",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

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
          <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={onDownload}>
            <Printer className="mr-2 h-4 w-4" />
            Download Today's Arrival
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const nights = calculateNights(booking.checkInDate, booking.checkOutDate)

          const getStatusColor = (status: string) => {
            switch (status) {
              case "CONFIRMED":
                return "text-green-500"
              case "CHECKED_IN":
                return "text-blue-500"
              case "CHECKED_OUT":
                return "text-purple-500"
              case "CANCELLED":
                return "text-red-500"
              case "NO_SHOW":
                return "text-yellow-500"
              default:
                return "text-gray-500"
            }
          }

          return (
            <motion.div
              key={booking.id}
              whileHover={{ scale: 1.01 }}
              className="rounded-lg border bg-white shadow-sm p-4 cursor-pointer space-y-4"
              onClick={() => onSelectBooking(booking.id)}
            >
              {/* Guest Name and Status */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="text-base font-semibold">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{booking.numberOfGuests || 1} Guest(s)</div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                  {/* Check In/Out Button */}
                  <div className="flex justify-end">
                    {booking.bookingStatus === "CONFIRMED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={(e) => handleCheckIn(booking.id, e)}
                        disabled={loadingId === booking.id}
                      >
                        {loadingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check In"}
                      </Button>
                    )}

                    {booking.bookingStatus === "CHECKED_IN" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={(e) => handleCheckOut(booking.id, e)}
                        disabled={loadingId === booking.id}
                      >
                        {loadingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Out"}
                      </Button>
                    )}
                  </div>
                </span>
              </div>

              {/* Row-wise Table Style Layout */}
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 pt-2">
                <div className="text-gray-500 font-medium">Booking ID</div>
                <div>{booking.bookingNumber}</div>

                <div className="text-gray-500 font-medium">Payment</div>
                <div>
                  {booking.paymentStatus === "PAID" ? "Paid" : "Pay at Hotel"}
                  <div className="text-xs text-gray-400">₹{Number(booking.totalAmount).toLocaleString("en-IN")}</div>
                </div>

                <div className="text-gray-500 font-medium">{nights} Night(s)</div>
                <div>
                  <div className="text-xs text-gray-400">
                    {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                  </div>
                </div>

                <div className="text-gray-500 font-medium">Booking Info</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Click to view / print</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      printBookingDetails(booking, countAssignedRoomsInBooking, calculateNights)
                    }}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>

                {/* Room Rows */}
                <RoomAssignmentSection
                  booking={{
                    roomTypeBookings: booking.roomTypeBookings,
                    bookingStatus: booking.bookingStatus,
                    bookingId: booking.id,
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function printBookingDetails(
  booking: Booking,
  countAssignedRoomsInBooking: (booking: Booking) => number,
  calculateNights: (checkIn: string, checkOut: string) => number,
) {
  const printContent = `
    <html>
      <head>
        <title>Booking ${booking.bookingNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          h1 { font-size: 24px; margin-bottom: 20px; }
          .info { margin-bottom: 20px; }
          .info-row { display: flex; margin-bottom: 10px; }
          .label { font-weight: bold; width: 200px; }
          .value { flex: 1; }
          .total { margin-top: 20px; font-weight: bold; font-size: 18px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Booking Confirmation: ${booking.bookingNumber}</h1>
        
        <div class="info">
          <div class="info-row">
            <div class="label">Guest:</div>
            <div class="value">${booking.guest.firstName} ${booking.guest.lastName}</div>
          </div>
          <div class="info-row">
            <div class="label">Email:</div>
            <div class="value">${booking.guest.email}</div>
          </div>
          <div class="info-row">
            <div class="label">Check-in Date:</div>
            <div class="value">${new Date(booking.checkInDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</div>
          </div>
          <div class="info-row">
            <div class="label">Check-out Date:</div>
            <div class="value">${new Date(booking.checkOutDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</div>
          </div>
          <div class="info-row">
            <div class="label">Number of Rooms:</div>
            <div class="value">${countAssignedRoomsInBooking(booking) || 1}</div>
          </div>
          <div class="info-row">
            <div class="label">Number of Guests:</div>
            <div class="value">${booking.numberOfGuests || 1}</div>
          </div>
          <div class="info-row">
            <div class="label">Number of Nights:</div>
            <div class="value">${calculateNights(booking.checkInDate, booking.checkOutDate)}</div>
          </div>
          <div class="info-row">
            <div class="label">Booking Status:</div>
            <div class="value">${booking.bookingStatus.replace("_", " ")}</div>
          </div>
          <div class="info-row">
            <div class="label">Payment Status:</div>
            <div class="value">${booking.paymentStatus || "Pending"}</div>
          </div>
        </div>
        
        <div class="total">Total Amount: ₹${Number(booking.totalAmount).toLocaleString()}</div>
        
        <p style="margin-top: 50px; font-size: 14px; color: #666;">
          This is a computer-generated document. No signature is required.
        </p>
      </body>
    </html>
  `
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }
}

// Export as named export to match the import
