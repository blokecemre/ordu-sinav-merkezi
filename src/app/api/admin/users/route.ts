import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get("role")
        const query = searchParams.get("query")
        const includeMistakeCount = searchParams.get("includeMistakeCount") === "true"

        const whereClause: any = {}

        if (role) {
            whereClause.role = role
        }

        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { surname: { contains: query, mode: 'insensitive' } },
                { username: { contains: query, mode: 'insensitive' } },
            ]
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                surname: true,
                username: true,
                role: true,
                classLevel: true,
                ...(includeMistakeCount && {
                    _count: {
                        select: { mistakes: true }
                    }
                })
            },
            orderBy: [
                { classLevel: 'asc' },
                { name: 'asc' },
                { surname: 'asc' }
            ]
        })

        // Transform to include mistakeCount as a flat field
        const result = users.map(user => ({
            ...user,
            mistakeCount: (user as any)._count?.mistakes ?? 0,
            _count: undefined
        }))

        return NextResponse.json(result)
    } catch (error) {
        console.error("Users fetch error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
