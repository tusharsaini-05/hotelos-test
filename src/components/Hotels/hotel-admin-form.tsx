"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useHotelContext } from "@/providers/hotel-provider"
import type { Hotel } from "@/providers/hotel-provider"

const formSchema = z.object({
  adminId: z.string().min(1, { message: "Admin ID is required." }),
})

type HotelAdminFormProps = {
  hotel: any
  onSuccess: () => void
}

export default function HotelAdminForm({ hotel, onSuccess }: HotelAdminFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null)
  const { userHotels } = useHotelContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminId: hotel.adminId || "",
    },
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock search results
      setSearchResults([
        {
          id: "67a37b9b346eff546b54277a",
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "67a478ba11c3747c4b3a8bb9",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "67a478ba11c3747c4b3a8bc0",
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const selectAdmin = (admin: any) => {
    setSelectedAdmin(admin)
    form.setValue("adminId", admin.id)
    setSearchResults([])
    setSearchQuery("")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be your actual mutation call
      /*
      const response = await assignHotelAdmin({
        variables: {
          hotelId: hotel.id,
          adminId: values.adminId,
        }
      });
      */

      onSuccess()
    } catch (err) {
      setError("Failed to assign hotel admin. Please try again.")
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
          <CardHeader>
            <CardTitle>Hotel Administrator</CardTitle>
            <CardDescription>Assign an administrator to manage this hotel property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Administrators</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="button" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <Card>
                <CardContent className="p-2">
                  <ul className="divide-y">
                    {searchResults.map((admin) => (
                      <li
                        key={admin.id}
                        className="py-2 px-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => selectAdmin(admin)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={admin.avatar} alt={admin.name} />
                            <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="adminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Administrator</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedAdmin && (
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedAdmin.avatar} alt={selectedAdmin.name} />
                    <AvatarFallback>{selectedAdmin.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedAdmin.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedAdmin.email}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
              "Assign Administrator"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function Label({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
      {...props}
    >
      {children}
    </label>
  )
}

