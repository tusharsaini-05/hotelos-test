"use client";

import { gql, useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "@/graphql/booking/mutations";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useHotelContext } from "@/providers/hotel-provider";

// RoomType enum matching backend
const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"] as const;

const bookingSchema = z.object({
  checkInDate: z.date(),
  checkOutDate: z.date(),
  numberOfGuests: z.number().min(1),
  bookingSource: z.enum(["DIRECT", "WEBSITE", "OTA", "PHONE", "WALK_IN", "CORPORATE"]),
  specialRequests: z.string().optional(),
  guest: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  roomTypeBookings: z.array(
    z.object({
      roomType: z.enum(ROOM_TYPES),
      numberOfRooms: z.number().min(1),
    })
  ),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [createBooking] = useMutation(CREATE_BOOKING);
  const { selectedHotel } = useHotelContext();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomTypeBookings: [],
    },
  });

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypeBookings",
  });

  const watchRoomTypeBookings = useWatch({
    control,
    name: "roomTypeBookings",
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const result = await createBooking({
        variables: {
          bookingData: {
            ...data,
            hotelId: selectedHotel?.id, // Taken from context
            ratePlan: null,
          },
        },
      });
      alert("Booking created: " + result.data.createBooking.bookingNumber);
    } catch (error) {
      console.error(error);
      alert("Error creating booking");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Guest Information</h2>
      <Input placeholder="First Name" {...register("guest.firstName")} />
      <Input placeholder="Last Name" {...register("guest.lastName")} />
      <Input placeholder="Email" {...register("guest.email")} />
      <Input placeholder="Phone" {...register("guest.phone")} />

      <h2 className="text-xl font-semibold pt-6">Booking Details</h2>
      <Input type="date" {...register("checkInDate", { valueAsDate: true })} />
      <Input type="date" {...register("checkOutDate", { valueAsDate: true })} />
      <Input
        type="number"
        placeholder="No. of Guests"
        {...register("numberOfGuests", { valueAsNumber: true })}
      />
      <Select
        onValueChange={(value) => setValue("bookingSource", value as BookingFormValues["bookingSource"])}
        value={watch("bookingSource")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Booking Source" />
        </SelectTrigger>
        <SelectContent>
          {["DIRECT", "WEBSITE", "OTA", "PHONE", "WALK_IN", "CORPORATE"].map((source) => (
            <SelectItem key={source} value={source}>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input placeholder="Special Requests" {...register("specialRequests")} />

      <h2 className="text-xl font-semibold pt-6">Room Type Bookings</h2>
      {fields.map((field, index) => {
        const currentRoomType = watchRoomTypeBookings?.[index]?.roomType ?? "";

        return (
          <div key={field.id} className="flex gap-2 items-center">
            <Select
              value={currentRoomType}
              onValueChange={(value) =>
                setValue(`roomTypeBookings.${index}.roomType`, value as (typeof ROOM_TYPES)[number])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="No. of Rooms"
              {...register(`roomTypeBookings.${index}.numberOfRooms`, {
                valueAsNumber: true,
              })}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
      >
        + Add Room Type
      </Button>

      <Button type="submit" className="mt-6">
        Create Booking
      </Button>
    </form>
  );
}
