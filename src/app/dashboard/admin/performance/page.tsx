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
import { TrendingUp, Download, Search } from "lucide-react"
import { AdminPerformanceExportButton } from "@/components/admin/AdminPerformanceExportButton"

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
            DersID: log.subjectId, // Ideally join subject name too, but this requires deep include or map
            Dogru: log.correctCount,
            Yanlis: log.wrongCount,
            Okuma: log.readingPage
        }))
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tüm Öğrenci Performansı</h1>
                    <p className="text-slate-500">Genel performans takibi ve veri yönetimi.</p>
                </div>
                <AdminPerformanceExportButton data={exportData} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="pl-6">Öğrenci</TableHead>
                            <TableHead>Toplam Çalışma (Son 30 Gün)</TableHead>
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
                                const totalQuestions = student.dailyLogs.reduce((acc, curr) => acc + curr.correctCount + curr.wrongCount, 0)

                                return (
                                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                                                    {student.name.charAt(0)}{student.surname.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-slate-900">{student.name} {student.surname}</div>
                                                    <div className="text-xs text-slate-500">{student.school}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-indigo-600">{totalQuestions}</span> Soru
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm ${lastDate === "Yok" ? "text-slate-400" : "text-emerald-600 font-medium"}`}>
                                                {lastDate}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Link href={`/dashboard/admin/users/${student.id}`}>
                                                <Button size="sm" variant="outline" className="gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Detay & Düzenle
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
