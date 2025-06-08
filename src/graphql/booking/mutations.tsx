import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking($bookingData: BookingInput!) {
    createBooking(bookingData: $bookingData) {
      id
      bookingNumber
      bookingStatus
    }
  }
`;
