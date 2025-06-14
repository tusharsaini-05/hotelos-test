"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Database, Save, Wifi, Calendar, BarChart3, MapPin } from "lucide-react"

export default function IntegrationSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState({
    pms: {
      enabled: false,
      provider: "opera",
      apiKey: "",
      endpoint: "",
    },
    channelManager: {
      enabled: true,
      provider: "siteminder",
      apiKey: "sm_test_123...",
      endpoint: "https://api.siteminder.com",
    },
    analytics: {
      enabled: true,
      provider: "google",
      trackingId: "GA-123456789",
      apiKey: "",
    },
    maps: {
      enabled: true,
      provider: "google",
      apiKey: "AIza...",
    },
    wifi: {
      enabled: false,
      provider: "unifi",
      controllerUrl: "",
      username: "",
      password: "",
    },
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Integration settings saved",
        description: "Third-party integrations have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save integration settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateIntegration = (key: string, field: string, value: any) => {
    setIntegrations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Property Management System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Property Management System (PMS)
          </CardTitle>
          <CardDescription>Connect with external PMS for room inventory and guest data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Label>Opera PMS Integration</Label>
                <p className="text-sm text-gray-500">Sync with Oracle Opera PMS</p>
              </div>
              <Badge variant={integrations.pms.enabled ? "default" : "secondary"}>
                {integrations.pms.enabled ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Switch
              checked={integrations.pms.enabled}
              onCheckedChange={(checked) => updateIntegration("pms", "enabled", checked)}
            />
          </div>

          {integrations.pms.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={integrations.pms.apiKey}
                    onChange={(e) => updateIntegration("pms", "apiKey", e.target.value)}
                    placeholder="Enter Opera API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input
                    value={integrations.pms.endpoint}
                    onChange={(e) => updateIntegration("pms", "endpoint", e.target.value)}
                    placeholder="https://api.opera.com"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Channel Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Channel Manager
          </CardTitle>
          <CardDescription>Manage room availability across booking channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Label>SiteMinder Integration</Label>
                <p className="text-sm text-gray-500">Distribute rates and availability</p>
              </div>
              <Badge variant={integrations.channelManager.enabled ? "default" : "secondary"}>
                {integrations.channelManager.enabled ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Switch
              checked={integrations.channelManager.enabled}
              onCheckedChange={(checked) => updateIntegration("channelManager", "enabled", checked)}
            />
          </div>

          {integrations.channelManager.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={integrations.channelManager.apiKey}
                    onChange={(e) => updateIntegration("channelManager", "apiKey", e.target.value)}
                    placeholder="Enter SiteMinder API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input
                    value={integrations.channelManager.endpoint}
                    onChange={(e) => updateIntegration("channelManager", "endpoint", e.target.value)}
                    placeholder="https://api.siteminder.com"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Tracking
          </CardTitle>
          <CardDescription>Track website traffic and user behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Label>Google Analytics</Label>
                <p className="text-sm text-gray-500">Track website performance</p>
              </div>
              <Badge variant={integrations.analytics.enabled ? "default" : "secondary"}>
                {integrations.analytics.enabled ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Switch
              checked={integrations.analytics.enabled}
              onCheckedChange={(checked) => updateIntegration("analytics", "enabled", checked)}
            />
          </div>

          {integrations.analytics.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tracking ID</Label>
                  <Input
                    value={integrations.analytics.trackingId}
                    onChange={(e) => updateIntegration("analytics", "trackingId", e.target.value)}
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key (Optional)</Label>
                  <Input
                    type="password"
                    value={integrations.analytics.apiKey}
                    onChange={(e) => updateIntegration("analytics", "apiKey", e.target.value)}
                    placeholder="For reporting API access"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Maps & Location
          </CardTitle>
          <CardDescription>Display hotel locations and nearby attractions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Label>Google Maps</Label>
                <p className="text-sm text-gray-500">Show interactive maps</p>
              </div>
              <Badge variant={integrations.maps.enabled ? "default" : "secondary"}>
                {integrations.maps.enabled ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Switch
              checked={integrations.maps.enabled}
              onCheckedChange={(checked) => updateIntegration("maps", "enabled", checked)}
            />
          </div>

          {integrations.maps.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Google Maps API Key</Label>
                <Input
                  type="password"
                  value={integrations.maps.apiKey}
                  onChange={(e) => updateIntegration("maps", "apiKey", e.target.value)}
                  placeholder="Enter Google Maps API key"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WiFi Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            WiFi Management
          </CardTitle>
          <CardDescription>Manage guest WiFi access and monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Label>UniFi Controller</Label>
                <p className="text-sm text-gray-500">Manage Ubiquiti UniFi network</p>
              </div>
              <Badge variant={integrations.wifi.enabled ? "default" : "secondary"}>
                {integrations.wifi.enabled ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Switch
              checked={integrations.wifi.enabled}
              onCheckedChange={(checked) => updateIntegration("wifi", "enabled", checked)}
            />
          </div>

          {integrations.wifi.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Controller URL</Label>
                <Input
                  value={integrations.wifi.controllerUrl}
                  onChange={(e) => updateIntegration("wifi", "controllerUrl", e.target.value)}
                  placeholder="https://unifi.hotel.com:8443"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={integrations.wifi.username}
                    onChange={(e) => updateIntegration("wifi", "username", e.target.value)}
                    placeholder="UniFi username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={integrations.wifi.password}
                    onChange={(e) => updateIntegration("wifi", "password", e.target.value)}
                    placeholder="UniFi password"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
