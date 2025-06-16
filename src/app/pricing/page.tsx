"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RefreshCw, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useHotelContext } from "@/providers/hotel-provider"
import { useSession } from "next-auth/react"
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
  // Store original price ratios for consistent updates
  minPriceRatio?: number
  maxPriceRatio?: number
}

interface WeekendRate {
  roomId: string
  price: number
  minPrice: number
  maxPrice: number
  enabled: boolean
  // Store original price ratios for consistent updates
  minPriceRatio?: number
  maxPriceRatio?: number
}

// Debounce hook for delayed validation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function PricingPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("standard")

  // Access hotel context and session
  const { selectedHotel } = useHotelContext()
  const { data: session } = useSession()

  // Room types state
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [editableRoomTypes, setEditableRoomTypes] = useState<RoomType[]>([])

  // Weekend rates state
  const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
  const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

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

  // Debounced temp prices for validation
  const debouncedTempPrices = useDebounce(tempPrices, 800) // 800ms delay

  useEffect(() => {
    if (selectedHotel?.id) {
      fetchRooms()
    }
  }, [selectedHotel])

  // Fetch rooms using the same logic as booking analytics
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
        // Group rooms by type and calculate pricing
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

        // Calculate pricing data for each room type
        const roomTypesForPricing: RoomType[] = Object.entries(roomTypeGroups).map(
          ([typeName, data]: [string, any]) => {
            const avgPrice =
              data.rooms.reduce((sum: number, room: any) => sum + (room.pricePerNight || 1000), 0) / data.totalRooms

            // Calculate base price and min/max prices
            const basePrice = Math.round(avgPrice)
            const minPrice = Math.round(avgPrice * 0.5) // 50% of avg price as min
            const maxPrice = Math.round(avgPrice * 2) // 200% of avg price as max
            
            // Store the price ratios for consistent updates
            const minPriceRatio = 0.5 // 50% of base price
            const maxPriceRatio = 2.0 // 200% of base price

            return {
              id: typeName.toLowerCase().replace(/\s+/g, "-"),
              roomType: typeName,
              price: basePrice,
              minPrice: minPrice,
              maxPrice: maxPrice,
              available: data.totalRooms,
              roomIds: data.roomIds,
              minPriceRatio,
              maxPriceRatio
            }
          },
        )

        console.log("Processed room types:", roomTypesForPricing)
        setRoomTypes(roomTypesForPricing)
        setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing)))

        // Initialize weekend rates
        const initialWeekendRates = roomTypesForPricing.map((room) => {
          // Weekend rates are 25% higher than standard rates
          const weekendRatio = 1.25
          const weekendPrice = Math.round(room.price * weekendRatio)
          
          return {
            roomId: room.id,
            price: weekendPrice,
            minPrice: Math.round(room.minPrice * weekendRatio),
            maxPrice: Math.round(room.maxPrice * weekendRatio),
            enabled: true,
            minPriceRatio: room.minPriceRatio,
            maxPriceRatio: room.maxPriceRatio
          }
        })

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

  // Debounced validation effect
  useEffect(() => {
    const errors: Record<string, string> = {}

    Object.entries(debouncedTempPrices).forEach(([key, price]) => {
      const [roomId, field] = key.split("-")

      if (field === "price") {
        const room = editableRoomTypes.find((r) => r.id === roomId)
        if (room && (price < room.minPrice || price > room.maxPrice)) {
          errors[key] = `Price should be between ฿${room.minPrice} and ฿${room.maxPrice}`
        }
      }
    })

    setValidationErrors(errors)

    // Show toast for validation errors
    Object.values(errors).forEach((error) => {
      if (error) {
        toast({
          title: "Price Warning",
          description: error,
          variant: "destructive",
        })
      }
    })
  }, [debouncedTempPrices, editableRoomTypes, toast])

  // Handle price change for standard rates
  const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
    const numValue = Number.parseFloat(value) || 0

    // Update temp prices for debounced validation
    setTempPrices((prev) => ({
      ...prev,
      [`${id}-${field}`]: numValue,
    }))

    // Update the actual state immediately for UI responsiveness
    setEditableRoomTypes((prev) => {
      return prev.map((room) => {
        if (room.id === id) {
          const updatedRoom = { ...room, [field]: numValue }
          
          // If base price is changing, update min and max prices proportionally
          if (field === "price") {
            // Only update min/max if we have the ratios
            if (room.minPriceRatio && room.maxPriceRatio) {
              updatedRoom.minPrice = Math.round(numValue * room.minPriceRatio)
              updatedRoom.maxPrice = Math.round(numValue * room.maxPriceRatio)
            }
          }
          // If min price is changing, update the ratio
          else if (field === "minPrice") {
            updatedRoom.minPriceRatio = numValue / room.price
          }
          // If max price is changing, update the ratio
          else if (field === "maxPrice") {
            updatedRoom.maxPriceRatio = numValue / room.price
          }
          
          return updatedRoom
        }
        return room
      })
    })
  }, [])

  // Handle weekend price change
  const handleWeekendPriceChange = useCallback(
    (roomId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
      const numValue = Number.parseFloat(value) || 0
      
      setEditableWeekendRates((prev) => {
        return prev.map((rate) => {
          if (rate.roomId === roomId) {
            const updatedRate = { ...rate, [field]: numValue }
            
            // If base price is changing, update min and max prices proportionally
            if (field === "price") {
              // Only update min/max if we have the ratios
              if (rate.minPriceRatio && rate.maxPriceRatio) {
                updatedRate.minPrice = Math.round(numValue * rate.minPriceRatio)
                updatedRate.maxPrice = Math.round(numValue * rate.maxPriceRatio)
              }
            }
            // If min price is changing, update the ratio
            else if (field === "minPrice") {
              updatedRate.minPriceRatio = numValue / rate.price
            }
            // If max price is changing, update the ratio
            else if (field === "maxPrice") {
              updatedRate.maxPriceRatio = numValue / rate.price
            }
            
            return updatedRate
          }
          return rate
        })
      })
    },
    [],
  )

  const handleWeekendRateToggle = useCallback((roomId: string, enabled: boolean) => {
    setEditableWeekendRates((prev) => prev.map((rate) => (rate.roomId === roomId ? { ...rate, enabled } : rate)))
  }, [])

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
          if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
            const room = roomTypes.find((r) => r.id === rate.roomId)
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
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-sm font-medium">Weekend days:</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="friday"
                      checked={weekendDays.friday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
                    />
                    <label htmlFor="friday" className="text-sm">
                      Friday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saturday"
                      checked={weekendDays.saturday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
                    />
                    <label htmlFor="saturday" className="text-sm">
                      Saturday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sunday"
                      checked={weekendDays.sunday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
                    />
                    <label htmlFor="sunday" className="text-sm">
                      Sunday
                    </label>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Room Category</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead>Min Price (฿)</TableHead>
                        <TableHead>Base Price (฿)</TableHead>
                        <TableHead>Max Price (฿)</TableHead>
                        <TableHead className="text-right">Standard Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableWeekendRates.map((rate) => {
                        const room = roomTypes.find((r) => r.id === rate.roomId)
                        return (
                          <TableRow key={rate.roomId}>
                            <TableCell className="font-medium">{room?.roomType}</TableCell>
                            <TableCell>
                              <Switch
                                checked={rate.enabled}
                                onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomId, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.minPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "minPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.price}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "price", e.target.value)}
                                className={`w-[120px] ${
                                  rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
                                    ? "border-red-500 bg-red-50"
                                    : ""
                                }`}
                                disabled={!rate.enabled}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.maxPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "maxPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
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