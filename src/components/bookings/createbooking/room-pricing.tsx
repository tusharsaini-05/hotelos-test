"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, RefreshCw, Plus, Trash2, Calendar, Tag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RoomType {
  id: string
  name: string
  price: number
  minPrice: number
  maxPrice: number
  available: number
}

interface WeekendRate {
  roomId: string
  price: number
  minPrice: number
  maxPrice: number
  enabled: boolean
}

interface Season {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
  rates: SeasonRate[]
}

interface SeasonRate {
  roomId: string
  price: number
  minPrice: number
  maxPrice: number
  enabled: boolean
}

interface SpecialOffer {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  discountType: "percentage" | "fixed"
  discountValue: number
  roomTypes: string[]
  active: boolean
}

export default function RoomPricing() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("standard")
  const [newSeasonDialogOpen, setNewSeasonDialogOpen] = useState(false)
  const [newOfferDialogOpen, setNewOfferDialogOpen] = useState(false)

  // Initial room types data
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: "premiere-deluxe-double",
      name: "Premiere Deluxe Double",
      price: 2354,
      minPrice: 270.74,
      maxPrice: 7062.75,
      available: 4,
    },
    {
      id: "suite",
      name: "Suite",
      price: 2648,
      minPrice: 304.65,
      maxPrice: 7945.5,
      available: 13,
    },
    {
      id: "1-bedroom-suite",
      name: "1 Bedroom Suite",
      price: 2648,
      minPrice: 304.65,
      maxPrice: 7945.5,
      available: 4,
    },
    {
      id: "executive-suite",
      name: "Executive Suite",
      price: 5288,
      minPrice: 500.0,
      maxPrice: 10564.0,
      available: 2,
    },
    {
      id: "superior-double",
      name: "Superior Double",
      price: 4500,
      minPrice: 450.0,
      maxPrice: 9000.0,
      available: 8,
    },
  ])

  // Weekend rates
  const [weekendRates, setWeekendRates] = useState<WeekendRate[]>(
    roomTypes.map((room) => ({
      roomId: room.id,
      price: Math.round(room.price * 1.25), // 25% higher than standard rate
      minPrice: Math.round(room.minPrice * 1.25),
      maxPrice: Math.round(room.maxPrice * 1.25),
      enabled: true,
    })),
  )

  // Weekend days
  const [weekendDays, setWeekendDays] = useState({
    friday: true,
    saturday: true,
    sunday: true,
  })

  // Seasonal rates
  const [seasons, setSeasons] = useState<Season[]>([
    {
      id: "peak-season",
      name: "Peak Season",
      startDate: new Date(2025, 11, 15), // Dec 15
      endDate: new Date(2026, 0, 15), // Jan 15
      color: "bg-red-500",
      rates: roomTypes.map((room) => ({
        roomId: room.id,
        price: Math.round(room.price * 1.5), // 50% higher than standard rate
        minPrice: Math.round(room.minPrice * 1.5),
        maxPrice: Math.round(room.maxPrice * 1.5),
        enabled: true,
      })),
    },
    {
      id: "shoulder-season",
      name: "Shoulder Season",
      startDate: new Date(2025, 5, 1), // June 1
      endDate: new Date(2025, 7, 31), // Aug 31
      color: "bg-amber-500",
      rates: roomTypes.map((room) => ({
        roomId: room.id,
        price: Math.round(room.price * 1.25), // 25% higher than standard rate
        minPrice: Math.round(room.minPrice * 1.25),
        maxPrice: Math.round(room.maxPrice * 1.25),
        enabled: true,
      })),
    },
    {
      id: "low-season",
      name: "Low Season",
      startDate: new Date(2025, 1, 1), // Feb 1
      endDate: new Date(2025, 3, 30), // Apr 30
      color: "bg-green-500",
      rates: roomTypes.map((room) => ({
        roomId: room.id,
        price: Math.round(room.price * 0.8), // 20% lower than standard rate
        minPrice: Math.round(room.minPrice * 0.8),
        maxPrice: Math.round(room.maxPrice * 0.8),
        enabled: true,
      })),
    },
  ])

  // Special offers
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([
    {
      id: "early-bird",
      name: "Early Bird Special",
      description: "Book 30 days in advance and save 15%",
      startDate: new Date(2025, 4, 1), // May 1
      endDate: new Date(2025, 9, 31), // Oct 31
      discountType: "percentage",
      discountValue: 15,
      roomTypes: ["premiere-deluxe-double", "suite", "1-bedroom-suite"],
      active: true,
    },
    {
      id: "summer-sale",
      name: "Summer Sale",
      description: "Special summer rates with fixed discount",
      startDate: new Date(2025, 5, 1), // June 1
      endDate: new Date(2025, 7, 31), // Aug 31
      discountType: "fixed",
      discountValue: 500,
      roomTypes: ["executive-suite", "superior-double"],
      active: true,
    },
    {
      id: "stay-longer",
      name: "Stay Longer, Save More",
      description: "Stay 5+ nights and get 20% off",
      startDate: new Date(2025, 0, 1), // Jan 1
      endDate: new Date(2025, 11, 31), // Dec 31
      discountType: "percentage",
      discountValue: 20,
      roomTypes: roomTypes.map((room) => room.id),
      active: true,
    },
  ])

  // New season form
  const [newSeason, setNewSeason] = useState<Omit<Season, "rates">>({
    id: "",
    name: "",
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    color: "bg-blue-500",
  })

  // New offer form
  const [newOffer, setNewOffer] = useState<Omit<SpecialOffer, "id">>({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: addDays(new Date(), 90),
    discountType: "percentage",
    discountValue: 10,
    roomTypes: [],
    active: true,
  })

  // Create a copy for editing
  const [editableRoomTypes, setEditableRoomTypes] = useState<RoomType[]>(JSON.parse(JSON.stringify(roomTypes)))
  const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>(
    JSON.parse(JSON.stringify(weekendRates)),
  )
  const [editableSeasons, setEditableSeasons] = useState<Season[]>(JSON.parse(JSON.stringify(seasons)))
  const [editableSpecialOffers, setEditableSpecialOffers] = useState<SpecialOffer[]>(
    JSON.parse(JSON.stringify(specialOffers)),
  )

  const handlePriceChange = (id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setEditableRoomTypes((prev) => prev.map((room) => (room.id === id ? { ...room, [field]: numValue } : room)))
  }

  const handleWeekendPriceChange = (roomId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setEditableWeekendRates((prev) =>
      prev.map((rate) => (rate.roomId === roomId ? { ...rate, [field]: numValue } : rate)),
    )
  }

  const handleWeekendRateToggle = (roomId: string, enabled: boolean) => {
    setEditableWeekendRates((prev) => prev.map((rate) => (rate.roomId === roomId ? { ...rate, enabled } : rate)))
  }

  const handleSeasonalPriceChange = (
    seasonId: string,
    roomId: string,
    field: "price" | "minPrice" | "maxPrice",
    value: string,
  ) => {
    const numValue = Number.parseFloat(value) || 0
    setEditableSeasons((prev) =>
      prev.map((season) => {
        if (season.id === seasonId) {
          return {
            ...season,
            rates: season.rates.map((rate) => (rate.roomId === roomId ? { ...rate, [field]: numValue } : rate)),
          }
        }
        return season
      }),
    )
  }

  const handleSeasonalRateToggle = (seasonId: string, roomId: string, enabled: boolean) => {
    setEditableSeasons((prev) =>
      prev.map((season) => {
        if (season.id === seasonId) {
          return {
            ...season,
            rates: season.rates.map((rate) => (rate.roomId === roomId ? { ...rate, enabled } : rate)),
          }
        }
        return season
      }),
    )
  }

  const handleDeleteSeason = (seasonId: string) => {
    setEditableSeasons((prev) => prev.filter((season) => season.id !== seasonId))
  }

  const handleAddSeason = () => {
    if (!newSeason.name) {
      toast({
        title: "Error",
        description: "Please enter a season name",
        variant: "destructive",
      })
      return
    }

    if (newSeason.startDate >= newSeason.endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    const seasonId = newSeason.name.toLowerCase().replace(/\s+/g, "-")

    const newSeasonWithRates: Season = {
      ...newSeason,
      id: seasonId,
      rates: roomTypes.map((room) => ({
        roomId: room.id,
        price: room.price,
        minPrice: room.minPrice,
        maxPrice: room.maxPrice,
        enabled: true,
      })),
    }

    setEditableSeasons((prev) => [...prev, newSeasonWithRates])
    setNewSeason({
      id: "",
      name: "",
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      color: "bg-blue-500",
    })
    setNewSeasonDialogOpen(false)

    toast({
      title: "Season added",
      description: `${newSeason.name} has been added successfully.`,
    })
  }

  const handleDeleteOffer = (offerId: string) => {
    setEditableSpecialOffers((prev) => prev.filter((offer) => offer.id !== offerId))
  }

  const handleAddOffer = () => {
    if (!newOffer.name) {
      toast({
        title: "Error",
        description: "Please enter an offer name",
        variant: "destructive",
      })
      return
    }

    if (newOffer.startDate >= newOffer.endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    if (newOffer.roomTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one room type",
        variant: "destructive",
      })
      return
    }

    if (newOffer.discountValue <= 0) {
      toast({
        title: "Error",
        description: "Discount value must be greater than zero",
        variant: "destructive",
      })
      return
    }

    const offerId = newOffer.name.toLowerCase().replace(/\s+/g, "-")

    const newOfferComplete: SpecialOffer = {
      ...newOffer,
      id: offerId,
    }

    setEditableSpecialOffers((prev) => [...prev, newOfferComplete])
    setNewOffer({
      name: "",
      description: "",
      startDate: new Date(),
      endDate: addDays(new Date(), 90),
      discountType: "percentage",
      discountValue: 10,
      roomTypes: [],
      active: true,
    })
    setNewOfferDialogOpen(false)

    toast({
      title: "Offer added",
      description: `${newOffer.name} has been added successfully.`,
    })
  }

  const handleOfferToggle = (offerId: string, active: boolean) => {
    setEditableSpecialOffers((prev) => prev.map((offer) => (offer.id === offerId ? { ...offer, active } : offer)))
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // Validate prices based on active tab
      if (activeTab === "standard") {
        for (const room of editableRoomTypes) {
          if (room.minPrice > room.price || room.price > room.maxPrice) {
            throw new Error(
              `Invalid price range for ${room.name}. Min price must be less than base price, and base price must be less than max price.`,
            )
          }
        }
      } else if (activeTab === "weekend") {
        for (const rate of editableWeekendRates) {
          if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
            const room = roomTypes.find((r) => r.id === rate.roomId)
            throw new Error(
              `Invalid weekend price range for ${room?.name}. Min price must be less than base price, and base price must be less than max price.`,
            )
          }
        }
      } else if (activeTab === "seasonal") {
        for (const season of editableSeasons) {
          for (const rate of season.rates) {
            if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
              const room = roomTypes.find((r) => r.id === rate.roomId)
              throw new Error(
                `Invalid seasonal price range for ${room?.name} in ${season.name}. Min price must be less than base price, and base price must be less than max price.`,
              )
            }
          }
        }
      }

      // In a real application, you would make an API call here
      // For example:
      // await fetch('/api/room-pricing', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     roomTypes: editableRoomTypes,
      //     weekendRates: editableWeekendRates,
      //     weekendDays,
      //     seasons: editableSeasons,
      //     specialOffers: editableSpecialOffers,
      //     rateType: activeTab
      //   })
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the main state with edited values
      if (activeTab === "standard") {
        setRoomTypes(editableRoomTypes)
      } else if (activeTab === "weekend") {
        setWeekendRates(editableWeekendRates)
      } else if (activeTab === "seasonal") {
        setSeasons(editableSeasons)
      } else if (activeTab === "special") {
        setSpecialOffers(editableSpecialOffers)
      }

      toast({
        title: "Pricing updated",
        description: `Room pricing has been successfully updated for ${activeTab} rate.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update pricing",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (activeTab === "standard") {
      setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
    } else if (activeTab === "weekend") {
      setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
    } else if (activeTab === "seasonal") {
      setEditableSeasons(JSON.parse(JSON.stringify(seasons)))
    } else if (activeTab === "special") {
      setEditableSpecialOffers(JSON.parse(JSON.stringify(specialOffers)))
    }

    toast({
      title: "Changes discarded",
      description: "All changes have been reset to the last saved values.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-medium">Room Pricing Management</h1>
              <p className="text-sm text-gray-500">Update room rates and pricing limits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Pricing Configuration</CardTitle>
            <CardDescription>
              Set the base price, minimum, and maximum pricing for each room type. These values will be used when
              creating bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="standard">Standard Rate</TabsTrigger>
                <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal Rate</TabsTrigger>
                <TabsTrigger value="special">Special Offers</TabsTrigger>
              </TabsList>

              {/* Standard Rate Tab */}
              <TabsContent value="standard" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Room Type</TableHead>
                        <TableHead>Base Price (₹)</TableHead>
                        <TableHead>Min Price (₹)</TableHead>
                        <TableHead>Max Price (₹)</TableHead>
                        <TableHead className="text-right">Available Rooms</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableRoomTypes.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={room.price}
                              onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
                              className="w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={room.minPrice}
                              onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
                              className="w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={room.maxPrice}
                              onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
                              className="w-[120px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">{room.available}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                  <p>
                    <strong>Note:</strong> Min price must be less than base price, and base price must be less than max
                    price.
                  </p>
                  <p className="mt-1">
                    These values determine the price range for dynamic pricing based on demand and occupancy.
                  </p>
                </div>
              </TabsContent>

              {/* Weekend Rate Tab */}
              <TabsContent value="weekend" className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-sm font-medium">Weekend days:</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="friday"
                      checked={weekendDays.friday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
                    />
                    <label htmlFor="friday" className="text-sm">
                      Friday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saturday"
                      checked={weekendDays.saturday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
                    />
                    <label htmlFor="saturday" className="text-sm">
                      Saturday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sunday"
                      checked={weekendDays.sunday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
                    />
                    <label htmlFor="sunday" className="text-sm">
                      Sunday
                    </label>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Room Type</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead>Base Price (₹)</TableHead>
                        <TableHead>Min Price (₹)</TableHead>
                        <TableHead>Max Price (₹)</TableHead>
                        <TableHead className="text-right">Standard Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableWeekendRates.map((rate) => {
                        const room = roomTypes.find((r) => r.id === rate.roomId)
                        return (
                          <TableRow key={rate.roomId}>
                            <TableCell className="font-medium">{room?.name}</TableCell>
                            <TableCell>
                              <Switch
                                checked={rate.enabled}
                                onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomId, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.price}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "price", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.minPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "minPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.maxPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomId, "maxPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                              />
                            </TableCell>
                            <TableCell className="text-right text-gray-500">₹ {room?.price}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <p>
                    <strong>Note:</strong> Weekend rates apply to the days selected above. Disable specific room types
                    if you don't want to apply weekend pricing to them.
                  </p>
                </div>
              </TabsContent>

              {/* Seasonal Rate Tab */}
              <TabsContent value="seasonal" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Seasonal Pricing Periods</h3>
                  <Dialog open={newSeasonDialogOpen} onOpenChange={setNewSeasonDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Season
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Season</DialogTitle>
                        <DialogDescription>
                          Create a new seasonal pricing period with custom rates for each room type.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="season-name" className="text-right">
                            Season Name
                          </Label>
                          <Input
                            id="season-name"
                            value={newSeason.name}
                            onChange={(e) => setNewSeason((prev) => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="e.g., Holiday Season"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Date Range</Label>
                          <div className="col-span-3 flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(newSeason.startDate, "MMM d, yyyy")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newSeason.startDate}
                                  onSelect={(date) => date && setNewSeason((prev) => ({ ...prev, startDate: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <span>to</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(newSeason.endDate, "MMM d, yyyy")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newSeason.endDate}
                                  onSelect={(date) => date && setNewSeason((prev) => ({ ...prev, endDate: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="season-color" className="text-right">
                            Color
                          </Label>
                          <Select
                            value={newSeason.color}
                            onValueChange={(value) => setNewSeason((prev) => ({ ...prev, color: value }))}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bg-red-500">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                  <span>Red</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bg-amber-500">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                                  <span>Amber</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bg-green-500">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                  <span>Green</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bg-blue-500">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                                  <span>Blue</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bg-purple-500">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                                  <span>Purple</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewSeasonDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddSeason}>Add Season</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {editableSeasons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No Seasons Defined</p>
                    <p className="text-sm text-center max-w-md mb-4">
                      Create seasonal pricing periods to set different rates during specific times of the year.
                    </p>
                    <Button onClick={() => setNewSeasonDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Season
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {editableSeasons.map((season) => (
                      <div key={season.id} className="border rounded-md overflow-hidden">
                        <div className={`${season.color} text-white px-4 py-3 flex justify-between items-center`}>
                          <div>
                            <h4 className="font-medium">{season.name}</h4>
                            <p className="text-sm opacity-90">
                              {format(season.startDate, "MMM d, yyyy")} - {format(season.endDate, "MMM d, yyyy")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => handleDeleteSeason(season.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[250px]">Room Type</TableHead>
                                <TableHead>Enabled</TableHead>
                                <TableHead>Base Price (₹)</TableHead>
                                <TableHead>Min Price (₹)</TableHead>
                                <TableHead>Max Price (₹)</TableHead>
                                <TableHead className="text-right">Standard Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {season.rates.map((rate) => {
                                const room = roomTypes.find((r) => r.id === rate.roomId)
                                return (
                                  <TableRow key={`${season.id}-${rate.roomId}`}>
                                    <TableCell className="font-medium">{room?.name}</TableCell>
                                    <TableCell>
                                      <Switch
                                        checked={rate.enabled}
                                        onCheckedChange={(checked) =>
                                          handleSeasonalRateToggle(season.id, rate.roomId, checked)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={rate.price}
                                        onChange={(e) =>
                                          handleSeasonalPriceChange(season.id, rate.roomId, "price", e.target.value)
                                        }
                                        className="w-[120px]"
                                        disabled={!rate.enabled}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={rate.minPrice}
                                        onChange={(e) =>
                                          handleSeasonalPriceChange(season.id, rate.roomId, "minPrice", e.target.value)
                                        }
                                        className="w-[120px]"
                                        disabled={!rate.enabled}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={rate.maxPrice}
                                        onChange={(e) =>
                                          handleSeasonalPriceChange(season.id, rate.roomId, "maxPrice", e.target.value)
                                        }
                                        className="w-[120px]"
                                        disabled={!rate.enabled}
                                      />
                                    </TableCell>
                                    <TableCell className="text-right text-gray-500">₹ {room?.price}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <p>
                    <strong>Note:</strong> Seasonal rates take precedence over standard and weekend rates during the
                    specified date ranges.
                  </p>
                </div>
              </TabsContent>

              {/* Special Offers Tab */}
              <TabsContent value="special" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Special Offers & Promotions</h3>
                  <Dialog open={newOfferDialogOpen} onOpenChange={setNewOfferDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Special Offer</DialogTitle>
                        <DialogDescription>
                          Set up a promotional offer or discount for specific room types.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="offer-name" className="text-right">
                            Offer Name
                          </Label>
                          <Input
                            id="offer-name"
                            value={newOffer.name}
                            onChange={(e) => setNewOffer((prev) => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="e.g., Summer Special"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="offer-description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="offer-description"
                            value={newOffer.description}
                            onChange={(e) => setNewOffer((prev) => ({ ...prev, description: e.target.value }))}
                            className="col-span-3"
                            placeholder="Brief description of the offer"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Valid Period</Label>
                          <div className="col-span-3 flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(newOffer.startDate, "MMM d, yyyy")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newOffer.startDate}
                                  onSelect={(date) => date && setNewOffer((prev) => ({ ...prev, startDate: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <span>to</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(newOffer.endDate, "MMM d, yyyy")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newOffer.endDate}
                                  onSelect={(date) => date && setNewOffer((prev) => ({ ...prev, endDate: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Discount Type</Label>
                          <div className="col-span-3">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="percentage"
                                  name="discountType"
                                  checked={newOffer.discountType === "percentage"}
                                  onChange={() => setNewOffer((prev) => ({ ...prev, discountType: "percentage" }))}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor="percentage" className="font-normal">
                                  Percentage (%)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="fixed"
                                  name="discountType"
                                  checked={newOffer.discountType === "fixed"}
                                  onChange={() => setNewOffer((prev) => ({ ...prev, discountType: "fixed" }))}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor="fixed" className="font-normal">
                                  Fixed Amount (₹)
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="discount-value" className="text-right">
                            {newOffer.discountType === "percentage" ? "Discount %" : "Discount Amount"}
                          </Label>
                          <Input
                            id="discount-value"
                            type="number"
                            value={newOffer.discountValue}
                            onChange={(e) =>
                              setNewOffer((prev) => ({
                                ...prev,
                                discountValue: Number.parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-[120px]"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label className="text-right pt-2">Applicable Rooms</Label>
                          <div className="col-span-3 space-y-2">
                            {roomTypes.map((room) => (
                              <div key={room.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`room-${room.id}`}
                                  checked={newOffer.roomTypes.includes(room.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewOffer((prev) => ({
                                        ...prev,
                                        roomTypes: [...prev.roomTypes, room.id],
                                      }))
                                    } else {
                                      setNewOffer((prev) => ({
                                        ...prev,
                                        roomTypes: prev.roomTypes.filter((id) => id !== room.id),
                                      }))
                                    }
                                  }}
                                />
                                <label htmlFor={`room-${room.id}`} className="text-sm">
                                  {room.name} (₹ {room.price})
                                </label>
                              </div>
                            ))}
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setNewOffer((prev) => ({
                                    ...prev,
                                    roomTypes: roomTypes.map((room) => room.id),
                                  }))
                                }
                              >
                                Select All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={() =>
                                  setNewOffer((prev) => ({
                                    ...prev,
                                    roomTypes: [],
                                  }))
                                }
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewOfferDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddOffer}>Create Offer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {editableSpecialOffers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    <Tag className="h-12 w-12 mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No Special Offers</p>
                    <p className="text-sm text-center max-w-md mb-4">
                      Create special offers and promotions to attract more bookings during specific periods.
                    </p>
                    <Button onClick={() => setNewOfferDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Offer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editableSpecialOffers.map((offer) => (
                      <div key={offer.id} className="border rounded-md overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div>
                              <h4 className="font-medium flex items-center">
                                {offer.name}
                                {!offer.active && (
                                  <Badge variant="outline" className="ml-2 text-xs border-white/50 text-white">
                                    Inactive
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm opacity-90">
                                {format(offer.startDate, "MMM d, yyyy")} - {format(offer.endDate, "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center mr-4">
                              <Switch
                                checked={offer.active}
                                onCheckedChange={(checked) => handleOfferToggle(offer.id, checked)}
                                className="data-[state=checked]:bg-white/30"
                              />
                              <span className="ml-2 text-sm">{offer.active ? "Active" : "Inactive"}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-600">{offer.description}</p>
                              <p className="text-sm font-medium mt-1">
                                Discount:{" "}
                                {offer.discountType === "percentage"
                                  ? `${offer.discountValue}% off`
                                  : `₹${offer.discountValue} off`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Applicable to:</p>
                              <div className="flex flex-wrap justify-end gap-1 mt-1">
                                {offer.roomTypes.map((roomId) => {
                                  const room = roomTypes.find((r) => r.id === roomId)
                                  return room ? (
                                    <Badge key={roomId} variant="outline" className="text-xs">
                                      {room.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-md border text-sm">
                            <h5 className="font-medium mb-2">Price Preview</h5>
                            <div className="grid grid-cols-3 gap-4">
                              {offer.roomTypes.slice(0, 3).map((roomId) => {
                                const room = roomTypes.find((r) => r.id === roomId)
                                if (!room) return null

                                const discountedPrice =
                                  offer.discountType === "percentage"
                                    ? room.price * (1 - offer.discountValue / 100)
                                    : room.price - offer.discountValue

                                return (
                                  <div key={roomId} className="border-r last:border-r-0 pr-4 last:pr-0">
                                    <p className="font-medium">{room.name}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="line-through text-gray-500 mr-2">₹{room.price}</span>
                                      <span className="text-green-600 font-medium">
                                        ₹{Math.max(0, Math.round(discountedPrice))}
                                      </span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                      Save{" "}
                                      {offer.discountType === "percentage"
                                        ? `${offer.discountValue}%`
                                        : `₹${offer.discountValue}`}
                                    </p>
                                  </div>
                                )
                              })}
                              {offer.roomTypes.length > 3 && (
                                <div className="text-gray-500 flex items-center">
                                  +{offer.roomTypes.length - 3} more room types
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-md p-4 text-sm text-purple-800">
                  <p>
                    <strong>Note:</strong> Special offers apply discounts to the applicable room types during the
                    specified date range. They can be combined with seasonal rates.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
