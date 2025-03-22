import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutProvider } from "@/providers/layout-providers"
import type React from "react"
import { Providers } from "../providers/provider"
import { ApoloProviders } from "@/providers/apollo-providers"
import { ToastContextProvider } from '@/components/ui/use-toast'
import { ConditionalAppShell } from "@/components/ConditionalAppShell"
import { HotelProvider } from "@/providers/hotel-provider"

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
        <ApoloProviders>
          <ToastContextProvider>
            <Providers>
            <HotelProvider>
              <LayoutProvider>
                <ConditionalAppShell>
                  {children}
                </ConditionalAppShell>
              </LayoutProvider>
            </HotelProvider>
            </Providers>
          </ToastContextProvider>
        </ApoloProviders>
      </body>
    </html>
  )
}