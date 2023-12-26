import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, Google, CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const email = token.email || session?.user?.email;
      if (!email) return session;
      const [user] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          provider: usersTable.provider,
          email: usersTable.email,
          image: usersTable.image,
          level: usersTable.level,
          experience: usersTable.experience
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          provider: user.provider,
          image: user.image,
          level: user.level,
          experience: user.experience,
        },
      };
    },
    async jwt({ token, account }) {
      // Sign in with social account, e.g. GitHub, Google, etc.
      if (!account) return token;
      const { name, email, picture } = token;
      const provider = account.provider;
      if (!name || !email || !provider) return token;
      const [existedUser] = await db
        .select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();
      if (existedUser) return token;
      // Sign up
      if (provider === "github" || provider === "google") {
          await db.insert(usersTable).values({
            username: name,
            email: email.toLowerCase(),
            provider,
            image: picture
          });
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});