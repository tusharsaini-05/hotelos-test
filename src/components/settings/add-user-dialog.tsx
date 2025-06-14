"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_USER } from "../../graphql/user/mutations"
import { GET_HOTELS } from "../../graphql/hotel/queries"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, AlertTriangle, Loader2 } from "lucide-react"
import { X } from "lucide-react" // Import X component
import type { Hotel } from "@/providers/hotel-provider"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated?: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  role: string
  selectedHotels: string[]
}

interface FormErrors {
  [key: string]: string
}

export default function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+66",
    role: "",
    selectedHotels: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showHotelWarning, setShowHotelWarning] = useState(false)

  // Fetch hotels from GraphQL
  const { data: hotelData, loading: hotelLoading } = useQuery(GET_HOTELS, {
    variables: {
      status: "ACTIVE",
      limit: 100,
      offset: 0,
    },
  })

  const hotelList: Hotel[] = hotelData?.hotel?.getHotels ?? []

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      toast({
        title: "✅ User Created Successfully!",
        description: `${data.createUser.name} has been added to the system.`,
      })
      resetForm()
      onOpenChange(false)
      onUserCreated?.()
    },
    onError: (err) => {
      toast({
        title: "❌ Error Creating User",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const roles = [
    { value: "SUPERADMIN", label: "Super Admin" },
    { value: "HOTEL_ADMIN", label: "Hotel Admin" },
    { value: "FRONTDESK", label: "Frontdesk" },
    { value: "RECEPTIONIST", label: "Receptionist" },
    { value: "STAFF", label: "Staff" },
    { value: "HOUSEKEEPER", label: "Housekeeper" },
    { value: "MAINTENANCE", label: "Maintenance" },
  ]

  const countryCodes = [
    { value: "+1", label: "+1" },
    { value: "+44", label: "+44" },
    { value: "+66", label: "+66" },
    { value: "+91", label: "+91" },
    { value: "+86", label: "+86" },
  ]

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+66",
      role: "",
      selectedHotels: [],
    })
    setErrors({})
    setShowHotelWarning(false)
  }

  // Handle role change and auto-select hotels for SUPERADMIN
  useEffect(() => {
    if (formData.role === "SUPERADMIN") {
      const allHotelIds = hotelList.map((hotel) => hotel.id)
      setFormData((prev) => ({ ...prev, selectedHotels: allHotelIds }))
      setShowHotelWarning(false)
    } else if (formData.role === "FRONTDESK" && formData.selectedHotels.length > 1) {
      // Keep only the first selected hotel for FRONTDESK
      setFormData((prev) => ({ ...prev, selectedHotels: [prev.selectedHotels[0]] }))
      setShowHotelWarning(true)
    } else {
      setShowHotelWarning(false)
    }
  }, [formData.role, hotelList])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleHotelSelection = (hotelId: string, checked: boolean) => {
    if (formData.role === "SUPERADMIN") {
      // SUPERADMIN cannot manually change hotel selection
      return
    }

    if (formData.role === "FRONTDESK") {
      if (checked) {
        // For FRONTDESK, only allow one hotel
        setFormData((prev) => ({ ...prev, selectedHotels: [hotelId] }))
        setShowHotelWarning(false)
      } else {
        setFormData((prev) => ({
          ...prev,
          selectedHotels: prev.selectedHotels.filter((id) => id !== hotelId),
        }))
      }
    } else {
      // For HOTEL_ADMIN and others, allow multiple selections
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          selectedHotels: [...prev.selectedHotels, hotelId],
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          selectedHotels: prev.selectedHotels.filter((id) => id !== hotelId),
        }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.role) newErrors.role = "Role is required"
    if (formData.selectedHotels.length === 0) newErrors.hotels = "At least one hotel must be selected"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
    const phoneNumber = formData.phone ? `${formData.countryCode}${formData.phone}` : null

    await createUser({
      variables: {
        userData: {
          name: fullName,
          email: formData.email.trim(),
          password: "TempPassword123!", // You might want to generate this or send via email
          role: formData.role,
          phone: phoneNumber,
          hotelIds: formData.selectedHotels,
        },
      },
    })
  }

  const getHotelSelectionTitle = () => {
    switch (formData.role) {
      case "SUPERADMIN":
        return "Select Hotel (All Hotels)"
      case "FRONTDESK":
        return "Select Hotel (Only One)"
      case "HOTEL_ADMIN":
        return "Select Hotel (Multiple Allowed)"
      default:
        return "Select Hotel"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">Add User</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-full">
         
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`bg-blue-50 ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`bg-blue-50 ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <div className="flex">
                <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                  <SelectTrigger className="w-20 bg-blue-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 ml-2 bg-blue-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-blue-50 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>
              Select Role<span className="text-red-500">*</span>
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger className={`bg-blue-50 ${errors.role ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Hotel Selection */}
          {formData.role && (
            <div className="space-y-4">
              <Label>{getHotelSelectionTitle()}</Label>

              {/* Warning for FRONTDESK role */}
              {formData.role === "FRONTDESK" && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Frontdesk role can only select one hotel.
                  </AlertDescription>
                </Alert>
              )}

              {/* Hotel List */}
              <div className="space-y-3 max-h-48 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {hotelLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading hotels...</span>
                  </div>
                ) : hotelList.length > 0 ? (
                  hotelList.map((hotel) => (
                    <div key={hotel.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={hotel.id}
                        checked={formData.selectedHotels.includes(hotel.id)}
                        onCheckedChange={(checked) => handleHotelSelection(hotel.id, checked as boolean)}
                        disabled={formData.role === "SUPERADMIN"}
                      />
                      <Label htmlFor={hotel.id} className="flex-1 cursor-pointer">
                        {hotel.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hotels available</p>
                )}
              </div>

              {errors.hotels && <p className="text-sm text-red-500">{errors.hotels}</p>}
            </div>
          )}

          {/* Info Message */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your contact information will be used for sending your login credentials
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={createLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              {createLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
