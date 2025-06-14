export interface GuestDetails {
  firstName: string
  lastName: string
  email: string
  phone?: string // if you have this in your schema
}

export interface RoomTypeBooking {
  roomType: RoomType // or use `RoomType` enum if strictly typed
  numberOfRooms: number
  roomIds: string[]
}
export interface PaymentDetails {
  method: string
  amount: number
  transactionId?: string
  transactionDate: string
  status: string
  notes?: string
}
export interface RoomCharge {
  description: string
  amount: number
  chargeDate: string
  chargeType: string
  notes?: string
}
export enum RoomType {
  STANDARD = "STANDARD",
  DELUXE = "DELUXE",
  SUITE = "SUITE",
  EXECUTIVE = "EXECUTIVE",
  PRESIDENTIAL = "PRESIDENTIAL",
}

export interface Booking {
  id: string
  hotelId: string
  bookingNumber: string
  guest: GuestDetails
  bookingStatus: string
  bookingSource: string
  checkInDate: string // ISO Date string
  checkOutDate: string
  checkInTime?: string
  checkOutTime?: string
  numberOfGuests: number
  ratePlan: string
  baseAmount: number
  taxAmount: number
  totalAmount: number
  paymentStatus: string
  payments: PaymentDetails[]
  roomCharges: RoomCharge[]
  roomTypeBookings: RoomTypeBooking[]
  specialRequests?: string
  cancellationReason?: string
  cancellationDate?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}
