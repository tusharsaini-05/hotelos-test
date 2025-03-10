import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH_CONFIG = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "" },
      },
      async authorize(credentials:any) {
        try {
          const response = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`, // If needed
            },
            body: JSON.stringify({
              query: `
                query GetUserByEmail($email: String!) {
                  user {
                    getUserByEmail(email: $email) {
                      id
                      email
                      role
                    }
                  }
                }
              `,
              variables: {
                email: credentials.username,
              },
            }),
          });

          const { data, errors } = await response.json();

          if (errors || !data?.user?.getUserByEmail) {
            console.error("User not found", errors);
            return null; // Reject login
          }

          const user = data.user.getUserByEmail;
          return {
            id: user.id,
            name: credentials.username,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error fetching user:", error);
          return null; // Reject login
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
        if (user) {
            token.uid = user.id;
        }
        return token;
        },
      session: ({ session, token, user }: any) => {
          if (session.user) {
              session.user.id = token.uid
          }
          return session
      }
    },
 
  }
