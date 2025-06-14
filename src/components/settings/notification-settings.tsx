"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Save, Mail, Smartphone, MessageSquare } from "lucide-react"

export default function NotificationSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmation: true,
    bookingCancellation: true,
    checkInReminder: true,
    checkOutReminder: true,
    paymentReceived: true,
    maintenanceAlerts: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smsProvider: "twilio",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    emailTemplate: `Dear {{guestName}},

Thank you for your booking at {{hotelName}}.

Booking Details:
- Booking Number: {{bookingNumber}}
- Check-in: {{checkInDate}}
- Check-out: {{checkOutDate}}
- Room Type: {{roomType}}

We look forward to welcoming you!

Best regards,
{{hotelName}} Team`,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notification settings saved",
        description: "Notification preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure which notifications to send and how to deliver them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Methods</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Send browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <h3 className="font-semibold">Event Notifications</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Booking Confirmation</Label>
                <Switch
                  checked={settings.bookingConfirmation}
                  onCheckedChange={(checked) => setSettings({ ...settings, bookingConfirmation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Booking Cancellation</Label>
                <Switch
                  checked={settings.bookingCancellation}
                  onCheckedChange={(checked) => setSettings({ ...settings, bookingCancellation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Check-in Reminder</Label>
                <Switch
                  checked={settings.checkInReminder}
                  onCheckedChange={(checked) => setSettings({ ...settings, checkInReminder: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Check-out Reminder</Label>
                <Switch
                  checked={settings.checkOutReminder}
                  onCheckedChange={(checked) => setSettings({ ...settings, checkOutReminder: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Payment Received</Label>
                <Switch
                  checked={settings.paymentReceived}
                  onCheckedChange={(checked) => setSettings({ ...settings, paymentReceived: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Maintenance Alerts</Label>
                <Switch
                  checked={settings.maintenanceAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceAlerts: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>Configure SMTP settings for sending emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={settings.smtpUsername}
                onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                placeholder="App password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Configuration
          </CardTitle>
          <CardDescription>Configure SMS provider settings (Twilio)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account SID</Label>
              <Input
                value={settings.twilioAccountSid}
                onChange={(e) => setSettings({ ...settings, twilioAccountSid: e.target.value })}
                placeholder="Twilio Account SID"
              />
            </div>
            <div className="space-y-2">
              <Label>Auth Token</Label>
              <Input
                type="password"
                value={settings.twilioAuthToken}
                onChange={(e) => setSettings({ ...settings, twilioAuthToken: e.target.value })}
                placeholder="Twilio Auth Token"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={settings.twilioPhoneNumber}
              onChange={(e) => setSettings({ ...settings, twilioPhoneNumber: e.target.value })}
              placeholder="+1234567890"
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Email Template
          </CardTitle>
          <CardDescription>Customize the default email template for booking confirmations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Booking Confirmation Template</Label>
            <Textarea
              value={settings.emailTemplate}
              onChange={(e) => setSettings({ ...settings, emailTemplate: e.target.value })}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Available variables:{" "}
              {`{{guestName}}, {{hotelName}}, {{bookingNumber}}, {{checkInDate}}, {{checkOutDate}}, {{roomType}}`}
            </p>
          </div>
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
