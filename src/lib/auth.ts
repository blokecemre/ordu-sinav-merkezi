import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "uIwZx2+KfOg7bwGJwMXxqlbH4oJm1wsQ=",
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Kullanıcı Adı", type: "text" },
                password: { label: "Şifre", type: "password" }
            },
            async authorize(credentials) {
                const username = credentials?.username?.trim();
                const password = credentials?.password?.trim();

                console.log("Login attempt for:", username);

                if (!username || !password) {
                    return null
                }

                try {
                    // Retry logic for DB connection issues
                    let user = null;
                    let retries = 3; // Keep it reasonable
                    let lastError = null;

                    while (retries > 0) {
                        try {
                            console.log(`[Auth] Attempting DB connection/fetch for user: ${username} (Retries left: ${retries})`);

                            // Explicit connection check
                            try {
                                await prisma.$queryRaw`SELECT 1`;
                                console.log("[Auth] DB Connection verified");
                            } catch (connError) {
                                console.error("[Auth] DB Connection check failed:", connError);
                                throw connError; // Trigger retry
                            }

                            const start = Date.now();
                            user = await prisma.user.findUnique({
                                where: {
                                    username: username
                                }
                            })
                            console.log(`[Auth] DB fetch took ${Date.now() - start}ms`);
                            break; // Success
                        } catch (dbError) {
                            lastError = dbError;
                            console.error(`[Auth] DB Error (Attempts left: ${retries - 1}):`, dbError);
                            retries--;
                            if (retries === 0) break; // Stop retrying
                            await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait to 2000ms
                        }
                    }

                    if (lastError && !user) {
                        console.error("[Auth] All DB retries failed. Last error:", lastError);
                        // We could throw here to show a different error, but let's return null to keep standard flow for now
                        // but logging is critical.
                    }

                    console.log("[Auth] User found in DB:", !!user, user ? `(ID: ${user.id})` : "");

                    if (!user) {
                        console.log("[Auth] User not found returning null");
                        return null
                    }

                    const isPasswordValid = await compare(password, user.password)
                    console.log("[Auth] Password valid:", isPasswordValid);

                    if (!isPasswordValid) {
                        console.log("[Auth] Password invalid returning null");
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name + " " + user.surname,
                        email: user.username,
                        role: user.role,
                    }
                } catch (error) {
                    console.error("[Auth] Unexpected login error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.username = token.username as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.username = user.email as string // We mapped username to email in authorize
            }
            return token
        }
    }
}
