"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Minus, X, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

interface Room {
  id: number
  type: string
  price: number
  minPrice: number
  maxPrice: number
  available: number
  pax: number
}

interface RoomType {
  name: string
  price: number
  minPrice: number
  maxPrice: number
  available: number
}

export default function CreateBooking() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [date, setDate] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1)),
  })
  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    phoneCode: "+66",
    phone: "",
    email: "",
    profileType: "personal",
    companyName: "",
  })
  const [billingDetails, setBillingDetails] = useState({
    billingName: "",
    guestTaxNumber: "",
    billingAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const [selectedPax, setSelectedPax] = useState("1")
  const [showRoomTypes, setShowRoomTypes] = useState(false)
  const { toast } = useToast()

  // This would typically come from an API or context in a real application
  const roomTypes: RoomType[] = [
    {
      name: "STANDARD",
      price: 2354,
      minPrice: 270.74,
      maxPrice: 7062.75,
      available: 4,
    },
    {
      name: "DELUXE",
      price: 2648,
      minPrice: 304.65,
      maxPrice: 7945.5,
      available: 13,
    },
    {
      name: "SUITE",
      price: 2648,
      minPrice: 304.65,
      maxPrice: 7945.5,
      available: 4,
    },
  ]

  const totalRoomsAvailable = roomTypes.reduce((sum, type) => sum + type.available, 0)

  const addRoom = (roomType: RoomType) => {
    const newRoom = {
      id: rooms.length + 1,
      type: roomType.name,
      price: roomType.price,
      minPrice: roomType.minPrice,
      maxPrice: roomType.maxPrice,
      available: roomType.available,
      pax: Number.parseInt(selectedPax),
    }
    setRooms([...rooms, newRoom])
    setShowRoomTypes(false)
  }

  const removeRoom = (index: number) => {
    const newRooms = [...rooms]
    newRooms.splice(index, 1)
    setRooms(newRooms)
  }

  const incrementRoomCount = (index: number) => {
    const newRooms = [...rooms]
    newRooms[index].pax += 1
    setRooms(newRooms)
  }

  const decrementRoomCount = (index: number) => {
    const newRooms = [...rooms]
    if (newRooms[index].pax > 1) {
      newRooms[index].pax -= 1
      setRooms(newRooms)
    }
  }

  const totalCharges = rooms.reduce((sum, room) => {
    const nights = date.to ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) : 1
    return sum + room.price * nights
  }, 0)

  const handleCreateBooking = async () => {
    // Validation
    if (!guestDetails.firstName || !guestDetails.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required guest details",
        variant: "destructive",
      })
      return
    }

    if (!date.from || !date.to) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      })
      return
    }

    if (rooms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one room",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Calculate total nights
      const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))

      // Calculate total guests
      const totalGuests = rooms.reduce((sum, room) => sum + room.pax, 0)

      // Calculate base amount (without taxes)
      const baseAmount = rooms.reduce((sum, room) => sum + room.price, 0) * nights

      // Calculate tax (assume 18% GST)
      const taxAmount = baseAmount * 0.18

      // Total amount
      const totalAmount = baseAmount + taxAmount

      // Mock API call - replace with your actual API endpoint
      setTimeout(() => {
        toast({
          title: "Success!",
          description: `Booking created successfully.`,
        })

        // Reset form or redirect to the new booking
        // window.location.href = `/bookings/new-booking-id`
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const getNights = () => {
    if (!date.to) return 1
    return Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getTotalGuests = () => {
    return rooms.reduce((sum, room) => sum + room.pax, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Create Booking</h1>
            <p className="text-sm text-gray-500">
              {getTotalGuests()} Guest{getTotalGuests() !== 1 ? "s" : ""},{rooms.length} Room
              {rooms.length !== 1 ? "s" : ""},{getNights()} Night{getNights() !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/booking/roompricing">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage Pricing
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Total Charges Bar */}
      <div className="sticky top-[72px] z-10 bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Charges</p>
            <p className="text-xl font-bold">₹ {totalCharges.toLocaleString()}</p>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleCreateBooking}
            disabled={loading}
          >
            Create Booking
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
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
                  defaultValue="+66"
                  onValueChange={(value) => setGuestDetails({ ...guestDetails, phoneCode: value })}
                >
                  <SelectTrigger className="w-[80px] rounded-r-none border-r-0">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+66">+66</SelectItem>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="mobile"
                  className="flex-1 rounded-l-none"
                  placeholder="Enter Mobile Number"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Enter Name *</Label>
              <Input
                id="name"
                placeholder="Enter Name"
                value={guestDetails.firstName}
                onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
              />
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
            <CalendarIcon className="h-5 w-5 text-gray-500" />
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
                    initialFocus
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center">
              <div className="px-4 text-gray-400">ON</div>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.to ? format(date.to, "dd MMM") : format(new Date(date.from.getTime() + 86400000), "dd MMM")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center">
              <Button
                variant="link"
                className="text-red-500"
                onClick={() => {
                  // Show price details
                  toast({
                    title: "Price Details",
                    description: `
                    Base Rate: ₹${rooms.reduce((sum, room) => sum + room.price, 0).toLocaleString()} per night
                    Total Nights: ${getNights()}
                    Subtotal: ₹${(rooms.reduce((sum, room) => sum + room.price, 0) * getNights()).toLocaleString()}
                    Taxes (18%): ₹${(rooms.reduce((sum, room) => sum + room.price, 0) * getNights() * 0.18).toFixed(2)}
                    Total: ₹${(rooms.reduce((sum, room) => sum + room.price, 0) * getNights() * 1.18).toFixed(2)}
                  `,
                  })
                }}
              >
                View Price Details
              </Button>
            </div>

            <div className="ml-auto">
              {totalRoomsAvailable > 0 ? (
                <div className="text-sm text-gray-500">{totalRoomsAvailable} rooms available</div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">No rooms available</div>
              )}
            </div>
          </div>

          {rooms.length === 0 && totalRoomsAvailable === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p>No rooms available</p>
            </div>
          )}

          {rooms.length === 0 && totalRoomsAvailable > 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <Button
                onClick={() => setShowRoomTypes(true)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Select a room to continue
              </Button>
            </div>
          )}

          {rooms.map((room, index) => (
            <div key={room.id} className="mb-4 rounded-lg border p-4 relative">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Room {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                  onClick={() => removeRoom(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select defaultValue={room.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rooms</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decrementRoomCount(index)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{room.pax}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementRoomCount(index)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">₹ {room.price}</div>
                      <div className="text-xs text-gray-500">
                        Min ₹ {room.minPrice.toFixed(2)} · Max ₹ {room.maxPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rooms.length > 0 && (
            <Button variant="outline" className="w-full" onClick={() => setShowRoomTypes(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          )}

          {/* Room Type Selection Popover */}
          {showRoomTypes && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto">
                <div className="p-4 border-b sticky top-0 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Select Room Type</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowRoomTypes(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Tabs defaultValue="1" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="1">1 PAX</TabsTrigger>
                        <TabsTrigger value="2">2 PAX</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="p-4">
                  {roomTypes.map((type) => (
                    <div key={type.name} className="border-b last:border-b-0 py-4" onClick={() => addRoom(type)}>
                      <div className="flex justify-between items-start cursor-pointer">
                        <div>
                          <h4 className="font-medium">{type.name}</h4>
                          <p className="text-sm text-gray-500">{type.available} rooms available</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹ {type.price}</div>
                          <div className="text-xs text-gray-500">
                            Min ₹ {type.minPrice.toFixed(2)}
                            <br />
                            Max ₹ {type.maxPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Billing Details */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-6">Billing Details</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="billingName">Billing Name</Label>
              <Input
                id="billingName"
                placeholder="Enter Billing Name"
                value={billingDetails.billingName}
                onChange={(e) => setBillingDetails({ ...billingDetails, billingName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestTaxNumber">Guest Tax Number</Label>
              <Input
                id="guestTaxNumber"
                placeholder="Enter Tax Number"
                value={billingDetails.guestTaxNumber}
                onChange={(e) => setBillingDetails({ ...billingDetails, guestTaxNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                placeholder="Enter Billing Address"
                value={billingDetails.billingAddress}
                onChange={(e) => setBillingDetails({ ...billingDetails, billingAddress: e.target.value })}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
