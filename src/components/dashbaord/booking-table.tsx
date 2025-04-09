"use client"

import React, { useState } from "react"
import { format, parseISO } from "date-fns"
import { ChevronDown, ChevronRight, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Guest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  specialRequests?: string
}

interface Booking {
  id: string
  bookingNumber: string
  guest: Guest
  checkInDate: string
  checkOutDate: string
  roomType: string
  roomNumber?: string
  bookingStatus: string
  paymentStatus?: string
  totalAmount: number
  numberOfGuests?: number
  createdAt?: string
  [key: string]: any
}

interface BookingTableProps {
  bookings: Booking[]
  isLoading: boolean
  isExpandable?: boolean
}

export default function BookingTable({ bookings, isLoading, isExpandable = false }: BookingTableProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const handleViewBooking = (booking: Booking): void => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const toggleExpand = (bookingId: string): void => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null)
    } else {
      setExpandedBooking(bookingId)
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "CHECKED_IN":
        return <Badge className="bg-blue-500">Checked In</Badge>
      case "CHECKED_OUT":
        return <Badge className="bg-gray-500">Checked Out</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "PENDING":
        return <Badge className="bg-amber-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground">No bookings available for the selected period</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {isExpandable && <TableHead className="w-[50px]"></TableHead>}
            <TableHead>Booking #</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <React.Fragment key={booking.id}>
              <TableRow className="hover:bg-muted/50">
                {isExpandable && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleExpand(booking.id)} 
                      className="h-8 w-8"
                    >
                      {expandedBooking === booking.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
                <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                <TableCell>
                  {booking.guest.firstName} {booking.guest.lastName}
                </TableCell>
                <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                <TableCell>{booking.roomType}</TableCell>
                <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                <TableCell className="text-right">${booking.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewBooking(booking)} 
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {isExpandable && expandedBooking === booking.id && (
                <TableRow>
                  <TableCell colSpan={9} className="bg-muted/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Guest Details</h4>
                        <p className="text-sm">
                          {booking.guest.firstName} {booking.guest.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.guest.email}</p>
                        <p className="text-sm text-muted-foreground">{booking.guest.phone || "No phone"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Room Details</h4>
                        <p className="text-sm">Room: {booking.roomNumber || "Not assigned"}</p>
                        <p className="text-sm">Type: {booking.roomType}</p>
                        <p className="text-sm">
                          Guests: {booking.numberOfGuests || 1} {(booking.numberOfGuests || 1) > 1 ? "people" : "person"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Payment Details</h4>
                        <p className="text-sm">Total: ${booking.totalAmount.toLocaleString()}</p>
                        <p className="text-sm">
                          Payment Status: {getStatusBadge(booking.paymentStatus || booking.bookingStatus)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Booking #{selectedBooking?.bookingNumber}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Guest Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p>
                      {selectedBooking.guest.firstName} {selectedBooking.guest.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedBooking.guest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedBooking.guest.phone || "Not provided"}</p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-2">Booking Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Check-in Date</p>
                    <p>{formatDate(selectedBooking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-out Date</p>
                    <p>{formatDate(selectedBooking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Room Type</p>
                    <p>{selectedBooking.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Number of Guests</p>
                    <p>{selectedBooking.numberOfGuests || 1}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-xl font-bold">${selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Booking Status</p>
                    <div className="mt-1">{getStatusBadge(selectedBooking.bookingStatus)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Status</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedBooking.paymentStatus || selectedBooking.bookingStatus)}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-2">Additional Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Created At</p>
                    <p>{formatDate(selectedBooking.createdAt || selectedBooking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Special Requests</p>
                    <p>{selectedBooking.guest.specialRequests || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}