import { addDays, subDays } from "date-fns"
import type { Booking, Room } from "./booking-analytics"

const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emily",
  "Robert",
  "Lisa",
  "James",
  "Maria",
  "William",
  "Jennifer",
  "Richard",
  "Patricia",
  "Charles",
  "Linda",
  "Thomas",
  "Barbara",
  "Christopher",
  "Elizabeth",
  "Daniel",
  "Helen",
]

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
]

const bookingStatuses = ["CONFIRMED", "CHECKED_IN", "PENDING", "CHECKED_OUT"]
const roomTypes = ["STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL"]

export function generateMockBookings(baseDate: Date, count = 20): Booking[] {
  const bookings: Booking[] = []

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]
    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)]

    // Generate random check-in date within ±7 days of base date
    const daysOffset = Math.floor(Math.random() * 15) - 7
    const checkInDate = addDays(baseDate, daysOffset)

    // Generate stay duration (1-5 days)
    const stayDuration = Math.floor(Math.random() * 5) + 1
    const checkOutDate = addDays(checkInDate, stayDuration)

    const booking: Booking = {
      id: `booking-${i + 1}`,
      bookingNumber: `BK${String(i + 1).padStart(4, "0")}`,
      guest: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      },
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      roomType,
      bookingStatus: status,
      paymentStatus: Math.random() > 0.3 ? "PAID" : "PENDING",
      totalAmount: Math.floor(Math.random() * 500) + 100,
      numberOfGuests: Math.floor(Math.random() * 4) + 1,
      roomNumber: "TBD",
      floor: 1,
      createdAt: subDays(checkInDate, Math.floor(Math.random() * 30)).toISOString(),
    }

    bookings.push(booking)
  }

  return bookings
}

export function generateMockRooms(): Room[] {
  const rooms: Room[] = []

  // Standard rooms (Floor 1: 101-108, Floor 2: 201-208)
  for (let floor = 1; floor <= 2; floor++) {
    for (let roomNum = 1; roomNum <= 8; roomNum++) {
      const roomNumber = `${floor}${String(roomNum).padStart(2, "0")}`
      rooms.push({
        id: `room-${roomNumber}`,
        hotelId: "hotel-1",
        roomNumber,
        roomType: "STANDARD",
        bedType: "Double",
        pricePerNight: 120,
        status: "AVAILABLE",
        isActive: true,
        floor,
        maxOccupancy: 2,
        baseOccupancy: 2,
        amenities: ["WiFi", "TV", "AC"],
      })
    }
  }

  // Deluxe rooms (Floor 2: 209-214, Floor 3: 301-306)
  for (let floor = 2; floor <= 3; floor++) {
    const startRoom = floor === 2 ? 9 : 1
    const endRoom = floor === 2 ? 14 : 6

    for (let roomNum = startRoom; roomNum <= endRoom; roomNum++) {
      const roomNumber = `${floor}${String(roomNum).padStart(2, "0")}`
      rooms.push({
        id: `room-${roomNumber}`,
        hotelId: "hotel-1",
        roomNumber,
        roomType: "DELUXE",
        bedType: "Queen",
        pricePerNight: 180,
        status: "AVAILABLE",
        isActive: true,
        floor,
        maxOccupancy: 3,
        baseOccupancy: 2,
        amenities: ["WiFi", "TV", "AC", "Mini Bar"],
      })
    }
  }

  // Suite rooms (Floor 3: 307-310)
  for (let roomNum = 7; roomNum <= 10; roomNum++) {
    const roomNumber = `3${String(roomNum).padStart(2, "0")}`
    rooms.push({
      id: `room-${roomNumber}`,
      hotelId: "hotel-1",
      roomNumber,
      roomType: "SUITE",
      bedType: "King",
      pricePerNight: 300,
      status: "AVAILABLE",
      isActive: true,
      floor: 3,
      maxOccupancy: 4,
      baseOccupancy: 2,
      amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony"],
    })
  }

  // Presidential rooms (Floor 3: 311-312)
  for (let roomNum = 11; roomNum <= 12; roomNum++) {
    const roomNumber = `3${String(roomNum).padStart(2, "0")}`
    rooms.push({
      id: `room-${roomNumber}`,
      hotelId: "hotel-1",
      roomNumber,
      roomType: "PRESIDENTIAL",
      bedType: "King Suite",
      pricePerNight: 500,
      status: "AVAILABLE",
      isActive: true,
      floor: 3,
      maxOccupancy: 6,
      baseOccupancy: 2,
      amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi", "Butler Service"],
    })
  }

  return rooms
}
