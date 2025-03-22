"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import CreateRoomForm from "./create-room-form"
import UpdateRoomStatusForm from "./update-room-status-form"
import RoomMaintenanceForm from "./room-maintenance-form"
import BulkUpdateRoomForm from "./bulk-update-room-form"
import UpdateRoomPricingForm from "./update-room-pricing-form"
import { BedDouble, WashingMachineIcon as CleaningService, Wrench, Users, DollarSign } from "lucide-react"

export default function RoomManagement() {
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <p className="text-muted-foreground mt-1">Create and manage rooms for your hotel properties</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="create" className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span className="hidden sm:inline">Create Room</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-1">
                <CleaningService className="h-4 w-4" />
                <span className="hidden sm:inline">Update Status</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Maintenance</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Bulk Update</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateRoomForm onSuccess={() => handleSuccess("Room created successfully")} />
            </TabsContent>

            <TabsContent value="status">
              <UpdateRoomStatusForm onSuccess={() => handleSuccess("Room status updated successfully")} />
            </TabsContent>

            <TabsContent value="maintenance">
              <RoomMaintenanceForm onSuccess={() => handleSuccess("Room marked for maintenance successfully")} />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkUpdateRoomForm onSuccess={() => handleSuccess("Rooms updated successfully")} />
            </TabsContent>

            <TabsContent value="pricing">
              <UpdateRoomPricingForm onSuccess={() => handleSuccess("Room pricing updated successfully")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

