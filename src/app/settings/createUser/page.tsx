"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_USER } from "../../../graphql/user/mutations";
import { GET_HOTELS } from "../../../graphql/hotel/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { Hotel } from "@/providers/hotel-provider";

export default function AddUserPage() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    hotelId: "",
  });

  const { data: hotelData, loading: hotelLoading } = useQuery(GET_HOTELS, {
    variables: {
      status: "ACTIVE",
      limit: 50,
      offset: 0,
    },
  });
  const hotelList = hotelData?.hotel?.getHotels ?? [];
  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      toast({
        title: "User created",
        description: `User ${data.createUser.name} created successfully.`,
      });
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        hotelId: "",
      });
    },
    onError: (err) => {
      toast({
        title: "Error creating user",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password, role, phone, hotelId } = formData;
    if (!name || !email || !password || !role || !hotelId) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    await createUser({
      variables: {
        userData: {
          name,
          email,
          password,
          role,
          phone: phone || null,
          hotelIds: [hotelId],
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white overflow-visible">
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="col-span-2">
          <Label>Role</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {["SUPERADMIN","HOTEL_ADMIN", "STAFF", "RECEPTIONIST", "HOUSEKEEPER", "MAINTENANCE"].map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label>Hotel</Label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, hotelId: value })}
            disabled={hotelLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={hotelLoading ? "Loading hotels..." : "Select Hotel"} />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {hotelList.length ? 
                hotelList.map((hotel: Hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))
               : (
                <div className="p-4 text-sm text-muted-foreground">No hotels found</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-6 text-right">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </Button>
      </div>
    </div>
  );
}
