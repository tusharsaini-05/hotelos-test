"use client"

import { motion } from "framer-motion"
import { DashboardStats } from "@/components/dashbaord/dashboard-stats"
import { RoomPricing } from "@/components/dashbaord/room-pricing"
import { useLayout } from "@/providers/layout-providers"

export default function DashboardPage() {
  const { isSidebarOpen } = useLayout()

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardStats />
          <RoomPricing />
        </div>
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Property Performance
          </h2>
          {/* Add property performance metrics here */}
          <div className="h-64 rounded-lg bg-white p-4 shadow-md">
            <p className="text-gray-500">Property performance metrics coming soon...</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
