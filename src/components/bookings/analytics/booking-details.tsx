"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type BookingDetailsProps = {
  booking: any
  onClose: () => void
}

export default function BookingDetails({ booking, onClose }: BookingDetailsProps) {
  const [activeTab, setActiveTab] = useState("booking-details")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  })

  const handleModifyDates = () => {
    // In a real app, this would open a date modification dialog
    console.log("Modify dates for booking:", booking.id)
  }

  const handleChangeOccupancy = () => {
    // In a real app, this would open an occupancy modification dialog
    console.log("Change occupancy for booking:", booking.id)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call the CheckOutBooking mutation
      // const { data } = await client.mutate({
      //   mutation: CHECK_OUT_BOOKING,
      //   variables: { bookingId: booking.id, status: "CHECKED_OUT", notes: "Checked out via system" }
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Checkout completed for booking:", booking.id)
      onClose()
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckin = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call the CheckInBooking mutation
      // const { data } = await client.mutate({
      //   mutation: CHECK_IN_BOOKING,
      //   variables: { bookingId: booking.id, status: "CHECKED_IN", notes: "Checked in via system" }
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Check-in completed for booking:", booking.id)
      onClose()
    } catch (error) {
      console.error("Error during check-in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBill = () => {
    // In a real app, this would open a dialog to add charges
    console.log("Add bill for booking:", booking.id)
  }

  const handleCollectPayment = () => {
    // In a real app, this would open a payment collection dialog
    console.log("Collect payment for booking:", booking.id)
  }

  const handlePinRoom = () => {
    setConfirmDialog({
      open: true,
      title: "Pin Room",
      description: "Are you sure you want to pin this room? This will mark it as a priority for housekeeping.",
      action: async () => {
        // In a real app, this would call a mutation to pin the room
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Room pinned:", booking.roomNumber)
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  const handleUnpinRoom = () => {
    setConfirmDialog({
      open: true,
      title: "Unpin Room",
      description: "Are you sure you want to unpin this room?",
      action: async () => {
        // In a real app, this would call a mutation to unpin the room
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Room unpinned:", booking.roomNumber)
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  const handleUpdateRoom = () => {
    // In a real app, this would open a dialog to update room details
    console.log("Update room:", booking.roomNumber)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM - dd MMM")
    } catch (e) {
      return "Invalid date"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="fixed inset-y-0 right-0 w-full max-w-md shadow-xl border-l z-50 overflow-auto">
      <div className="sticky top-0 bg-background z-10 border-b">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-semibold">Room {booking.roomNumber}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="booking-details" className="flex-1">
              Booking Details
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              Notes/To Do
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-0">
        <TabsContent value="booking-details" className="m-0">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">
                  {booking.guest.firstName} {booking.guest.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  ({booking.guest.firstName} {booking.guest.lastName})
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{booking.bookingNumber}</p>
                <p className="text-xs text-muted-foreground">Booking.com #{booking.externalReference}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium">Dates</p>
                <p className="text-base">{formatDate(`${booking.checkInDate} - ${booking.checkOutDate}`)}</p>
                <p className="text-sm">{booking.roomNumber}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleModifyDates}>
                Modify
              </Button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium">Guests</p>
                <p className="text-base">
                  {booking.numberOfGuests} Adults, {booking.children || 0} Kids
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleChangeOccupancy}>
                Change Occupancy
              </Button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="mb-2">
              <p className="text-sm font-medium">Total Bill</p>
              <p className="text-xl font-bold">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm font-medium">Pending Amount</p>
              <p className="text-base">{formatCurrency(booking.pendingAmount || 0)}</p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleCheckout} disabled={isLoading}>
              Checkout
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("booking-details")}>
              Booking Details
            </Button>
            <Button variant="outline" onClick={() => console.log("Guest card")}>
              Guest Card
            </Button>
          </div>

          <div className="p-4 grid grid-cols-3 gap-3">
            <Button variant="outline" size="sm" onClick={handleAddBill}>
              Add Bill
            </Button>
            <Button variant="outline" size="sm" onClick={handleCollectPayment}>
              Collect Payment
            </Button>
            <Button variant="outline" size="sm" onClick={handleCheckin}>
              Checkin Now
            </Button>
          </div>

          <div className="p-4 grid grid-cols-3 gap-3">
            <Button variant="outline" size="sm" onClick={handlePinRoom}>
              Pin Room
            </Button>
            <Button variant="outline" size="sm" onClick={handleUnpinRoom}>
              Unpin Room
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleUpdateRoom}>
              Update Room
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="m-0 p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            <div className="border rounded-md p-3 bg-muted/30">
              <p className="text-sm">{booking.notes || "No notes available for this booking."}</p>
            </div>

            <h3 className="text-lg font-medium mt-6">To Do</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="todo-1" className="rounded" />
                <label htmlFor="todo-1" className="text-sm">
                  Prepare welcome package
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="todo-2" className="rounded" />
                <label htmlFor="todo-2" className="text-sm">
                  Verify payment method
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="todo-3" className="rounded" />
                <label htmlFor="todo-3" className="text-sm">
                  Check special requests
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Add New Note</Button>
            </div>
          </div>
        </TabsContent>
      </CardContent>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button onClick={confirmDialog.action}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

