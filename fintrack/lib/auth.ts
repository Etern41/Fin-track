import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !email ||
          !password
        ) {
          return null;
        }

        const { prisma } = await import("@/lib/prisma");
        const { compare } = await import("bcryptjs");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
