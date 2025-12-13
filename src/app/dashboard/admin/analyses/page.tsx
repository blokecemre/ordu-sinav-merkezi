export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Trash2, FileText, BarChart2, HelpCircle } from "lucide-react"
import { deleteAnalysis } from "@/app/actions/analysis"
import { UploadAnalysisDialog } from "@/components/admin/UploadAnalysisDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminAnalysesPage() {
    const analyses = await prisma.analysis.findMany({
        include: { student: true },
        orderBy: { createdAt: "desc" }
    })

    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: [{ classLevel: "asc" }, { name: "asc" }]
    })

    // Group analyses by student
    const analysesByStudent: Record<string, typeof analyses> = {}
    analyses.forEach(analysis => {
        const key = analysis.studentId
        if (!analysesByStudent[key]) {
            analysesByStudent[key] = []
        }
        analysesByStudent[key].push(analysis)
    })

    // Get students who have analyses
    const studentsWithAnalyses = students.filter(s => analysesByStudent[s.id])

    const getAnalysisTypeLabel = (type: string) => {
        switch (type) {
            case "GENEL_DENEME": return "Genel Deneme Analizi"
            case "YANLIS_SORU": return "Yanlış Soru Analizi"
            default: return "Analiz"
        }
    }

    const getAnalysisTypeIcon = (type: string) => {
        switch (type) {
            case "GENEL_DENEME": return <BarChart2 className="w-4 h-4 text-blue-500" />
            case "YANLIS_SORU": return <HelpCircle className="w-4 h-4 text-orange-500" />
            default: return <FileText className="w-4 h-4 text-gray-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Öğrenci Analizleri</h1>
                <UploadAnalysisDialog students={students} />
            </div>

            {studentsWithAnalyses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Henüz yüklenmiş analiz bulunmuyor.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {studentsWithAnalyses.map(student => (
                        <Card key={student.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>{student.name} {student.surname}</span>
                                    {student.classLevel && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            ({student.classLevel}. Sınıf)
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {analysesByStudent[student.id].map(analysis => (
                                        <div
                                            key={analysis.id}
                                            className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <Link
                                                href={`/dashboard/admin/analyses/${analysis.id}`}
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                {getAnalysisTypeIcon(analysis.analysisType)}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm truncate">{analysis.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {getAnalysisTypeLabel(analysis.analysisType)} • {format(new Date(analysis.createdAt), "d MMM yyyy", { locale: tr })}
                                                    </p>
                                                </div>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await deleteAnalysis(analysis.id)
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
