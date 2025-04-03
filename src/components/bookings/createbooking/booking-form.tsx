"use client"

import React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

// Mock room data for dropdown
const mockRooms = [
  { id: "room-1", roomNumber: "101", type: "Standard", price: 100 },
  { id: "room-2", roomNumber: "102", type: "Deluxe", price: 150 },
  { id: "room-3", roomNumber: "201", type: "Suite", price: 250 },
  { id: "room-4", roomNumber: "202", type: "Standard", price: 100 },
  { id: "room-5", roomNumber: "301", type: "Deluxe", price: 150 },
]

const formSchema = z.object({
  hotelId: z.string().min(1, { message: "Hotel ID is required" }),
  roomId: z.string().min(1, { message: "Room is required" }),
  guestFirstName: z.string().min(1, { message: "First name is required" }),
  guestLastName: z.string().min(1, { message: "Last name is required" }),
  guestEmail: z.string().email({ message: "Invalid email address" }),
  guestPhone: z.string().min(5, { message: "Phone number is required" }),
  checkInDate: z.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.date({ required_error: "Check-out date is required" }),
  adults: z.coerce.number().int().min(1, { message: "At least 1 adult is required" }),
  children: z.coerce.number().int().min(0),
  specialRequests: z.string().optional(),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  extraBed: z.boolean().default(false),
  totalAmount: z.coerce.number().positive({ message: "Total amount must be positive" }),
})

type FormValues = z.infer<typeof formSchema>

type BookingFormProps = {
  hotelId: string
  hotelName: string
  roomId?: string
  roomNumber?: string
  onSuccess: () => void
}

export default function BookingForm({ hotelId, hotelName, roomId, roomNumber, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find the selected room from mock data if roomId is provided
  const selectedRoom = roomId
    ? mockRooms.find((r) => r.id === roomId)
    : roomNumber
      ? mockRooms.find((r) => r.roomNumber === roomNumber)
      : null

  const today = new Date()
  const tomorrow = addDays(today, 1)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelId,
      roomId: selectedRoom?.id || "",
      guestFirstName: "",
      guestLastName: "",
      guestEmail: "",
      guestPhone: "",
      checkInDate: today,
      checkOutDate: tomorrow,
      adults: 1,
      children: 0,
      specialRequests: "",
      paymentMethod: "CREDIT_CARD",
      extraBed: false,
      totalAmount: selectedRoom?.price || 0,
    },
  })

  // Calculate total amount when relevant fields change
  const watchCheckInDate = form.watch("checkInDate")
  const watchCheckOutDate = form.watch("checkOutDate")
  const watchRoomId = form.watch("roomId")
  const watchExtraBed = form.watch("extraBed")

  // Calculate nights
  const nights = Math.max(
    1,
    Math.ceil((watchCheckOutDate.getTime() - watchCheckInDate.getTime()) / (1000 * 60 * 60 * 24)),
  )

  // Find room price
  const selectedRoomPrice = mockRooms.find((r) => r.id === watchRoomId)?.price || 0

  // Calculate total
  const extraBedFee = watchExtraBed ? 50 : 0
  const totalAmount = selectedRoomPrice * nights + extraBedFee

  // Use useEffect to update the form value after rendering
  React.useEffect(() => {
    if (form.getValues("totalAmount") !== totalAmount) {
      form.setValue("totalAmount", totalAmount)
    }
  }, [form, totalAmount])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // This would be your actual mutation call
      /*
      const response = await createBooking({
        variables: {
          bookingData: {
            hotelId: values.hotelId,
            roomId: values.roomId,
            guestFirstName: values.guestFirstName,
            guestLastName: values.guestLastName,
            guestEmail: values.guestEmail,
            guestPhone: values.guestPhone,
            checkInDate: values.checkInDate.toISOString(),
            checkOutDate: values.checkOutDate.toISOString(),
            adults: values.adults,
            children: values.children,
            specialRequests: values.specialRequests,
            paymentMethod: values.paymentMethod,
            extraBed: values.extraBed,
            totalAmount: values.totalAmount,
          }
        }
      });
      */

      console.log("Booking created:", values)
      onSuccess()
    } catch (err) {
      setError("Failed to create booking. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Booking Details</h3>
              <p className="text-sm text-muted-foreground">Hotel: {hotelName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedRoom}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.roomNumber} - {room.type} (${room.price}/night)
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
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Guest Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guestFirstName"
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
                name="guestLastName"
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
                name="guestEmail"
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
                name="guestPhone"
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
                          disabled={(date) => date < watchCheckInDate || date < today}
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
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Number of children (under 12 years)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or requirements..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional: Add any special requests for your stay</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="extraBed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Extra Bed</FormLabel>
                      <FormDescription>Add an extra bed for $50 per night</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Payment Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                        <SelectItem value="PAYPAL">PayPal</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CASH">Cash (Pay at Hotel)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} readOnly className="bg-muted" />
                    </FormControl>
                    <FormDescription>
                      {nights} night{nights > 1 ? "s" : ""} × ${selectedRoomPrice}
                      {watchExtraBed ? ` + $50 extra bed fee` : ""}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 pt-6 border-t flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

