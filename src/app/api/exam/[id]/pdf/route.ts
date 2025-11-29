import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const exam = await prisma.exam.findUnique({
            where: { id },
            select: {
                pdfData: true,
                pdfName: true,
                pdfMimeType: true
            }
        })

        if (!exam || !exam.pdfData) {
            return new NextResponse("PDF not found", { status: 404 })
        }

        const headers = new Headers()
        headers.set("Content-Type", exam.pdfMimeType || "application/pdf")
        headers.set("Content-Disposition", `attachment; filename="${exam.pdfName || 'exam.pdf'}"`)

        return new NextResponse(exam.pdfData, {
            status: 200,
            headers
        })

    } catch (error) {
        console.error("Error serving PDF:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
