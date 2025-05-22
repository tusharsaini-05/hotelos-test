import { gql } from "@apollo/client"
export const CREATE_USER = gql `mutation CreateUser($userData: UserInput!) {
  createUser(userData: $userData) {
    id
    email
    name
    role
    phone
    hotelIds
    createdAt
    updatedAt
  }
}`
export const UPDATE_USER = gql `mutation UpadateUser($id:String!,$userData: UserInput!) {
    createUser(userData: $userData) {
      id
      email
      name
      role
      phone
      hotelIds
      createdAt
      updatedAt
    }
  }`
 export const DELETE_USER = gql `mutation DeleteUser($id:String!) {
    deleteUser(id: $id)
  }`

 export const CHANGE_PASSWORD = gql `mutation ChangePassword($id: String!$currentPassword: String!,$newPassword: String!){
     changePassword(id:$id,currentPassword:$currentPassword,newPassword:$newPassword)
  }`

 export const ASSIGN_HOTELS_TO_USER = gql `mutation AssignHotelsToUser($userId:String!,$hotelIds:[String!]!){
     assignHotelsToUser(userId:$userId,hotelIds:$hotelIds){
        id
        email
        name
        role
        phone
        hotelIds
        createdAt
        updatedAt
     }
  } `

export  const UPDATE_USER_ROLE = gql `mutation UpdateUserRole($userId:String!,$newRole:String!){
     updateUserRole(userId:$userId,newRole:$newRole){
        id
        email
        name
        role
        phone
        hotelIds
        createdAt
        updatedAt
     }
  }`