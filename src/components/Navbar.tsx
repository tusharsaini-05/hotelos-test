"use client"

import { Bell, Search, MessageSquare } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLayout } from "@/providers/layout-providers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const { isSidebarOpen } = useLayout()

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
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-l3QW4FaCX6v3jrnwf7OYXXXxY3LctK.png"
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
      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="default"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          New Booking
        </Button>
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-[10px]">3</Badge>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-blue-500 p-0 text-[10px]">5</Badge>
        </Button>
        <div className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-gray-100"
          />
          <div className="hidden md:block">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-500">admin@hotel.com</div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

