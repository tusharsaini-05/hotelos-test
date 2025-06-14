"use client"

import { useState } from "react"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon, Plus, Minus, X, User, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHotelContext } from "@/providers/hotel-provider"
import { useMutation } from "@apollo/client"
import { CREATE_BOOKING } from "@/graphql/booking/mutations"

// Room types enum matching backend
const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"] as const

// Room type configuration
const ROOM_TYPE_CONFIG = {
  STANDARD: {
    name: "Standard Room",
    price: 1850,
    maxOccupancy: 2,
    baseOccupancy: 1,
    extraBedAllowed: false,
    extraBedPrice: 0,
  },
  DELUXE: {
    name: "Deluxe Room",
    price: 2648,
    maxOccupancy: 2,
    baseOccupancy: 2,
    extraBedAllowed: false,
    extraBedPrice: 0,
  },
  SUITE: {
    name: "Suite",
    price: 3450,
    maxOccupancy: 3,
    baseOccupancy: 2,
    extraBedAllowed: true,
    extraBedPrice: 750,
  },
  EXECUTIVE: {
    name: "Executive Room",
    price: 2950,
    maxOccupancy: 4,
    baseOccupancy: 2,
    extraBedAllowed: true,
    extraBedPrice: 500,
  },
  PRESIDENTIAL: {
    name: "Presidential Suite",
    price: 5500,
    maxOccupancy: 4,
    baseOccupancy: 2,
    extraBedAllowed: true,
    extraBedPrice: 1000,
  },
} as const

export default function CreateBooking() {
  const { selectedHotel } = useHotelContext()
  const [createBooking, { loading: isCreatingBooking }] = useMutation(CREATE_BOOKING)
  const { toast } = useToast()

  const [date, setDate] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })

  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    lastName: "",
    phoneCode: "+91",
    phone: "",
    email: "",
    profileType: "personal",
    companyName: "",
  })

  const [bookingSource, setBookingSource] = useState<"DIRECT" | "WEBSITE" | "OTA" | "PHONE" | "WALK_IN" | "CORPORATE">(
    "WALK_IN",
  )
  const [specialRequests, setSpecialRequests] = useState("")
  const [isGroupBooking, setIsGroupBooking] = useState(false)

  // Room configurations
  const [rooms, setRooms] = useState<
    {
      id: number
      roomType: (typeof ROOM_TYPES)[number]
      roomCount: number
      adults: number
      children: number
      price: number
      totalPrice: number
    }[]
  >([
    {
      id: 1,
      roomType: "STANDARD",
      roomCount: 1,
      adults: ROOM_TYPE_CONFIG.STANDARD.baseOccupancy,
      children: 0,
      price: ROOM_TYPE_CONFIG.STANDARD.price,
      totalPrice: ROOM_TYPE_CONFIG.STANDARD.price,
    },
  ])

  // Calculate total charges
  const getTotalCharges = () => {
    const nights = date.to ? differenceInDays(date.to, date.from) || 1 : 1
    return rooms.reduce((sum, room) => sum + room.price * room.roomCount * nights, 0)
  }

  const handleAddRoom = () => {
    const newRoomId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    const defaultRoomType = "STANDARD"
    const config = ROOM_TYPE_CONFIG[defaultRoomType]

    setRooms([
      ...rooms,
      {
        id: newRoomId,
        roomType: defaultRoomType,
        roomCount: 1,
        adults: config.baseOccupancy,
        children: 0,
        price: config.price,
        totalPrice: config.price,
      },
    ])
  }

  const handleRemoveRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((room) => room.id !== id))
    }
  }

  const updateRoomField = (id: number, field: string, value: any) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === id) {
          const updatedRoom = { ...room, [field]: value }

          // If changing room type, update price and occupancy
          if (field === "roomType") {
            const config = ROOM_TYPE_CONFIG[value as keyof typeof ROOM_TYPE_CONFIG]
            if (config) {
              updatedRoom.price = config.price
              updatedRoom.adults = config.baseOccupancy
              const nights = date.to ? differenceInDays(date.to, date.from) || 1 : 1
              updatedRoom.totalPrice = config.price * room.roomCount * nights
            }
          }

          // If changing room count, update total price
          if (field === "roomCount") {
            const nights = date.to ? differenceInDays(date.to, date.from) || 1 : 1
            updatedRoom.totalPrice = room.price * value * nights
          }

          return updatedRoom
        }
        return room
      }),
    )
  }

  const incrementAdults = (index: number) => {
    const newRooms = [...rooms]
    const config = ROOM_TYPE_CONFIG[newRooms[index].roomType]

    if (newRooms[index].adults < config.maxOccupancy) {
      newRooms[index].adults += 1
      setRooms(newRooms)
    } else {
      toast({
        title: "Maximum occupancy reached",
        description: `This room type can accommodate a maximum of ${config.maxOccupancy} guests.`,
      })
    }
  }

  const decrementAdults = (index: number) => {
    const newRooms = [...rooms]
    if (newRooms[index].adults > 1) {
      newRooms[index].adults -= 1
      setRooms(newRooms)
    }
  }

  const incrementChildren = (index: number) => {
    const newRooms = [...rooms]
    const config = ROOM_TYPE_CONFIG[newRooms[index].roomType]
    const totalOccupants = newRooms[index].adults + newRooms[index].children + 1

    if (totalOccupants <= config.maxOccupancy) {
      newRooms[index].children += 1
      setRooms(newRooms)
    } else {
      toast({
        title: "Maximum occupancy reached",
        description: `This room type can accommodate a maximum of ${config.maxOccupancy} guests.`,
      })
    }
  }

  const decrementChildren = (index: number) => {
    const newRooms = [...rooms]
    if (newRooms[index].children > 0) {
      newRooms[index].children -= 1
      setRooms(newRooms)
    }
  }

  const getTotalGuests = () => {
    return rooms.reduce((sum, room) => sum + room.adults + room.children, 0)
  }

  const getTotalRooms = () => {
    return rooms.reduce((sum, room) => sum + room.roomCount, 0)
  }

  const getNights = () => {
    return date.to ? differenceInDays(date.to, date.from) || 1 : 1
  }

  const handleCreateBooking = async () => {
    console.log("=== BOOKING DEBUG START ===")

    // Debug selected hotel
    console.log("Selected Hotel:", selectedHotel)

    // Validation
    if (!selectedHotel?.id) {
      console.log("ERROR: No hotel selected")
      alert("Error: No hotel selected")
      return
    }

    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.phone || !guestDetails.email) {
      console.log("ERROR: Missing guest details", guestDetails)
      alert("Error: Please fill in all required guest details")
      return
    }

    if (!date.from || !date.to) {
      console.log("ERROR: Missing dates", date)
      alert("Error: Please select check-in and check-out dates")
      return
    }

    try {
      // Prepare room type bookings exactly like your working form
      const roomTypeBookings = rooms.map((room) => ({
        roomType: room.roomType,
        numberOfRooms: room.roomCount,
      }))

      console.log("Room Type Bookings:", roomTypeBookings)

      // Format dates as ISO strings to match your working form
      const checkInDate = date.from.toISOString().split("T")[0] + "T00:00:00.000Z"
      const checkOutDate = date.to!.toISOString().split("T")[0] + "T00:00:00.000Z"

      const bookingData = {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: getTotalGuests(),
        bookingSource,
        specialRequests: specialRequests || "",
        guest: {
          firstName: guestDetails.firstName,
          lastName: guestDetails.lastName,
          email: guestDetails.email,
          phone: `${guestDetails.phoneCode}${guestDetails.phone}`,
        },
        roomTypeBookings,
        hotelId: selectedHotel.id,
        ratePlan: null,
      }

      console.log("Final Booking Data:", JSON.stringify(bookingData, null, 2))

      const result = await createBooking({
        variables: {
          bookingData,
        },
      })

      console.log("GraphQL Result:", result)
      console.log("Result Data:", result.data)
      console.log("Result Errors:", result.errors)

      // Check for data and errors more thoroughly
      if (result.data && result.data.createBooking) {
        console.log("SUCCESS: Booking created successfully")
        console.log("Booking Number:", result.data.createBooking.bookingNumber)
        alert("Booking created: " + result.data.createBooking.bookingNumber)

        // Reset form
        setGuestDetails({
          firstName: "",
          lastName: "",
          phoneCode: "+91",
          phone: "",
          email: "",
          profileType: "personal",
          companyName: "",
        })
        setSpecialRequests("")
        setRooms([
          {
            id: 1,
            roomType: "STANDARD",
            roomCount: 1,
            adults: ROOM_TYPE_CONFIG.STANDARD.baseOccupancy,
            children: 0,
            price: ROOM_TYPE_CONFIG.STANDARD.price,
            totalPrice: ROOM_TYPE_CONFIG.STANDARD.price,
          },
        ])
      } else if (result.errors && result.errors.length > 0) {
        console.log("GraphQL Errors found:", result.errors)
        const errorMessages = result.errors.map((error) => error.message).join(", ")
        alert("GraphQL Error: " + errorMessages)
      } else {
        console.log("ERROR: No booking data returned and no errors")
        console.log("Full result object:", JSON.stringify(result, null, 2))
        alert("Error creating booking - no data returned. Check console for details.")
      }
    } catch (error) {
      console.log("CATCH ERROR:", error)
      console.log("Error type:", typeof error)
      console.log("Error message:", error?.message)
      console.log("Error stack:", error?.stack)
      console.log("GraphQL Errors:", error?.graphQLErrors)
      console.log("Network Error:", error?.networkError)

      // More detailed error logging
      if (error?.graphQLErrors) {
        error.graphQLErrors.forEach((gqlError, index) => {
          console.log(`GraphQL Error ${index}:`, gqlError)
        })
      }

      if (error?.networkError) {
        console.log("Network Error Details:", error.networkError)
      }

      alert("Error creating booking: " + (error?.message || "Unknown error"))
    }

    console.log("=== BOOKING DEBUG END ===")
  }

  return (
    <div className="container mx-auto py-4 max-w-7xl">
      {/* Header with booking summary */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create Booking</h1>
          <p className="text-muted-foreground">
            {getTotalGuests()} {getTotalGuests() === 1 ? "Guest" : "Guests"}, {getTotalRooms()}{" "}
            {getTotalRooms() === 1 ? "Room" : "Rooms"}, {getNights()} {getNights() === 1 ? "Night" : "Nights"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full p-2 h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <br />
        Hotel ID: {selectedHotel?.id || "Not selected"}
        <br />
        Hotel Name: {selectedHotel?.name || "Not selected"}
        <br />
        Guest: {guestDetails.firstName} {guestDetails.lastName}
        <br />
        Email: {guestDetails.email}
        <br />
        Phone: {guestDetails.phoneCode}
        {guestDetails.phone}
        <br />
        Dates: {date.from ? format(date.from, "yyyy-MM-dd") : "Not set"} to{" "}
        {date.to ? format(date.to, "yyyy-MM-dd") : "Not set"}
        <br />
        Rooms: {rooms.length} room type(s)
        <br />
        Total Guests: {getTotalGuests()}
      </div>

      {/* Total charges bar */}
      <div className="flex justify-between items-center bg-slate-800 text-white p-4 rounded-md mb-6">
        <div>
          <p className="text-sm font-medium">Total Charges</p>
          <p className="text-2xl font-bold">₹ {getTotalCharges().toLocaleString()}</p>
        </div>
        <Button onClick={handleCreateBooking} disabled={isCreatingBooking} className="bg-green-500 hover:bg-green-600">
          {isCreatingBooking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Booking"
          )}
        </Button>
      </div>

      {/* Main booking form */}
      <div className="space-y-6">
        {/* Contact Details */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium">Contact Details</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mobile">Enter Mobile Number *</Label>
              <div className="flex">
                <Select
                  defaultValue="+91"
                  onValueChange={(value) => setGuestDetails({ ...guestDetails, phoneCode: value })}
                >
                  <SelectTrigger className="w-[80px] rounded-r-none border-r-0">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="mobile"
                  className="flex-1 rounded-l-none"
                  placeholder="Enter Mobile Number"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter First Name"
                value={guestDetails.firstName}
                onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter Last Name"
                value={guestDetails.lastName}
                onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookingSource">Booking Source</Label>
              <Select value={bookingSource} onValueChange={(value) => setBookingSource(value as typeof bookingSource)}>
                <SelectTrigger id="bookingSource">
                  <SelectValue placeholder="Select Booking Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECT">Direct</SelectItem>
                  <SelectItem value="WEBSITE">Website</SelectItem>
                  <SelectItem value="OTA">Online Travel Agency</SelectItem>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="WALK_IN">Walk-in</SelectItem>
                  <SelectItem value="CORPORATE">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileType">Type of Profile</Label>
              <Select
                value={guestDetails.profileType}
                onValueChange={(value) => setGuestDetails({ ...guestDetails, profileType: value })}
              >
                <SelectTrigger id="profileType">
                  <SelectValue placeholder="Select Profile Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company/Business Name</Label>
              <Input
                id="companyName"
                placeholder="Enter Company Name"
                disabled={guestDetails.profileType !== "business"}
                value={guestDetails.companyName}
                onChange={(e) => setGuestDetails({ ...guestDetails, companyName: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Stay Details */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium">Stay Details</h2>
          </div>

          <div className="mb-6 flex flex-wrap gap-6">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date.from, "dd MMM")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date.from}
                    selected={{ from: date.from, to: date.to }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setDate({ from: range.from, to: range.to })
                      }
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center">
              <div className="px-4 text-gray-400">TO</div>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.to ? format(date.to, "dd MMM") : format(addDays(date.from, 1), "dd MMM")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date.from}
                    selected={{ from: date.from, to: date.to }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setDate({ from: range.from, to: range.to })
                      }
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {rooms.map((room, index) => (
            <div key={room.id} className="mb-4 rounded-lg border p-4 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                  Room {index + 1}
                  {room.roomCount > 1 ? ` to ${index + room.roomCount}` : ""}
                  {room.roomCount > 1 ? ` (${room.roomCount} Rooms)` : ""}
                </h3>
                <div className="font-bold">₹ {room.totalPrice.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-1 block">Room Type</Label>
                  <Select value={room.roomType} onValueChange={(value) => updateRoomField(room.id, "roomType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {ROOM_TYPE_CONFIG[type].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-1 block">Rooms</Label>
                  <Select
                    value={room.roomCount.toString()}
                    onValueChange={(value) => updateRoomField(room.id, "roomCount", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-1 block">Adults (5+ Years)</Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => decrementAdults(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 h-10 px-3 py-2 border border-l-0 border-r-0 flex items-center justify-center">
                      {room.adults}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => incrementAdults(index)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-1 block">Children (0-5 years)</Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => decrementChildren(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 h-10 px-3 py-2 border border-l-0 border-r-0 flex items-center justify-center">
                      {room.children}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => incrementChildren(index)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                {rooms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => handleRemoveRoom(room.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="text-right text-sm text-muted-foreground mt-2">
                <div className="flex justify-end gap-2">
                  <span>Room Price: ₹{room.price}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <Button variant="outline" className="border-dashed w-full" onClick={handleAddRoom}>
              <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="group-booking"
                checked={isGroupBooking}
                onCheckedChange={(checked) => setIsGroupBooking(checked === true)}
              />
              <label
                htmlFor="group-booking"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark this as a group booking
              </label>
            </div>
          </div>
        </section>

        {/* Special Requests */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-6">Special Requests</h2>
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Input
              id="specialRequests"
              placeholder="Enter any special requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
