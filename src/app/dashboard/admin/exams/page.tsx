export const dynamic = "force-dynamic"
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
import { Trash2, FileText, User as UserIcon } from "lucide-react"
import { deleteExam } from "@/app/actions/exam"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function ExamsPage() {
    const exams = await prisma.exam.findMany({
        orderBy: { date: "desc" },
        select: {
            id: true,
            name: true,
            date: true,
            type: true,
            pdfName: true,
            _count: {
                select: { results: true }
            }
        }
    })

    // Get students with their exam results (participated in exams)
    const studentsWithPdfCounts = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
            id: true,
            name: true,
            surname: true,
            username: true,
            classLevel: true,
            studentResults: {
                select: {
                    id: true,
                    exam: {
                        select: {
                            name: true,
                            pdfName: true
                        }
                    }
                }
            }
        },
        orderBy: [
            { classLevel: 'asc' },
            { name: 'asc' }
        ]
    })

    // Filter only students who have at least one result
    const studentsWithPdfs = studentsWithPdfCounts.filter(s => s.studentResults.length > 0)

    // Group by class level
    const groupedStudents: Record<string, typeof studentsWithPdfs> = {}
    studentsWithPdfs.forEach(student => {
        const key = student.classLevel ? `${student.classLevel}. Sınıf` : "Sınıf Belirtilmemiş"
        if (!groupedStudents[key]) {
            groupedStudents[key] = []
        }
        groupedStudents[key].push(student)
    })

    const sortedKeys = Object.keys(groupedStudents).sort((a, b) => {
        const aNum = parseInt(a) || 99
        const bNum = parseInt(b) || 99
        return aNum - bNum
    })

    return (
        <div className="space-y-8">
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
                                    {exam.pdfName ? (
                                        <a href={`/api/exam/${exam.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            PDF İndir
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/dashboard/admin/exams/${exam.id}/results`}>
                                            <Button variant="outline" size="sm">
                                                Sonuçlar
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server"
                                            await deleteExam(exam.id)
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Students with Exam Results Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Sınava Katılan Öğrenciler</h2>

                {studentsWithPdfs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                        Henüz hiçbir öğrenci sınava katılmamış.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sortedKeys.map(classLevel => (
                            <div key={classLevel} className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">{classLevel}</h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {groupedStudents[classLevel].map((student) => (
                                        <Card key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                        <UserIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900">{student.name} {student.surname}</h4>
                                                        <p className="text-sm text-gray-500">@{student.username}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                                                <FileText className="h-3 w-3" />
                                                                {student.studentResults.length} sınav
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 space-y-1">
                                                            {student.studentResults.slice(0, 3).map((result) => (
                                                                <p key={result.id} className="text-xs text-gray-500 truncate">
                                                                    • {result.exam.name}
                                                                </p>
                                                            ))}
                                                            {student.studentResults.length > 3 && (
                                                                <p className="text-xs text-gray-400 italic">
                                                                    +{student.studentResults.length - 3} daha...
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
