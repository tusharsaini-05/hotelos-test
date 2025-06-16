"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Bed, CreditCard } from "lucide-react"
import BookingForm from "@/components/bookings/createbooking/booking-form"
import { useHotelContext } from "@/providers/hotel-provider"

// Function to get pricing config from localStorage
function getPricingConfig(hotelId: string) {
  try {
    const configKey = `pricingConfig_${hotelId}`;
    return JSON.parse(localStorage.getItem(configKey) || '{}');
  } catch (error) {
    console.error("Error getting pricing config from localStorage:", error);
    return {};
  }
}

export default function CreateBookingPage() {
  const { selectedHotel } = useHotelContext()
  const [pricingSummary, setPricingSummary] = useState<
    Record<string, { basePrice: number; minPrice: number; maxPrice: number }>
  >({})

  useEffect(() => {
    if (selectedHotel?.id) {
      fetchPricingSummary()
    }
  }, [selectedHotel])

  const fetchPricingSummary = async () => {
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
      roomType
      pricePerNight
    }
  }
`,
        }),
      })

      const result = await response.json()

      if (result.data && result.data.rooms) {
        // Group rooms by type and calculate pricing
        const roomTypeGroups = result.data.rooms.reduce((acc: any, room: any) => {
          const roomType = room.roomType
          if (!acc[roomType]) {
            acc[roomType] = {
              prices: [],
              totalRooms: 0,
            }
          }
          acc[roomType].prices.push(room.pricePerNight || 1000)
          acc[roomType].totalRooms += 1
          return acc
        }, {})

        // Get pricing configuration from localStorage
        const pricingConfig = getPricingConfig(selectedHotel?.id || '');
        
        // Calculate pricing data for each room type
        const pricingMap: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {}

        Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
          const avgPrice = data.prices.reduce((sum: number, price: number) => sum + price, 0) / data.totalRooms

          // Check if we have pricing configuration for this room type
          const roomConfig = pricingConfig[typeName];

          if (roomConfig) {
            // Use the configured pricing
            pricingMap[typeName] = {
              basePrice: roomConfig.basePrice,
              minPrice: roomConfig.minPrice,
              maxPrice: roomConfig.maxPrice
            };
          } else {
            // For STANDARD room type
            if (typeName === "STANDARD") {
              pricingMap[typeName] = {
                basePrice: 500,
                minPrice: 250,
                maxPrice: 1000,
              }
            }
            // For DELUXE room type
            else if (typeName === "DELUXE") {
              pricingMap[typeName] = {
                basePrice: 300,
                minPrice: 150,
                maxPrice: 600,
              }
            }
            // For SUITE room type
            else if (typeName === "SUITE") {
              pricingMap[typeName] = {
                basePrice: 2000,
                minPrice: 1000,
                maxPrice: 4000,
              }
            }
            // For other room types
            else {
              pricingMap[typeName] = {
                basePrice: Math.round(avgPrice),
                minPrice: Math.round(avgPrice * 0.5),
                maxPrice: Math.round(avgPrice * 2),
              }
            }
          }
        })

        setPricingSummary(pricingMap)
      }
    } catch (error) {
      console.error("Error fetching pricing summary:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
          <p className="text-muted-foreground">Add a new reservation to the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          <BookingForm
            onSuccess={() => {
              // Handle successful booking creation
              console.log("Booking created successfully")
            }}
          />
        </div>

        {/* Pricing Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Room Rates
              </CardTitle>
              <CardDescription>Base pricing for available room categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(pricingSummary).map(([roomType, pricing]) => (
                <div key={roomType} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{roomType}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Bed className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
                  </div>
                </div>
              ))}

              {Object.keys(pricingSummary).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Loading pricing information...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Booking Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p>Prices shown are base rates and may vary based on demand and season</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p>Weekend rates may apply for Friday, Saturday, and Sunday</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <p>Final price will be calculated based on selected dates and occupancy</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p>Special offers and discounts may be available during booking</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Room Types:</span>
                  <span className="font-medium">{Object.keys(pricingSummary).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starting From:</span>
                  <span className="font-medium text-green-600">
                    ฿{Math.min(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium Rates:</span>
                  <span className="font-medium text-blue-600">
                    ฿{Math.max(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}