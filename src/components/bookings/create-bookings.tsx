import { BookingForm } from "./booking-form";

export default function CreateBookingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>
      <BookingForm />
    </div>
  );
}
