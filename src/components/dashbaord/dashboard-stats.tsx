"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export function DashboardStats() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
      <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
          <CardTitle className="text-lg font-medium">Today's Status (Dec 26)</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 grid gap-4">
          <motion.div variants={item} className="grid gap-4">
            <StatsItem label="Check-ins left" value="4" total="4" color="text-blue-600" />
            <StatsItem label="Check-outs left" value="3" total="10" color="text-purple-600" />
            <StatsItem label="Rooms in use" value="5" total="8" color="text-green-600" />
            <StatsItem label="EOD Occupancy" value="75.00" suffix="%" color="text-orange-600" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StatsItem({
  label,
  value,
  total,
  suffix = "",
  color,
}: {
  label: string
  value: string
  total?: string
  suffix?: string
  color: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{label}</span>
        <InfoIcon className="h-4 w-4 text-gray-400" />
      </div>
      <div className={`font-medium ${color}`}>
        {value}
        {total ? ` of ${total}` : suffix}
      </div>
    </div>
  )
}

