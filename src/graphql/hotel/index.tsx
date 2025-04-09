import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_HOTEL, DELETE_HOTEL, UPDATE_HOTEL } from "./mutations";
import {HotelInput, HotelUpdateInput } from "../types";
const HotelManager = () => {
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    contactPhone: "",
    contactEmail: "",
    adminId: "",
  });

  const [createHotel, { data: createData, loading: createLoading, error: createError }] = useMutation(CREATE_HOTEL);
  const [deleteHotel, { data: deleteData }] = useMutation(DELETE_HOTEL);
  const [updateHotel, { data: updateData }] = useMutation(UPDATE_HOTEL);

  const handleCreateHotel = async () => {
    try {
      await createHotel({ variables: { hotelData } });
      alert("Hotel Created Successfully!");
    } catch (err) {
      console.error("Error creating hotel:", err);
    }
  };

  const handleDeleteHotel = async (id:string) => {
    try {
      await deleteHotel({ variables: { id } });
      alert("Hotel Deleted Successfully!");
    } catch (err) {
      console.error("Error deleting hotel:", err);
    }
  };

  const handleUpdateHotel = async (id:string, updateData:{id: string,
    hotelData: HotelUpdateInput
    }) => {
    try {
      await updateHotel({ variables: { id, hotelData: updateData } });
      alert("Hotel Updated Successfully!");
    } catch (err) {
      console.error("Error updating hotel:", err);
    }
  };

  return (
    <div>
      <h2>Manage Hotels</h2>

      <button onClick={handleCreateHotel} disabled={createLoading}>
        {createLoading ? "Creating..." : "Create Hotel"}
      </button>

      <button onClick={() => handleDeleteHotel("hotel-id")}>
        Delete Hotel
      </button>

      

      {createError && <p>Error: {createError.message}</p>}
    </div>
  );
};

export default HotelManager;
