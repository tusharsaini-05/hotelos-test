"use client"

import { useState, useEffect } from "react"
import RoomBlock from "./room-block"

// Mock room data generator
const generateMockRooms = (hotelId: string, floors: number, roomsPerFloor: number) => {
  const rooms = []
  const statuses = ["AVAILABLE", "BOOKED", "OCCUPIED", "CLEANING", "MAINTENANCE"]

  for (let floor = 1; floor <= floors; floor++) {
    for (let room = 1; room <= roomsPerFloor; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, "0")}`
      const randomStatus = statuses[Math.floor(Math.random() * 5)]
      const isAvailable = randomStatus === "AVAILABLE"

      // Generate random check-in/out times for booked rooms
      const now = new Date()
      const checkInDate = new Date(now)
      checkInDate.setDate(now.getDate() - Math.floor(Math.random() * 3))
      const checkOutDate = new Date(checkInDate)
      checkOutDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 7) + 1)

      rooms.push({
        id: `room-${hotelId}-${roomNumber}`,
        hotelId,
        roomNumber,
        floor,
        status: randomStatus,
        isAvailable,
        checkInTime: isAvailable ? null : checkInDate.toISOString(),
        checkOutTime: isAvailable ? null : checkOutDate.toISOString(),
        guestName: isAvailable ? null : `Guest ${Math.floor(Math.random() * 1000)}`,
      })
    }
  }

  return rooms
}

type RoomGridProps = {
  hotelId: string
  floors: number
  roomsPerFloor: number
  onCreateBooking: (room: any) => void
}

export default function RoomGrid({ hotelId, floors, roomsPerFloor, onCreateBooking }: RoomGridProps) {
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch rooms
    const fetchRooms = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockRooms = generateMockRooms(hotelId, floors, roomsPerFloor)
        setRooms(mockRooms)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [hotelId, floors, roomsPerFloor])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    )
  }

  // Group rooms by floor
  const roomsByFloor = rooms.reduce(
    (acc, room) => {
      const floor = room.floor
      if (!acc[floor]) {
        acc[floor] = []
      }
      acc[floor].push(room)
      return acc
    },
    {} as Record<number, any[]>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(roomsByFloor)
        .sort(([floorA], [floorB]) => Number(floorB) - Number(floorA)) // Sort floors in descending order
        .map(([floor, floorRooms]) => (
          <div key={floor} className="space-y-2">
            <h3 className="text-lg font-medium">Floor {floor}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {floorRooms
                .sort((a : any, b : any) => a.roomNumber.localeCompare(b.roomNumber))
                .map((room : any) => (
                  <RoomBlock key={room.id} room={room} onCreateBooking={() => onCreateBooking(room)} />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}

