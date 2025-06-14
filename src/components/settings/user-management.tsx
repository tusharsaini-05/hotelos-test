"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, UserPlus, Mail, Phone, Settings, MoreHorizontal, AlertCircle, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LIST_USERS } from "../../graphql/user/queries"
import AddUserDialog from "./add-user-dialog"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  hotelIds: string[]
  createdAt: string
  updatedAt: string
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  // Fetch users from GraphQL
  const {
    data: userData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(LIST_USERS, {
    variables: {
      limit: 100,
      skip: 0,
      isActive: undefined, // Get both active and inactive users
      role: undefined, // Get all roles
      hotelId: undefined, // Get users from all hotels
    },
    errorPolicy: "all",
  })

  // Extract users from GraphQL response
  const users: User[] = userData?.user?.listUsers ?? []

  const getRoleColor = (role: string) => {
    const colors = {
      SUPERADMIN: "bg-red-100 text-red-800 border-red-200",
      HOTEL_ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
      FRONTDESK: "bg-green-100 text-green-800 border-green-200",
      RECEPTIONIST: "bg-purple-100 text-purple-800 border-purple-200",
      STAFF: "bg-gray-100 text-gray-800 border-gray-200",
      HOUSEKEEPER: "bg-orange-100 text-orange-800 border-orange-200",
      MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserCreated = () => {
    // Refresh users list after creating a new user
    refetchUsers()
    console.log("User created, refreshing list...")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "N/A"
    }
  }

  const getHotelDisplay = (hotelIds: string[]) => {
    if (!hotelIds || hotelIds.length === 0) return "No hotels assigned"
    if (hotelIds.length === 1) return `${hotelIds.length} hotel`
    return `${hotelIds.length} hotels`
  }

  // Loading state
  if (usersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
          </div>
          <Button disabled className="gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>

        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading User Cards */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (usersError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
          </div>
          <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load users: {usersError.message}
            <Button variant="outline" size="sm" onClick={() => refetchUsers()} className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        <AddUserDialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog} onUserCreated={handleUserCreated} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role.includes("ADMIN")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => !u.role.includes("ADMIN")).length}
            </div>
          </CardContent>
        </Card>
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
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-500">Created: {formatDate(user.createdAt)}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">Hotels: {getHotelDisplay(user.hotelIds)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(user.isActive)}>{user.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
                  <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        {user.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !usersLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">{searchTerm ? "No users found matching your search." : "No users found."}</p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-2">
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add User Dialog */}
      <AddUserDialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog} onUserCreated={handleUserCreated} />
    </div>
  )
}
