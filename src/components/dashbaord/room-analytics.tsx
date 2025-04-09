"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts"

// Define all the interfaces for the component
interface ChartDataItem {
  name: string
  value: number
}

interface OccupancyDataItem {
  date: string
  occupancy: number
}

interface TrendDataItem {
  date: string
  bookings?: number
  revenue?: number
  occupancy?: number
}

// Union type for all possible chart data formats
type ChartData = ChartDataItem[] | OccupancyDataItem[] | TrendDataItem[] | any[]

interface RoomAnalyticsProps {
  data: ChartData
  isLoading: boolean
  chartType?: "line" | "bar" | "pie" | "heatmap"
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function RoomAnalytics({ data, isLoading, chartType = "bar" }: RoomAnalyticsProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />
  }

  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as ChartDataItem[]}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {(data as ChartDataItem[]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Rooms"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data as ChartDataItem[]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Rooms" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === "heatmap") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Treemap 
          data={data as ChartDataItem[]} 
          dataKey="value" 
          aspectRatio={4 / 3} 
          stroke="#fff" 
          fill="#8884d8" 
          nameKey="name"
        >
          <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
        </Treemap>
      </ResponsiveContainer>
    )
  }

  // Line chart for occupancy timeline
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data as OccupancyDataItem[] | TrendDataItem[]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="occupancy" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Occupancy Rate" 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}