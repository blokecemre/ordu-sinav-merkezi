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

                console.log("--- LOGIN ATTEMPT START ---");
                console.log("Username provided:", username);
                console.log("Password provided length:", password?.length);

                if (!username || !password) {
                    console.log("Missing credentials");
                    return null
                }

                try {
                    // Retry logic for DB connection issues
                    let user = null;
                    let retries = 3;
                    let lastError = null;

                    while (retries > 0) {
                        try {
                            console.log(`[Auth] Connection check... (Retries: ${retries})`);

                            // Explicit connection check
                            try {
                                await prisma.$queryRaw`SELECT 1`;
                                console.log("[Auth] DB Connection verified");
                            } catch (connError) {
                                console.error("[Auth] DB Connection check failed:", connError);
                                throw connError;
                            }

                            const start = Date.now();
                            console.log(`[Auth] Fetching user: ${username}`);
                            user = await prisma.user.findUnique({
                                where: {
                                    username: username
                                }
                            })
                            console.log(`[Auth] DB fetch took ${Date.now() - start}ms`);
                            break;
                        } catch (dbError) {
                            lastError = dbError;
                            console.error(`[Auth] DB Error:`, dbError);
                            retries--;
                            if (retries === 0) break;
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    if (lastError && !user) {
                        console.error("[Auth] All retries failed.");
                    }

                    console.log("[Auth] User found:", !!user);
                    if (user) {
                        console.log("User ID:", user.id);
                        console.log("User Role:", user.role);
                        console.log("Stored Hash Prefix:", user.password.substring(0, 10));
                    }

                    if (!user) {
                        console.log("[Auth] User not found -> Returning null");
                        return null
                    }

                    const isPasswordValid = await compare(password, user.password)
                    console.log("[Auth] Password valid:", isPasswordValid);

                    if (!isPasswordValid) {
                        console.log("[Auth] Password invalid -> Returning null");
                        return null
                    }

                    console.log("--- LOGIN SUCCESS ---");
                    return {
                        id: user.id,
                        name: user.name + " " + user.surname,
                        email: user.username,
                        role: user.role,
                    }
                } catch (error) {
                    console.error("[Auth] Unexpected error:", error);
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
