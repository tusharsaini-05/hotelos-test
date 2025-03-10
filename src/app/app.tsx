"use client"
import { useState } from "react"
import {gql,useQuery,useMutation} from "@apollo/client"
import {signIn,signOut} from "next-auth/react"
import { GET_USER_BY_EMAIL } from "@/graphql/user/queries"
// app/page.js
const GET_USER = gql `query  GetUserByEmail($email: String!) {
  user{
    getUserByEmail(email:$email){
      role
      id
    }
  }
}`
const CREATE_USER = gql `mutation CreateUser($userData: UserInput!) {
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



function App(){

  const [newUser,setNewUser] = useState({})
  const handleCreateUser = async() =>{
    const {data,error,loading} = useQuery(GET_USER_BY_EMAIL,{variables:{
      "email":"rahul@example.com"
     }
  })
  }

  const [createUser] = useMutation(CREATE_USER,{variables:{
    "userData": {
      "email": "sumit@example.com",
      "name": "Rahul",
      "role": "SUPERADMIN",
      "password": "securePassword123",
      "phone": "1234567890",
      "hotelIds": ["65f2a6b8e7c9d4f1a3b2c9e8"]
    }
  }});
  
  
  return (
  <div className="App">
    <div>
      <button onClick={() => (signIn())}>SignIn</button>
      <button onClick={() => (signOut())}>SignOut</button>
      
    </div>
  </div>
  );
    
}
export default App;