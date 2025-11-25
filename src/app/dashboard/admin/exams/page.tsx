import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UploadExamDialog } from "@/components/admin/UploadExamDialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteExam } from "@/app/actions/exam"

export default async function ExamsPage() {
    const exams = await prisma.exam.findMany({
        orderBy: { date: "desc" },
        include: {
            _count: {
                select: { results: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sınavlar</h1>
                <UploadExamDialog />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sınav Adı</TableHead>
                            <TableHead>Tür</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Katılımcı Sayısı</TableHead>
                            <TableHead>Sonuç Dosyası</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell className="font-medium">{exam.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{exam.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(exam.date), "d MMMM yyyy", { locale: tr })}
                                </TableCell>
                                <TableCell>{exam._count.results}</TableCell>
                                <TableCell>
                                    {exam.pdfUrl ? (
                                        <a href={exam.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            PDF İndir
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <form action={async () => {
                                        "use server"
                                        await deleteExam(exam.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
