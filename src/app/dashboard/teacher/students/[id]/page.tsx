import { prisma } from "@/lib/prisma"
import { AnalysisCharts } from "@/components/student/AnalysisCharts"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { notFound } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function StudentDetailPage({ params }: PageProps) {
    const { id } = await params

    const student = await prisma.user.findUnique({
        where: { id },
    })

    if (!student || student.role !== "STUDENT") {
        notFound()
    }

    const results = await prisma.result.findMany({
        where: { studentId: id },
        include: { exam: true },
        orderBy: { exam: { date: "asc" } }
    })

    const analyses = await prisma.analysis.findMany({
        where: { studentId: id },
        orderBy: { createdAt: "desc" }
    })

    const chartData = results.map(result => ({
        examName: result.exam.name,
        date: format(new Date(result.exam.date), "d MMM", { locale: tr }),
        score: result.totalScore,
        net: result.totalNet
    }))

    // Reverse for table to show newest first
    const tableResults = [...results].reverse()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{student.name} {student.surname}</h1>
                <p className="text-muted-foreground">Öğrenci Analizi</p>
            </div>

            <AnalysisCharts data={chartData} />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Sınav Geçmişi</h2>
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sınav Adı</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead>Tür</TableHead>
                                <TableHead>Puan</TableHead>
                                <TableHead>Net</TableHead>
                                <TableHead className="text-right">Sonuç Dosyası</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableResults.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.exam.name}</TableCell>
                                    <TableCell>
                                        {format(new Date(result.exam.date), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{result.exam.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-blue-600">
                                        {result.totalScore.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="font-bold text-green-600">
                                        {result.totalNet.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {result.exam.pdfName ? (
                                            <a
                                                href={`/api/exam/${result.exam.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:underline"
                                            >
                                                <FileText className="w-4 h-4 mr-1" /> İndir
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Analiz Raporları</h2>
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rapor Başlığı</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analyses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                        Henüz analiz raporu bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                analyses.map((analysis) => (
                                    <TableRow key={analysis.id}>
                                        <TableCell className="font-medium">{analysis.title}</TableCell>
                                        <TableCell>
                                            {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/teacher/students/${id}/analysis/${analysis.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    Görüntüle <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
