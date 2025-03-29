"use client"

import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CreditCard, Edit, MoreVertical, Plus, UserCheck, X } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

type RoomBlockProps = {
  room: any
  onCreateBooking: () => void
}

export default function RoomBlock({ room, onCreateBooking }: RoomBlockProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors = {
    AVAILABLE: "bg-green-500",
    BOOKED: "bg-red-500",
    OCCUPIED: "bg-red-600",
    CLEANING: "bg-amber-500",
    MAINTENANCE: "bg-blue-500",
  }

  const statusLabels = {
    AVAILABLE: "Available",
    BOOKED: "Booked",
    OCCUPIED: "Occupied",
    CLEANING: "Cleaning",
    MAINTENANCE: "Maintenance",
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    return statusLabels[status as keyof typeof statusLabels] || "Unknown"
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a")
    } catch (e) {
      return "Invalid date"
    }
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={`
            relative aspect-square rounded-md border shadow-sm 
            ${getStatusColor(room.status)} 
            hover:shadow-md transition-shadow duration-200 cursor-pointer
            flex items-center justify-center
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="text-white font-medium">{room.roomNumber}</span>

          {isHovered && (
            <div className="absolute top-1 right-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 bg-white/90 hover:bg-white">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onCreateBooking}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create Booking</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Update Booking</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Payment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <X className="mr-2 h-4 w-4" />
                    <span>Cancel Booking</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Room Charge</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Extend Booking</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">Room {room.roomNumber}</h4>
              <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
            </div>
            <Badge className={`${room.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
              {getStatusLabel(room.status)}
            </Badge>
          </div>
        </div>

        {!room.isAvailable && (
          <div className="p-4 space-y-3">
            {room.guestName && (
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{room.guestName}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-sm">{formatDateTime(room.checkInTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="text-sm">{formatDateTime(room.checkOutTime)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 flex justify-end">
          <Button size="sm" variant="outline" onClick={onCreateBooking}>
            {room.isAvailable ? "Book Now" : "Modify Booking"}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

