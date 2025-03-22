"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

const roomStatuses = [
  { value: "AVAILABLE", label: "Available" },
  { value: "OCCUPIED", label: "Occupied" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
]

const formSchema = z.object({
  roomIds: z.array(z.string()).min(1, { message: "Select at least one room" }),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type BulkUpdateRoomFormProps = {
  onSuccess: () => void
}

export default function BulkUpdateRoomForm({ onSuccess }: BulkUpdateRoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rooms, setRooms] = useState([
    { id: "67a47d32329751d24b9742e1", number: "301", type: "Deluxe", floor: 3 },
    { id: "67a47d32329751d24b9742e2", number: "302", type: "Standard", floor: 3 },
    { id: "67a47d32329751d24b9742e3", number: "303", type: "Suite", floor: 3 },
    { id: "67a47d32329751d24b9742e4", number: "401", type: "Deluxe", floor: 4 },
    { id: "67a47d32329751d24b9742e5", number: "402", type: "Standard", floor: 4 },
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomIds: [],
      status: "",
      notes: "",
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
      const response = await bulkUpdateRoomStatus({
        variables: {
          roomIds: values.roomIds,
          status: values.status,
          notes: values.notes || undefined,
        }
      });
      */

      onSuccess()
      form.reset()
    } catch (err) {
      setError("Failed to update rooms. Please try again.")
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
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Bulk Update</h3>
                <p className="text-blue-700 text-sm">
                  Update the status of multiple rooms at once. This is useful for cleaning schedules or maintenance.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="roomIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Rooms</FormLabel>
                    <FormDescription>Select all rooms you want to update</FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rooms.map((room) => (
                      <FormField
                        key={room.id}
                        control={form.control}
                        name="roomIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={room.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(room.id)}
                                  onCheckedChange={(checked: boolean) => {
                                    return checked
                                      ? field.onChange([...field.value, room.id])
                                      : field.onChange(field.value?.filter((value: string) => value !== room.id))
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Room {room.number}</FormLabel>
                                <FormDescription>
                                  {room.type} - Floor {room.floor}
                                </FormDescription>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this bulk update..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Add any relevant information about this status change</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Rooms...
                  </>
                ) : (
                  "Update Rooms"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

