"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface RoomUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentRoomType: string
  currentPrice: number
  bookingId: string
}

// Mock upgrade options
const upgradeOptions = [
  {
    id: "upgrade-1",
    roomType: "Deluxe Double",
    originalPrice: 2648,
    upgradePrice: 513,
    description: "Upgrade to a more spacious room with premium amenities",
    features: ["Larger Room (32 sqm)", "Premium Toiletries", "Bathtub", "City View"],
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "upgrade-2",
    roomType: "Executive Suite",
    originalPrice: 3450,
    upgradePrice: 1315,
    description: "Luxury suite with separate living area and panoramic views",
    features: [
      "Separate Living Area",
      "Panoramic Views",
      "Premium Minibar",
      "Nespresso Machine",
      "Bathrobe & Slippers",
    ],
    image: "/placeholder.svg?height=120&width=200",
  },
]

export default function RoomUpgradeModal({
  isOpen,
  onClose,
  currentRoomType,
  currentPrice,
  bookingId,
}: RoomUpgradeModalProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = () => {
    if (!selectedUpgrade) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Room Upgraded Successfully",
        description: `Booking ${bookingId} has been upgraded to ${upgradeOptions.find((option) => option.id === selectedUpgrade)?.roomType}`,
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Upgrade Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Current Room</h3>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{currentRoomType}</p>
                <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{currentPrice.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per night</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Available Upgrades</h3>
            <div className="space-y-4">
              {upgradeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedUpgrade === option.id ? "border-green-500 bg-green-50" : "hover:border-slate-400"
                  }`}
                  onClick={() => setSelectedUpgrade(option.id)}
                >
                  <div className="flex gap-4">
                    <div className="w-[120px] h-[80px] rounded-md overflow-hidden">
                      <img
                        src={option.image || "/placeholder.svg"}
                        alt={option.roomType}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{option.roomType}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{option.originalPrice.toLocaleString()}</div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            +₹{option.upgradePrice} upgrade
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {option.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <Check className="h-3 w-3" /> {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedUpgrade === option.id && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Upgrade Summary</h3>
            {selectedUpgrade ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Room Price:</span>
                  <span>₹{currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Upgrade Fee:</span>
                  <span>
                    +₹{upgradeOptions.find((option) => option.id === selectedUpgrade)?.upgradePrice.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>New Room Price:</span>
                  <span>
                    ₹
                    {(
                      currentPrice + (upgradeOptions.find((option) => option.id === selectedUpgrade)?.upgradePrice || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select an upgrade option to see the summary</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={!selectedUpgrade || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : "Confirm Upgrade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
