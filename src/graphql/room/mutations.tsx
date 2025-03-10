import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
  mutation CreateRoom($roomData: RoomInput!) {
    createRoom(roomData: $roomData) {
      id
      name
      type
      status
      pricePerNight
      amenities
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: String!, $roomData: RoomUpdateInput!) {
    updateRoom(id: $id, roomData: $roomData) {
      id
      name
      type
      status
      pricePerNight
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: String!) {
    deleteRoom(id: $id)
  }
`;

export const UPDATE_ROOM_STATUS = gql`
  mutation UpdateRoomStatus($roomId: String!, $status: RoomStatus!, $notes: String) {
    updateRoomStatus(roomId: $roomId, status: $status, notes: $notes) {
      id
      status
    }
  }
`;

export const BULK_UPDATE_ROOM_STATUS = gql`
  mutation BulkUpdateRoomStatus($roomIds: [String!]!, $status: RoomStatus!, $notes: String) {
    bulkUpdateRoomStatus(roomIds: $roomIds, status: $status, notes: $notes) {
      id
      status
    }
  }
`;

export const UPDATE_ROOM_AMENITIES = gql`
  mutation UpdateRoomAmenities($roomId: String!, $amenities: [String!]!, $operation: String!) {
    updateRoomAmenities(roomId: $roomId, amenities: $amenities, operation: $operation) {
      id
      amenities
    }
  }
`;

export const UPDATE_ROOM_PRICING = gql`
  mutation UpdateRoomPricing($roomId: String!, $pricePerNight: Float!, $extraBedPrice: Float) {
    updateRoomPricing(roomId: $roomId, pricePerNight: $pricePerNight, extraBedPrice: $extraBedPrice) {
      id
      pricePerNight
      extraBedPrice
    }
  }
`;

export const MARK_ROOM_MAINTENANCE = gql`
  mutation MarkRoomMaintenance(
    $roomId: String!
    $title: String!
    $description: String!
    $maintenanceType: MaintenanceType!
    $category: MaintenanceCategory!
    $priority: String!
    $estimatedDays: Int!
    $safetyNotes: String
    $partsRequired: [PartDetailInput!]
    $toolsRequired: [String!]
    $createdBy: String!
  ) {
    markRoomMaintenance(
      roomId: $roomId
      title: $title
      description: $description
      maintenanceType: $maintenanceType
      category: $category
      priority: $priority
      estimatedDays: $estimatedDays
      safetyNotes: $safetyNotes
      partsRequired: $partsRequired
      toolsRequired: $toolsRequired
      createdBy: $createdBy
    ) {
      id
      status
      maintenanceDetails {
        title
        description
        maintenanceType
        category
        priority
        estimatedDays
      }
    }
  }
`;
