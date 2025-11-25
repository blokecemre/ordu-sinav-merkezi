import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AnalysisDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
        where: { id },
    })

    if (!analysis || analysis.studentId !== session.user.id) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{analysis.title}</h1>
                <p className="text-muted-foreground">
                    {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                </p>
            </div>

            <article className="prose prose-blue max-w-none dark:prose-invert">
                <ReactMarkdown>{analysis.content}</ReactMarkdown>
            </article>
        </div>
    )
}
