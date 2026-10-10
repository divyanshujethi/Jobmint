import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, users, accounts, sessions, verificationTokens, eq } from "@repo/database";
import { UserRole } from "@repo/shared";
import { verifyPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding/candidate",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = (credentials.email as string).trim().toLowerCase();
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (userList.length === 0) return null;
        const user = userList[0];
        if (!user.passwordHash) return null;

        const isValid = verifyPassword(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: false,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: false,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: false,
    }),
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      issuer: process.env.MICROSOFT_ISSUER || "https://login.microsoftonline.com/common/v2.0",
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (account && account.provider === "github" && profile) {
        token.githubUsername = (profile as any).login || (profile as any).username;
      }
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || UserRole.CANDIDATE;
        token.emailVerified = (user as any).emailVerified
          ? new Date((user as any).emailVerified).toISOString()
          : null;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).githubUsername = token.githubUsername as string;
        (session.user as any).emailVerified = token.emailVerified
          ? new Date(token.emailVerified as string)
          : null;

        const configuredAdminEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        const userEmail = session.user.email?.toLowerCase();
        (session.user as any).isAdmin = Boolean(
          userEmail &&
          configuredAdminEmails.length > 0 &&
          configuredAdminEmails.includes(userEmail) &&
          token.emailVerified
        );
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow same-site relative paths (but not protocol-relative "//host" or "/\host")
      if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) return `${baseUrl}${url}`;
      // Allow rolenest.in and *.rolenest.in (localhost only outside production)
      try {
        const parsed = new URL(url);
        const isLocal =
          process.env.NODE_ENV !== "production" &&
          (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
        if (parsed.hostname === "rolenest.in" || parsed.hostname.endsWith(".rolenest.in") || isLocal) {
          return url;
        }
      } catch {}
      // Default to baseUrl for untrusted third-party URLs
      return baseUrl;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".rolenest.in" : undefined,
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.callback-url" : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".rolenest.in" : undefined,
      },
    },
  },
});
