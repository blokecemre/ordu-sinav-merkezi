import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrendingUp, Download, Search, Folder } from "lucide-react"
import { AdminPerformanceExportButton } from "@/components/admin/AdminPerformanceExportButton"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const dynamic = "force-dynamic"

export default async function AdminPerformancePage() {
    // Fetch all students with their summary stats
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { name: "asc" },
        include: {
            dailyLogs: {
                orderBy: { date: 'desc' }
            }
        }
    })

    // Prepare flat data for export
    const exportData = students.flatMap(student =>
        student.dailyLogs.map(log => ({
            OgrenciAd: student.name,
            OgrenciSoyad: student.surname,
            Sinif: student.classLevel,
            Okul: student.school,
            Tarih: new Date(log.date).toLocaleDateString("tr-TR"),
            DersID: log.subjectId,
            Dogru: log.correctCount,
            Yanlis: log.wrongCount,
            Okuma: log.readingPage
        }))
    )

    // Group students by Grade (Sınıf Seviyesi)
    const studentsByGrade: Record<string, typeof students> = {}

    students.forEach(student => {
        let groupName = "Sınıfı Yok"

        if (student.classLevel) {
            // Extract the number from classLevel (e.g. "8-A" -> "8")
            const gradeMatch = student.classLevel.match(/\d+/)
            if (gradeMatch) {
                groupName = `${gradeMatch[0]}. Sınıf`
            } else if (student.classLevel.toLowerCase().includes("mezun")) {
                groupName = "Mezun"
            } else {
                // Fallback for non-numeric classes if needed, or keep original
                groupName = student.classLevel
            }
        }

        if (!studentsByGrade[groupName]) {
            studentsByGrade[groupName] = []
        }
        studentsByGrade[groupName].push(student)
    })

    // Sort class names (5. Sınıf < 6. Sınıf < 7. Sınıf < 8. Sınıf ... < Diğer)
    const sortedGrades = Object.keys(studentsByGrade).sort((a, b) => {
        const getVal = (s: string) => {
            if (s.includes("Sınıfı Yok")) return 999
            if (s.includes("Mezun")) return 998
            const match = s.match(/\d+/)
            return match ? parseInt(match[0]) : 997
        }
        return getVal(a) - getVal(b)
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tüm Öğrenci Performansı</h1>
                    <p className="text-slate-500">Öğrencilerin sınıf bazlı performans takibi.</p>
                </div>
                <AdminPerformanceExportButton data={exportData} />
            </div>

            <div className="bg-transparent">
                <Accordion type="multiple" defaultValue={sortedGrades} className="w-full space-y-4">
                    {sortedGrades.map((grade) => {
                        const classStudents = studentsByGrade[grade]
                        return (
                            <AccordionItem key={grade} value={grade} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 transition-colors hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-lg text-slate-800">{grade}</span>
                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {classStudents.length} Öğrenci
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="border-t border-slate-100">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-none">
                                                <TableHead className="pl-6 font-semibold text-slate-600">Öğrenci</TableHead>
                                                <TableHead className="font-semibold text-slate-600">Toplam (Son 30 Gün)</TableHead>
                                                <TableHead className="font-semibold text-slate-600">Son Aktivite</TableHead>
                                                <TableHead className="text-right pr-6 font-semibold text-slate-600">İşlem</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {classStudents.map((student) => {
                                                const lastLog = student.dailyLogs[0]
                                                const lastDate = lastLog ? new Date(lastLog.date).toLocaleDateString("tr-TR") : "Yok"
                                                const totalQuestions = student.dailyLogs.reduce((acc, curr) => acc + curr.correctCount + curr.wrongCount, 0)

                                                return (
                                                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0 border-slate-100">
                                                        <TableCell className="font-medium pl-6 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold border border-slate-200">
                                                                    {student.name.charAt(0)}{student.surname.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-slate-900">{student.name} {student.surname}</div>
                                                                    <div className="text-xs text-slate-500">{student.classLevel || 'Sınıfı Yok'} - {student.school}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-indigo-600">{totalQuestions} Soru</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`text-sm ${lastDate === "Yok" ? "text-slate-400" : "text-emerald-600 font-medium"}`}>
                                                                {lastDate}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <Link href={`/dashboard/admin/users/${student.id}`}>
                                                                <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                                                                    <TrendingUp className="w-4 h-4 mr-2" />
                                                                    Detay
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
        </div>
    )
}
