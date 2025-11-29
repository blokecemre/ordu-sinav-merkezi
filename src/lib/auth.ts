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
                console.log("Login attempt for:", credentials?.username);
                console.log("DB URL Prefix:", process.env.DATABASE_URL?.substring(0, 20));

                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            username: credentials.username
                        }
                    })

                    console.log("User found in DB:", !!user);

                    if (!user) {
                        console.log("User not found");
                        return null
                    }

                    const isPasswordValid = await compare(credentials.password, user.password)
                    console.log("Password valid:", isPasswordValid);

                    if (!isPasswordValid) {
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name + " " + user.surname,
                        email: user.username,
                        role: user.role,
                    }
                } catch (error) {
                    console.error("Login error:", error);
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
