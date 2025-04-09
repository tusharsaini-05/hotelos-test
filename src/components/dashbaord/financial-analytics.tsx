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

interface ChartDataItem {
  name: string
  value: number
}

interface TrendDataItem {
  date: string
  revenue: number
}

type ChartData = ChartDataItem[] | TrendDataItem[] | any[]

interface FinancialAnalyticsProps {
  data: ChartData
  isLoading: boolean
  chartType?: "line" | "bar" | "pie"
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function FinancialAnalytics({ data, isLoading, chartType = "line" }: FinancialAnalyticsProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />
  }

  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground">No financial data available for the selected period</p>
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
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
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
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Default is line chart for revenue trends
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data as TrendDataItem[]}
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
        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#82ca9d" 
          activeDot={{ r: 8 }} 
          name="Revenue" 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}