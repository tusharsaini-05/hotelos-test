"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Minus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Room {
  id: number
  type: string
  adults: number
  children: number
  price: number
}

export default function CreateBooking() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, type: "Executive Suite", adults: 1, children: 0, price: 5288 }
  ])
  const [date, setDate] = useState<{ from: Date; to: Date }>()

  const totalCharges = rooms.reduce((sum, room) => sum + room.price, 0)

  const addRoom = () => {
    setRooms([...rooms, { 
      id: rooms.length + 1, 
      type: "Executive Suite", 
      adults: 1, 
      children: 0, 
      price: 5288 
    }])
  }

  return (
    <div className="container mx-auto p-6">
      <div className="sticky top-0 z-10 -mx-6 -mt-6 bg-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Create Booking</h1>
            <p className="text-sm text-gray-500">1 Guest, 1 Room, 1 Night</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Charges</div>
              <div className="text-xl font-bold">₹ {totalCharges.toLocaleString()}</div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600">
              Create Booking
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              1
            </span>
            Contact Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <div className="flex">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1" placeholder="Enter Mobile Number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Enter Name" />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter Email Address" />
            </div>

            <div className="space-y-2">
              <Label>Type of Profile</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Profile Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Company/Business Name</Label>
              <Input placeholder="Enter Company Name" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              2
            </span>
            Stay Details
          </h2>

          <div className="mb-6 flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? format(date.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(range: any) => setDate(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.to ? format(date.to, "PPP") : "Pick a date"}
              </Button>
            </div>

            <Button variant="link" className="mt-8 text-red-500">
              View Price Details
            </Button>
          </div>

          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="mb-4 rounded-lg border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Room {index + 1}</h3>
                <div className="text-right">
                  <div className="font-medium">₹ {room.price}</div>
                  <div className="text-sm text-gray-500">
                    Min ₹ 0 · Max ₹ 10,564
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select defaultValue={room.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                      <SelectItem value="Superior Double">Superior Double</SelectItem>
                      <SelectItem value="Premiere Deluxe">Premiere Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rooms</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Adults (5+ Years)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newRooms = [...rooms]
                        if (newRooms[index].adults > 1) {
                          newRooms[index].adults--
                          setRooms(newRooms)
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{room.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newRooms = [...rooms]
                        newRooms[index].adults++
                        setRooms(newRooms)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Children (0-5 years)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newRooms = [...rooms]
                        if (newRooms[index].children > 0) {
                          newRooms[index].children--
                          setRooms(newRooms)
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{room.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newRooms = [...rooms]
                        newRooms[index].children++
                        setRooms(newRooms)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addRoom}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </section>
      </div>
    </div>
  )
}
