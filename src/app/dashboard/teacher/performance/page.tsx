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
import { TrendingUp, ArrowRight, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TeacherPerformancePage() {
    // Fetch all students (assuming teacher can see all or strict to their classes if logic exists. keeping simple as per current scope)
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { name: "asc" },
        include: {
            dailyLogs: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    })

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performans Takibi</h1>
                    <p className="text-slate-500">Öğrencilerinin çalışma istatistiklerini ve disiplin durumlarını incele.</p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="pl-6">Öğrenci</TableHead>
                            <TableHead>Sınıf</TableHead>
                            <TableHead>Son Aktivite</TableHead>
                            <TableHead className="text-right pr-6">İşlem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    Henüz öğrenci bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => {
                                const lastLog = student.dailyLogs[0]
                                const lastDate = lastLog ? new Date(lastLog.date).toLocaleDateString("tr-TR") : "Yok"

                                return (
                                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {student.name.charAt(0)}{student.surname.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-slate-900">{student.name} {student.surname}</div>
                                                    <div className="text-xs text-slate-500">{student.school}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {student.classLevel || "Belirtilmemiş"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm ${lastDate === "Yok" ? "text-slate-400" : "text-emerald-600 font-medium"}`}>
                                                {lastDate}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Link href={`/dashboard/teacher/performance/${student.id}`}>
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    İncele
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
