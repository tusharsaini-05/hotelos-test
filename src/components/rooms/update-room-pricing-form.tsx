"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, DollarSign, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID is required" }),
  pricePerNight: z.coerce.number().positive({ message: "Price must be a positive number" }),
  extraBedPrice: z.coerce.number().nonnegative({ message: "Extra bed price must be a non-negative number" }),
})

type FormValues = z.infer<typeof formSchema>

type UpdateRoomPricingFormProps = {
  onSuccess: () => void
}

export default function UpdateRoomPricingForm({ onSuccess }: UpdateRoomPricingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rooms, setRooms] = useState([
    { id: "67a47d32329751d24b9742e1", number: "301", type: "Deluxe", currentPrice: 200, extraBedPrice: 50 },
    { id: "67a47d32329751d24b9742e2", number: "302", type: "Standard", currentPrice: 150, extraBedPrice: 40 },
    { id: "67a47d32329751d24b9742e3", number: "303", type: "Suite", currentPrice: 300, extraBedPrice: 60 },
  ])

  const [selectedRoom, setSelectedRoom] = useState<any>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      pricePerNight: 0,
      extraBedPrice: 0,
    },
  })

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      setSelectedRoom(room)
      form.setValue("pricePerNight", room.currentPrice)
      form.setValue("extraBedPrice", room.extraBedPrice)
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be your actual mutation call
      /*
      const response = await updateRoomPricing({
        variables: {
          roomId: values.roomId,
          pricePerNight: values.pricePerNight,
          extraBedPrice: values.extraBedPrice,
        }
      });
      */

      onSuccess()
      form.reset()
      setSelectedRoom(null)
    } catch (err) {
      setError("Failed to update room pricing. Please try again.")
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
          <CardContent className="pt-6 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Pricing Update</h3>
                <p className="text-green-700 text-sm">
                  Update the pricing for a room. This will affect future bookings only.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Room</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleRoomChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.number} - {room.type} (${room.currentPrice})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRoom && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Night ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>Current price: ${selectedRoom.currentPrice}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extraBedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extra Bed Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>Current extra bed price: ${selectedRoom.extraBedPrice}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !selectedRoom}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Pricing...
                  </>
                ) : (
                  "Update Pricing"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

