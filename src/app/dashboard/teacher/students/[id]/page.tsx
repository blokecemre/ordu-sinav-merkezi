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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
