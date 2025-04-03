import { addDays } from "date-fns"

// Generate random booking data for demonstration
export const generateMockBookings = (currentDate: Date) => {
  const bookings = []
  const roomTypes = ["Standard Double", "Superior Double", "Deluxe Suite", "Executive Suite"]
  const statuses = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED", "PENDING"]
  const firstNames = ["Thomas", "Julia", "Philippe", "Raven", "Benjamin", "Nishan", "Frédéric", "Chayangkul", "Ahmed"]
  const lastNames = ["Scott", "Schenk", "Le Calvez", "Valenzuela", "Kammoun", "Wang", "Fardey", "Majoon", "Ali"]

  // Generate rooms
  const rooms = [
    { roomNumber: "203", floor: 2, type: "Superior Double" },
    { roomNumber: "204", floor: 2, type: "Superior Double" },
    { roomNumber: "205", floor: 2, type: "Superior Double" },
    { roomNumber: "206", floor: 2, type: "Superior Double" },
    { roomNumber: "303", floor: 3, type: "Deluxe Suite" },
    { roomNumber: "304", floor: 3, type: "Deluxe Suite" },
    { roomNumber: "305", floor: 3, type: "Deluxe Suite" },
    { roomNumber: "306", floor: 3, type: "Deluxe Suite" },
  ]

  // Generate 15-20 bookings
  const bookingCount = Math.floor(Math.random() * 6) + 15

  for (let i = 0; i < bookingCount; i++) {
    const room = rooms[Math.floor(Math.random() * rooms.length)]
    const checkInOffset = Math.floor(Math.random() * 14) - 7 // -7 to +7 days from current date
    const stayLength = Math.floor(Math.random() * 5) + 1 // 1 to 5 days

    const checkInDate = addDays(currentDate, checkInOffset)
    const checkOutDate = addDays(checkInDate, stayLength)

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const totalAmount = (Math.floor(Math.random() * 20) + 10) * 100 // $1000 to $3000

    bookings.push({
      id: `booking-${i}`,
      bookingNumber: `BIV${Math.floor(Math.random() * 10000)}`,
      externalReference: `${Math.floor(Math.random() * 1000000000)}`,
      roomNumber: room.roomNumber,
      floor: room.floor,
      roomType: room.type,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      numberOfGuests: Math.floor(Math.random() * 3) + 1,
      children: Math.floor(Math.random() * 2),
      bookingStatus: status,
      totalAmount: totalAmount,
      pendingAmount: status === "PENDING" ? totalAmount : 0,
      guest: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      },
      notes: Math.random() > 0.7 ? "Guest requested extra pillows and late checkout." : "",
    })
  }

  return bookings
}

