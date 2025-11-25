import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AnalysisCharts } from "@/components/student/AnalysisCharts"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export default async function StudentAnalysisPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const results = await prisma.result.findMany({
        where: { studentId: session.user.id },
        include: { exam: true },
        orderBy: { exam: { date: "asc" } } // Order by date ascending for charts
    })

    const chartData = results.map(result => ({
        examName: result.exam.name,
        date: format(new Date(result.exam.date), "d MMM", { locale: tr }),
        score: result.totalScore,
        net: result.totalNet
    }))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Gelişim Analizi</h1>
            <AnalysisCharts data={chartData} />
        </div>
    )
}
