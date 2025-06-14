"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Save, DollarSign, Percent } from "lucide-react"

export default function PaymentSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalEnabled: false,
    paypalClientId: "",
    paypalClientSecret: "",
    defaultCurrency: "USD",
    taxRate: "8.5",
    serviceFee: "2.5",
    cancellationFee: "25.00",
    autoRefund: true,
    requireDeposit: true,
    depositPercentage: "20",
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Payment settings saved",
        description: "Payment configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateways
          </CardTitle>
          <CardDescription>Configure payment processors and their API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stripe */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Stripe</h3>
                <p className="text-sm text-gray-600">Accept credit cards and digital payments</p>
              </div>
              <Switch
                checked={settings.stripeEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, stripeEnabled: checked })}
              />
            </div>

            {settings.stripeEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Publishable Key</Label>
                    <Input
                      type="password"
                      value={settings.stripePublicKey}
                      onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={settings.stripeSecretKey}
                      onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PayPal */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">PayPal</h3>
                <p className="text-sm text-gray-600">Accept PayPal payments</p>
              </div>
              <Switch
                checked={settings.paypalEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, paypalEnabled: checked })}
              />
            </div>

            {settings.paypalEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client ID</Label>
                    <Input
                      value={settings.paypalClientId}
                      onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Secret</Label>
                    <Input
                      type="password"
                      value={settings.paypalClientSecret}
                      onChange={(e) => setSettings({ ...settings, paypalClientSecret: e.target.value })}
                      placeholder="PayPal Client Secret"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing & Fees
          </CardTitle>
          <CardDescription>Configure taxes, service fees, and other charges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                placeholder="8.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Fee (%)</Label>
              <Input
                value={settings.serviceFee}
                onChange={(e) => setSettings({ ...settings, serviceFee: e.target.value })}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2">
              <Label>Cancellation Fee ($)</Label>
              <Input
                value={settings.cancellationFee}
                onChange={(e) => setSettings({ ...settings, cancellationFee: e.target.value })}
                placeholder="25.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Booking Policies
          </CardTitle>
          <CardDescription>Configure deposit requirements and refund policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Refunds</Label>
              <p className="text-sm text-gray-500">Automatically process refunds for eligible cancellations</p>
            </div>
            <Switch
              checked={settings.autoRefund}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRefund: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Deposit</Label>
              <p className="text-sm text-gray-500">Require a deposit when booking is created</p>
            </div>
            <Switch
              checked={settings.requireDeposit}
              onCheckedChange={(checked) => setSettings({ ...settings, requireDeposit: checked })}
            />
          </div>

          {settings.requireDeposit && (
            <div className="space-y-2">
              <Label>Deposit Percentage (%)</Label>
              <Input
                value={settings.depositPercentage}
                onChange={(e) => setSettings({ ...settings, depositPercentage: e.target.value })}
                placeholder="20"
                className="max-w-xs"
              />
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
