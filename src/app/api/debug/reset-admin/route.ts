import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        const hashedPassword = await hash("admin123", 12);

        // Upsert admin user to ensure it exists with the correct password
        const user = await prisma.user.upsert({
            where: { username: "admin" },
            update: { password: hashedPassword },
            create: {
                username: "admin",
                password: hashedPassword,
                name: "Admin",
                surname: "User",
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Admin password reset to 'admin123'",
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
