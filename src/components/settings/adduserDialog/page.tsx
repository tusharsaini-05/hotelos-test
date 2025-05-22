// components/AddUserDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [userFirstName, SetuserFirstName] = useState<String|null>("")
  const [userLastName, SetuserLastName] = useState<String|null>("")
  
  const permissions = [
    "Amenities", "And Report", "Bookings Report", "Calendar", "Country Reports",
    "Create Orders", "Day End Report", "Delete Role", "Delete Staff", "Edit Staff", "FAQ",
    "Features", "German Statistic Report", "Get Help", "Guest Request Report", "Guest Revenue Report",
    "Guest Reviews", "Housekeeping", "Housekeeping Settings"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="First Name" required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Last Name" required />
          </div>
          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" placeholder="+66" required />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="Email Address" required />
          </div>
          <div className="col-span-2">
            <Label htmlFor="role">Select Role</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {["Administrator", "Duty Manager", "Guest Relations Executive", "Hotel Accountant", "Hotel Manager"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Permissions</Label>
            <ScrollArea className="h-32 rounded-md border p-2">
              <div className="flex flex-wrap gap-2">
                {permissions.map((perm) => (
                  <Badge key={perm} variant="outline">{perm}</Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="pt-4 text-right">
          <Button type="submit">Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
