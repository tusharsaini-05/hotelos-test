"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Calendar, Printer, Search, RefreshCw, X, Loader2, CreditCard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { useHotelContext } from "@/providers/hotel-provider"
import type React from "react"
import type { Booking } from "@/graphql/types/booking"
import { gql, useMutation } from "@apollo/client"
import { Badge } from "@/components/ui/badge"

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

const ADD_PAYMENT_MUTATION = gql`
  mutation AddPayment($bookingId: String!, $paymentData: PaymentInput!) {
    addPayment(
      bookingId: $bookingId
      paymentData: $paymentData
    ) {
      id
      bookingNumber
      paymentStatus
      totalAmount
      payments {
        method
        amount
        transactionId
        transactionDate
        status
        notes
      }
    }
  }
`

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void
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

type BookingCategory = "confirmed" | "checked_in" | "checked_out"

export function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [activeTab, setActiveTab] = useState<"confirmed" | "checked_in" | "checked_out">("confirmed")
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [selectedBookingData, setSelectedBookingData] = useState<Booking | null>(null)
  const [paymentCollected, setPaymentCollected] = useState<boolean>(false)

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
    setSelectedBookingId(null)
    setSelectedBookingData(null)
    setPaymentCollected(false)
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

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query bookingId($bookingId: String!) {
              booking(bookingId: $bookingId) {
                id
                bookingNumber
                guest {
                  firstName
                  lastName
                  email
                }
                checkInDate
                checkOutDate
                roomTypeBookings {
                  roomType
                  numberOfRooms
                  roomIds
                }
                bookingStatus
                paymentStatus
                totalAmount
                numberOfGuests
                createdAt
                payments {
                  method
                  amount
                  transactionId
                  transactionDate
                  status
                  notes
                }
              }
            }
          `,
          variables: { bookingId },
        }),
      })
      
      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      
      const bookingData = result.data.booking
      setSelectedBookingData(bookingData)
      
      // Check if payment is already collected
      if (bookingData.paymentStatus === "PAID" || 
          (bookingData.payments && bookingData.payments.length > 0 && 
           bookingData.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0) >= bookingData.totalAmount)) {
        setPaymentCollected(true)
      } else {
        setPaymentCollected(false)
      }
      
    } catch (error) {
      console.error("Error fetching booking details:", error)
      toast({
        title: "Error",
        description: "Failed to load booking details. Please try again.",
        variant: "destructive",
      })
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

  // Handle booking selection
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    fetchBookingDetails(bookingId)
  }

  // Handle back button in booking details
  const handleBackToList = () => {
    setSelectedBookingId(null)
    setSelectedBookingData(null)
    setPaymentCollected(false)
  }

  // Handle payment collection
  const [collectPayment, { loading: collectingPayment }] = useMutation(ADD_PAYMENT_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Payment Collected",
        description: "Payment has been successfully collected.",
      })
      setPaymentCollected(true)
      // Refresh booking details
      fetchBookingDetails(selectedBookingId!)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to collect payment. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleCollectPayment = async () => {
    if (!selectedBookingData) return
    
    try {
      await collectPayment({
        variables: {
          bookingId: selectedBookingData.id,
          paymentData: {
            method: "CASH",
            amount: selectedBookingData.totalAmount,
            transactionId: `txn_${Date.now()}`,
            notes: "Payment collected at check-in"
          }
        }
      })
    } catch (error) {
      console.error("Error collecting payment:", error)
    }
  }

  // Handle check-in
  const [checkInBooking, { loading: checkingIn }] = useMutation(CHECK_IN_BOOKING_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Success",
        description: "Guest successfully checked in",
      })
      fetchBookings()
      handleBackToList()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to check in guest. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleCheckIn = async () => {
    if (!selectedBookingId || !paymentCollected) return
    
    try {
      await checkInBooking({
        variables: {
          bookingId: selectedBookingId
        }
      })
    } catch (error) {
      console.error("Error checking in:", error)
    }
  }

  // Handle check-out
  const [checkOutBooking, { loading: checkingOut }] = useMutation(CHECK_OUT_BOOKING_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Success",
        description: "Guest successfully checked out",
      })
      fetchBookings()
      handleBackToList()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to check out guest. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleCheckOut = async (bookingId: string) => {
    try {
      await checkOutBooking({
        variables: {
          bookingId
        }
      })
    } catch (error) {
      console.error("Error checking out:", error)
    }
  }

  // Render booking details view
  if (selectedBookingId && selectedBookingData) {
    // Calculate payments collected total
    const paymentsCollected = selectedBookingData.payments?.reduce((sum: number, payment: any) => 
      sum + (Number(payment.amount) || 0), 0) || 0
    
    // Calculate balance to collect
    const balanceToCollect = Number(selectedBookingData.totalAmount) - paymentsCollected

    return (
      <div className="container mx-auto">
        <Button variant="ghost" onClick={handleBackToList} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Button>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Booking {selectedBookingData.bookingNumber}</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {selectedBookingData.guest?.firstName} {selectedBookingData.guest?.lastName}
                    </h2>
                  </div>
                  <Badge className={
                    selectedBookingData.bookingStatus === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
                    selectedBookingData.bookingStatus === "CHECKED_IN" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {selectedBookingData.bookingStatus.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium">{selectedBookingData.guest?.firstName} {selectedBookingData.guest?.lastName}</h3>
                  <p className="text-gray-500">
                    {selectedBookingData.numberOfGuests || 1} {selectedBookingData.numberOfGuests === 1 ? 'Guest' : 'Guests'} · 
                    {selectedBookingData.roomTypeBookings?.[0]?.numberOfRooms || 1} {selectedBookingData.roomTypeBookings?.[0]?.numberOfRooms === 1 ? 'Room' : 'Rooms'} · 
                    {calculateNights(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)} {calculateNights(selectedBookingData.checkInDate, selectedBookingData.checkOutDate) === 1 ? 'Night' : 'Nights'}
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div>
                      <p className="font-medium">
                        {calculateNights(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)} 
                        {calculateNights(selectedBookingData.checkInDate, selectedBookingData.checkOutDate) === 1 ? ' Night' : ' Nights'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateRange(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{selectedBookingData.numberOfGuests || 1} Guests</p>
                      <p className="text-sm text-gray-500">
                        {selectedBookingData.numberOfGuests || 1} {selectedBookingData.numberOfGuests === 1 ? 'Adult' : 'Adults'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Email: {selectedBookingData.guest?.email}</p>
                    </div>
                  </div>

                  {/* Room Assignment Section */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-4">Room Assignment</h4>
                    {selectedBookingData.roomTypeBookings?.map((rtb, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium">{rtb.roomType}</p>
                        <p className="text-sm text-gray-500">
                          {rtb.numberOfRooms} {rtb.numberOfRooms === 1 ? 'Room' : 'Rooms'}
                          {rtb.roomIds && rtb.roomIds.length > 0 ? ' (Assigned)' : ' (Unassigned)'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Price Summary</h3>
                  <span className="text-sm text-green-500">
                    {selectedBookingData.paymentStatus === "PAID" ? "Paid" : "Pay at Hotel"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Total Bill</span>
                    <span>₹{Number(selectedBookingData.totalAmount).toLocaleString()}</span>
                  </Button>
                  <div className="mt-4 px-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">{selectedBookingData.roomTypeBookings?.[0]?.roomType}</span>
                      <span>₹{Number(selectedBookingData.totalAmount).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedBookingData.roomTypeBookings?.[0]?.numberOfRooms || 1} Room ×
                      {calculateNights(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)} Nights
                    </div>
                  </div>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span>Payment Collected</span>
                  <span>₹{paymentsCollected.toLocaleString()}</span>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span>Balance to Collect</span>
                  <span className="font-medium">₹{balanceToCollect.toLocaleString()}</span>
                </div>

                <Button
                  className="mt-6 w-full bg-green-500 hover:bg-green-600"
                  onClick={handleCollectPayment}
                  disabled={collectingPayment || balanceToCollect <= 0}
                >
                  {collectingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : balanceToCollect <= 0 ? (
                    "Payment Complete"
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Collect Payment
                    </>
                  )}
                </Button>

                {selectedBookingData.bookingStatus === "CONFIRMED" && (
                  <Button
                    className="mt-4 w-full"
                    onClick={handleCheckIn}
                    disabled={checkingIn || !paymentCollected}
                  >
                    {checkingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking In...
                      </>
                    ) : (
                      "Check In"
                    )}
                  </Button>
                )}

                {selectedBookingData.bookingStatus === "CHECKED_IN" && (
                  <Button
                    className="mt-4 w-full"
                    onClick={() => handleCheckOut(selectedBookingData.id)}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking Out...
                      </>
                    ) : (
                      "Check Out"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
          {/* Today's Bookings */}
          {todayBookings.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Today</h2>
                  <p className="text-sm text-gray-500">
                    {todayBookings.length} {todayBookings.length === 1 ? "Booking" : "Bookings"} - {todayRoomCount} {todayRoomCount === 1 ? "Room" : "Rooms"}
                  </p>
                </div>
                <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={handleDownloadTodaysArrivals}>
                  <Printer className="mr-2 h-4 w-4" />
                  Download Today's Arrival
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                    <tr>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3">BOOKING ID</th>
                      <th className="px-4 py-3">ROOM NIGHTS</th>
                      <th className="px-4 py-3">PAYMENTS</th>
                      <th className="px-4 py-3">BOOKING INFO</th>
                      <th className="px-4 py-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {todayBookings.map((booking) => {
                      const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                      const roomCount = booking.roomTypeBookings?.[0]?.numberOfRooms || 1;
                      
                      return (
                        <tr 
                          key={booking.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectBooking(booking.id)}
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</div>
                            <div className="text-sm text-gray-500">{booking.numberOfGuests || 1} Guest(s)</div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{booking.bookingNumber}</div>
                            <div className="text-xs text-gray-500">
                              {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{roomCount} Room</div>
                            <div className="text-sm text-gray-500">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={booking.paymentStatus === "PAID" ? "text-green-600" : ""}>
                              {booking.paymentStatus === "PAID" ? "Pre-Paid" : "Pay at Hotel"}
                            </div>
                            <div className="text-sm">₹{Number(booking.totalAmount).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-500">
                              Booking.com #{booking.id.substring(0, 8)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="bg-gray-200 hover:bg-gray-300"
                              >
                                No Show
                              </Button>
                              <Button 
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Checkin Now
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Upcoming</h2>
                <p className="text-sm text-gray-500">
                  {upcomingBookings.length} {upcomingBookings.length === 1 ? "Booking" : "Bookings"} - {upcomingRoomCount} {upcomingRoomCount === 1 ? "Room" : "Rooms"}
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                    <tr>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3">BOOKING ID</th>
                      <th className="px-4 py-3">ROOM NIGHTS</th>
                      <th className="px-4 py-3">PAYMENTS</th>
                      <th className="px-4 py-3">BOOKING INFO</th>
                      <th className="px-4 py-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {upcomingBookings.map((booking) => {
                      const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                      const roomCount = booking.roomTypeBookings?.[0]?.numberOfRooms || 1;
                      
                      return (
                        <tr 
                          key={booking.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectBooking(booking.id)}
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</div>
                            <div className="text-sm text-gray-500">{booking.numberOfGuests || 1} Guest(s)</div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{booking.bookingNumber}</div>
                            <div className="text-xs text-gray-500">
                              {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{roomCount} Room</div>
                            <div className="text-sm text-gray-500">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={booking.paymentStatus === "PAID" ? "text-green-600" : ""}>
                              {booking.paymentStatus === "PAID" ? "Pre-Paid" : "Pay at Hotel"}
                            </div>
                            <div className="text-sm">₹{Number(booking.totalAmount).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-500">
                              Booking.com #{booking.id.substring(0, 8)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                printBookingDetails(booking, countAssignedRoomsInBooking, calculateNights);
                              }}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Previous Bookings */}
          {previousBookings.length > 0 && (
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Previous</h2>
                <p className="text-sm text-gray-500">
                  {previousBookings.length} {previousBookings.length === 1 ? "Booking" : "Bookings"} - {previousRoomCount} {previousRoomCount === 1 ? "Room" : "Rooms"}
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                    <tr>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3">BOOKING ID</th>
                      <th className="px-4 py-3">ROOM NIGHTS</th>
                      <th className="px-4 py-3">PAYMENTS</th>
                      <th className="px-4 py-3">BOOKING INFO</th>
                      <th className="px-4 py-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previousBookings.map((booking) => {
                      const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                      const roomCount = booking.roomTypeBookings?.[0]?.numberOfRooms || 1;
                      
                      return (
                        <tr 
                          key={booking.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectBooking(booking.id)}
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</div>
                            <div className="text-sm text-gray-500">{booking.numberOfGuests || 1} Guest(s)</div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{booking.bookingNumber}</div>
                            <div className="text-xs text-gray-500">
                              {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{roomCount} Room</div>
                            <div className="text-sm text-gray-500">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={booking.paymentStatus === "PAID" ? "text-green-600" : ""}>
                              {booking.paymentStatus === "PAID" ? "Pre-Paid" : "Pay at Hotel"}
                            </div>
                            <div className="text-sm">₹{Number(booking.totalAmount).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-500">
                              Booking.com #{booking.id.substring(0, 8)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                printBookingDetails(booking, countAssignedRoomsInBooking, calculateNights);
                              }}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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