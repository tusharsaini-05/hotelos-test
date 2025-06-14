"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, ChevronDown } from "lucide-react"
import RoomBlock from "./room-block"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock room data
const roomData = [
  {
    id: "room-1",
    name: "Superior Double",
    description: "Spacious room with a double bed and city view",
    price: 2135,
    capacity: 2,
    amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Hairdryer"],
    images: ["/placeholder.svg?height=192&width=384"],
    available: 8,
  },
  {
    id: "room-2",
    name: "Deluxe Double",
    description: "Luxurious room with a king-size bed and premium amenities",
    price: 2648,
    capacity: 2,
    amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Hairdryer", "Bathtub", "Balcony"],
    images: ["/placeholder.svg?height=192&width=384"],
    available: 5,
  },
  {
    id: "room-3",
    name: "Executive Suite",
    description: "Elegant suite with separate living area and panoramic views",
    price: 3450,
    capacity: 3,
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "TV",
      "Mini Bar",
      "Safe",
      "Hairdryer",
      "Bathtub",
      "Balcony",
      "Living Area",
      "Coffee Machine",
    ],
    images: ["/placeholder.svg?height=192&width=384"],
    available: 2,
  },
  {
    id: "room-4",
    name: "Family Room",
    description: "Comfortable room with two double beds, perfect for families",
    price: 2950,
    capacity: 4,
    amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Hairdryer", "Extra Beds"],
    images: ["/placeholder.svg?height=192&width=384"],
    available: 3,
  },
  {
    id: "room-5",
    name: "Standard Single",
    description: "Cozy room with a single bed, perfect for solo travelers",
    price: 1850,
    capacity: 1,
    amenities: ["Free WiFi", "Air Conditioning", "TV", "Safe", "Hairdryer"],
    images: ["/placeholder.svg?height=192&width=384"],
    available: 10,
  },
]

interface RoomGridProps {
  onRoomSelection: (selectedRooms: { id: string; quantity: number; price: number }[]) => void
  initialSelections?: { id: string; quantity: number }[]
}

export default function RoomGrid({ onRoomSelection, initialSelections = [] }: RoomGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-asc")
  const [filterCapacity, setFilterCapacity] = useState<number | null>(null)
  const [filterAmenities, setFilterAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRooms, setSelectedRooms] = useState<{ id: string; quantity: number }[]>(initialSelections)

  // Get all unique amenities from room data
  const allAmenities = Array.from(new Set(roomData.flatMap((room) => room.amenities))).sort()

  // Handle room selection
  const handleRoomSelect = (roomId: string, quantity: number) => {
    const updatedSelections = selectedRooms.filter((room) => room.id !== roomId)
    if (quantity > 0) {
      updatedSelections.push({ id: roomId, quantity })
    }
    setSelectedRooms(updatedSelections)

    // Pass selected rooms with price information to parent
    const roomsWithPrices = updatedSelections.map((selection) => {
      const roomInfo = roomData.find((room) => room.id === selection.id)
      return {
        id: selection.id,
        quantity: selection.quantity,
        price: roomInfo ? roomInfo.price : 0,
      }
    })

    onRoomSelection(roomsWithPrices)
  }

  // Filter and sort rooms
  const filteredRooms = roomData
    .filter((room) => {
      // Search filter
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Capacity filter
      const matchesCapacity = filterCapacity ? room.capacity >= filterCapacity : true

      // Amenities filter
      const matchesAmenities =
        filterAmenities.length === 0 || filterAmenities.every((amenity) => room.amenities.includes(amenity))

      return matchesSearch && matchesCapacity && matchesAmenities
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "capacity-asc":
          return a.capacity - b.capacity
        case "capacity-desc":
          return b.capacity - a.capacity
        case "availability-asc":
          return a.available - b.available
        case "availability-desc":
          return b.available - a.available
        default:
          return 0
      }
    })

  // Get quantity for a room
  const getSelectedQuantity = (roomId: string) => {
    const selection = selectedRooms.find((room) => room.id === roomId)
    return selection ? selection.quantity : 0
  }

  // Toggle amenity filter
  const toggleAmenity = (amenity: string) => {
    setFilterAmenities((current) => {
      if (current.includes(amenity)) {
        return current.filter((a) => a !== amenity)
      } else {
        return [...current, amenity]
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search rooms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="capacity-asc">Capacity: Low to High</SelectItem>
              <SelectItem value="capacity-desc">Capacity: High to Low</SelectItem>
              <SelectItem value="availability-asc">Availability: Low to High</SelectItem>
              <SelectItem value="availability-desc">Availability: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className="ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Guest Capacity</h4>
                  <Select
                    value={filterCapacity?.toString() || "any"}
                    onValueChange={(value) => setFilterCapacity(value === "any" ? null : Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any capacity</SelectItem>
                      <SelectItem value="1">1+ person</SelectItem>
                      <SelectItem value="2">2+ people</SelectItem>
                      <SelectItem value="3">3+ people</SelectItem>
                      <SelectItem value="4">4+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filterAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterCapacity(null)
                      setFilterAmenities([])
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} found
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomBlock
            key={room.id}
            id={room.id}
            name={room.name}
            description={room.description}
            price={room.price}
            capacity={room.capacity}
            amenities={room.amenities}
            images={room.images}
            available={room.available}
            onSelect={handleRoomSelect}
            selected={getSelectedQuantity(room.id)}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No rooms match your criteria</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  )
}
