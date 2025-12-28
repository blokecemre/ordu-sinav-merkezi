export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import {
    FileText,
    Award,
    Target,
    BarChart3,
    CalendarDays,
    LayoutGrid,
    TrendingUp,
    BookX
} from "lucide-react"
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

async function getAssignedExams(userId: string) {
    const assignments = await prisma.examAssignment.findMany({
        where: { studentId: userId },
        include: {
            exam: {
                select: {
                    id: true,
                    name: true,
                    date: true,
                    type: true,
                    pdfName: true,
                }
            }
        },
        orderBy: { exam: { date: "desc" } }
    })

    return assignments.map(a => a.exam)
}

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const stats = await getStudentStats(session.user.id)
    const assignedExams = await getAssignedExams(session.user.id)

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Merhaba, <span className="text-blue-600">{session.user.name}</span>
                </h2>
                <p className="text-slate-500 mt-1">Bugün nasıl çalışmak istersin?</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Katıldığın Sınavlar</p>
                                <p className="text-4xl font-bold text-slate-800">{stats.totalExams}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Ortalama Puan</p>
                                <p className="text-4xl font-bold text-slate-800">{stats.averageScore.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Ortalama Net</p>
                                <p className="text-4xl font-bold text-slate-800">{stats.averageNet.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Exam Results */}
            <section className="mb-10">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Son Sınav Sonuçların</h3>
                {stats.recentResults.length === 0 ? (
                    <Card className="border-0 shadow-lg shadow-slate-200/50">
                        <CardContent className="p-8">
                            <div className="text-center text-slate-400">
                                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Henüz sınav sonucu bulunmuyor</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stats.recentResults.map((result) => (
                            <Card key={result.id} className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h4 className="text-lg font-semibold text-slate-800 line-clamp-1">{result.exam.name}</h4>
                                        <p className="text-sm text-slate-500">
                                            {format(new Date(result.exam.date), "d MMMM yyyy", { locale: tr })}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-500">Puan</span>
                                        <span className="text-lg font-bold text-blue-600">{result.totalScore.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-slate-500">Net</span>
                                        <span className="text-lg font-bold text-emerald-600">{result.totalNet.toFixed(2)}</span>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        {result.exam.pdfName && (
                                            <a href={`/api/exam/${result.exam.id}/pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                                                <FileText className="w-4 h-4 mr-2" />
                                                <span>Sınav PDF'ini İndir</span>
                                            </a>
                                        )}
                                        {result.resultPdfName && (
                                            <a href={`/api/result/${result.id}/pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
                                                <FileText className="w-4 h-4 mr-2" />
                                                <span>Sonuç Karnesi İndir</span>
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* My Exams */}
            <section>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Sınavlarım</h3>
                {assignedExams.length === 0 ? (
                    <Card className="border-0 shadow-lg shadow-slate-200/50">
                        <CardContent className="p-8">
                            <div className="text-center text-slate-400">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Henüz atanmış sınav bulunmuyor</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assignedExams.map((exam) => (
                            <Card key={exam.id} className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h4 className="text-lg font-semibold text-slate-800 line-clamp-1">{exam.name}</h4>
                                        <p className="text-sm text-slate-500">
                                            {format(new Date(exam.date), "d MMMM yyyy", { locale: tr })}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-slate-500">Tür</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                                            {exam.type}
                                        </span>
                                    </div>
                                    {exam.pdfName && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <a href={`/api/exam/${exam.id}/pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                                                <FileText className="w-4 h-4 mr-2" />
                                                <span>Sınav PDF'ini İndir</span>
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
