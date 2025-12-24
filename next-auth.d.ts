import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user types
   */
  interface Session {
    user: {
      id: string;
      role: string;
      tenantId: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user types
   */
  interface User extends DefaultUser {
    role: string;
    tenantId: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT types
   */
  interface JWT extends DefaultJWT {
    role: string;
    tenantId: string;
  }
}
