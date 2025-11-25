"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function assignStudents(teacherId: string, studentIds: string[]) {
    try {
        // First, remove existing assignments if needed or just add new ones?
        // Let's assume we are adding/updating.
        // For simplicity, let's delete all existing assignments for this teacher and re-create selected ones.
        // Or better, just create non-existing ones.

        // Strategy: 
        // 1. Check if relation exists.
        // 2. If not, create.

        // Actually, a better UX for "Assignment" page is usually "Select Teacher" -> "Select Students" -> "Save".
        // This implies the selected students are the ONLY students for that teacher? Or just adding?
        // Let's implement "Add/Remove" logic.

        // For this MVP: We will receive a list of ALL students that should be assigned to the teacher.
        // We will delete all current assignments for this teacher and re-create them.
        // This is simple and effective for small numbers.

        await prisma.$transaction(async (tx) => {
            // Delete all existing assignments for this teacher
            await tx.teacherStudent.deleteMany({
                where: { teacherId }
            })

            // Create new assignments
            if (studentIds.length > 0) {
                await tx.teacherStudent.createMany({
                    data: studentIds.map(studentId => ({
                        teacherId,
                        studentId
                    }))
                })
            }
        })

        revalidatePath("/dashboard/admin/assignments")
        return { message: "Atama işlemi başarıyla tamamlandı.", success: true }
    } catch (e) {
        console.error(e)
        return { message: "Atama işlemi sırasında bir hata oluştu.", success: false }
    }
}
