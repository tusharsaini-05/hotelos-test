"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Hotel, Settings, MapPin, Image, Shield, Users, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import HotelBasicInfoForm from "./hotel-basic-info-form"
import HotelPoliciesForm from "./hotel-policies-form"
import HotelAmenitiesForm from "./hotel-amenities-form"
import HotelImagesForm from "./hotel-images-form"
import HotelLocationForm from "./hotel-location-form"
import HotelAdminForm from "./hotel-admin-form"
import HotelStatusForm from "./hotel-status-form"
import CreateHotelForm from "./create-hotel-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function HotelSettingsPage() {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null)
  const [hotelData, setHotelData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Mock function to fetch hotel data - replace with actual API call
  useEffect(() => {
    const fetchHotelData = async () => {
      // Simulate API call
      setTimeout(() => {
        // Mock data
        setHotelData({
          id: "67a473107f94fb7765b95957",
          name: "Grand Hotel",
          description: "A luxury hotel in the heart of the city",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          country: "USA",
          zipcode: "10001",
          latitude: 40.7128,
          longitude: -74.006,
          contactPhone: "+1-212-555-0123",
          contactEmail: "info@grandhotel.com",
          website: "https://grandhotel.com",
          adminId: "67a37b9b346eff546b54277a",
          floorCount: 20,
          starRating: 5,
          status: "ACTIVE",
          amenities: ["POOL", "SPA", "RESTAURANT", "GYM"],
          images: ["https://storage.example.com/hotel-lobby.jpg", "https://storage.example.com/suite-bedroom.jpg"],
          policies: {
            checkInTime: "14:00",
            checkOutTime: "11:00",
            cancellationHours: 24,
            paymentMethods: ["CREDIT_CARD", "DEBIT_CARD", "CASH"],
            petPolicy: "ALLOWED",
          },
        })
        setIsLoading(false)
      }, 1000)
    }

    if (selectedHotelId) {
      fetchHotelData()
    } else {
      // For demo purposes, set a default hotel ID
      setSelectedHotelId("67a473107f94fb7765b95957")
    }
  }, [selectedHotelId])

  const handleCreateSuccess = (newHotelId: string) => {
    toast({
      title: "Hotel Created",
      description: "Your new hotel has been created successfully.",
    })
    setCreateDialogOpen(false)
    setSelectedHotelId(newHotelId)
    setActiveTab("basic-info")
  }

  const handleUpdateSuccess = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading hotel data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your hotel properties and configurations</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add New Hotel</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Hotel</DialogTitle>
              <DialogDescription>Fill in the details below to create a new hotel property.</DialogDescription>
            </DialogHeader>
            <CreateHotelForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="basic-info" className="flex items-center gap-1">
                <Hotel className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="policies" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Policies</span>
              </TabsTrigger>
              <TabsTrigger value="amenities" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Amenities</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Images</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Location</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info">
              <HotelBasicInfoForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="policies">
              <HotelPoliciesForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="amenities">
              <HotelAmenitiesForm onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="images">
              <HotelImagesForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="location">
              <HotelLocationForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="admin">
              <HotelAdminForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>

            <TabsContent value="status">
              <HotelStatusForm hotel={hotelData} onSuccess={handleUpdateSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

