import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, AlertTriangle, BookOpen } from "lucide-react"
import { getStats, getSubjects } from "@/app/actions/performance"
import { PerformanceClientPage } from "@/components/student/PerformanceClientPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ studentId: string }>
}

export default async function TeacherPerformanceDetailPage({ params }: PageProps) {
    const { studentId: id } = await params

    const student = await prisma.user.findUnique({
        where: { id },
    })

    if (!student || student.role !== "STUDENT") {
        notFound()
    }

    const { subjects } = await getSubjects()
    const stats = await getStats(id)

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/teacher/performance">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{student.name} {student.surname}</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Performans Analizi</span>
                        <span>•</span>
                        <span>{student.classLevel}</span>
                    </div>
                </div>
            </div>

            {stats.success ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-indigo-900">Toplam Soru</CardTitle>
                                <TrendingUp className="h-4 w-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-indigo-700">
                                    {stats.dailyStats?.reduce((acc: number, curr: any) => acc + curr.correct + curr.wrong, 0) || 0}
                                </div>
                                <p className="text-xs text-indigo-600/80">Son 7 Gün</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-50 border-emerald-100">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-emerald-900">Toplam Kitap</CardTitle>
                                <BookOpen className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-700">
                                    {stats.totalReading || 0} <span className="text-sm font-normal">Sayfa</span>
                                </div>
                                <p className="text-xs text-emerald-600/80">Son 7 Gün</p>
                            </CardContent>
                        </Card>
                        {stats.disciplineWarning && (
                            <Card className="bg-red-50 border-red-200 animate-pulse">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-red-900">Disiplin Uyarısı</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold text-red-700">
                                        3+ Gün Veri Yok
                                    </div>
                                    <p className="text-xs text-red-600/80">Acil İletişim Gerekli</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <PerformanceClientPage
                        subjects={subjects || []}
                        dailyStats={stats.dailyStats || []}
                        subjectStats={stats.subjectStats || []}
                        successTrend={stats.successTrend || []}
                        studentId={id}
                        readOnly={true}
                    />
                </div>
            ) : (
                <div className="p-12 text-center border rounded-xl bg-slate-50 text-slate-500">
                    Veri bulunamadı.
                </div>
            )}
        </div>
    )
}
