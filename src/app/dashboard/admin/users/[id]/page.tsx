import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, AlertTriangle } from "lucide-react"
import { getStats, getSubjects } from "@/app/actions/performance"
import { PerformanceClientPage } from "@/components/student/PerformanceClientPage"
import { AdminPerformanceTable } from "@/components/admin/AdminPerformanceTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: PageProps) {
    const { id } = await params

    const student = await prisma.user.findUnique({
        where: { id },
    })

    if (!student) {
        notFound()
    }

    // Fetch Performance Data
    const { subjects } = await getSubjects()
    const stats = await getStats(id)

    // Fetch Raw Logs for Table
    const rawLogs = await prisma.dailyLog.findMany({
        where: { studentId: id },
        include: { subject: true },
        orderBy: { date: 'desc' }
    })

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{student.name} {student.surname}</h1>
                    <p className="text-muted-foreground">{student.email} • {student.role}</p>
                </div>
            </div>

            {student.role === "STUDENT" && (
                <>
                    {/* Performance Charts */}
                    {stats.success && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    Performans Grafikleri
                                </h2>
                                {stats.disciplineWarning && (
                                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-200">
                                        <AlertTriangle className="h-5 w-5" />
                                        <span className="font-semibold text-sm">Disiplin Uyarısı</span>
                                    </div>
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
                    )}

                    {/* Data Management */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Veri Yönetimi & Geçmiş</h2>
                        <AdminPerformanceTable logs={rawLogs} />
                    </div>
                </>
            )}
        </div>
    )
}
