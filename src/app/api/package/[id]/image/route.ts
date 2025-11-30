import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const pkg = await prisma.package.findUnique({
            where: { id },
            select: {
                imageData: true,
                imageMimeType: true
            }
        })

        if (!pkg || !pkg.imageData) {
            return new NextResponse("Image not found", { status: 404 })
        }

        const headers = new Headers()
        if (pkg.imageMimeType) {
            headers.set("Content-Type", pkg.imageMimeType)
        }
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new NextResponse(pkg.imageData, {
            status: 200,
            headers,
        })
    } catch (error) {
        console.error("Error serving package image:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
