import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UploadAnalysisDialog } from "@/components/admin/UploadAnalysisDialog"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteAnalysis } from "@/app/actions/analysis"

export default async function AdminAnalysesPage() {
    const analyses = await prisma.analysis.findMany({
        include: { student: true },
        orderBy: { createdAt: "desc" }
    })

    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { name: "asc" }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Öğrenci Analizleri</h1>
                <UploadAnalysisDialog students={students} />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Öğrenci</TableHead>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analyses.map((analysis) => (
                            <TableRow key={analysis.id}>
                                <TableCell className="font-medium">
                                    {analysis.student.name} {analysis.student.surname}
                                </TableCell>
                                <TableCell>{analysis.title}</TableCell>
                                <TableCell>
                                    {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <form action={async () => {
                                        "use server"
                                        await deleteAnalysis(analysis.id)
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
