"use client"

import { useState } from "react"
import { X, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Room {
  id: number
  roomNo: string
  category: string
  floorNo: string
}

interface EditFloorModalProps {
  isOpen: boolean
  onClose: () => void
  floorNumber: number
}

export function EditFloorModal({ isOpen, onClose, floorNumber }: EditFloorModalProps) {
  const [rooms] = useState<Room[]>([
    { id: 1, roomNo: "201", category: "Premiere Deluxe Double", floorNo: "Floor 2" },
    { id: 2, roomNo: "202", category: "Superior Triple", floorNo: "Floor 2" },
    { id: 3, roomNo: "203", category: "Superior Double", floorNo: "Floor 2" },
    { id: 4, roomNo: "204", category: "Superior Double", floorNo: "Floor 2" },
    { id: 5, roomNo: "205", category: "Superior Double", floorNo: "Floor 2" },
    { id: 6, roomNo: "206", category: "Superior Double", floorNo: "Floor 2" },
    { id: 7, roomNo: "207", category: "Suite", floorNo: "Floor 2" },
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Floor {floorNumber}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Room Details</h2>
            <Button variant="outline">View Definitions</Button>
          </div>

          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please review and edit room numbers & floor numbers as required</AlertDescription>
          </Alert>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-3">Room No.</div>
                <div className="col-span-5">Room Category</div>
                <div className="col-span-4">Floor No.</div>
              </div>

              {rooms.map((room) => (
                <div key={room.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <Input defaultValue={room.roomNo} />
                  </div>
                  <div className="col-span-5">
                    <Select defaultValue={room.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Premiere Deluxe Double">Premiere Deluxe Double</SelectItem>
                        <SelectItem value="Superior Triple">Superior Triple</SelectItem>
                        <SelectItem value="Superior Double">Superior Double</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Select defaultValue={room.floorNo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Floor 1">Floor 1</SelectItem>
                        <SelectItem value="Floor 2">Floor 2</SelectItem>
                        <SelectItem value="Floor 3">Floor 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

