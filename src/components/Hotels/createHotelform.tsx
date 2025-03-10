"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_HOTEL } from "@/graphql/hotel/mutations";

const CreateHotelForm = () => {
  const [hotelData, setHotelData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    latitude: "",
    longitude: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    adminId: "",
    floorCount: "",
    starRating: "",
    amenities: "",
    checkInTime: "",
    checkOutTime: "",
    cancellationHours: "",
    paymentMethods: "",
    petPolicy: "",
    extraBedPolicy: ""
  });

  const [createHotel, { data, loading, error }] = useMutation(CREATE_HOTEL);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createHotel({
        variables: {
          hotelData: {
            name:hotelData.name,
            description:hotelData.description,
            address:hotelData.address,
            city:hotelData.city,
            state:hotelData.state,
            country:hotelData.country,
            zipcode:hotelData.zipcode,
            latitude: parseFloat(hotelData.latitude),
            longitude: parseFloat(hotelData.longitude),
            contactPhone:hotelData.contactPhone,
            contactEmail:hotelData.contactEmail,
            website:hotelData.website,
            adminId:hotelData.adminId,
            floorCount: parseInt(hotelData.floorCount),
            starRating: parseInt(hotelData.starRating),
            amenities: hotelData.amenities.split(","),
            policies: {
              checkInTime: hotelData.checkInTime,
              checkOutTime: hotelData.checkOutTime,
              cancellationHours: parseInt(hotelData.cancellationHours),
              paymentMethods: hotelData.paymentMethods.split(","),
              petPolicy: hotelData.petPolicy,
              extraBedPolicy: hotelData.extraBedPolicy
            },
          },
        },
      });
      alert("Hotel Created Successfully!");
    } catch (err) {
      console.error("Error creating hotel:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create a New Hotel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Hotel Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded"></textarea>
        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="state" placeholder="State" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="country" placeholder="Country" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="zipcode" placeholder="Zipcode" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="latitude" placeholder="Latitude" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="number" name="longitude" placeholder="Longitude" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="contactPhone" placeholder="Phone" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="contactEmail" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="website" placeholder="Website" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="adminId" placeholder="Admin ID" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="floorCount" placeholder="Floor Count" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="starRating" placeholder="Star Rating" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="amenities" placeholder="Amenities (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="checkInTime" placeholder="Check-in Time" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="checkOutTime" placeholder="Check-out Time" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="cancellationHours" placeholder="Cancellation Hours" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="paymentMethods" placeholder="Payment Methods (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="petPolicy" placeholder="Pet Policy" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="extraBedPolicy" placeholder=" extraBedPolicy" onChange={handleChange} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {loading ? "Creating..." : "Create Hotel"}
        </button>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && <p className="text-green-500">Hotel Created: {data.createHotel.name}</p>}
      </form>
    </div>
  );
};

export default CreateHotelForm;
