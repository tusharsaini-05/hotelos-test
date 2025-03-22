"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type HotelImagesFormProps = {
  hotel: any
  onSuccess: () => void
}

export default function HotelImagesForm({ hotel, onSuccess }: HotelImagesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>(hotel.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const handleDeleteImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteImage = () => {
    if (selectedImage) {
      setImages((prev) => prev.filter((url) => url !== selectedImage))
      setIsDeleteDialogOpen(false)
      setSelectedImage(null)
    }
  }

  async function handleSaveImages() {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be your actual mutation call
      /*
      const response = await updateHotelImages({
        variables: {
          hotelId: hotel.id,
          images: images,
          operation: "replace"
        }
      });
      */

      onSuccess()
    } catch (err) {
      setError("Failed to update hotel images. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hotel Images</CardTitle>
          <CardDescription>
            Add or remove images for your hotel. These will be displayed to potential guests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button onClick={handleAddImage} disabled={!newImageUrl.trim()} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div>
            <Label className="mb-2 block">Current Images</Label>
            {images.length === 0 ? (
              <div className="border rounded-md p-8 text-center text-muted-foreground">
                No images have been added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Hotel image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md border"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=256"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(imageUrl)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSaveImages} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Images"
          )}
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedImage && (
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Image to delete"
                className="w-full h-48 object-cover rounded-md border"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=256"
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteImage}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

