import { addDays, format, subDays, eachDayOfInterval } from "date-fns"

// Generate random dashboard data for demonstration
export const generateMockDashboardData = (startDate: Date, endDate: Date) => {
  // Overview metrics
  const totalBookings = Math.floor(Math.random() * 500) + 500
  const totalBookingsChange = Math.floor(Math.random() * 30) - 10

  const occupancyRate = Math.floor(Math.random() * 30) + 60
  const occupancyRateChange = Math.floor(Math.random() * 20) - 5

  const totalRevenue = Math.floor(Math.random() * 500000) + 500000
  const totalRevenueChange = Math.floor(Math.random() * 25) - 5

  const averageDailyRate = Math.floor(Math.random() * 100) + 150
  const averageDailyRateChange = Math.floor(Math.random() * 15) - 5

  const revPAR = Math.floor(averageDailyRate * (occupancyRate / 100))
  const totalGuests = Math.floor(totalBookings * 1.8)
  const totalRooms = 200

  // Booking trends
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const bookingTrends = days.map((day) => {
    const bookings = Math.floor(Math.random() * 20) + 5
    const revenue = bookings * (Math.floor(Math.random() * 100) + 150)

    return {
      date: format(day, "MMM d"),
      bookings,
      revenue,
    }
  })

  // Room type distribution
  const roomTypeDistribution = [
    { name: "Standard", value: Math.floor(Math.random() * 100) + 100 },
    { name: "Deluxe", value: Math.floor(Math.random() * 80) + 80 },
    { name: "Suite", value: Math.floor(Math.random() * 50) + 30 },
    { name: "Executive", value: Math.floor(Math.random() * 30) + 20 },
    { name: "Penthouse", value: Math.floor(Math.random() * 10) + 5 },
  ]

  // Room type performance
  const roomTypePerformance = [
    { name: "Standard", value: Math.floor(Math.random() * 30) + 60 },
    { name: "Deluxe", value: Math.floor(Math.random() * 20) + 70 },
    { name: "Suite", value: Math.floor(Math.random() * 15) + 80 },
    { name: "Executive", value: Math.floor(Math.random() * 10) + 85 },
    { name: "Penthouse", value: Math.floor(Math.random() * 5) + 90 },
  ]

  // Room status
  const roomStatus = [
    { name: "Occupied", value: Math.floor(Math.random() * 30) + 60 },
    { name: "Available", value: Math.floor(Math.random() * 20) + 20 },
    { name: "Cleaning", value: Math.floor(Math.random() * 10) + 10 },
    { name: "Maintenance", value: Math.floor(Math.random() * 5) + 5 },
  ]

  // Floor occupancy
  const floorOccupancy = [
    { name: "Floor 1", value: Math.floor(Math.random() * 20) + 70 },
    { name: "Floor 2", value: Math.floor(Math.random() * 15) + 75 },
    { name: "Floor 3", value: Math.floor(Math.random() * 10) + 80 },
    { name: "Floor 4", value: Math.floor(Math.random() * 5) + 85 },
    { name: "Floor 5", value: Math.floor(Math.random() * 10) + 75 },
  ]

  // Occupancy timeline
  const occupancyTimeline = days.map((day) => {
    return {
      date: format(day, "MMM d"),
      occupancy: Math.floor(Math.random() * 30) + 60,
    }
  })

  // Booking sources
  const bookingSources = [
    { name: "Direct", value: Math.floor(Math.random() * 100) + 100 },
    { name: "Booking.com", value: Math.floor(Math.random() * 150) + 150 },
    { name: "Expedia", value: Math.floor(Math.random() * 80) + 80 },
    { name: "Airbnb", value: Math.floor(Math.random() * 50) + 50 },
    { name: "Travel Agents", value: Math.floor(Math.random() * 30) + 30 },
  ]

  // Booking status
  const bookingStatus = [
    { name: "Confirmed", value: Math.floor(Math.random() * 200) + 200 },
    { name: "Checked In", value: Math.floor(Math.random() * 100) + 100 },
    { name: "Checked Out", value: Math.floor(Math.random() * 150) + 150 },
    { name: "Cancelled", value: Math.floor(Math.random() * 50) + 50 },
    { name: "Pending", value: Math.floor(Math.random() * 30) + 30 },
  ]

  // Guest types
  const guestTypes = [
    { name: "New Guests", value: Math.floor(Math.random() * 300) + 300 },
    { name: "Returning Guests", value: Math.floor(Math.random() * 200) + 200 },
  ]

  // Stay duration
  const stayDuration = [
    { name: "1-2 Days", value: Math.floor(Math.random() * 2) + 1 },
    { name: "3-5 Days", value: Math.floor(Math.random() * 2) + 3 },
    { name: "6-7 Days", value: Math.floor(Math.random() * 1) + 6 },
    { name: "8+ Days", value: Math.floor(Math.random() * 3) + 8 },
  ]

  // Guest satisfaction
  const guestSatisfaction = [
    { name: "5 Stars", value: Math.floor(Math.random() * 200) + 200 },
    { name: "4 Stars", value: Math.floor(Math.random() * 100) + 100 },
    { name: "3 Stars", value: Math.floor(Math.random() * 50) + 50 },
    { name: "2 Stars", value: Math.floor(Math.random() * 20) + 20 },
    { name: "1 Star", value: Math.floor(Math.random() * 10) + 10 },
  ]

  // Top guests
  const topGuests = [
    {
      name: "John Smith",
      email: "john.smith@example.com",
      bookings: Math.floor(Math.random() * 5) + 5,
      spent: Math.floor(Math.random() * 5000) + 5000,
    },
    {
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      bookings: Math.floor(Math.random() * 4) + 4,
      spent: Math.floor(Math.random() * 4000) + 4000,
    },
    {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      bookings: Math.floor(Math.random() * 3) + 3,
      spent: Math.floor(Math.random() * 3000) + 3000,
    },
    {
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      bookings: Math.floor(Math.random() * 3) + 3,
      spent: Math.floor(Math.random() * 3000) + 3000,
    },
    {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      bookings: Math.floor(Math.random() * 2) + 2,
      spent: Math.floor(Math.random() * 2000) + 2000,
    },
  ]

  // Guest demographics
  const guestDemographics = [
    { name: "United States", value: Math.floor(Math.random() * 200) + 200 },
    { name: "United Kingdom", value: Math.floor(Math.random() * 100) + 100 },
    { name: "Germany", value: Math.floor(Math.random() * 80) + 80 },
    { name: "France", value: Math.floor(Math.random() * 70) + 70 },
    { name: "Canada", value: Math.floor(Math.random() * 60) + 60 },
    { name: "Australia", value: Math.floor(Math.random() * 50) + 50 },
    { name: "Japan", value: Math.floor(Math.random() * 40) + 40 },
    { name: "China", value: Math.floor(Math.random() * 30) + 30 },
  ]

  // Revenue trends
  const revenueTrends = days.map((day) => {
    const revenue = Math.floor(Math.random() * 20000) + 10000
    const profit = Math.floor(revenue * 0.4)

    return {
      date: format(day, "MMM d"),
      revenue,
      profit,
    }
  })

  // Revenue by room type
  const revenueByRoomType = [
    { name: "Standard", value: Math.floor(Math.random() * 200000) + 200000 },
    { name: "Deluxe", value: Math.floor(Math.random() * 300000) + 300000 },
    { name: "Suite", value: Math.floor(Math.random() * 150000) + 150000 },
    { name: "Executive", value: Math.floor(Math.random() * 100000) + 100000 },
    { name: "Penthouse", value: Math.floor(Math.random() * 50000) + 50000 },
  ]

  // Payment methods
  const paymentMethods = [
    { name: "Credit Card", value: Math.floor(Math.random() * 300000) + 300000 },
    { name: "Debit Card", value: Math.floor(Math.random() * 200000) + 200000 },
    { name: "PayPal", value: Math.floor(Math.random() * 100000) + 100000 },
    { name: "Bank Transfer", value: Math.floor(Math.random() * 50000) + 50000 },
    { name: "Cash", value: Math.floor(Math.random() * 30000) + 30000 },
  ]

  // Recent bookings
  const recentBookings = Array.from({ length: 20 }).map((_, index) => {
    const checkInOffset = Math.floor(Math.random() * 30) - 15
    const stayLength = Math.floor(Math.random() * 7) + 1

    const checkInDate = addDays(new Date(), checkInOffset)
    const checkOutDate = addDays(checkInDate, stayLength)

    const roomTypes = ["Standard", "Deluxe", "Suite", "Executive", "Penthouse"]
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]

    const statuses = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED", "PENDING"]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const totalAmount = (Math.floor(Math.random() * 200) + 100) * stayLength

    const firstNames = [
      "John",
      "Emily",
      "Michael",
      "Sarah",
      "Robert",
      "Jennifer",
      "William",
      "Elizabeth",
      "David",
      "Linda",
    ]
    const lastNames = [
      "Smith",
      "Johnson",
      "Brown",
      "Davis",
      "Wilson",
      "Miller",
      "Moore",
      "Taylor",
      "Anderson",
      "Thomas",
    ]

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return {
      id: `booking-${index}`,
      bookingNumber: `BK${Math.floor(Math.random() * 10000000)}`,
      roomNumber: `${Math.floor(Math.random() * 5) + 1}${Math.floor(Math.random() * 20) + 1}`.padStart(3, "0"),
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      roomType,
      numberOfGuests: Math.floor(Math.random() * 3) + 1,
      bookingStatus: status,
      paymentStatus: status === "CANCELLED" ? "REFUNDED" : status === "CONFIRMED" ? "PAID" : "PENDING",
      totalAmount,
      createdAt: subDays(checkInDate, Math.floor(Math.random() * 30) + 5).toISOString(),
      guest: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1${Math.floor(Math.random() * 1000000000)}`.padStart(11, "0"),
      },
      specialRequests: Math.random() > 0.7 ? "Late check-in requested. Extra pillows needed." : "",
    }
  })

  return {
    overview: {
      totalBookings,
      totalBookingsChange,
      occupancyRate,
      occupancyRateChange,
      totalRevenue,
      totalRevenueChange,
      averageDailyRate,
      averageDailyRateChange,
      revPAR,
      totalGuests,
      totalRooms,
    },
    bookingTrends,
    roomTypeDistribution,
    roomTypePerformance,
    roomStatus,
    floorOccupancy,
    occupancyTimeline,
    bookingSources,
    bookingStatus,
    guestTypes,
    stayDuration,
    guestSatisfaction,
    topGuests,
    guestDemographics,
    revenueTrends,
    revenueByRoomType,
    paymentMethods,
    recentBookings,
  }
}

