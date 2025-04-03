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
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type GuestAnalyticsProps = {
  data: any[]
  isLoading: boolean
  chartType?: "line" | "bar" | "pie" | "table" | "map"
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function GuestAnalytics({ data, isLoading, chartType = "bar" }: GuestAnalyticsProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />
  }

  if (chartType === "table") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((guest, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.bookings}</TableCell>
              <TableCell className="text-right">${guest.spent.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (chartType === "map") {
    // For a real map, you would use a mapping library like react-simple-maps
    // This is a simplified representation
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>World map showing guest distribution</p>
          <p className="text-sm mt-2">Top countries:</p>
          <ul className="mt-2">
            {data.slice(0, 5).map((country, index) => (
              <li key={index} className="text-sm">
                {country.name}: {country.value} guests
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Guests"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Bar dataKey="value" fill="#8884d8" name="Guests" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="guests" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

