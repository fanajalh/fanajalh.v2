import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  useSecureCookies: process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL?.includes("localhost"),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const email = String(credentials.email).trim().toLowerCase();

        const sql = getDb();
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (users.length === 0) {
          throw new Error("Email atau password tidak valid");
        }

        const user = users[0];
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Email atau password tidak valid");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: { signIn: "/loginUser" },
  secret: process.env.NEXTAUTH_SECRET,
};
