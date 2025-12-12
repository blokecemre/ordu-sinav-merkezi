import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // Allow the request to continue
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Allow public routes
                if (
                    pathname === "/" ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/paketler") ||
                    pathname.startsWith("/kurumsal") ||
                    pathname.startsWith("/hakkimizda") ||
                    pathname.startsWith("/iletisim") ||
                    pathname.startsWith("/sinavlar") ||
                    pathname.startsWith("/blog") ||
                    pathname.startsWith("/_next") ||
                    pathname.includes(".")
                ) {
                    return true
                }

                // Require auth for dashboard routes
                if (pathname.startsWith("/dashboard")) {
                    return !!token
                }

                return true
            },
        },
        pages: {
            signIn: "/login",
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) - except auth
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)",
    ],
}
