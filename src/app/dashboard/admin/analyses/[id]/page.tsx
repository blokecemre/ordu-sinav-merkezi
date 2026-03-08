import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { PrintButton } from "@/components/PrintButton"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AdminAnalysisDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") return null

    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
        where: { id },
        include: { student: true }
    })

    if (!analysis) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
            <div className="border-b pb-4 flex items-start justify-between print:border-b-2 print:border-black">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 print:text-black">{analysis.title}</h1>
                    <p className="text-muted-foreground print:text-black font-semibold">
                        Öğrenci: {analysis.student.name} {analysis.student.surname}
                    </p>
                    <p className="text-muted-foreground print:text-gray-700">
                        {format(new Date(analysis.createdAt), "d MMMM yyyy", { locale: tr })}
                    </p>
                </div>
                <div className="print:hidden">
                    <PrintButton />
                </div>
            </div>

            <article className="max-w-none print:text-black print:bg-white analyses-print-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 shadow-sm print:border-black print:shadow-none print:break-inside-avoid">
                                <table className="w-full text-xs border-collapse font-sans print:text-black" {...props} />
                            </div>
                        ),
                        thead: ({ node, ...props }) => (
                            <thead className="bg-[#7c3aed] text-white font-semibold uppercase tracking-wider print:bg-gray-200 print:text-black" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                            <th className="p-2 border border-slate-300 text-center align-middle whitespace-nowrap print:border-black" {...props} />
                        ),
                        tbody: ({ node, ...props }) => (
                            <tbody className="bg-white divide-y divide-slate-200 print:divide-black" {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                            <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors print:bg-white" {...props} />
                        ),
                        td: ({ node, children, ...props }) => {
                            const value = String(children).trim()
                            const num = parseFloat(value)

                            let className = "p-1.5 border border-slate-300 text-center align-middle text-slate-700 font-medium print:border-black print:text-black"

                            if (!isNaN(num) && num >= 0 && num <= 100 && (value.length <= 3 || value.includes('.'))) {
                                if (num < 50) className += " bg-red-100 text-red-700 print:bg-transparent"
                                else if (num < 70) className += " bg-yellow-100 text-yellow-800 print:bg-transparent"
                                else className += " bg-green-100 text-green-800 print:bg-transparent"
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
