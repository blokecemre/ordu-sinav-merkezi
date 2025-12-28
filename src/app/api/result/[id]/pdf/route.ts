import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const result = await prisma.result.findUnique({
            where: { id },
            select: {
                resultPdfData: true,
                resultPdfName: true,
                resultPdfMimeType: true
            }
        })

        if (!result || !result.resultPdfData) {
            return new NextResponse("PDF not found", { status: 404 })
        }

        const headers = new Headers()
        headers.set("Content-Type", result.resultPdfMimeType || "application/pdf")
        headers.set("Content-Disposition", `inline; filename="${result.resultPdfName || 'sonuc.pdf'}"`)
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new NextResponse(result.resultPdfData, {
            status: 200,
            headers
        })
    } catch (error) {
        console.error("Error serving PDF:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
