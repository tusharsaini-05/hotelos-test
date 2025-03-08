
import { getServerSession } from "next-auth"
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
// app/page.js
import { ApolloClient,ApolloProvider,InMemoryCache } from "@apollo/client";
import App from "./app"

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache()
})


async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

export default async function Home() {

  const session = await getUser();

 
  return (
  <div>
    {JSON.stringify(session)}
    <App />
  </div>
  );
}
