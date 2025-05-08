"use client"

import { useState, useEffect } from "react"
import RoomBlock from "./room-block"

type Room = {
  id: string
  roomNumber: string
  roomType: string
  bedType: string
  pricePerNight: number
  status: string
  amenities: string[]
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  maintenanceNotes: string
  extraBedAllowed: boolean
  lastMaintained: string
  extraBedPrice: number
  baseOccupancy: number
  maxOccupancy: number
  lastCleaned: string
  floor: number
  hotelId: string
  roomSize: number
  bedCount: number
  isAvailable?: boolean
  checkInTime?: string | null
  checkOutTime?: string | null
  guestName?: string | null
}

type RoomGridProps = {
  hotelId: string
  floorCount: number
  onCreateBooking: (room: Room) => void
}

export default function RoomGrid({ hotelId, floorCount, onCreateBooking }: RoomGridProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      if (!hotelId) return
      
      setIsLoading(true)
      try {
        // Using the provided GraphQL query
        const query = `
          query GetRooms {
            rooms(
              hotelId: "${hotelId}"
              limit: 100
            ) {
              id
              roomNumber
              roomType
              bedType
              pricePerNight
              status
              amenities
              images
              isActive
              createdAt
              updatedAt
              maintenanceNotes
              extraBedAllowed
              lastMaintained
              extraBedPrice
              baseOccupancy
              maxOccupancy
              lastCleaned
              floor
              hotelId
              roomSize
              bedCount
            }
          }
        `

        // Replace this with your actual GraphQL fetch function
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        })

        const data = await response.json()
        
        if (data.data && data.data.rooms) {
          const processedRooms = data.data.rooms.map((room: Room) => ({
            ...room,
            isAvailable: room.status === "AVAILABLE"
          }))
          setRooms(processedRooms)
        } else {
          console.error("Error fetching rooms: Invalid response structure", data)
          setRooms([])
        }
      } catch (error) {
        console.error("Error fetching rooms:", error)
        setRooms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [hotelId])

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

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No rooms found for this hotel.</p>
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
    {} as Record<number, Room[]>,
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
                .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                .map((room) => (
                  <RoomBlock 
                    key={room.id} 
                    room={room} 
                    onCreateBooking={() => onCreateBooking(room)} 
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}