// "use client"

// import { useState, useEffect } from "react"
// import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
// import { ChevronLeft, ChevronRight, Calendar, Filter, RefreshCw, HelpCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/components/ui/use-toast"
// import BookingCalendar from "./booking-calendar"
// import { useHotelContext } from "@/providers/hotel-provider"
// import { useSession } from "next-auth/react"
// import { generateMockBookings } from "./mock-data"
// import { BookingDetails } from "@/components/dashbaord/booking-details"

// export interface Guest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
// }

// export interface Payment {
//   amount: number;
//   status: string;
//   __typename: string;
//   transactionId: string;
//   transactionDate: string;
// }

// export interface RoomCharge {
//   amount: number;
//   chargeDate: string;
//   chargeType: string;
//   description: string;
// }

// export interface Booking {
//   id: string;
//   bookingNumber: string;
//   guest: Guest;
//   checkInDate: string;
//   checkOutDate: string;
//   roomType: string;
//   bookingStatus: string;
//   paymentStatus: string;
//   totalAmount: number;
//   ratePlan?: string;
//   payments?: Payment[];
//   taxAmount?: number;
//   createdAt?: string;
//   updatedAt?: string;
//   createdBy?: string;
//   updatedBy?: string;
//   baseAmount?: number;
//   roomCharges?: RoomCharge[];
//   specialRequests?: string;
//   cancellationDate?: string;
//   cancellationReason?: string;
//   roomIds?: string[];
//   numberOfGuests: number;
//   numberOfRooms?: number;
//   roomNumber: string;
//   floor: number;
//   externalReference?: string;
//   children?: number;
//   pendingAmount?: number;
//   notes?: string;
// }

// export interface Room {
//   id: string;
//   hotelId: string;
//   roomNumber: string;
//   roomType: string;
//   bedType?: string;
//   pricePerNight: number;
//   status: string;
//   amenities?: string[];
//   isActive: boolean;
//   description?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   __typename?: string;
//   lastCleaned?: string;
//   maxOccupancy?: number;
//   baseOccupancy?: number;
//   extraBedPrice?: number;
//   lastMaintained?: string;
//   extraBedAllowed?: boolean;
//   maintenanceNotes?: string;
//   floor: number;
//   roomSize?: number;
//   isPinned?: boolean;
//   images?: string[];
// }

// export interface OccupancyData {
//   date: Date;
//   percentage: number;
//   available: number;
// }

// export default function BookingAnalytics() {
//   const [currentDate, setCurrentDate] = useState<Date>(new Date())
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({})
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [showBookingDetails, setShowBookingDetails] = useState<boolean>(false)

//   // Filter states
//   const [selectedFloor, setSelectedFloor] = useState<string>("all")
//   const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
//   const [selectedStatus, setSelectedStatus] = useState<string>("all")
  
//   // Access hotel context and session
//   const { selectedHotel } = useHotelContext()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   useEffect(() => {
//     if (selectedHotel?.id) {
//       fetchBookings()
//       fetchRooms()
//     }
//   }, [currentDate, selectedHotel])

//   // Fetch detailed room information by ID
//   const fetchRoomDetails = async (roomId: string): Promise<Room | null> => {
//     try {
//       const response = await fetch("http://localhost:8000/graphql", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${(session as any)?.accessToken || ''}`
//         },
//         body: JSON.stringify({
//           query: `
//             query {
//               room(roomId: "${roomId}") {
//                 id
//                 hotelId
//                 roomNumber
//                 roomType
//                 bedType
//                 pricePerNight
//                 status
//                 amenities
//                 description
//                 images
//                 isActive
//                 createdAt
//                 updatedAt
//                 lastCleaned
//                 maxOccupancy
//                 baseOccupancy
//                 extraBedPrice
//                 lastMaintained
//                 extraBedAllowed
//                 maintenanceNotes
//                 floor
//                 roomSize
//               }
//             }
//           `
//         }),
//       })

//       const result = await response.json()
      
//       if (result.data && result.data.room) {
//         return result.data.room as Room
//       }
//       return null
//     } catch (error) {
//       console.error(`Error fetching room details for ${roomId}:`, error)
//       return null
//     }
//   }

//   // Batch fetch room details for multiple bookings
//   const fetchAllRoomDetails = async (bookingsData: Booking[]) => {
//   const roomIds = [...new Set(
//     bookingsData.flatMap(booking => (booking.roomIds || [])).filter(id => !roomDetails[id])
//   )]

//   if (roomIds.length === 0) return

//   const newRoomDetails = { ...roomDetails }

//   await Promise.all(roomIds.map(async (roomId) => {
//     const roomDetail = await fetchRoomDetails(roomId)
//     if (roomDetail) {
//       newRoomDetails[roomId] = roomDetail
//     }
//   }))

//   setRoomDetails(newRoomDetails)
// }

//   const fetchBookings = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("http://localhost:8000/graphql", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${(session as any)?.accessToken || ''}`
//         },
//         body: JSON.stringify({
//           query: `
//             query {
//               bookings(
//                 hotelId: "${selectedHotel?.id}"
//               ) {
//                 id
//                 bookingNumber
//                 guest {
//                   firstName
//                   lastName
//                   email
//                 }
//                 checkInDate
//                 checkOutDate
//                 roomType
//                 bookingStatus
//                 paymentStatus
//                 totalAmount
//                 ratePlan
//                 payments {
//                   amount
//                   status
//                   __typename
//                   transactionId
//                   transactionDate
//                 }
//                 taxAmount
//                 createdAt
//                 updatedAt
//                 createdBy
//                 updatedBy
//                 baseAmount
//                 roomCharges {
//                   amount
//                   chargeDate
//                   chargeType
//                   description
//                 }
//                 specialRequests
//                 cancellationDate
//                 cancellationReason
//                 roomId
//                 numberOfGuests
//                 numberOfRooms
//                 taxAmount
//               }
//             }
//           `
//         }),
//       })

//       const result = await response.json()
      
//       if (result.data && result.data.bookings) {
//         // Process bookings to include room information
//         const bookingsData = result.data.bookings.map((booking: any) => {
//   const primaryRoomId = (booking.roomIds && booking.roomIds.length > 0) ? booking.roomIds[0] : null
//   const room = primaryRoomId && roomDetails[primaryRoomId]
//     ? roomDetails[primaryRoomId]
//     : rooms.find(r => r.id === primaryRoomId) || { roomNumber: "Unknown", floor: 1 }

//   return {
//     ...booking,
//     roomNumber: room.roomNumber || "Unknown",
//     floor: room.floor || 1,
//     checkInDate: booking.checkInDate,
//     checkOutDate: booking.checkOutDate,
//     paymentStatus: booking.paymentStatus || "PENDING",
//     totalAmount: booking.totalAmount || 0,
//     numberOfGuests: booking.numberOfGuests || 1
//   } as Booking
// })

//         setBookings(bookingsData)
        
//         // Fetch detailed room information for bookings
//         await fetchAllRoomDetails(bookingsData)
//       } else {
//         console.error("Error fetching bookings: No data in response", result)
//         // Fall back to mock data for development/testing
//         const mockData = generateMockBookings(currentDate)
//         // Ensure mock data includes all required fields
//         const enhancedMockData = mockData.map(booking => ({
//           ...booking,
//           paymentStatus: booking.paymentStatus || "PENDING",
//           totalAmount: booking.totalAmount || 0,
//           numberOfGuests: booking.numberOfGuests || 1
//         })) as Booking[]
        
//         setBookings(enhancedMockData)
//       }
//     } catch (error) {
//       console.error("Error fetching bookings:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch bookings. Using mock data instead.",
//         variant: "destructive"
//       })
      
//       // Fall back to mock data with proper types
//       const mockData = generateMockBookings(currentDate)
//       const enhancedMockData = mockData.map(booking => ({
//         ...booking,
//         paymentStatus: "PENDING",
//         totalAmount: booking.totalAmount || 0,
//         numberOfGuests: booking.numberOfGuests || 1
//       })) as Booking[]
      
//       setBookings(enhancedMockData)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchRooms = async () => {
//   try {
//     const response = await fetch("http://localhost:8000/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${(session as any)?.accessToken || ''}`
//       },
//       body: JSON.stringify({
//         query: `
//           query {
//             rooms(
//               hotelId: "${selectedHotel?.id}"
//               limit: 100
//               offset: 0
//             ) {
//               id
//               hotelId
//               roomNumber
//               roomType
//               bedType
//               pricePerNight
//               status
//               amenities
//               isActive
//               createdAt
//               updatedAt
//               __typename
//               lastCleaned
//               maxOccupancy
//               baseOccupancy
//               extraBedPrice
//               lastMaintained
//               extraBedAllowed
//               maintenanceNotes
//               floor
//               roomSize
//             }
//           }
//         `
//       }),
//     });

//     const result = await response.json();

//     if (result.data && result.data.rooms) {
//       const processedRooms = result.data.rooms.map((room: any) => ({
//         ...room,
//         floor: room.floor || 1
//       }));

//       setRooms(processedRooms);

//       if (bookings.length > 0) {
//         setBookings(bookings.map(booking => {
//           if (booking.roomIds && booking.roomIds.length > 0) {
//             const matchedRooms = booking.roomIds
//               .map((id: string) => processedRooms.find((r: any) => r.id === id))
//               .filter(Boolean);

//             return {
//               ...booking,
//               roomNumbers: matchedRooms.map(r => r.roomNumber),
//               floors: matchedRooms.map(r => r.floor)
//             };
//           }
//           return booking;
//         }));
//       }
//     } else {
//       console.error("Error fetching rooms: No data in response", result);
//     }
//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//     toast({
//       title: "Error",
//       description: "Failed to fetch room information",
//       variant: "destructive"
//     });
//   }
// };


//   const handlePreviousMonth = () => {
//     const newDate = new Date(currentDate)
//     newDate.setMonth(newDate.getMonth() - 1)
//     setCurrentDate(newDate)
//   }

//   const handleNextMonth = () => {
//     const newDate = new Date(currentDate)
//     newDate.setMonth(newDate.getMonth() + 1)
//     setCurrentDate(newDate)
//   }

//   const handleToday = () => {
//     setCurrentDate(new Date())
//   }

//   const handleBookingClick = (booking: Booking) => {
//   setSelectedBooking(booking)
//   setShowBookingDetails(true)

//   const fetchMissingRoomDetails = async () => {
//     const missing = (booking.roomIds || []).filter(id => !roomDetails[id])
//     const fetchedRooms = await Promise.all(missing.map(fetchRoomDetails))
//     const newRoomDetails = { ...roomDetails }
//     missing.forEach((id, i) => {
//       if (fetchedRooms[i]) newRoomDetails[id] = fetchedRooms[i]!
//     })
//     setRoomDetails(newRoomDetails)
//   }

//   fetchMissingRoomDetails()
// }

//   const handleCloseDetails = () => {
//     setShowBookingDetails(false)
//     setSelectedBooking(null)
//   }

//   const handleRefresh = () => {
//     fetchBookings()
//     fetchRooms()
//   }

//   // Calculate days for the current month view
//   const monthStart = startOfMonth(currentDate)
//   const monthEnd = endOfMonth(currentDate)
//   const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

//   // Filter the bookings based on selected filters
//   const filteredBookings = bookings.filter(booking => {
//     // Apply floor filter
//     if (selectedFloor !== "all") {
//       if (booking.floor?.toString() !== selectedFloor) return false
//     }
    
//     // Apply room type filter
//     if (selectedRoomType !== "all" && booking.roomType !== selectedRoomType) {
//       return false
//     }
    
//     // Apply status filter
//     if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
//       return false
//     }
    
//     return true
//   })

//   // Calculate occupancy percentages for each day
//   const occupancyData: OccupancyData[] = daysInMonth.map((day) => {
//     const dayBookings = filteredBookings.filter((booking) => {
//       const checkIn = new Date(booking.checkInDate)
//       const checkOut = new Date(booking.checkOutDate)
//       return day >= checkIn && day <= checkOut
//     })

//     // Get total number of rooms from the API data or fallback to 20
//     const totalRooms = rooms.length > 0 ? rooms.length : 20
//     const occupiedRooms = dayBookings.length
//     const percentage = Math.round((occupiedRooms / totalRooms) * 100)

//     return {
//       date: day,
//       percentage,
//       available: totalRooms - occupiedRooms,
//     }
//   })

//   // Generate floors list based on available rooms
//   const floors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b)
  
//   // Generate room types list based on available rooms
//   const roomTypes = [...new Set(rooms.map(room => room.roomType))]

//   return (
//     <div className="container mx-auto py-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
//           <div className="flex items-center border rounded-md p-1 ml-4">
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Calendar className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Filter className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={handleRefresh}>
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="icon">
//             <HelpCircle className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <Card className="mb-8">
//         <CardContent className="p-0">
//           <div className="flex justify-between items-center p-4 border-b">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-semibold">{format(currentDate, "MMM yyyy")}</h2>
//               <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm" onClick={handleToday}>
//                 Today
//               </Button>
//               <Button variant="ghost" size="sm" onClick={handleNextMonth}>
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Floors</span>
//                 <Select value={selectedFloor} onValueChange={setSelectedFloor}>
//                   <SelectTrigger className="w-[120px]">
//                     <SelectValue placeholder="All Floors" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Floors</SelectItem>
//                     {floors.map(floor => (
//                       <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Room Type</span>
//                 <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Room Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Room Types</SelectItem>
//                     {roomTypes.map(type => (
//                       <SelectItem key={type} value={type}>{type}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Booking Status</span>
//                 <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                     <SelectItem value="CHECKED_IN">Checked In</SelectItem>
//                     <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
//                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                     <SelectItem value="PENDING">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           <BookingCalendar
//             bookings={filteredBookings}
//             occupancyData={occupancyData}
//             currentDate={currentDate}
//             isLoading={isLoading}
//             onBookingClick={handleBookingClick}
//             hotelId = {selectedHotel?.id}
//           />
//         </CardContent>
//       </Card>

//       {showBookingDetails && selectedBooking && (
//         <BookingDetails 
//           booking={selectedBooking} 
//           onClose={handleCloseDetails} 
//           roomDetails={selectedBooking.roomId ? roomDetails[selectedBooking.roomId] : undefined}
//         />
//       )}
//     </div>
      
    
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, Filter, RefreshCw, HelpCircle, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import BookingCalendar from "./booking-calendar"
import { useHotelContext } from "@/providers/hotel-provider"
import { useSession } from "next-auth/react"
import { generateMockBookings } from "./mock-data"
import { BookingDetails } from "@/components/dashbaord/booking-details"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export interface Guest {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface Payment {
  amount: number
  status: string
  __typename: string
  transactionId: string
  transactionDate: string
}

export interface RoomCharge {
  amount: number
  chargeDate: string
  chargeType: string
  description: string
}

export interface RoomTypeBooking {
  roomType: string
  numberOfRooms: number
  roomIds: string[]
}

export interface Booking {
  id: string
  bookingNumber: string
  guest: Guest
  checkInDate: string
  checkOutDate: string
  roomType: string
  bookingStatus: string
  paymentStatus: string
  totalAmount: number
  ratePlan?: string
  payments?: Payment[]
  taxAmount?: number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  baseAmount?: number
  roomCharges?: RoomCharge[]
  specialRequests?: string
  cancellationDate?: string
  cancellationReason?: string
  roomIds?: string[]
  numberOfGuests: number
  numberOfRooms?: number
  roomNumber: string
  floor: number
  externalReference?: string
  children?: number
  pendingAmount?: number
  notes?: string
  roomTypeBookings?: RoomTypeBooking[]
}

export interface Room {
  id: string
  hotelId: string
  roomNumber: string
  roomType: string
  bedType?: string
  pricePerNight: number
  status: string
  amenities?: string[]
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
  __typename?: string
  lastCleaned?: string
  maxOccupancy?: number
  baseOccupancy?: number
  extraBedPrice?: number
  lastMaintained?: string
  extraBedAllowed?: boolean
  maintenanceNotes?: string
  floor: number
  roomSize?: number
  isPinned?: boolean
  images?: string[]
}

export interface OccupancyData {
  date: Date
  percentage: number
  available: number
  occupied: number
  roomTypeOccupancy: {
    [key: string]: {
      total: number
      occupied: number
      percentage: number
    }
  }
}

export default function BookingAnalytics() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({})
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showBookingDetails, setShowBookingDetails] = useState<boolean>(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [networkDetails, setNetworkDetails] = useState<any>(null)

  // Filter states
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Access hotel context and session
  const { selectedHotel } = useHotelContext()
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (selectedHotel?.id) {
      fetchBookings()
      fetchRooms()
    }
  }, [currentDate, selectedHotel])

  // Fetch bookings using the same approach as in booking-list.tsx
  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching bookings with hotel ID:", selectedHotel?.id)

      // Using the same approach as in booking-list.tsx
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query bookings($hotelId:String){
                bookings(hotelId:$hotelId){
                  id
                  hotelId
                  bookingNumber
                  guest{
                    firstName
                    lastName
                    email
                  }
                  roomTypeBookings{
                    roomType
                    numberOfRooms
                    roomIds
                  }
                  checkInDate 
                  checkOutDate
                  bookingStatus
                  paymentStatus
                  totalAmount
                  numberOfGuests
                  createdAt
                }
          }
          `,
          variables: {
            hotelId: `${selectedHotel?.id}`,
            limit: 100,
          },
        }),
      })

      const result = await response.json()
      console.log("API Response:", result)
      setDebugInfo(result)

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      const allBookings = result.data?.bookings || []
      console.log("Fetched bookings:", allBookings)

      if (allBookings.length > 0) {
        // Process bookings to include room information
        const processedBookings = allBookings.map((booking: any) => {
          // Extract room type from roomTypeBookings if available
          let roomType = "Standard"
          if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
            roomType = booking.roomTypeBookings[0].roomType
          }

          return {
            ...booking,
            roomNumber: "TBD", // We'll update this later
            floor: 1, // Default floor
            paymentStatus: booking.paymentStatus || "PENDING",
            totalAmount: booking.totalAmount || 0,
            numberOfGuests: booking.numberOfGuests || 1,
            roomType: roomType,
          } as Booking
        })

        console.log("Processed bookings:", processedBookings)
        setBookings(processedBookings)

        // Fetch detailed room information for bookings if needed
        if (processedBookings.some((b) => b.roomTypeBookings?.length > 0)) {
          await fetchAllRoomDetails(processedBookings)
        }
      } else {
        console.log("No bookings found for hotel ID:", selectedHotel?.id)
        setBookings([])
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error)
      setError(`Failed to fetch bookings: ${error.message || "Unknown error"}`)

      toast({
        title: "Error",
        description: "Failed to fetch bookings. Using mock data instead.",
        variant: "destructive",
      })

      // Fall back to mock data with proper types
      const mockData = generateMockBookings(currentDate)
      const enhancedMockData = mockData.map((booking) => ({
        ...booking,
        paymentStatus: "PENDING",
        totalAmount: booking.totalAmount || 0,
        numberOfGuests: booking.numberOfGuests || 1,
      })) as Booking[]

      setBookings(enhancedMockData)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query {
            rooms(
              hotelId: "${selectedHotel?.id}"
              limit: 100
              offset: 0
            ) {
              id
              hotelId
              roomNumber
              roomType
              bedType
              pricePerNight
              status
              amenities
              isActive
              floor
            }
          }
        `,
        }),
      })

      const result = await response.json()
      console.log("Rooms API Response:", result)

      if (result.data && result.data.rooms) {
        const processedRooms = result.data.rooms.map((room: any) => ({
          ...room,
          floor: room.floor || 1,
        }))

        console.log("Fetched rooms:", processedRooms)
        setRooms(processedRooms)

        if (bookings.length > 0) {
          setBookings(
            bookings.map((booking) => {
              if (booking.roomIds && booking.roomIds.length > 0) {
                const matchedRooms = booking.roomIds
                  .map((id: string) => processedRooms.find((r: any) => r.id === id))
                  .filter(Boolean)

                return {
                  ...booking,
                  roomNumbers: matchedRooms.map((r) => r.roomNumber),
                  floors: matchedRooms.map((r) => r.floor),
                }
              }
              return booking
            }),
          )
        }
      } else {
        console.error("Error fetching rooms: No data in response", result)

        // If no rooms are returned, create some default rooms for testing
        if (rooms.length === 0) {
          const defaultRooms = [
            { id: "1", roomNumber: "101", roomType: "STANDARD", status: "AVAILABLE", isActive: true, floor: 1 },
            { id: "2", roomNumber: "102", roomType: "STANDARD", status: "AVAILABLE", isActive: true, floor: 1 },
            { id: "3", roomNumber: "103", roomType: "DELUXE", status: "AVAILABLE", isActive: true, floor: 1 },
            { id: "4", roomNumber: "104", roomType: "DELUXE", status: "AVAILABLE", isActive: true, floor: 1 },
            { id: "5", roomNumber: "105", roomType: "PRESIDENTIAL", status: "AVAILABLE", isActive: true, floor: 1 },
          ] as Room[]

          setRooms(defaultRooms)
          console.log("Using default rooms:", defaultRooms)
        }
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch room information",
        variant: "destructive",
      })

      // Create default rooms if none exist
      if (rooms.length === 0) {
        const defaultRooms = [
          { id: "1", roomNumber: "101", roomType: "STANDARD", status: "AVAILABLE", isActive: true, floor: 1 },
          { id: "2", roomNumber: "102", roomType: "STANDARD", status: "AVAILABLE", isActive: true, floor: 1 },
          { id: "3", roomNumber: "103", roomType: "DELUXE", status: "AVAILABLE", isActive: true, floor: 1 },
          { id: "4", roomNumber: "104", roomType: "DELUXE", status: "AVAILABLE", isActive: true, floor: 1 },
          { id: "5", roomNumber: "105", roomType: "PRESIDENTIAL", status: "AVAILABLE", isActive: true, floor: 1 },
        ] as Room[]

        setRooms(defaultRooms)
        console.log("Using default rooms:", defaultRooms)
      }
    }
  }

  // Fetch detailed room information by ID
  const fetchRoomDetails = async (roomId: string): Promise<Room | null> => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              room(roomId: "${roomId}") {
                id
                hotelId
                roomNumber
                roomType
                bedType
                pricePerNight
                status
                amenities
                description
                images
                isActive
                createdAt
                updatedAt
                lastCleaned
                maxOccupancy
                baseOccupancy
                extraBedPrice
                lastMaintained
                extraBedAllowed
                maintenanceNotes
                floor
                roomSize
              }
            }
          `,
        }),
      })

      const result = await response.json()

      if (result.data && result.data.room) {
        return result.data.room as Room
      }
      return null
    } catch (error) {
      console.error(`Error fetching room details for ${roomId}:`, error)
      return null
    }
  }

  // Batch fetch room details for multiple bookings
  const fetchAllRoomDetails = async (bookingsData: Booking[]) => {
    const roomIds = [
      ...new Set(
        bookingsData
          .flatMap((booking) => {
            // Try to get room IDs from roomTypeBookings first
            if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
              return booking.roomTypeBookings.flatMap((rtb) => rtb.roomIds || [])
            }
            // Fall back to roomIds if available
            return booking.roomIds || []
          })
          .filter((id) => !roomDetails[id]),
      ),
    ]

    if (roomIds.length === 0) return

    const newRoomDetails = { ...roomDetails }

    await Promise.all(
      roomIds.map(async (roomId) => {
        const roomDetail = await fetchRoomDetails(roomId)
        if (roomDetail) {
          newRoomDetails[roomId] = roomDetail
        }
      }),
    )

    setRoomDetails(newRoomDetails)
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)

    const fetchMissingRoomDetails = async () => {
      const missing = (booking.roomIds || []).filter((id) => !roomDetails[id])
      const fetchedRooms = await Promise.all(missing.map(fetchRoomDetails))
      const newRoomDetails = { ...roomDetails }
      missing.forEach((id, i) => {
        if (fetchedRooms[i]) newRoomDetails[id] = fetchedRooms[i]!
      })
      setRoomDetails(newRoomDetails)
    }

    fetchMissingRoomDetails()
  }

  const handleCloseDetails = () => {
    setShowBookingDetails(false)
    setSelectedBooking(null)
  }

  const handleRefresh = () => {
    fetchBookings()
    fetchRooms()
  }

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  // Calculate days for the current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Filter the bookings based on selected filters
  const filteredBookings = bookings.filter((booking) => {
    // Apply floor filter
    if (selectedFloor !== "all") {
      if (booking.floor?.toString() !== selectedFloor) return false
    }

    // Apply room type filter
    if (selectedRoomType !== "all" && booking.roomType !== selectedRoomType) {
      return false
    }

    // Apply status filter
    if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
      return false
    }

    return true
  })

  // Calculate occupancy percentages for each day with improved logic
  const occupancyData: OccupancyData[] = daysInMonth.map((day) => {
    // Get bookings that overlap with this day
    const dayBookings = filteredBookings.filter((booking) => {
      try {
        const checkIn = parseISO(booking.checkInDate)
        const checkOut = parseISO(booking.checkOutDate)

        // Check if the day falls within the booking period
        return isWithinInterval(day, { start: checkIn, end: checkOut })
      } catch (e) {
        console.error("Error parsing dates:", e, booking)
        return false
      }
    })

    console.log(`Day ${format(day, "yyyy-MM-dd")} has ${dayBookings.length} bookings`)

    // Get total number of rooms from the API data or fallback to 5
    const totalRooms = rooms.length > 0 ? rooms.length : 5

    // Count occupied rooms by room type
    const roomTypeOccupancy: {
      [key: string]: {
        total: number
        occupied: number
        percentage: number
      }
    } = {}

    // Initialize room type occupancy with all room types from rooms array
    rooms.forEach((room) => {
      if (!roomTypeOccupancy[room.roomType]) {
        roomTypeOccupancy[room.roomType] = {
          total: 0,
          occupied: 0,
          percentage: 0,
        }
      }
      roomTypeOccupancy[room.roomType].total += 1
    })

    // If no rooms are found, add default room types
    if (Object.keys(roomTypeOccupancy).length === 0) {
      roomTypeOccupancy["STANDARD"] = { total: 2, occupied: 0, percentage: 0 }
      roomTypeOccupancy["DELUXE"] = { total: 2, occupied: 0, percentage: 0 }
      roomTypeOccupancy["PRESIDENTIAL"] = { total: 1, occupied: 0, percentage: 0 }
    }

    // Count occupied rooms by booking
    dayBookings.forEach((booking) => {
      const roomType = booking.roomType || "STANDARD"

      if (!roomTypeOccupancy[roomType]) {
        roomTypeOccupancy[roomType] = {
          total: 1, // Assume at least one room of this type
          occupied: 0,
          percentage: 0,
        }
      }

      // Count rooms from roomTypeBookings if available
      if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
        booking.roomTypeBookings.forEach((rtb) => {
          if (!roomTypeOccupancy[rtb.roomType]) {
            roomTypeOccupancy[rtb.roomType] = {
              total: rtb.numberOfRooms,
              occupied: 0,
              percentage: 0,
            }
          }
          roomTypeOccupancy[rtb.roomType].occupied += rtb.numberOfRooms
        })
      } else {
        // Default to 1 room if no roomTypeBookings
        roomTypeOccupancy[roomType].occupied += 1
      }
    })

    // Calculate percentages for each room type
    Object.keys(roomTypeOccupancy).forEach((roomType) => {
      const { total, occupied } = roomTypeOccupancy[roomType]
      roomTypeOccupancy[roomType].percentage = total > 0 ? Math.round((occupied / total) * 100) : 0
    })

    // Calculate total occupancy
    const occupiedRooms = Object.values(roomTypeOccupancy).reduce((sum, { occupied }) => sum + occupied, 0)
    const percentage = Math.round((occupiedRooms / totalRooms) * 100)

    return {
      date: day,
      percentage,
      available: totalRooms - occupiedRooms,
      occupied: occupiedRooms,
      roomTypeOccupancy,
    }
  })

  // Generate floors list based on available rooms
  const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)

  // Generate room types list based on available rooms
  const roomTypes = [...new Set(rooms.map((room) => room.roomType))]

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <div className="flex items-center border rounded-md p-1 ml-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleDebug}>
            <Bug className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error fetching bookings</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showDebug && (
        <Card className="mb-4 bg-yellow-50">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Hotel Context</h3>
                <div className="text-xs overflow-auto max-h-40 bg-black text-green-400 p-2 rounded">
                  <pre>Selected Hotel ID: {selectedHotel?.id || "None"}</pre>
                  <pre>Selected Hotel Name: {selectedHotel?.name || "None"}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Bookings Data</h3>
                <div className="text-xs overflow-auto max-h-60 bg-black text-green-400 p-2 rounded">
                  <pre>Total Bookings: {bookings.length}</pre>
                  <pre>Filtered Bookings: {filteredBookings.length}</pre>
                  <pre>{JSON.stringify(bookings.slice(0, 2), null, 2)}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Rooms Data</h3>
                <div className="text-xs overflow-auto max-h-40 bg-black text-green-400 p-2 rounded">
                  <pre>Total Rooms: {rooms.length}</pre>
                  <pre>Room Types: {roomTypes.join(", ")}</pre>
                  <pre>{JSON.stringify(rooms.slice(0, 2), null, 2)}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Occupancy Data</h3>
                <div className="text-xs overflow-auto max-h-60 bg-black text-green-400 p-2 rounded">
                  <pre>{JSON.stringify(occupancyData[0], null, 2)}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{format(currentDate, "MMM yyyy")}</h2>
              <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Floors</span>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    {floors.map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        Floor {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Room Type</span>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Room Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Booking Status</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                    <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <BookingCalendar
              bookings={filteredBookings}
              occupancyData={occupancyData}
              currentDate={currentDate}
              isLoading={isLoading}
              onBookingClick={handleBookingClick}
              hotelId={selectedHotel?.id}
            />
          )}
        </CardContent>
      </Card>

      {showBookingDetails && selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={handleCloseDetails}
          roomDetails={selectedBooking.roomId ? roomDetails[selectedBooking.roomId] : undefined}
        />
      )}
    </div>
  )
}
