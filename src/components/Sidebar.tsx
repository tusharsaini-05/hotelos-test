"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  Users,
  BedDouble,
  MessageSquare,
  TrendingUp,
  Calendar,
  ClipboardList,
  Settings,
  LucideLayoutDashboard,
  Tag,
} from "lucide-react"
import { useLayout } from "@/providers/layout-providers"

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LucideLayoutDashboard, href: "/dashboard" },
  { name: "Analytics", icon: Users, href: "/booking/analytics" },
  { name: "Check-Booking", icon: BedDouble, href: "/booking/checkbooking" },
  { name: "Create-Booking", icon: MessageSquare, href: "/booking/createbooking" },
  { name: "Hotel-Setup", icon: TrendingUp, href: "/hotels/settings" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Room-Setup", icon: ClipboardList, href: "/room/manage" },
  { name: "Pricing", icon: Tag, href: "/pricing" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function DashboardSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayout()
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isHovering) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300)
    } else {
      setIsSidebarOpen(true)
    }
    return () => clearTimeout(timeout)
  }, [isHovering, setIsSidebarOpen])

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl"
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 70,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex h-16 items-center justify-center">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-white"
        >
          {isSidebarOpen ? "Hotel OS" : "HO"}
        </motion.div>
      </div>
      <div className="px-3 py-4 my-3">
        {menuItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.name} href={item.href} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`group mb-2 flex cursor-pointer items-center rounded-lg p-2 transition-colors ${
                  active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
