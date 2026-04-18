import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // MVP: Bypass actual hashing for now to get architecture running
        // If the email doesn't exist, we'll create it to allow instant login for testing
        const existingUsers = await db.select().from(users).where(eq(users.email, credentials.email as string));
        
        if (existingUsers.length > 0) {
           return { id: existingUsers[0].id, name: existingUsers[0].name, email: existingUsers[0].email };
        } else {
           const newUser = await db.insert(users).values({
              email: credentials.email as string,
              name: "Grace User",
           }).returning();
           return { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email };
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
})
