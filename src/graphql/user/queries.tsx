import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: String!) {
    user{
       getUser(id: $id) {
      id
      name
      email
      role
      phone
      isActive
      createdAt
      updatedAt
    }
  }
    }
    
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    user{
       getUserByEmail(email: $email) {
      id
      name
      email
      role
      phone
      isActive
      createdAt
      updatedAt
    }
  }
    }
    
`;

export const LIST_USERS = gql`
  query ListUsers($hotelId: String, $isActive: Boolean, $limit: Int!, $role: UserRole, $skip: Int!) { 
    user{
      listUsers(hotelId: $hotelId, isActive: $isActive, limit: $limit, role: $role, skip: $skip) {
      id
      name
      email
      role
      phone
      hotelIds
      isActive
      createdAt
      updatedAt
    }
  }
    }
  
`;

export const GET_HOTEL_STAFF = gql`
  query GetHotelStaff($hotelId: String!, $role: UserRole) {
   user{
      getHotelStaff(hotelId: $hotelId, role: $role) {
      id
      name
      email
      role
      phone
    }
  }
   }
    
`;

export const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: String!) {
  user{
    getUserPermissions(userId: $userId) {
      id
      permission
    }
  }
  
  }
  
`;

export const SEARCH_USERS = gql`
  query SearchUsers($limit: Int!, $query: String!, $skip: Int!) {
  user{
    searchUsers(limit: $limit, query: $query, skip: $skip) {
      id
      name
      email
      role
    }
  }
  
  }
  
`;
