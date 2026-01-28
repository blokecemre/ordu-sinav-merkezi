import { prisma } from "@/lib/prisma"
import { StudentDetailCharts } from "@/components/teacher/StudentDetailCharts"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { notFound } from "next/navigation"
import { BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowRight, Calendar, Target, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

    const analyses = await prisma.analysis.findMany({
        where: { studentId: id },
        orderBy: { createdAt: "desc" }
    })

    const chartData = results.map(result => ({
        examName: result.exam.name,
        date: format(new Date(result.exam.date), "d MMM", { locale: tr }),
        score: result.totalScore,
        net: result.totalNet
    }))

    // Reverse for table to show newest first
    const tableResults = [...results].reverse()

    // Calculate Stats
    const totalExams = results.length
    const avgNet = totalExams > 0
        ? results.reduce((sum, r) => sum + r.totalNet, 0) / totalExams
        : 0
    const avgScore = totalExams > 0
        ? results.reduce((sum, r) => sum + r.totalScore, 0) / totalExams
        : 0

    return (
        <div className="space-y-8 p-1">
            {/* Back Button & Header */}
            <div className="space-y-6">
                <Link href="/dashboard/teacher/students">
                    <Button
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Öğrencilere Dön
                    </Button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {student.name.charAt(0)}{student.surname.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {student.name} {student.surname}
                            </h1>
                            <p className="text-slate-500">
                                Öğrenci Analizi
                            </p>
                        </div>
                    </div>

                    <Link href={`/dashboard/teacher/students/${id}/mistakes`}>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all hover:scale-105">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Yanlış Soru Defteri
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Performance & Discipline Section Removed as per request */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Toplam Sınav</p>
                                <p className="text-3xl font-bold text-slate-800">{totalExams}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Ortalama Net</p>
                                <p className="text-3xl font-bold text-slate-800">{avgNet.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Ortalama Puan</p>
                                <p className="text-3xl font-bold text-slate-800">{avgScore.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <StudentDetailCharts data={chartData} />

            {/* Exam History Table */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                        Sınav Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="text-slate-500 font-semibold pl-6">Sınav Adı</TableHead>
                                <TableHead className="text-slate-500 font-semibold">Tarih</TableHead>
                                <TableHead className="text-slate-500 font-semibold">Tür</TableHead>
                                <TableHead className="text-slate-500 font-semibold">Puan</TableHead>
                                <TableHead className="text-slate-500 font-semibold">Net</TableHead>
                                <TableHead className="text-right text-slate-500 font-semibold pr-6">Sonuç Dosyası</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableResults.map((result, index) => (
                                <TableRow key={result.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                                    <TableCell className="font-medium text-slate-700 pl-6">{result.exam.name}</TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {format(new Date(result.exam.date), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-white font-normal text-slate-500">{result.exam.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-indigo-600">
                                        {result.totalScore.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-800">
                                        {result.totalNet.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {result.exam.pdfName ? (
                                            <a
                                                href={`/api/exam/${result.exam.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                <FileText className="w-4 h-4 mr-1" /> İndir
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Analysis Reports Table */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                        Analiz Raporları
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="text-slate-500 font-semibold pl-6">Rapor Başlığı</TableHead>
                                <TableHead className="text-slate-500 font-semibold">Tarih</TableHead>
                                <TableHead className="text-right text-slate-500 font-semibold pr-6">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analyses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                        Henüz analiz raporu bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                analyses.map((analysis) => (
                                    <TableRow key={analysis.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                                        <TableCell className="font-medium text-slate-700 pl-6">{analysis.title}</TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Link href={`/dashboard/teacher/students/${id}/analysis/${analysis.id}`}>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    Görüntüle <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
