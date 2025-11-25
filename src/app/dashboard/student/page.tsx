export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Award } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

async function getStudentStats(userId: string) {
    const results = await prisma.result.findMany({
        where: { studentId: userId },
        include: { exam: true },
        orderBy: { exam: { date: "desc" } }
    })

    const totalExams = results.length
    const averageScore = totalExams > 0
        ? results.reduce((acc, curr) => acc + curr.totalScore, 0) / totalExams
        : 0
    const averageNet = totalExams > 0
        ? results.reduce((acc, curr) => acc + curr.totalNet, 0) / totalExams
        : 0

    return { totalExams, averageScore, averageNet, recentResults: results.slice(0, 5) }
}

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const stats = await getStudentStats(session.user.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Merhaba, {session.user.name}</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Katıldığın Sınavlar</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalExams}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Puan</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageScore.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Net</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageNet.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Son Sınav Sonuçların</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.recentResults.map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">{result.exam.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(result.exam.date), "d MMMM yyyy", { locale: tr })}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Puan</span>
                                    <span className="text-lg font-bold text-blue-600">{result.totalScore.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-500">Net</span>
                                    <span className="text-lg font-bold text-green-600">{result.totalNet.toFixed(2)}</span>
                                </div>
                                {result.exam.pdfUrl && (
                                    <div className="mt-4 pt-4 border-t">
                                        <a href={result.exam.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                                            <FileText className="w-4 h-4 mr-1" /> Sınav PDF'ini İndir
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
