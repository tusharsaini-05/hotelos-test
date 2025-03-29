"use client"

import { useState , useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import RoomGrid from "./room-grid"
import BookingForm from "./booking-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useHotelContext } from "@/providers/hotel-provider"

// Mock hotel data
const hotelData = {
  id: "67a473107f94fb7765b95957",
  name: "Grand Hotel",
  floors: 4,
  roomsPerFloor: 5,
}

export default function CreateBooking() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const { selectedHotel } = useHotelContext();
  const [hotelData, setHotelData] = useState({
    id: "",
    name: "",
    floor : 0,
    roomCount : 0
  });

  // Update hotelData when selectedHotel changes
  useEffect(() => {
    if (selectedHotel) {
      setHotelData({
        id: selectedHotel?.id,
        name: selectedHotel?.name,
        floor : selectedHotel?.floorCount,
        roomCount : selectedHotel?.roomCount
      });
    }
  }, [selectedHotel]);


  const handleCreateBooking = (room: any) => {
    setSelectedRoom(room)
    setIsFormOpen(true)
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground mt-1">Manage room bookings and availability</p>
        </div>
        <Button className="gap-1" onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          <span>New Booking</span>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{hotelData.name}</CardTitle>
              <CardDescription>Hotel ID: {hotelData.id}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-green-500"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                <span className="text-sm">Booked</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <RoomGrid
            hotelId={hotelData.id}
            floors={hotelData.floor}
            roomsPerFloor={hotelData.roomCount}
            onCreateBooking={handleCreateBooking}
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRoom ? `Create Booking for Room ${selectedRoom.roomNumber}` : "Create New Booking"}
            </DialogTitle>
            <DialogDescription>Fill in the details below to create a new booking</DialogDescription>
          </DialogHeader>
          <BookingForm
            hotelId={hotelData.id}
            hotelName={hotelData.name}
            roomId={selectedRoom?.id}
            roomNumber={selectedRoom?.roomNumber}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

