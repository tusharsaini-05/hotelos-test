"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Bell, Search, MessageSquare, ChevronDown, User, Settings, LogOut } from "lucide-react"
import { Hotel as HotelIcon } from "lucide-react" // Renamed to avoid conflicts
import Image from "next/image"
import { motion } from "framer-motion"
import { useLayout } from "@/providers/layout-providers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import the hotel context and type
import { useHotelContext } from "@/providers/hotel-provider"
import type { Hotel } from "@/providers/hotel-provider"

export function Navbar() {
  const { isSidebarOpen } = useLayout()
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { selectedHotel, setSelectedHotel, userHotels } = useHotelContext()

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    // You might want to trigger data refetching or context changes here
    console.log(`Selected hotel: ${hotel.name}`)
  }

  return (
    <motion.header
      initial={false}
      animate={{
        width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 70px)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-40 flex h-16 items-center border-b bg-white/80 px-4 backdrop-blur-md md:px-6"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <Image
          src="https://t4.ftcdn.net/jpg/04/64/21/59/360_F_464215993_LWZKZ52fQKt4YDQ43b50koqZgn9WxHzA.jpg"
          alt="Logo"
          width={100}
          height={40}
          className="h-8 w-auto"
        />
        <div className="hidden md:flex md:w-96">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search rooms, customers..." className="w-full pl-10" />
          </div>
        </div>
      </div>
      
      {selectedHotel && (
        <div className="hidden md:flex mx-4 items-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <HotelIcon className="h-3.5 w-3.5 mr-1" />
            {selectedHotel.name}
          </Badge>
        </div>
      )}
      
      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="default"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          New Booking
        </Button>
        
        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none">
              <Image
                src="/profile.png"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-gray-100"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">
                  {session?.user?.name || "Admin User"}
                </div>
                <div className="text-xs text-gray-500">
                  {session?.user?.email || "admin@hotel.com"}
                </div>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-gray-500 md:block" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="font-normal">Signed in as</div>
              <div className="font-medium truncate">{session?.user?.email}</div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Update Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Update Hotels</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Your Hotels</DropdownMenuLabel>
            {userHotels.map((hotel) => (
              <DropdownMenuItem 
                key={hotel.id} 
                onClick={() => handleHotelSelect(hotel)}
                className={selectedHotel?.id === hotel.id ? "bg-gray-100" : ""}
              >
                <HotelIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{hotel.name}</span>
                  <span className="text-xs text-gray-500">{hotel.id}</span>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}