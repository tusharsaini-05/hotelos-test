"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RoomUpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg bg-white p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Select New Room Category</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <RadioGroup defaultValue="premium">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edited" id="edited" />
                <Label htmlFor="edited">Edited Single Bed (2 Avail)</Label>
                <span className="ml-auto text-sm text-gray-500">$0 Extra</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium">Premium Single Bed (2 Avail)</Label>
                <span className="ml-auto text-sm text-gray-500">$100 Extra</span>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-6 flex justify-end">
          <Button className="bg-green-500 hover:bg-green-600">Upgrade</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

