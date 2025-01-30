"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

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

export function RoomPricing() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Price</CardTitle>
            <button className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-red-500 transition-colors hover:bg-red-100">
              1 PAX
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <motion.div variants={item} className="space-y-4">
            <RoomCard name="Japanese Room - Quintuple" type="(Non-Smoking)" status="No room left" price="5,120" />
            <RoomCard name="Japanese Room" type="(with 15 pax)" status="2 rooms left" price="5,120" available />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RoomCard({
  name,
  type,
  status,
  price,
  available = false,
}: {
  name: string
  type: string
  status: string
  price: string
  available?: boolean
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            {name} <span className="text-gray-500">{type}</span>
          </div>
          <div className={`text-sm ${available ? "text-green-500" : "text-gray-500"}`}>{status}</div>
        </div>
        <div className="text-lg font-semibold text-gray-900">¥ {price}</div>
      </div>
    </div>
  )
}

