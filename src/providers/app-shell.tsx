"use client"

import type React from "react"
import { Navbar } from "@/components/Navbar"
import { DashboardSidebar } from "@/components/Sidebar"
import { useLayout } from "@/providers/layout-providers"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useLayout()

  return (
    <>
      <DashboardSidebar />
      <main className="main-container min-h-screen bg-gray-50" data-sidebar-open={isSidebarOpen}>
        <Navbar />
        {children}
      </main>
    </>
  )
}

