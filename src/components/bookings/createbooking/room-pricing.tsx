"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RefreshCw, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useHotelContext } from "@/providers/hotel-provider"
import { useMutation } from "@apollo/client"
import { gql } from "@apollo/client"

// GraphQL mutation for updating room pricing
const UPDATE_ROOM_PRICING = gql`
  mutation UpdateRoomPricing($roomId: String!, $pricePerNight: Float!, $extraBedPrice: Float) {
    updateRoomPricing(roomId: $roomId, pricePerNight: $pricePerNight, extraBedPrice: $extraBedPrice) {
      id
      pricePerNight
      extraBedPrice
    }
  }
`

interface RoomType {
  id: string
  roomType: string
  price: number
  minPrice: number
  maxPrice: number
  available: number
  roomIds: string[]
}

export default function RoomPricing() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("standard")

  // Access hotel context and session
  const { selectedHotel } = useHotelContext()

  // Room types state
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [editableRoomTypes, setEditableRoomTypes] = useState<RoomType[]>([])

  // Weekend rates state
  const [weekendRates, setWeekendRates] = useState<RoomType[]>([])
  const [editableWeekendRates, setEditableWeekendRates] = useState<RoomType[]>([])

  // Weekend days
  const [weekendDays, setWeekendDays] = useState({
    friday: true,
    saturday: true,
    sunday: true,
  })

  // Validation state for debounced warnings
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [tempPrices, setTempPrices] = useState<Record<string, number>>({})

  // Setup mutation hook
  const [updateRoomPricing] = useMutation(UPDATE_ROOM_PRICING, {
    onCompleted: (data) => {
      console.log("Room pricing updated successfully:", data)
    },
    onError: (error) => {
      console.error("Error updating room pricing:", error)
    }
  })

  useEffect(() => {
    if (selectedHotel?.id) {
      fetchRooms()
    }
  }, [selectedHotel])

  // Fetch rooms using GraphQL
  const fetchRooms = async () => {
    setRoomsLoading(true)

    try {
      console.log("Fetching rooms with hotel ID:", selectedHotel?.id)

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

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      if (result.data && result.data.rooms) {
        // Group rooms by room type to create room categories
        const roomTypeGroups = result.data.rooms.reduce((acc: any, room: any) => {
          const roomType = room.roomType
          if (!acc[roomType]) {
            acc[roomType] = {
              rooms: [],
              totalRooms: 0,
              avgPrice: 0,
              roomIds: [],
            }
          }
          acc[roomType].rooms.push(room)
          acc[roomType].totalRooms += 1
          acc[roomType].roomIds.push(room.id)
          return acc
        }, {})

        // Create room types for pricing
        const roomTypesForPricing: RoomType[] = Object.entries(roomTypeGroups).map(
          ([typeName, data]: [string, any]) => {
            const avgPrice =
              data.rooms.reduce((sum: number, room: any) => sum + (room.pricePerNight || 1000), 0) / data.totalRooms

            return {
              id: typeName.toLowerCase().replace(/\s+/g, "-"),
              roomType: typeName,
              price: Math.round(avgPrice),
              minPrice: Math.round(avgPrice * 0.5), // 50% of avg price as min
              maxPrice: Math.round(avgPrice * 2), // 200% of avg price as max
              available: data.totalRooms,
              roomIds: data.roomIds,
            }
          },
        )

        console.log("Processed room types:", roomTypesForPricing)
        setRoomTypes(roomTypesForPricing)
        setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing)))

        // Initialize weekend rates
        const initialWeekendRates = roomTypesForPricing.map((room) => ({
          ...room,
          price: Math.round(room.price * 1.25), // 25% higher than standard rate
          minPrice: Math.round(room.minPrice * 1.25),
          maxPrice: Math.round(room.maxPrice * 1.25),
        }))

        setWeekendRates(initialWeekendRates)
        setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
      } else {
        console.error("Error fetching rooms: No data in response", result)
        setRoomTypes([])
        setEditableRoomTypes([])
      }
    } catch (error: any) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch room information from server.",
        variant: "destructive",
      })
      setRoomTypes([])
      setEditableRoomTypes([])
    } finally {
      setRoomsLoading(false)
    }
  }

  // Handle price change for standard rates
  const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
    const numValue = Number.parseFloat(value) || 0

    // Update temp prices for validation
    setTempPrices((prev) => ({
      ...prev,
      [`${id}-${field}`]: numValue,
    }))

    // Update the actual state immediately for UI responsiveness
    setEditableRoomTypes((prev) => prev.map((room) => (room.id === id ? { ...room, [field]: numValue } : room)))
  }, [])

  // Handle weekend price change
  const handleWeekendPriceChange = useCallback(
    (id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
      const numValue = Number.parseFloat(value) || 0
      setEditableWeekendRates((prev) =>
        prev.map((rate) => (rate.id === id ? { ...rate, [field]: numValue } : rate)),
      )
    },
    [],
  )

  // Save changes to the backend
  const handleSave = async () => {
    setLoading(true)

    try {
      // Validate prices based on active tab
      if (activeTab === "standard") {
        for (const room of editableRoomTypes) {
          if (room.minPrice > room.price || room.price > room.maxPrice) {
            throw new Error(
              `Invalid price range for ${room.roomType}. Min price must be less than base price, and base price must be less than max price.`,
            )
          }
        }

        // Update each room's price in the backend
        for (const roomType of editableRoomTypes) {
          // For each room ID in this room type
          for (const roomId of roomType.roomIds) {
            await updateRoomPricing({
              variables: {
                roomId: roomId,
                pricePerNight: roomType.price,
                extraBedPrice: null // You can add this if needed
              }
            })
          }
        }

        // Update the main state with edited values
        setRoomTypes(editableRoomTypes)
      } else if (activeTab === "weekend") {
        for (const rate of editableWeekendRates) {
          if (rate.minPrice > rate.price || rate.price > rate.maxPrice) {
            const room = roomTypes.find((r) => r.id === rate.id)
            throw new Error(
              `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
            )
          }
        }

        // Here you would implement weekend rate updates
        // This would require a separate mutation or endpoint for weekend rates
        
        // Update the main state with edited values
        setWeekendRates(editableWeekendRates)
      }

      // Clear validation errors and temp prices
      setValidationErrors({})
      setTempPrices({})

      toast({
        title: "Pricing updated",
        description: `Room pricing has been successfully updated for ${activeTab} rate.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update pricing",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (activeTab === "standard") {
      setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
    } else if (activeTab === "weekend") {
      setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
    }

    // Clear validation errors and temp prices
    setValidationErrors({})
    setTempPrices({})

    toast({
      title: "Changes discarded",
      description: "All changes have been reset to the last saved values.",
    })
  }

  const handleRefresh = () => {
    fetchRooms()
  }

  if (roomsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading room categories...</span>
        </div>
      </div>
    )
  }

  if (roomTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Room Pricing Management</h1>
              <p className="text-sm text-gray-500">Configure room rates and weekend pricing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={roomsLoading}>
                <RefreshCw className={`h-4 w-4 ${roomsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Show data status */}
        <div className="mb-4 text-sm text-gray-600">
          <p>
            Found {roomTypes.length} room categories
            {selectedHotel ? ` for ${selectedHotel.name}` : ""}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Pricing Configuration</CardTitle>
            <CardDescription>
              Set the base price, minimum, and maximum pricing for each room category. These values will be used when
              creating bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="standard">Standard Rate</TabsTrigger>
                <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
              </TabsList>

              {/* Standard Rate Tab */}
              <TabsContent value="standard" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Room Category</TableHead>
                        <TableHead>Min Price (฿)</TableHead>
                        <TableHead>Base Price (฿)</TableHead>
                        <TableHead>Max Price (฿)</TableHead>
                        <TableHead className="text-right">Available Rooms</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableRoomTypes.map((room) => {
                        const priceKey = `${room.id}-price`
                        const hasError = validationErrors[priceKey]

                        return (
                          <TableRow key={room.id}>
                            <TableCell className="font-medium">{room.roomType}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.minPrice}
                                onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
                                className="w-[120px]"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.price}
                                onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
                                className={`w-[120px] ${hasError ? "border-red-500 bg-red-50" : ""}`}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.maxPrice}
                                onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
                                className="w-[120px]"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell className="text-right">{room.available}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <p>
                    <strong>Price Range Validation:</strong> Your desired price must be between the minimum and maximum
                    price range.
                  </p>
                  <p className="mt-1">
                    • <strong>Min Price:</strong> Lowest price you're willing to accept
                    <br />• <strong>Base Price:</strong> Your desired/target price
                    <br />• <strong>Max Price:</strong> Highest price for peak demand
                  </p>
                </div>
              </TabsContent>

              {/* Weekend Rate Tab */}
              <TabsContent value="weekend" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Room Category</TableHead>
                        <TableHead>Min Price (฿)</TableHead>
                        <TableHead>Base Price (฿)</TableHead>
                        <TableHead>Max Price (฿)</TableHead>
                        <TableHead className="text-right">Standard Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableWeekendRates.map((rate) => {
                        const room = roomTypes.find((r) => r.id === rate.id)
                        return (
                          <TableRow key={rate.id}>
                            <TableCell className="font-medium">{room?.roomType}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.minPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.id, "minPrice", e.target.value)}
                                className="w-[120px]"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.price}
                                onChange={(e) => handleWeekendPriceChange(rate.id, "price", e.target.value)}
                                className={`w-[120px] ${
                                  rate.price < rate.minPrice || rate.price > rate.maxPrice
                                    ? "border-red-500 bg-red-50"
                                    : ""
                                }`}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.maxPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.id, "maxPrice", e.target.value)}
                                className="w-[120px]"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <p>
                    <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
                    automatically for bookings on weekend days.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}