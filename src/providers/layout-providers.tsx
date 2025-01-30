"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type LayoutContextType = {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener("sidebar:hover:enter", handleMouseEnter)
    document.addEventListener("sidebar:hover:leave", handleMouseLeave)

    return () => {
      document.removeEventListener("sidebar:hover:enter", handleMouseEnter)
      document.removeEventListener("sidebar:hover:leave", handleMouseLeave)
    }
  }, [])

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

  return <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

