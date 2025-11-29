export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

async function getTeacherAnalytics(teacherId: string) {
    // Get all students assigned to this teacher
    const assignments = await prisma.teacherStudent.findMany({
        where: { teacherId },
        include: {
            student: {
                include: {
                    studentResults: {
                        include: {
                            exam: true
                        },
                        orderBy: {
                            exam: { date: "desc" }
                        }
                    }
                }
            }
        }
    })

    const students = assignments.map(a => a.student)
    const totalStudents = students.length

    // Calculate overall statistics
    let totalExams = 0
    let totalScore = 0
    let totalNet = 0
    let examCount = 0

    students.forEach(student => {
        student.studentResults.forEach(result => {
            totalExams++
            totalScore += result.totalScore
            totalNet += result.totalNet
            examCount++
        })
    })

    const averageScore = examCount > 0 ? totalScore / examCount : 0
    const averageNet = examCount > 0 ? totalNet / examCount : 0

    // Get top performers
    const studentAverages = students.map(student => {
        const results = student.studentResults
        const count = results.length
        const avgScore = count > 0 ? results.reduce((sum, r) => sum + r.totalScore, 0) / count : 0
        const avgNet = count > 0 ? results.reduce((sum, r) => sum + r.totalNet, 0) / count : 0

        return {
            id: student.id,
            name: `${student.name} ${student.surname}`,
            examCount: count,
            averageScore: avgScore,
            averageNet: avgNet
        }
    }).sort((a, b) => b.averageScore - a.averageScore)

    return {
        totalStudents,
        totalExams,
        averageScore,
        averageNet,
        topPerformers: studentAverages.slice(0, 5)
    }
}

export default async function TeacherAnalysisPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
        redirect("/login")
    }

    const analytics = await getTeacherAnalytics(session.user.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analiz</h1>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Öğrenci</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Sınav</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalExams}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Puan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.averageScore.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Net</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.averageNet.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            <Card>
                <CardHeader>
                    <CardTitle>En Başarılı Öğrenciler</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.topPerformers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Henüz sonuç yok.</p>
                    ) : (
                        <div className="space-y-4">
                            {analytics.topPerformers.map((student, index) => (
                                <div key={student.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.examCount} sınav</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{student.averageScore.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">{student.averageNet.toFixed(2)} net</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
