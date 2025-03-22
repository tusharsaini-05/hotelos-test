"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppShell } from "@/providers/app-shell"
import React from "react"

// Public paths that should not show the AppShell
const publicPaths = ["/login", "/signup", "/forgot-password"]

export function ConditionalAppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { status } = useSession()
  
  // Check if current path is in publicPaths
  const isPublicPage = publicPaths.includes(pathname || "")
  
  // Only show AppShell if user is authenticated AND not on a public page
  const shouldShowAppShell = status === "authenticated" && !isPublicPage

  if (shouldShowAppShell) {
    return <AppShell>{children}</AppShell>
  }

  // Render just the children without AppShell for login/public pages
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {children}
    </div>
  )
}