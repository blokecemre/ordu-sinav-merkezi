import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { limit } = await request.json()

        const setting = await prisma.systemSetting.upsert({
            where: { key: "daily_mistake_limit" },
            update: { value: limit.toString() },
            create: { key: "daily_mistake_limit", value: limit.toString() }
        })

        return NextResponse.json(setting)
    } catch (error) {
        console.error("Settings error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const setting = await prisma.systemSetting.findUnique({
            where: { key: "daily_mistake_limit" }
        })

        return NextResponse.json({ limit: setting ? parseInt(setting.value) : 5 })
    } catch (error) {
        console.error("Settings error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
