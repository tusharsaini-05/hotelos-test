"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserPlus, Mail, Phone, Settings } from "lucide-react"
import AddUserDialog from "@/components/settings/add-user-dialog"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  // Mock users data - replace with real GraphQL query
  const users = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@hotel.com",
      phone: "+1-555-0123",
      role: "HOTEL_ADMIN",
      status: "ACTIVE",
      lastLogin: "2024-01-15 09:15 AM",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@hotel.com",
      phone: "+1-555-0102",
      role: "RECEPTIONIST",
      status: "ACTIVE",
      lastLogin: "2024-01-15 09:15 AM",
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "m.davis@example.com",
      phone: "+1-555-0156",
      role: "MAINTENANCE",
      status: "INACTIVE",
      lastLogin: "2024-01-10 02:30 PM",
    },
  ]

  const getRoleColor = (role: string) => {
    const colors = {
      SUPERADMIN: "bg-red-100 text-red-800",
      HOTEL_ADMIN: "bg-blue-100 text-blue-800",
      FRONTDESK: "bg-green-100 text-green-800",
      RECEPTIONIST: "bg-purple-100 text-purple-800",
      STAFF: "bg-gray-100 text-gray-800",
      HOUSEKEEPER: "bg-orange-100 text-orange-800",
      MAINTENANCE: "bg-yellow-100 text-yellow-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last login: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add User Dialog */}
      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onUserCreated={() => {
          // Refresh users list here
          console.log("User created, refresh list")
        }}
      />
    </div>
  )
}
