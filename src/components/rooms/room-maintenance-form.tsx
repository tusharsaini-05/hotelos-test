"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2, Wrench } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID is required" }),
  estimatedDays: z.coerce.number().int().min(1, { message: "Estimated days must be at least 1" }),
  maintenanceNotes: z.string().min(5, { message: "Please provide maintenance details" }),
})

type FormValues = z.infer<typeof formSchema>

type RoomMaintenanceFormProps = {
  onSuccess: () => void
}

export default function RoomMaintenanceForm({ onSuccess }: RoomMaintenanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rooms, setRooms] = useState([
    { id: "67a47d32329751d24b9742e1", number: "301", type: "Deluxe" },
    { id: "67a47d32329751d24b9742e2", number: "302", type: "Standard" },
    { id: "67a47d32329751d24b9742e3", number: "303", type: "Suite" },
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      estimatedDays: 1,
      maintenanceNotes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be your actual mutation call
      /*
      const response = await markRoomMaintenance({
        variables: {
          roomId: values.roomId,
          estimatedDays: values.estimatedDays,
          maintenanceNotes: values.maintenanceNotes,
        }
      });
      */

      onSuccess()
      form.reset()
    } catch (err) {
      setError("Failed to mark room for maintenance. Please try again.")
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
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-start gap-3">
              <Wrench className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Maintenance Mode</h3>
                <p className="text-amber-700 text-sm">
                  This will mark the room as under maintenance and make it unavailable for bookings.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Room</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.number} - {room.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Days</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>Estimated number of days the room will be under maintenance</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenanceNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the maintenance required..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>Provide details about the maintenance issue and work required</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Marking for Maintenance...
                  </>
                ) : (
                  "Mark for Maintenance"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

