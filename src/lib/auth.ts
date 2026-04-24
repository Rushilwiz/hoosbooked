import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import authConfig from "./auth.config";
import { getUserByUsername } from "../db/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await getUserByUsername(credentials.username as string);
        if (!user) return null;

        const match = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!match) return null;

        return {
          id: String(user.id),
          username: user.username,
        };
      },
    }),
  ],
});
