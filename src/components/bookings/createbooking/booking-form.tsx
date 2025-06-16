"use client"
import { useMutation } from "@apollo/client"
import { CREATE_BOOKING } from "@/graphql/booking/mutations"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { format, addDays } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useHotelContext } from "@/providers/hotel-provider"

// Room types from backend enum
const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"] as const

const bookingSourceOptions = [
  { value: "WEBSITE", label: "Website" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "PHONE", label: "Phone" },
  { value: "DIRECT", label: "Direct" },
  { value: "OTA", label: "Online Travel Agency" },
  { value: "CORPORATE", label: "Corporate" },
]

const bookingSchema = z.object({
  checkInDate: z.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.date({ required_error: "Check-out date is required" }),
  numberOfGuests: z.coerce.number().int().min(1, { message: "At least 1 guest is required" }),
  bookingSource: z.enum(["DIRECT", "WEBSITE", "OTA", "PHONE", "WALK_IN", "CORPORATE"], {
    required_error: "Booking source is required",
  }),
  specialRequests: z.string().optional(),
  guest: z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(5, { message: "Phone number is required" }),
  }),
  roomTypeBookings: z
    .array(
      z.object({
        roomType: z.enum(ROOM_TYPES, { required_error: "Room type is required" }),
        numberOfRooms: z.coerce.number().int().min(1, { message: "At least 1 room is required" }),
      }),
    )
    .min(1, { message: "At least one room type must be selected" }),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingFormProps {
  onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [createBooking, { loading }] = useMutation(CREATE_BOOKING)
  const { toast } = useToast()
  const today = new Date()

  // Pricing data state
  const [pricingData, setPricingData] = useState<
    Record<string, { basePrice: number; minPrice: number; maxPrice: number }>
  >({})
  const [pricingLoading, setPricingLoading] = useState(true)

  // Access hotel context
  const { selectedHotel } = useHotelContext()

  // Fetch pricing data
  useEffect(() => {
    if (selectedHotel?.id) {
      fetchPricingData()
    }
  }, [selectedHotel])

  const fetchPricingData = async () => {
    setPricingLoading(true)

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

        // Calculate pricing data for each room type
        const pricingMap: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {}

        Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
          const avgPrice = data.prices.reduce((sum: number, price: number) => sum + price, 0) / data.totalRooms

          pricingMap[typeName] = {
            basePrice: Math.round(avgPrice),
            minPrice: Math.round(avgPrice * 0.5), // 50% of avg as min
            maxPrice: Math.round(avgPrice * 2), // 200% of avg as max
          }
        })

        setPricingData(pricingMap)
      }
    } catch (error) {
      console.error("Error fetching pricing data:", error)
      toast({
        title: "Warning",
        description: "Could not load pricing data. Using default prices.",
        variant: "destructive",
      })
    } finally {
      setPricingLoading(false)
    }
  }

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkInDate: today,
      checkOutDate: addDays(today, 1),
      numberOfGuests: 2,
      bookingSource: "WALK_IN",
      guest: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      roomTypeBookings: [{ roomType: "STANDARD", numberOfRooms: 1 }],
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypeBookings",
  })

  const watchRoomTypeBookings = useWatch({
    control,
    name: "roomTypeBookings",
  })

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedHotel?.id) {
      toast({
        title: "Error",
        description: "No hotel selected",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await createBooking({
        variables: {
          bookingData: {
            ...data,
            hotelId: selectedHotel.id,
            ratePlan: "standard", // Default rate plan
          },
        },
      })

      toast({
        title: "Booking Created",
        description: `Booking #${result.data.createBooking.bookingNumber} created successfully`,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      })
    }
  }

  if (pricingLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading pricing information...</span>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Guest Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guest.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Stay Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const checkInDate = form.getValues("checkInDate")
                            return date <= checkInDate
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookingSourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Room Selection</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Room Type
              </Button>
            </div>

            {fields.map((field, index) => {
              const currentRoomType = watchRoomTypeBookings?.[index]?.roomType ?? ""
              const pricing = pricingData[currentRoomType]

              return (
                <div key={field.id} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Room Type {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`roomTypeBookings.${index}.roomType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ROOM_TYPES.map((type) => {
                                const typePricing = pricingData[type]
                                return (
                                  <SelectItem key={type} value={type}>
                                    <div className="flex flex-col">
                                      <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                                      {typePricing && (
                                        <div className="text-xs text-gray-500">
                                          ฿{typePricing.basePrice} (฿{typePricing.minPrice} - ฿{typePricing.maxPrice})
                                        </div>
                                      )}
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`roomTypeBookings.${index}.numberOfRooms`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Rooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Pricing Display */}
                  {pricing && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-semibold text-green-600">
                            ฿{pricing.basePrice}
                            <span className="text-sm font-normal text-gray-500 ml-1">per night</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {watchRoomTypeBookings?.[index]?.numberOfRooms || 1} room(s)
                          </div>
                          <div className="text-lg font-semibold">
                            ฿{pricing.basePrice * (watchRoomTypeBookings?.[index]?.numberOfRooms || 1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {fields.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No room types added</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Room Type
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Special Requests</h3>
            </div>

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or requirements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional: Add any special requests for the stay</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="mt-6 pt-6 flex justify-end">
          <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              "Create Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
