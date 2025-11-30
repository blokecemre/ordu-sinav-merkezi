import { getAnswerKeyFile } from "@/app/actions/answer-key"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const file = await getAnswerKeyFile(id)

    if (!file || !file.pdfData) {
        return new NextResponse("File not found", { status: 404 })
    }

    const headers = new Headers()
    headers.set("Content-Type", file.pdfMimeType)
    headers.set("Content-Disposition", `inline; filename="${encodeURIComponent(file.pdfName)}"`)

    return new NextResponse(file.pdfData, {
        status: 200,
        headers,
    })
}
