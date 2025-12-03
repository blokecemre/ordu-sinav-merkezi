import { getExamResults, updateStudentResult } from "@/app/actions/exam"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ResultDialog } from "./result-dialog"

export default async function ExamResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { success, students, results, examName, error } = await getExamResults(id)

    if (!success) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sınav Sonuçları</h1>
                    <p className="text-muted-foreground">{examName}</p>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Öğrenci</TableHead>
                            <TableHead>Puan</TableHead>
                            <TableHead>Net</TableHead>
                            <TableHead>Sonuç Dosyası</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students?.map((student: any) => {
                            const result = results?.find((r: any) => r.studentId === student.id)
                            return (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        {student.name} {student.surname}
                                        <div className="text-xs text-muted-foreground">{student.username}</div>
                                    </TableCell>
                                    <TableCell>{result?.totalScore || "-"}</TableCell>
                                    <TableCell>{result?.totalNet || "-"}</TableCell>
                                    <TableCell>
                                        {result?.resultPdfName ? (
                                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                                <FileText className="w-4 h-4" />
                                                PDF Yüklü
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ResultDialog
                                            examId={id}
                                            student={student}
                                            result={result}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
