"use client"

import { ArrowLeft, Upload, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RoomPhotosProps {
  onBack: () => void
}

export function RoomPhotos({ onBack }: RoomPhotosProps) {
  const photos = [
    {
      id: 1,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5cy4Fmh9b2sdNrYrdkJ5QO7qb4Px3n.png",
      category: "Premiere Deluxe Double Room",
    },
    {
      id: 2,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5cy4Fmh9b2sdNrYrdkJ5QO7qb4Px3n.png",
      category: "Premiere Deluxe Double Room",
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Photos of property</h1>
      </div>

      <div className="mb-6 flex gap-4">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          View Professional photos
        </Button>
      </div>

      <p className="mb-6 text-sm text-gray-500">Upload 25+ photos. Photo categories are auto assigned, tap to edit</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.category}
              width={400}
              height={300}
              className="aspect-video w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-medium">{photo.category}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

