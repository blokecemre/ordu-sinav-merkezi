import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/cevap-anahtarlari/:path*",
        // Add other protected routes here
    ]
}
