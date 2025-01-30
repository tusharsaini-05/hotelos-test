"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type LayoutContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isHovering) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300)
    } else {
      setIsSidebarOpen(true)
    }
    return () => clearTimeout(timeout)
  }, [isHovering])

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="fixed left-0 top-0 z-50 h-full w-[var(--sidebar-width-collapsed)] hover:w-[var(--sidebar-width)]"
      >
        {children}
      </div>
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

