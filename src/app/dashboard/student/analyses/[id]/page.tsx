import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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

            <article className="max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 shadow-sm">
                                <table className="w-full text-xs border-collapse font-sans" {...props} />
                            </div>
                        ),
                        thead: ({ node, ...props }) => (
                            <thead className="bg-[#7c3aed] text-white font-semibold uppercase tracking-wider" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                            <th className="p-2 border border-slate-300 text-center align-middle whitespace-nowrap" {...props} />
                        ),
                        tbody: ({ node, ...props }) => (
                            <tbody className="bg-white divide-y divide-slate-200" {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                            <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors" {...props} />
                        ),
                        td: ({ node, children, ...props }) => {
                            // Check if content is numeric (score/percentage) to apply colors
                            const value = String(children).trim()
                            const num = parseFloat(value)

                            let className = "p-1.5 border border-slate-300 text-center align-middle text-slate-700 font-medium"

                            // Simple heuristic: if it looks like a 0-100 score/rate
                            if (!isNaN(num) && num >= 0 && num <= 100 && (value.length <= 3 || value.includes('.'))) {
                                if (num < 50) className += " bg-red-100 text-red-700"
                                else if (num < 70) className += " bg-yellow-100 text-yellow-800"
                                else className += " bg-green-100 text-green-800"
                            }

                            return <td className={className} {...props}>{children}</td>
                        }
                    }}
                >
                    {analysis.content}
                </ReactMarkdown>
            </article>
        </div>
    )
}
