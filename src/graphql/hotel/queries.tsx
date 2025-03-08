import { gql } from "@apollo/client";

export const GET_HOTEL = gql`
  query GetHotel($id: String!) {
    hotel{
      getHotel(id: $id) {
      id
      name
      description
      address
      city
      state
      country
      zipcode
      latitude
      longitude
      contactPhone
      contactEmail
      website
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
        paymentMethods
        petPolicy
        extraBedPolicy
      }
      images
      createdAt
      updatedAt
    }
  }
    }
    
`;

export const GET_HOTELS = gql`
  query GetHotels(
    $status: HotelStatus
    $city: String
    $country: String
    $adminId: String
    $limit: Int!
    $offset: Int!
  ) {
    hotel{
      getHotels(
      status: $status
      city: $city
      country: $country
      adminId: $adminId
      limit: $limit
      offset: $offset
    ) {
      id
      name
      city
      country
      status
      starRating
      roomCount
      amenities
    }
  }

    }
    
`;

export const SEARCH_HOTELS = gql`
  query SearchHotels($query: String!, $limit: Int!, $offset: Int!) {
    hotel{
      searchHotels(query: $query, limit: $limit, offset: $offset) {
      id
      name
      city
      country
      starRating
    }
  }
    }
    
`;

export const GET_HOTELS_BY_AMENITIES = gql`
  query GetHotelsByAmenities($amenities: [String!]!, $limit: Int!, $offset: Int!) {
   hotel{

     getHotelsByAmenities(amenities: $amenities, limit: $limit, offset: $offset) {
      id
      name
      city
      amenities
      starRating
    }
  }
   }
    
`;

export const GET_HOTELS_BY_LOCATION = gql`
  query GetHotelsByLocation($latitude: Float!, $longitude: Float!, $radius: Float!, $limit: Int!, $offset: Int!) {
    hotel{
      getHotelsByLocation(latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, offset: $offset) {
      id
      name
      city
      latitude
      longitude
      starRating
    }
  }
    }
`;

export const GET_HOTELS_BY_RATING = gql`
  query GetHotelsByRating($minRating: Int!, $maxRating: Int!, $limit: Int!, $offset: Int!) {
    hotel{
      getHotelsByRating(minRating: $minRating, maxRating: $maxRating, limit: $limit, offset: $offset) {
      id
      name
      city
      starRating
    }
  }
    }
`;

export const GET_HOTELS_BY_ADMIN = gql`
  query GetHotelsByAdmin($adminId: String!, $limit: Int!, $offset: Int!) {
    hotel{
      getHotelsByAdmin(adminId: $adminId, limit: $limit, offset: $offset) {
      id
      name
      city
      adminId
      starRating
    }
  }
    }
`;
