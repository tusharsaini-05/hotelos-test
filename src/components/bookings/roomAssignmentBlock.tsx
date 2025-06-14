// "use client"

// import { useState } from "react"
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock, CreditCard, Edit, MoreVertical, Plus, UserCheck, X } from "lucide-react"
// import { format } from "date-fns"
// import { Badge } from "@/components/ui/badge"
// import { RoomType } from "@/graphql/types/booking"
// import { Room } from "./roomAssignment"
// import { useMutation } from "@apollo/client"
// import { gql } from "@apollo/client"


// const ASSIGN_ROOM_MUTATION = gql`
//   mutation AssignSingleRoomToBooking($bookingId: String!, $roomType: RoomType!, $roomId: String!) {
//     assignSingleRoomToBooking(bookingId: $bookingId, roomType: $roomType, roomId: $roomId) {
//       id
//       # Include other fields you need from the Booking type
//     }
//   }
// `

// type RoomBlockProps = {
//   room: Room
//   bookingId:string
//   onAssignmentSuccess?: () => void
//   roomType:RoomType
// //  handleAssignRoom: () => void
// }


// export default function RoomBlock({ room, bookingId, roomType, onAssignmentSuccess }: RoomBlockProps) {
//   const [assignRoom] = useMutation(ASSIGN_ROOM_MUTATION)
//   const [isAssigning, setIsAssigning] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const statusColors = {
//     AVAILABLE: "bg-green-500",
//     BOOKED: "bg-red-500",
//     OCCUPIED: "bg-red-600",
//     CLEANING: "bg-amber-500",
//     MAINTENANCE: "bg-blue-500",
//   }

//   const statusLabels = {
//     AVAILABLE: "Available",
//     BOOKED: "Booked",
//     OCCUPIED: "Occupied",
//     CLEANING: "Cleaning",
//     MAINTENANCE: "Maintenance",
//   }

//   const getStatusColor = (status: string) => {
//     return statusColors[status as keyof typeof statusColors] || "bg-gray-500"
//   }

//   const getStatusLabel = (status: string) => {
//     return statusLabels[status as keyof typeof statusLabels] || "Unknown"
//   }

//   const formatDateTime = (dateString: string | null) => {
//     if (!dateString) return "N/A"
//     try {
//       return format(new Date(dateString), "MMM d, yyyy h:mm a")
//     } catch (e) {
//       return "Invalid date"
//     }
//   }

//   const handleAssignRoom = async () => {
//     if (!room.isAvailable) return
    
//     setIsAssigning(true)
//     setError(null)
    
//     try {
//       const { data } = await assignRoom({
//         variables: {
//           bookingId:bookingId,
//           roomType:roomType,
//           roomId: room.id
//         }
//       })
      
//       if (data?.assignSingleRoomToBooking) {
//         onAssignmentSuccess?.()
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to assign room")
//     } finally {
//       setIsAssigning(false)
//     }
//   }

//   return (
//     <div>
//       <HoverCard openDelay={200} closeDelay={100}>
//         <HoverCardTrigger asChild>
//           <div
//             className={`
//               relative aspect-square rounded-md border shadow-sm 
//               ${getStatusColor(room.status)} 
//               hover:shadow-md transition-shadow duration-200 cursor-pointer
//               flex items-center justify-center
//             `}
//             onClick={room.isAvailable ? handleAssignRoom : undefined}
//           >
//             <span className="text-white font-medium">{room.roomNumber}</span>
//             {isAssigning && (
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//               </div>
//             )}
//           </div>
//         </HoverCardTrigger>

//         <HoverCardContent className="w-80 p-0">
//           <div className="p-4 border-b">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="font-semibold">Room {room.roomNumber}</h4>
//                 <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
//               </div>
//               <Badge className={`${room.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
//                 {getStatusLabel(room.status)}
//               </Badge>
//             </div>
//           </div>

//           {!room.isAvailable && (
//             <div className="p-4 space-y-3">
//               {room.guestName && (
//                 <div className="flex items-center gap-2">
//                   <UserCheck className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">{room.guestName}</span>
//                 </div>
//               )}

              
//             </div>
//           )}

//           <div className="p-4 bg-muted/50 flex justify-end">
//             <Button 
//               size="sm" 
//               variant="outline" 
//               onClick={handleAssignRoom}
//               disabled={!room.isAvailable || isAssigning}
//             >
//               {isAssigning ? "Assigning..." : room.isAvailable ? "Assign Room" : "Modify Booking"}
//             </Button>
//           </div>
//           {error && (
//             <div className="p-2 text-red-500 text-sm">
//               {error}
//             </div>
//           )}
//         </HoverCardContent>
//       </HoverCard>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { UserCheck } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { RoomType } from "@/graphql/types/booking"
import type { Room } from "./roomAssignment"
import { useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { useToast } from "@/components/ui/use-toast"

const ASSIGN_ROOM_MUTATION = gql`
  mutation AssignSingleRoomToBooking($bookingId: String!, $roomType: RoomType!, $roomId: String!) {
    assignSingleRoomToBooking(bookingId: $bookingId, roomType: $roomType, roomId: $roomId) {
      id
      roomTypeBookings {
        roomType
        numberOfRooms
        roomIds
      }
    }
  }
`

type RoomBlockProps = {
  room: Room
  bookingId: string
  onAssignmentSuccess?: () => void
  roomType: RoomType
}

export default function RoomBlock({ room, bookingId, roomType, onAssignmentSuccess }: RoomBlockProps) {
  const [assignRoom] = useMutation(ASSIGN_ROOM_MUTATION)
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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

  const handleAssignRoom = async () => {
    if (!room.isAvailable) return

    setIsAssigning(true)
    setError(null)

    try {
      console.log("Assigning room:", {
        bookingId,
        roomType,
        roomId: room.id,
      })

      const { data, errors } = await assignRoom({
        variables: {
          bookingId,
          roomType,
          roomId: room.id,
        },
      })

      if (errors) {
        throw new Error(errors[0].message)
      }

      if (data?.assignSingleRoomToBooking) {
        toast({
          title: "Room Assigned",
          description: `Room ${room.roomNumber} has been assigned successfully.`,
          variant: "default",
        })

        // Call the success callback to refresh the parent component
        if (onAssignmentSuccess) {
          onAssignmentSuccess()
        }
      } else {
        throw new Error("Failed to assign room - no data returned")
      }
    } catch (err) {
      console.error("Room assignment error:", err)
      setError(err instanceof Error ? err.message : "Failed to assign room")
      toast({
        title: "Assignment Failed",
        description: err instanceof Error ? err.message : "Failed to assign room",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  // Direct click handler for the room block
  const handleRoomClick = () => {
    if (room.isAvailable) {
      handleAssignRoom()
    }
  }

  return (
    <div>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div
            className={`
              relative aspect-square rounded-md border shadow-sm 
              ${getStatusColor(room.status)} 
              hover:shadow-md transition-shadow duration-200 cursor-pointer
              flex items-center justify-center
            `}
            onClick={handleRoomClick}
          >
            <span className="text-white font-medium">{room.roomNumber}</span>
            {isAssigning && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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

          {!room.isAvailable && room.guestName && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{room.guestName}</span>
              </div>
            </div>
          )}

          <div className="p-4 bg-muted/50 flex justify-end">
            <Button size="sm" variant="outline" onClick={handleAssignRoom} disabled={!room.isAvailable || isAssigning}>
              {isAssigning ? "Assigning..." : room.isAvailable ? "Assign Room" : "Unavailable"}
            </Button>
          </div>
          {error && <div className="p-2 text-red-500 text-sm">{error}</div>}
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
