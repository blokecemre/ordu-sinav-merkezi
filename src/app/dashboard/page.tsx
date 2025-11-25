import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Redirect based on role
    if (session.user.role === "ADMIN") {
        redirect("/dashboard/admin")
    } else if (session.user.role === "TEACHER") {
        redirect("/dashboard/teacher")
    } else if (session.user.role === "STUDENT") {
        redirect("/dashboard/student")
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Hoş Geldiniz</h1>
            <p>Yönlendiriliyorsunuz...</p>
        </div>
    )
}
