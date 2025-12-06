import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File
        const description = formData.get("description") as string
        const lesson = formData.get("lesson") as string || "Genel"

        if (!file) {
            return new NextResponse("File is required", { status: 400 })
        }

        // Check daily limit
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const mistakesToday = await prisma.mistake.count({
            where: {
                studentId: session.user.id,
                createdAt: {
                    gte: today
                }
            }
        })

        // Get limit from settings (default 5)
        const limitSetting = await prisma.systemSetting.findUnique({
            where: { key: "daily_mistake_limit" }
        })
        const limit = limitSetting ? parseInt(limitSetting.value) : 5

        if (mistakesToday >= limit) {
            return new NextResponse(`Daily limit of ${limit} reached`, { status: 403 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        const mistake = await prisma.mistake.create({
            data: {
                studentId: session.user.id,
                imageData: buffer,
                imageMimeType: file.type,
                description: description || null,
                lesson: lesson
            }
        })

        return NextResponse.json(mistake)
    } catch (error) {
        console.error("Mistake upload error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const studentId = searchParams.get("studentId")

        // If teacher/admin, allow viewing specific student's mistakes
        if ((session.user.role === "TEACHER" || session.user.role === "ADMIN") && studentId) {
            const mistakes = await prisma.mistake.findMany({
                where: { studentId },
                orderBy: { createdAt: "desc" }
            })

            // Convert buffer to base64 for frontend
            const mistakesWithImages = mistakes.map(m => ({
                ...m,
                imageData: `data:${m.imageMimeType};base64,${Buffer.from(m.imageData).toString('base64')}`
            }))

            return NextResponse.json(mistakesWithImages)
        }

        // If student, return own mistakes
        if (session.user.role === "STUDENT") {
            const mistakes = await prisma.mistake.findMany({
                where: { studentId: session.user.id },
                orderBy: { createdAt: "desc" }
            })

            const mistakesWithImages = mistakes.map(m => ({
                ...m,
                imageData: `data:${m.imageMimeType};base64,${Buffer.from(m.imageData).toString('base64')}`
            }))

            return NextResponse.json(mistakesWithImages)
        }

        return new NextResponse("Unauthorized", { status: 401 })
    } catch (error) {
        console.error("Mistake fetch error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
