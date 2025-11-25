import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { FileText } from "lucide-react"

export default async function StudentAnalysesPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const analyses = await prisma.analysis.findMany({
        where: { studentId: session.user.id },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analizlerim</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analyses.map((analysis) => (
                    <Link key={analysis.id} href={`/dashboard/student/analyses/${analysis.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
                {analyses.length === 0 && (
                    <p className="text-muted-foreground col-span-full">Henüz yüklenmiş bir analiz bulunmuyor.</p>
                )}
            </div>
        </div>
    )
}
