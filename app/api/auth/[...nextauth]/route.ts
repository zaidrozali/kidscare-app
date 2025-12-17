import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" }, // Optional for multi-tenant
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Find user by email (and optionally tenant)
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            ...(credentials.tenantId && { tenantId: credentials.tenantId }),
          },
          include: {
            tenant: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await comparePassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Check if tenant is active
        if (!user.tenant.isActive) {
          throw new Error("Account is inactive");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          image: user.image,
        };
      },
    }),

    // Google OAuth (Free tier: unlimited users)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // OAuth sign-in logic
      if (account?.provider === "google") {
        // For OAuth users, assign them to a default tenant or create one
        // This is a simplified version - in production, you'd have a tenant selection flow
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create a default tenant for new OAuth users
          // In production, you'd have a proper onboarding flow
          return true; // Allow sign in, tenant will be created by adapter
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt", // Using JWT instead of database sessions (simpler for now)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
