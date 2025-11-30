import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const partner = await prisma.partner.findUnique({
            where: { id },
            select: {
                logoData: true,
                logoMimeType: true
            }
        })

        if (!partner || !partner.logoData) {
            return new NextResponse("Logo not found", { status: 404 })
        }

        const headers = new Headers()
        if (partner.logoMimeType) {
            headers.set("Content-Type", partner.logoMimeType)
        }
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new NextResponse(partner.logoData, {
            status: 200,
            headers,
        })
    } catch (error) {
        console.error("Error serving partner logo:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
