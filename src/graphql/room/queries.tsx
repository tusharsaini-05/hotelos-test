import { gql } from "@apollo/client";

export const GET_ROOM = gql`
  query GetRoom($roomId: String!) {
    room(roomId: $roomId) {
      id
      hotelId
      roomNumber
      floor
      roomType
      status
      pricePerNight
      baseOccupancy
      maxOccupancy
      extraBedAllowed
      extraBedPrice
      roomSize
      bedType
      bedCount
      amenities
      description
      images
      isSmoking
      isActive
      lastCleaned
      lastMaintained
      maintenanceNotes
      createdAt
      updatedAt
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms(
    $bedType: BedType
    $hotelId: String
    $limit: Int
    $maxPrice: Float
    $minPrice: Float
    $offset: Int
    $roomType: RoomType
    $status: RoomStatus
  ) {
    rooms(
      bedType: $bedType
      hotelId: $hotelId
      limit: $limit
      maxPrice: $maxPrice
      minPrice: $minPrice
      offset: $offset
      roomType: $roomType
      status: $status
    ) {
      id
      hotelId
      roomNumber
      floor
      roomType
      status
      pricePerNight
      baseOccupancy
      maxOccupancy
      bedType
      bedCount
      amenities
    }
  }
`;

export const GET_AVAILABLE_ROOMS = gql`
  query GetAvailableRooms(
    $checkInDate: DateTime!
    $checkOutDate: DateTime!
    $guests: Int
    $hotelId: String!
    $roomType: RoomType
  ) {
    availableRooms(
      checkInDate: $checkInDate
      checkOutDate: $checkOutDate
      guests: $guests
      hotelId: $hotelId
      roomType: $roomType
    ) {
      id
      hotelId
      roomNumber
      floor
      roomType
      status
      pricePerNight
      baseOccupancy
      maxOccupancy
      bedType
      bedCount
      amenities
    }
  }
`;

export const GET_ROOMS_BY_AMENITIES = gql`
  query GetRoomsByAmenities($amenities: [String!]!, $hotelId: String!) {
    roomsByAmenities(amenities: $amenities, hotelId: $hotelId) {
      id
      hotelId
      roomNumber
      floor
      roomType
      status
      pricePerNight
      bedType
      amenities
    }
  }
`;

export const GET_ROOMS_BY_STATUS = gql`
  query GetRoomsByStatus($hotelId: String!, $status: RoomStatus!) {
    roomsByStatus(hotelId: $hotelId, status: $status) {
      id
      hotelId
      roomNumber
      floor
      roomType
      status
      pricePerNight
      bedType
      amenities
    }
  }
`;
