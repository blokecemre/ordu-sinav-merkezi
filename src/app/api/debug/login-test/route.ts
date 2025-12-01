import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found in DB",
                username
            })
        }

        const isMatch = await compare(password, user.password)

        return NextResponse.json({
            success: true,
            userFound: true,
            passwordMatch: isMatch,
            userId: user.id,
            role: user.role,
            storedHashPrefix: user.password.substring(0, 10)
        })

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
