import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const image = await prisma.sliderImage.findUnique({
            where: { id },
            select: {
                imageData: true,
                imageMimeType: true
            }
        })

        if (!image || !image.imageData) {
            return new NextResponse("Image not found", { status: 404 })
        }

        const headers = new Headers()
        if (image.imageMimeType) {
            headers.set("Content-Type", image.imageMimeType)
        }
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new NextResponse(image.imageData, {
            status: 200,
            headers,
        })
    } catch (error) {
        console.error("Error serving slider image:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
