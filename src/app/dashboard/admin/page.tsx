import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react"

async function getStats() {
    const studentCount = await prisma.user.count({ where: { role: "STUDENT" } })
    const teacherCount = await prisma.user.count({ where: { role: "TEACHER" } })
    const examCount = await prisma.exam.count()
    // Mock result count for now
    const resultCount = await prisma.result.count()

    return { studentCount, teacherCount, examCount, resultCount }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Paneli</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Öğrenci</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studentCount}</div>
                        <p className="text-xs text-muted-foreground">Sisteme kayıtlı öğrenci sayısı</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Öğretmen</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.teacherCount}</div>
                        <p className="text-xs text-muted-foreground">Sisteme kayıtlı öğretmen sayısı</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sınavlar</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.examCount}</div>
                        <p className="text-xs text-muted-foreground">Düzenlenen toplam sınav</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sonuçlar</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resultCount}</div>
                        <p className="text-xs text-muted-foreground">Girilen sınav sonucu</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
