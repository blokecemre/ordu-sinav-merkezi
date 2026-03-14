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
        <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
            <div className="border-b pb-4 flex items-start justify-between print:border-b-2 print:border-black">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 print:text-black">{analysis.title}</h1>
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
                        },
                        code: ({ node, inline, className, children, ...props }: any) => {
                            const text = String(children);
                            if (!inline && text.includes('█')) {
                                const lines = text.split('\n').map((line, i) => {
                                    const coloredLine = line.split(/([█★˅]+)/).map((part, j) => {
                                        if (part.includes('█')) return <span key={j} className="text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] print:text-black print:drop-shadow-none">{part}</span>;
                                        if (part.includes('★')) return <span key={j} className="text-yellow-500 animate-pulse drop-shadow-[0_0_5px_rgba(234,179,8,0.8)] print:text-black print:animate-none print:drop-shadow-none">{part}</span>;
                                        if (part.includes('˅')) return <span key={j} className="text-red-500 font-bold print:text-black">{part}</span>;
                                        return part;
                                    });
                                    return <div key={i}>{coloredLine}</div>;
                                });

                                return (
                                    <div className="relative my-6 glass-card p-6 overflow-x-auto rounded-xl print:shadow-none print:border-none print:p-0 print:bg-transparent">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-xl print:hidden" />
                                        <pre className="relative font-mono text-sm leading-tight text-foreground/80 print:text-black" {...props}>
                                            {lines}
                                        </pre>
                                    </div>
                                );
                            }

                            return inline ? (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-primary font-mono print:bg-transparent print:text-black" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm my-4 font-mono shadow-md print:bg-white print:text-black print:border print:border-black print:shadow-none" {...props}>
                                    <code {...props}>{children}</code>
                                </pre>
                            );
                        }
                    }}
                >
                    {analysis.content}
                </ReactMarkdown>
            </article>
        </div>
    )
}
