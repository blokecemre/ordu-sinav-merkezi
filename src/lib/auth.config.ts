import { NextAuthOptions } from "next-auth"

export const authConfig: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "uIwZx2+KfOg7bwGJwMXxqlbH4oJm1wsQ=",
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                domain: process.env.NODE_ENV === 'production' ? '.ordusinav.com' : undefined
            }
        }
    },
    providers: [], // Providers will be added in auth.ts
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
                token.username = user.email as string
            }
            return token
        }
    }
}
