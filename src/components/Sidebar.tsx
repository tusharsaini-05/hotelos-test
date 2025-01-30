"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLayout } from "@/providers/layout-providers"
import {
  Users,
  BedDouble,
  MessageSquare,
  TrendingUp,
  Calendar,
  ClipboardList,
  UserCog,
  Settings,
  Activity,
  FileText,
} from "lucide-react"

const menuItems = [
  { name: "Orders", icon: ClipboardList, href: "/orders" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Rooms", icon: BedDouble, href: "/rooms" },
  { name: "Guest Reviews", icon: MessageSquare, href: "/reviews" },
  { name: "Trends", icon: TrendingUp, href: "/trends" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "House Keeping", icon: ClipboardList, href: "/housekeeping" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "My Staff", icon: UserCog, href: "/staff" },
  { name: "Activity Logs", icon: Activity, href: "/activity" },
]

export function DashboardSidebar() {
  const { isSidebarOpen } = useLayout()

  return (
    <motion.div
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 70,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl"
    >
      <div className="flex h-[var(--navbar-height)] items-center justify-center border-b border-gray-700/50">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-white"
        >
          {isSidebarOpen ? "Hotel OS" : "HO"}
        </motion.div>
      </div>
      <div className="px-3 py-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="group mb-2 flex cursor-pointer items-center rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-800"
            >
              <item.icon className="h-5 w-5" />
              <motion.span
                animate={{
                  opacity: isSidebarOpen ? 1 : 0,
                  x: isSidebarOpen ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className="ml-3 origin-left"
              >
                {item.name}
              </motion.span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

