import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
    params: Promise<{ id: string; analysisId: string }>
}

export default async function TeacherAnalysisDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login")
    }

    const { id, analysisId } = await params

    // Verify teacher is assigned to this student
    const assignment = await prisma.teacherStudent.findUnique({
        where: {
            teacherId_studentId: {
                teacherId: session.user.id,
                studentId: id
            }
        }
    })

    if (!assignment) {
        notFound()
    }

    const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: { student: true }
    })

    if (!analysis || analysis.studentId !== id) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/dashboard/teacher/students/${id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{analysis.title}</h1>
                    <p className="text-muted-foreground">
                        {analysis.student.name} {analysis.student.surname} - {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                    </p>
                </div>
            </div>

            <article className="prose prose-blue max-w-none dark:prose-invert bg-white p-8 rounded-lg border shadow-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.content}</ReactMarkdown>
            </article>
        </div>
    )
}
