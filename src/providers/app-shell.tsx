"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { DashboardSidebar } from "@/components/Sidebar"
import { useLayout } from "@/providers/layout-providers"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useLayout()

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <motion.div
        className="flex flex-col flex-1"
        initial={false}
        animate={{
          marginLeft: isSidebarOpen ? "240px" : "70px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Navbar />
        <main className="flex-1 bg-gray-50 p-1 overflow-scroll">{children}</main>
      </motion.div>
    </div>
  )
}

