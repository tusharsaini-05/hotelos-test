"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Save, Key, Lock, AlertTriangle } from "lucide-react"

export default function SecuritySettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    passwordMinLength: "8",
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    ipWhitelist: "",
    auditLogging: true,
    encryptionEnabled: true,
    backupEncryption: true,
    sslRequired: true,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Security settings saved",
        description: "Security configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentication Settings
          </CardTitle>
          <CardDescription>Configure user authentication and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Lockout Duration (minutes)</Label>
            <Input
              value={settings.lockoutDuration}
              onChange={(e) => setSettings({ ...settings, lockoutDuration: e.target.value })}
              placeholder="15"
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policy
          </CardTitle>
          <CardDescription>Set password requirements and complexity rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Minimum Password Length</Label>
            <Select
              value={settings.passwordMinLength}
              onValueChange={(value) => setSettings({ ...settings, passwordMinLength: value })}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 characters</SelectItem>
                <SelectItem value="8">8 characters</SelectItem>
                <SelectItem value="10">10 characters</SelectItem>
                <SelectItem value="12">12 characters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Require Uppercase Letters</Label>
              <Switch
                checked={settings.passwordRequireUppercase}
                onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireUppercase: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Numbers</Label>
              <Switch
                checked={settings.passwordRequireNumbers}
                onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireNumbers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Special Characters</Label>
              <Switch
                checked={settings.passwordRequireSymbols}
                onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireSymbols: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Control
          </CardTitle>
          <CardDescription>Configure IP restrictions and access policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>IP Whitelist</Label>
            <Input
              value={settings.ipWhitelist}
              onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
              placeholder="192.168.1.0/24, 10.0.0.0/8 (comma separated)"
            />
            <p className="text-xs text-gray-500">Leave empty to allow access from any IP address</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Audit Logging</Label>
              <p className="text-sm text-gray-500">Log all user actions and system events</p>
            </div>
            <Switch
              checked={settings.auditLogging}
              onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require SSL/HTTPS</Label>
              <p className="text-sm text-gray-500">Force all connections to use HTTPS</p>
            </div>
            <Switch
              checked={settings.sslRequired}
              onCheckedChange={(checked) => setSettings({ ...settings, sslRequired: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Data Protection
          </CardTitle>
          <CardDescription>Configure encryption and data security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Database Encryption</Label>
              <p className="text-sm text-gray-500">Encrypt sensitive data in the database</p>
            </div>
            <Switch
              checked={settings.encryptionEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, encryptionEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Encryption</Label>
              <p className="text-sm text-gray-500">Encrypt database backups</p>
            </div>
            <Switch
              checked={settings.backupEncryption}
              onCheckedChange={(checked) => setSettings({ ...settings, backupEncryption: checked })}
            />
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
