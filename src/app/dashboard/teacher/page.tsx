export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

async function getTeacherStats(userId: string) {
    const studentCount = await prisma.teacherStudent.count({
        where: { teacherId: userId }
    })

    return { studentCount }
}

export default async function TeacherDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const stats = await getTeacherStats(session.user.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Merhaba, {session.user.name}</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Öğrencilerim</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studentCount}</div>
                        <p className="text-xs text-muted-foreground">Size atanan toplam öğrenci</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
