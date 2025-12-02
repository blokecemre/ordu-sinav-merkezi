"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type StudyPlanItem = {
    id: string
    day: string
    subject: string
    duration: number
    order: number
}

export async function getStudyPlan() {
    try {
        const items = await prisma.studyPlanItem.findMany({
            orderBy: { order: 'asc' }
        })
        return { success: true, data: items }
    } catch (error) {
        console.error("Error fetching study plan:", error)
        return { success: false, error: "Çalışma planı getirilemedi" }
    }
}

export async function updateStudyPlan(items: { day: string; subject: string; duration: number; order: number }[]) {
    try {
        // Transaction to replace all items safely
        await prisma.$transaction(async (tx) => {
            // Delete all existing items
            await tx.studyPlanItem.deleteMany()

            // Create new items
            if (items.length > 0) {
                await tx.studyPlanItem.createMany({
                    data: items
                })
            }
        })

        revalidatePath("/")
        revalidatePath("/calisma-plani")
        revalidatePath("/dashboard/admin/study-plan")
        return { success: true }
    } catch (error) {
        console.error("Error updating study plan:", error)
        return { success: false, error: "Çalışma planı güncellenemedi" }
    }
}
