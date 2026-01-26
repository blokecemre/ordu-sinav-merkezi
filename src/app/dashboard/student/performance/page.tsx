import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getStats, getSubjects } from "@/app/actions/performance"
import { PerformanceClientPage } from "@/components/student/PerformanceClientPage"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GraduationCap, AlertTriangle, TrendingUp, BookOpen, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PerformancePage() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "STUDENT") {
        redirect("/")
    }

    const { subjects } = await getSubjects()
    const stats = await getStats(session.user.id)

    if (!stats.success) {
        return <div>Veriler yüklenemedi.</div>
    }

    const daysAgo = stats.daysSinceLastActivity ?? 999

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performans ve Disiplin</h1>
                    <p className="text-muted-foreground">Günlük çalışmalarını kaydet ve gelişimini takip et.</p>
                </div>
                {stats.disciplineWarning && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-200 animate-pulse">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Dikkat: Süreklilik Bozuldu! (3+ gün veri girilmedi)</span>
                    </div>
                )}
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Çalışma</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.dailyStats?.reduce((acc: number, curr: any) => acc + curr.correct + curr.wrong, 0) || 0} Soru
                        </div>
                        <p className="text-xs text-muted-foreground">Son 7 gün</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kitap Okuma</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalReading || 0} Sayfa
                        </div>
                        <p className="text-xs text-muted-foreground">Son 7 gün</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Son Aktivite</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {daysAgo === 0 ? "Bugün" :
                                daysAgo === 1 ? "Dün" :
                                    daysAgo > 30 ? "Uzun Süredir Yok" :
                                        `${daysAgo} Gün Önce`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.disciplineWarning ? "Disiplini geri kazanmalısın!" : "Harika gidiyorsun!"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Başarı Ortalaması</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(() => {
                                const totalCorrect = stats.dailyStats?.reduce((acc: number, curr: any) => acc + curr.correct, 0) || 0
                                const totalQuestions = stats.dailyStats?.reduce((acc: number, curr: any) => acc + curr.correct + curr.wrong, 0) || 0
                                return totalQuestions > 0 ? `%${Math.round((totalCorrect / totalQuestions) * 100)}` : "-"
                            })()}
                        </div>
                        <p className="text-xs text-muted-foreground">Son 7 gün</p>
                    </CardContent>
                </Card>
            </div>

            <PerformanceClientPage
                subjects={subjects || []}
                dailyStats={stats.dailyStats}
                subjectStats={stats.subjectStats}
                successTrend={stats.successTrend}
                studentId={session.user.id}
            />
        </div>
    )
}
