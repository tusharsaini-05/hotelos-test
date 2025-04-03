"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"
import { DatePickerWithRange } from "@/components/dashbaord/date-range-picker"
import { format, subDays } from "date-fns"
import OverviewMetrics from "@/components/dashbaord/overview-metrics"
import BookingTrends from "@/components/dashbaord/booking-trends"
import RoomAnalytics from "@/components/dashbaord/room-analytics"
import GuestAnalytics from "@/components/dashbaord/guest-analytics"
import FinancialAnalytics from "@/components/dashbaord/financial-analytics"
import BookingTable from "@/components/dashbaord/booking-table"
import { generateMockDashboardData } from "@/components/dashbaord/mock-data"

export default function HotelDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be GraphQL queries to fetch data
        // For example:
        // const { data: bookingsData } = await client.query({
        //   query: GET_BOOKINGS,
        //   variables: { hotelId: "60d21b4667d0d8992e610c80", limit: 100 }
        // });

        // Using mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData = generateMockDashboardData(dateRange.from, dateRange.to)
        setDashboardData(mockData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [dateRange])

  const handleRefresh = () => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData = generateMockDashboardData(dateRange.from, dateRange.to)
        setDashboardData(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting dashboard data...")
    alert("Dashboard data export started. The file will be downloaded shortly.")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive analytics for bookings, rooms, and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Booking Trends</TabsTrigger>
          <TabsTrigger value="rooms">Room Analytics</TabsTrigger>
          <TabsTrigger value="guests">Guest Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {dashboardData && <OverviewMetrics data={dashboardData.overview} isLoading={isLoading} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Last 10 bookings across all properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingTable bookings={dashboardData.recentBookings.slice(0, 5)} isLoading={isLoading} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Room Type Distribution</CardTitle>
                    <CardDescription>Bookings by room type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {dashboardData && (
                      <RoomAnalytics data={dashboardData.roomTypeDistribution} isLoading={isLoading} chartType="pie" />
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {dashboardData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>
                    Booking patterns over time ({format(dateRange.from, "MMM d, yyyy")} -{" "}
                    {format(dateRange.to, "MMM d, yyyy")})
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <BookingTrends data={dashboardData.bookingTrends} isLoading={isLoading} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Sources</CardTitle>
                    <CardDescription>Where bookings are coming from</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <BookingTrends data={dashboardData.bookingSources} isLoading={isLoading} chartType="pie" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booking Status</CardTitle>
                    <CardDescription>Current status of all bookings</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <BookingTrends data={dashboardData.bookingStatus} isLoading={isLoading} chartType="bar" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>Detailed list of all bookings in the selected date range</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingTable bookings={dashboardData.recentBookings} isLoading={isLoading} isExpandable={true} />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Occupancy</CardTitle>
                    <CardDescription>Current occupancy rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold">{dashboardData.overview.occupancyRate}%</div>
                      <p className="text-muted-foreground">Occupancy Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Room Type Performance</CardTitle>
                    <CardDescription>Most booked room types</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <RoomAnalytics data={dashboardData.roomTypePerformance} isLoading={isLoading} chartType="bar" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Room Status</CardTitle>
                    <CardDescription>Current status of all rooms</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <RoomAnalytics data={dashboardData.roomStatus} isLoading={isLoading} chartType="pie" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Floor Occupancy</CardTitle>
                  <CardDescription>Room occupancy by floor</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <RoomAnalytics data={dashboardData.floorOccupancy} isLoading={isLoading} chartType="heatmap" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Room Occupancy Timeline</CardTitle>
                  <CardDescription>Occupancy rate over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <RoomAnalytics data={dashboardData.occupancyTimeline} isLoading={isLoading} chartType="line" />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Types</CardTitle>
                    <CardDescription>New vs. returning guests</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <GuestAnalytics data={dashboardData.guestTypes} isLoading={isLoading} chartType="pie" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Stay Duration</CardTitle>
                    <CardDescription>Length of stay by guest type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <GuestAnalytics data={dashboardData.stayDuration} isLoading={isLoading} chartType="bar" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Guest Satisfaction</CardTitle>
                    <CardDescription>Rating distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <GuestAnalytics data={dashboardData.guestSatisfaction} isLoading={isLoading} chartType="bar" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Guests</CardTitle>
                  <CardDescription>Guests with most bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <GuestAnalytics data={dashboardData.topGuests} isLoading={isLoading} chartType="table" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Demographics</CardTitle>
                  <CardDescription>Guest distribution by country</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <GuestAnalytics data={dashboardData.guestDemographics} isLoading={isLoading} chartType="map" />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>Revenue in selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold">${dashboardData.overview.totalRevenue.toLocaleString()}</div>
                      <p className="text-muted-foreground">Total Revenue</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Daily Rate</CardTitle>
                    <CardDescription>ADR in selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold">
                        ${dashboardData.overview.averageDailyRate.toLocaleString()}
                      </div>
                      <p className="text-muted-foreground">ADR</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>RevPAR</CardTitle>
                    <CardDescription>Revenue per available room</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold">${dashboardData.overview.revPAR.toLocaleString()}</div>
                      <p className="text-muted-foreground">RevPAR</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <FinancialAnalytics data={dashboardData.revenueTrends} isLoading={isLoading} chartType="line" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Room Type</CardTitle>
                    <CardDescription>Revenue distribution by room category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <FinancialAnalytics data={dashboardData.revenueByRoomType} isLoading={isLoading} chartType="bar" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Revenue by payment type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <FinancialAnalytics data={dashboardData.paymentMethods} isLoading={isLoading} chartType="pie" />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

