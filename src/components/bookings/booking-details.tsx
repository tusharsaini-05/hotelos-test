"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { MoreVertical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomUpgradeModal } from "./room-upgrade-modal"

interface BookingDetailsProps {
  bookingId: string
  onBack: () => void
}

export function BookingDetails({ bookingId, onBack }: BookingDetailsProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  return (
    <div className="container mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
      </Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bookings  {`>`} {bookingId}</p>
                  <h2 className="mt-1 text-xl font-semibold">1st Stay at OYO</h2>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Sumeet</h3>
                  <p className="text-gray-500">2 Guests · 1 Room · 1 Night</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-red-500">
                    Edit Details
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600">Checkin Now</Button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">1 Night</p>
                    <p className="text-sm text-gray-500">29 Mar - 30 Mar</p>
                  </div>
                  <div className="text-right">
                    <Button variant="link" className="text-red-500">
                      Extend
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">2 Guests</p>
                    <p className="text-sm text-gray-500">1 Adult, 1 Kid</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Room 1</p>
                    <p className="text-sm text-gray-500">
                      29 Mar - 30 Mar
                      <br />
                      Edited Single Bed
                      <br />1 PAX
                    </p>
                  </div>
                  <div className="text-right">
                    <Button variant="link" className="text-red-500" onClick={() => setIsUpgradeModalOpen(true)}>
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Price Summary</CardTitle>
                <span className="text-sm text-green-500">Pay at Hotel</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <Button variant="outline" className="w-full justify-between">
                  <span>Total Bill</span>
                  <span>$ 400</span>
                </Button>
                <div className="mt-4 px-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Single Bed</span>
                    <span>$ 400</span>
                  </div>
                  <div className="text-sm text-gray-500">1 Room Night x $ 400.00</div>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span>Payment Collected</span>
                <span>$ 0</span>
              </div>

              <div className="mt-4 flex justify-between border-t pt-4">
                <span>Security Deposit</span>
                <span>-</span>
              </div>

              <div className="mt-4 flex justify-between border-t pt-4">
                <span>Balance to Collect</span>
                <span className="font-medium">$ 400</span>
              </div>

              <Button className="mt-6 w-full bg-green-500 hover:bg-green-600">Collect Payment</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {isUpgradeModalOpen && <RoomUpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

