"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Hotel, Users, CreditCard, Bell, Shield, Database, Palette } from "lucide-react"

import GeneralSettings from "@/components/settings/general-settings"
import HotelManagement from "@/components/settings/hotel-management"
import UserManagement from "@/components/settings/user-management"
import PaymentSettings from "@/components/settings/payment-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import SecuritySettings from "@/components/settings/security-settings"
import IntegrationSettings from "@/components/settings/integration-settings"
import AppearanceSettings from "@/components/settings/appearance-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const settingsCategories = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      description: "Basic application settings and preferences",
    },
    {
      id: "hotels",
      label: "Hotels",
      icon: Hotel,
      description: "Manage hotel properties and configurations",
    },
    {
      id: "users",
      label: "Users & Roles",
      icon: Users,
      description: "User management and role permissions",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      description: "Payment gateways and billing settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email, SMS, and push notification settings",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Authentication and security policies",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Database,
      description: "Third-party services and API connections",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      description: "Theme, branding, and UI customization",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your hotel management system configuration</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              System Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Settings Categories</CardTitle>
                <CardDescription>Configure different aspects of your system</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          activeTab === category.id
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Add New User
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Hotel className="h-4 w-4" />
                  Add Hotel Property
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Database className="h-4 w-4" />
                  Backup Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="hotels">
                <HotelManagement />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentSettings />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationSettings />
              </TabsContent>

              <TabsContent value="appearance">
                <AppearanceSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
