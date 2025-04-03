"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, Users, Calendar, Hotel, DollarSign } from "lucide-react"
import { useHotelContext } from "@/providers/hotel-provider"

type OverviewMetricsProps = {
  data: {
    totalBookings: number
    totalBookingsChange: number
    occupancyRate: number
    occupancyRateChange: number
    totalRevenue: number
    totalRevenueChange: number
    averageDailyRate: number
    averageDailyRateChange: number
    revPAR: number
    totalGuests: number
    totalRooms: number
  }
  isLoading: boolean
}

export default function OverviewMetrics({ data, isLoading }: OverviewMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-1" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const {selectedHotel} = useHotelContext()

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalBookings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.totalBookingsChange > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">{data.totalBookingsChange}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{Math.abs(data.totalBookingsChange)}%</span>
              </>
            )}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Hotel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.occupancyRate}%</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.occupancyRateChange > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">{data.occupancyRateChange}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{Math.abs(data.occupancyRateChange)}%</span>
              </>
            )}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.totalRevenueChange > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">{data.totalRevenueChange}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{Math.abs(data.totalRevenueChange)}%</span>
              </>
            )}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalGuests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across {data.totalRooms} rooms</p>
        </CardContent>
      </Card>
    </div>
  )
}

