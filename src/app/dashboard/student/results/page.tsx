import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

export default async function StudentResultsPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const results = await prisma.result.findMany({
        where: { studentId: session.user.id },
        include: { exam: true },
        orderBy: { exam: { date: "desc" } }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Sınav Sonuçlarım</h1>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sınav Adı</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Tür</TableHead>
                            <TableHead>Puan</TableHead>
                            <TableHead>Net</TableHead>
                            <TableHead>Sonuç Dosyası</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((result) => (
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
                                <TableCell>
                                    {result.exam.pdfUrl ? (
                                        <a href={result.exam.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            PDF İndir
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
