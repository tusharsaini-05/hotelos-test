"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Info, Plus, Minus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RoomBlockProps {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  available: number
  onSelect: (id: string, quantity: number) => void
  selected: number
}

export default function RoomBlock({
  id,
  name,
  description,
  price,
  capacity,
  amenities,
  images,
  available,
  onSelect,
  selected,
}: RoomBlockProps) {
  const [quantity, setQuantity] = useState(selected)

  const handleIncrement = () => {
    if (quantity < available) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onSelect(id, newQuantity)
    }
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onSelect(id, newQuantity)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0] || "/placeholder.svg?height=192&width=384&query=hotel room"}
          alt={name}
          className="w-full h-full object-cover"
        />
        {available < 3 && <Badge className="absolute top-2 right-2 bg-red-500">Only {available} left</Badge>}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="text-right">
            <div className="text-xl font-bold">₹{price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{description}</p>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            Up to {capacity} guests
          </Badge>
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help">
                    <Info className="h-3 w-3 mr-1" /> {amenities.length - 3} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="text-xs">
                    {amenities.slice(3).map((amenity) => (
                      <li key={amenity} className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> {amenity}
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {available} {available === 1 ? "room" : "rooms"} available
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleDecrement}
            disabled={quantity === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleIncrement}
            disabled={quantity >= available}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
