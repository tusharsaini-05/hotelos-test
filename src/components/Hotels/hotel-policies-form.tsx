"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const paymentMethods = [
  { id: "CREDIT_CARD", label: "Credit Card" },
  { id: "DEBIT_CARD", label: "Debit Card" },
  { id: "CASH", label: "Cash" },
  { id: "CRYPTO", label: "Cryptocurrency" },
  { id: "BANK_TRANSFER", label: "Bank Transfer" },
  { id: "PAYPAL", label: "PayPal" },
]

const petPolicyOptions = [
  { value: "ALLOWED", label: "Pets Allowed" },
  { value: "ALLOWED_WITH_FEE", label: "Pets Allowed with Fee" },
  { value: "ALLOWED_WITH_RESTRICTIONS", label: "Pets Allowed with Restrictions" },
  { value: "NOT_ALLOWED", label: "Pets Not Allowed" },
]

const formSchema = z.object({
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  checkOutTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  cancellationHours: z.coerce.number().int().min(0, {
    message: "Cancellation hours must be a positive number.",
  }),
  paymentMethods: z.array(z.string()).min(1, {
    message: "Select at least one payment method.",
  }),
  petPolicy: z.string(),
})

type HotelPoliciesFormProps = {
  hotel: any
  onSuccess: () => void
}

export default function HotelPoliciesForm({ hotel, onSuccess }: HotelPoliciesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkInTime: hotel.policies.checkInTime,
      checkOutTime: hotel.policies.checkOutTime,
      cancellationHours: hotel.policies.cancellationHours,
      paymentMethods: hotel.policies.paymentMethods,
      petPolicy: hotel.policies.petPolicy,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be your actual mutation call
      /*
      const response = await updateHotelPolicies({
        variables: {
          hotelId: hotel.id,
          policies: {
            checkInTime: values.checkInTime,
            checkOutTime: values.checkOutTime,
            cancellationHours: values.cancellationHours,
            paymentMethods: values.paymentMethods,
            petPolicy: values.petPolicy,
          }
        }
      });
      */

      onSuccess()
    } catch (err) {
      setError("Failed to update hotel policies. Please try again.")
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="checkInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in Time</FormLabel>
                <FormControl>
                  <Input placeholder="14:00" {...field} />
                </FormControl>
                <FormDescription>Format: 24-hour (HH:MM)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out Time</FormLabel>
                <FormControl>
                  <Input placeholder="11:00" {...field} />
                </FormControl>
                <FormDescription>Format: 24-hour (HH:MM)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cancellationHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Period</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormDescription>Hours before check-in</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="petPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {petPolicyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Define your hotel's policy regarding pets.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethods"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Accepted Payment Methods</FormLabel>
                <FormDescription>Select all payment methods accepted by your hotel.</FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <FormField
                    key={method.id}
                    control={form.control}
                    name="paymentMethods"
                    render={({ field }) => {
                      return (
                        <FormItem key={method.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(method.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, method.id])
                                  : field.onChange(field.value?.filter((value) => value !== method.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{method.label}</FormLabel>
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Policies"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

