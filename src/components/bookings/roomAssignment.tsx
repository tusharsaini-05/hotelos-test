// "use client"

// import { useState, useEffect } from "react"
// import RoomBlock from "./roomAssignmentBlock"
// import { RoomType } from "@/graphql/types/booking"
// export type Room = {
//   id: string
//   roomNumber: string
//   roomType: string
//   bedType: string
//   pricePerNight: number
//   status: string
//   amenities: string[]
//   images: string[]
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
//   maintenanceNotes: string
//   extraBedAllowed: boolean
//   lastMaintained: string
//   extraBedPrice: number
//   baseOccupancy: number
//   maxOccupancy: number
//   lastCleaned: string
//   floor: number
//   hotelId: string
//   roomSize: number
//   bedCount: number
//   isAvailable?: boolean
//   checkInTime?: string | null
//   checkOutTime?: string | null
//   guestName?: string | null
// }

// type AssignRoomProps = {
//   hotelId: string
//   floorCount: number
//   roomType:RoomType
//   bookingId:string
// //  onAssignRoom: (room: Room) => void
// }

// export default function RoomGrid({ hotelId,roomType,bookingId /*onAssignRoom*/ }: AssignRoomProps) {
  
//   const [selectedRoom,setSelectedRoom] = useState<Room>();
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [isLoading, setIsLoading] = useState(true)
  
//   useEffect(() => {
  
//     const fetchRooms = async () => {
//       if (!hotelId) return
      
//       setIsLoading(true)
//       try {
//         // Using the provided GraphQL query
//         const query = `
//           query GetRooms {
//             rooms(
//               hotelId: "${hotelId}"
//               roomType: ${roomType}
//               limit: 100
//             ) {
//               id
//               roomNumber
//               roomType
//               bedType
//               pricePerNight
//               status
//               amenities
//               images
//               isActive
//               createdAt
//               updatedAt
//               maintenanceNotes
//               extraBedAllowed
//               lastMaintained
//               extraBedPrice
//               baseOccupancy
//               maxOccupancy
//               lastCleaned
//               floor
//               hotelId
//               roomSize
//               bedCount
//             }
//           }
//         `

//         // Replace this with your actual GraphQL fetch function
//         const response = await fetch('http://localhost:8000/graphql', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ query }),
//         })

//         const data = await response.json()
//         console.log(data)
//         if (data.data && data.data.rooms) {
//           const processedRooms = data.data.rooms.map((room: Room) => ({
//             ...room,
//             isAvailable: room.status === "AVAILABLE"
//           }))
//           setRooms(processedRooms)
//         } else {
//           console.error("Error fetching rooms: Invalid response structure", data)
//           setRooms([])
//         }
//       } catch (error) {
//         console.error("Error fetching rooms:", error)
//         setRooms([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchRooms()
//   }, [hotelId])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center gap-2">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//           <p className="text-muted-foreground">Loading rooms...</p>
//         </div>
//       </div>
//     )
//   }

//   if (rooms.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-muted-foreground">No rooms found for this hotel.</p>
//       </div>
//     )
//   }

//   // Group rooms by floor
//   const roomsByFloor = rooms.reduce(
//     (acc, room) => {
//       const floor = room.floor
//       if (!acc[floor]) {
//         acc[floor] = []
//       }
//       acc[floor].push(room)
//       return acc
//     },
//     {} as Record<number, Room[]>,
//   )

  

//   return (
//     <div className="space-y-8">
//       {Object.entries(roomsByFloor)
//         .sort(([floorA], [floorB]) => Number(floorB) - Number(floorA)) // Sort floors in descending order
//         .map(([floor, floorRooms]) => (
//           <div key={`floor-${floor}`} className="space-y-2">
//             <h3 className="text-lg font-medium">Floor {floor}</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
//               {floorRooms
//                 .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
//                 .map((room) => (
//                   <RoomBlock 
//                     key={room.id} 
//                     room={room} 
//                     bookingId={bookingId}
//                     roomType={roomType}
//                    // onAssignmentSuccess={() => refreshData()}
//                    // handleAssignRoom={() => handleAssignRoom(room)} 
//                   />
//                 ))}
//             </div>
//           </div>
//         ))}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import RoomBlock from "./roomAssignmentBlock"
import type { RoomType } from "@/graphql/types/booking"

export type Room = {
  id: string
  roomNumber: string
  floor: number
  status: string
  isAvailable: boolean
  guestName?: string
  checkInDate?: string
  checkOutDate?: string
}

type RoomGridProps = {
  hotelId: string
  roomType?: RoomType
  floorCount?: number
  bookingId: string
  onAssignmentSuccess?: () => void
}

export default function RoomGrid({ hotelId, roomType, floorCount = 5, bookingId, onAssignmentSuccess }: RoomGridProps) {
  const [activeFloor, setActiveFloor] = useState<number>(1)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // GraphQL endpoint
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

  useEffect(() => {
    fetchRooms()
  }, [hotelId, roomType, activeFloor])

  const fetchRooms = async () => {
    if (!hotelId) return

    setLoading(true)
    setError(null)

    try {
      const query = `
      query GetRooms {
        rooms(
          hotelId: "${hotelId}"
          ${roomType ? `roomType: ${roomType}` : ""}
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

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      if (result.data && result.data.rooms) {
        // Filter rooms by the active floor and transform the data
        const allRooms = result.data.rooms
        const floorRooms = allRooms.filter((room: any) => room.floor === activeFloor)

        const transformedRooms = floorRooms.map((room: any) => ({
          id: room.id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          status: room.status,
          isAvailable: room.status === "AVAILABLE",
          // Add guest info if room is occupied (you may need to adjust this based on your schema)
          guestName: room.status === "OCCUPIED" ? "Guest" : undefined,
        }))

        setRooms(transformedRooms)
      } else {
        console.error("Error fetching rooms: Invalid response structure", result)
        setRooms([])
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setError(error instanceof Error ? error.message : "Failed to load rooms")
    } finally {
      setLoading(false)
    }
  }

  // Handle successful room assignment
  const handleAssignmentSuccess = () => {
    // Refresh the rooms data
    fetchRooms()

    // Call the parent's success handler if provided
    if (onAssignmentSuccess) {
      onAssignmentSuccess()
    }
  }

  // Generate floor tabs
  const floorTabs = Array.from({ length: floorCount }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeFloor.toString()} onValueChange={(value) => setActiveFloor(Number.parseInt(value))}>
        <TabsList className="grid grid-cols-5 mb-4">
          {floorTabs.map((floor) => (
            <TabsTrigger key={floor} value={floor.toString()}>
              Floor {floor}
            </TabsTrigger>
          ))}
        </TabsList>

        {floorTabs.map((floor) => (
          <TabsContent key={floor} value={floor.toString()} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square h-12" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No rooms available on this floor</div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {rooms.map((room) => (
                  <RoomBlock
                    key={room.id}
                    room={room}
                    bookingId={bookingId}
                    roomType={roomType as RoomType}
                    onAssignmentSuccess={handleAssignmentSuccess}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
