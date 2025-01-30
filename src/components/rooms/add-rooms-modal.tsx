"use client"

import { X, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Floor {
  id: number
  floorNumber: number
  roomsCount: number
}

interface AddRoomsModalProps {
  isOpen: boolean
  onClose: () => void
  onEditFloor: (floorId: number) => void
}

export function AddRoomsModal({ isOpen, onClose, onEditFloor }: AddRoomsModalProps) {
  const floors: Floor[] = [
    { id: 1, floorNumber: 2, roomsCount: 14 },
    { id: 2, floorNumber: 3, roomsCount: 14 },
    // Add more floors as needed
  ]

  const totalRooms = floors.reduce((acc, floor) => acc + floor.roomsCount, 0)
  const totalFloors = floors.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Rooms & Floors</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Total Rooms</div>
              <div className="text-2xl font-bold">{totalRooms}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Total Floors{" "}
                <Button variant="link" className="text-blue-500 p-0">
                  Edit
                </Button>
              </div>
              <div className="text-2xl font-bold">{totalFloors}</div>
            </div>
          </div>

          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please add actual room numbers & assign all rooms to actual floors. Please click on 'Submit changes' below
              to save all changes
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[400px] pr-4">
            {floors.map((floor) => (
              <div key={floor.id} className="mb-4 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">Floor {floor.floorNumber}</div>
                  <div className="text-sm text-gray-500">{floor.roomsCount} Rooms Added</div>
                </div>
                <Button variant="outline" onClick={() => onEditFloor(floor.id)}>
                  Edit Rooms
                </Button>
              </div>
            ))}
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>Submit Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

