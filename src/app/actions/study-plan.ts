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

export async function getStudyPlan(studentId?: string) {
    try {
        if (!studentId) {
            return { success: true, data: [] }
        }

        const items = await prisma.studyPlanItem.findMany({
            where: { studentId },
            orderBy: { order: 'asc' }
        })
        return { success: true, data: items }
    } catch (error) {
        console.error("Error fetching study plan:", error)
        return { success: false, error: "Çalışma planı getirilemedi" }
    }
}

export async function updateStudyPlan(studentId: string, items: { day: string; subject: string; duration: number; order: number; outcomes?: string[] }[]) {
    try {
        if (!studentId) {
            return { success: false, error: "Öğrenci seçilmedi" }
        }

        // Transaction to replace all items safely
        await prisma.$transaction(async (tx) => {
            // Delete all existing items for this student
            await tx.studyPlanItem.deleteMany({
                where: { studentId }
            })

            // Create new items
            if (items.length > 0) {
                await tx.studyPlanItem.createMany({
                    data: items.map(item => ({
                        ...item,
                        studentId
                    }))
                })
            }
        })

        revalidatePath("/")
        revalidatePath("/calisma-plani")
        revalidatePath("/dashboard/admin/study-plan")
        revalidatePath("/dashboard/student/study-plan")
        return { success: true }
    } catch (error) {
        console.error("Error updating study plan:", error)
        return { success: false, error: "Çalışma planı güncellenemedi" }
    }
}
