import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { FileText, BarChart2, HelpCircle } from "lucide-react"

export default async function StudentAnalysesPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const analyses = await prisma.analysis.findMany({
        where: { studentId: session.user.id },
        orderBy: { createdAt: "desc" }
    })

    // Group by type
    const genelDenemeler = analyses.filter(a => a.analysisType === "GENEL_DENEME" || !a.analysisType)
    const yanlisSorular = analyses.filter(a => a.analysisType === "YANLIS_SORU")

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analizlerim</h1>

            {analyses.length === 0 ? (
                <p className="text-muted-foreground">Henüz yüklenmiş bir analiz bulunmuyor.</p>
            ) : (
                <div className="space-y-8">
                    {/* Genel Deneme Analizleri */}
                    {genelDenemeler.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-blue-500" />
                                Genel Deneme Analizleri
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {genelDenemeler.map((analysis) => (
                                    <Link key={analysis.id} href={`/dashboard/student/analyses/${analysis.id}`}>
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-blue-500">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-lg font-medium line-clamp-1">
                                                    {analysis.title}
                                                </CardTitle>
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Yanlış Soru Analizleri */}
                    {yanlisSorular.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-orange-500" />
                                Yanlış Soru Analizleri
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {yanlisSorular.map((analysis) => (
                                    <Link key={analysis.id} href={`/dashboard/student/analyses/${analysis.id}`}>
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-orange-500">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-lg font-medium line-clamp-1">
                                                    {analysis.title}
                                                </CardTitle>
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
