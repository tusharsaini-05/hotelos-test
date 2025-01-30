import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutProvider } from "@/providers/layout-providers"
import { AppShell } from "@/providers/app-shell"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A modern hotel management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <LayoutProvider>
          <AppShell>{children}</AppShell>
        </LayoutProvider>
      </body>
    </html>
  )
}

