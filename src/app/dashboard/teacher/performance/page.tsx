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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const dynamic = "force-dynamic"

export default async function TeacherPerformancePage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    // Fetch relations for the logged-in teacher
    const relations = await prisma.teacherStudent.findMany({
        where: { teacherId: session.user.id },
        include: {
            student: {
                include: {
                    dailyLogs: {
                        take: 1,
                        orderBy: { date: 'desc' }
                    }
                }
            }
        },
        orderBy: { student: { name: "asc" } }
    })

    // Group students by Grade (Sınıf Seviyesi)
    const studentsByGrade: Record<string, typeof relations> = {}

    relations.forEach(rel => {
        let groupName = "Sınıfı Yok"
        const student = rel.student

        if (student.classLevel) {
            // Extract the number from classLevel (e.g. "8-A" -> "8")
            const gradeMatch = student.classLevel.match(/\d+/)
            if (gradeMatch) {
                groupName = `${gradeMatch[0]}. Sınıf`
            } else if (student.classLevel.toLowerCase().includes("mezun")) {
                groupName = "Mezun"
            } else {
                groupName = student.classLevel
            }
        }

        if (!studentsByGrade[groupName]) {
            studentsByGrade[groupName] = []
        }
        studentsByGrade[groupName].push(rel)
    })

    // Sort class names (5. Sınıf < 6. Sınıf < ... < Diğer)
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performans Takibi</h1>
                <p className="text-slate-500">Öğrencilerinin çalışma istatistiklerini ve disiplin durumlarını incele.</p>
            </div>

            {relations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
                    <p>Henüz öğrenci bulunmuyor.</p>
                </div>
            ) : (
                <div className="bg-transparent">
                    <Accordion type="multiple" defaultValue={sortedGrades} className="w-full space-y-4">
                        {sortedGrades.map((grade) => {
                            const classRelations = studentsByGrade[grade]
                            return (
                                <AccordionItem key={grade} value={grade} className="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
                                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 transition-colors hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Folder className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-lg text-slate-800">{grade}</span>
                                            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {classRelations.length} Öğrenci
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="border-t border-slate-100">
                                        <Table>
                                            <TableHeader className="bg-slate-50/50">
                                                <TableRow className="border-none">
                                                    <TableHead className="pl-6 font-semibold text-slate-600">Öğrenci</TableHead>
                                                    <TableHead className="text-center font-semibold text-slate-600">Sınıf</TableHead>
                                                    <TableHead className="text-center font-semibold text-slate-600">Son Aktivite</TableHead>
                                                    <TableHead className="text-right pr-6 font-semibold text-slate-600">İşlem</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {classRelations.map((rel, index) => {
                                                    const lastLog = rel.student.dailyLogs[0]
                                                    const lastActivity = lastLog ? new Date(lastLog.date).toLocaleDateString("tr-TR") : "Yok"

                                                    return (
                                                        <TableRow key={rel.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0 border-slate-100">
                                                            <TableCell className="pl-6 py-3">
                                                                <Link href={`/dashboard/teacher/performance/${rel.student.id}`} className="block group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                                            {rel.student.name.charAt(0)}{rel.student.surname.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                                                {rel.student.name} {rel.student.surname}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500">{rel.student.school || "Okul Yok"}</div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell className="text-center text-slate-600">
                                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-sm font-medium">
                                                                    {grade}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <span className={`text-sm ${lastActivity === "Yok" ? "text-slate-400" : "text-emerald-600 font-medium"}`}>
                                                                    {lastActivity}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6">
                                                                <Link href={`/dashboard/teacher/performance/${rel.student.id}`}>
                                                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2">
                                                                        <TrendingUp className="w-4 h-4" />
                                                                        İncele
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
            )}
        </div>
    )
}
