import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const post = await prisma.blogPost.findUnique({
            where: { id },
            select: {
                imageData: true,
                imageMimeType: true
            }
        })

        if (!post || !post.imageData) {
            return new NextResponse("Image not found", { status: 404 })
        }

        const headers = new Headers()
        if (post.imageMimeType) {
            headers.set("Content-Type", post.imageMimeType)
        }
        headers.set("Cache-Control", "public, max-age=31536000, immutable")

        return new NextResponse(post.imageData, {
            status: 200,
            headers,
        })
    } catch (error) {
        console.error("Error serving blog image:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
