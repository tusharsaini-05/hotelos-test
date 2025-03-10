import { gql } from "@apollo/client";

export const CREATE_HOTEL = gql`
  mutation CreateHotel($hotelData: HotelInput!) {
    createHotel(hotelData: $hotelData) {
      id
      name
      address
      city
      state
      country
      zipcode
      contactPhone
      contactEmail
      adminId
      status
      amenities
      roomCount
      floorCount
      starRating
      policies {
        checkInTime
        checkOutTime
        cancellationHours
      }
      images
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_HOTEL = gql`
  mutation UpdateHotel($id: String!, $hotelData: HotelUpdateInput!) {
    updateHotel(id: $id, hotelData: $hotelData) {
      id
      name
      description
      address
      city
      state
      country
      zipcode
    }
  }
`;

export const DELETE_HOTEL = gql`
  mutation DeleteHotel($id: String!) {
    deleteHotel(id: $id)
  }
`;

export const UPDATE_HOTEL_POLICIES = gql`
  mutation UpdateHotelPolicies($hotelId: String!, $policies: HotelPolicyInput!) {
    updateHotelPolicies(hotelId: $hotelId, policies: $policies) {
      id
      policies {
        checkInTime
        checkOutTime
        cancellationPolicy
      }
    }
  }
`;

export const ADD_HOTEL_AMENITIES = gql`
  mutation AddHotelAmenities($hotelId: String!, $amenities: [String!]!) {
    addHotelAmenities(hotelId: $hotelId, amenities: $amenities) {
      id
      amenities
    }
  }
`;

export const REMOVE_HOTEL_AMENITIES = gql`
  mutation RemoveHotelAmenities($hotelId: String!, $amenities: [String!]!) {
    removeHotelAmenities(hotelId: $hotelId, amenities: $amenities) {
      id
      amenities
    }
  }
`;

export const UPDATE_HOTEL_IMAGES = gql`
  mutation UpdateHotelImages($hotelId: String!, $images: [String!]!, $operation: String!) {
    updateHotelImages(hotelId: $hotelId, images: $images, operation: $operation) {
      id
      images
    }
  }
`;

export const CHANGE_HOTEL_STATUS = gql`
  mutation ChangeHotelStatus($hotelId: String!, $status: String!, $reason: String) {
    changeHotelStatus(hotelId: $hotelId, status: $status, reason: $reason) {
      id
      status
    }
  }
`;

export const ASSIGN_HOTEL_ADMIN = gql`
  mutation AssignHotelAdmin($hotelId: String!, $adminId: String!) {
    assignHotelAdmin(hotelId: $hotelId, adminId: $adminId) {
      id
      adminId
    }
  }
`;

export const UPDATE_HOTEL_LOCATION = gql`
  mutation UpdateHotelLocation(
    $hotelId: String!
    $latitude: Float!
    $longitude: Float!
    $address: String
    $city: String
    $state: String
    $country: String
    $zipcode: String
  ) {
    updateHotelLocation(
      hotelId: $hotelId
      latitude: $latitude
      longitude: $longitude
      address: $address
      city: $city
      state: $state
      country: $country
      zipcode: $zipcode
    ) {
      id
      latitude
      longitude
      address
      city
      state
      country
      zipcode
    }
  }
`;
