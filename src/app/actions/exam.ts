"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ExamSchema = z.object({
    name: z.string().min(3),
    date: z.string(), // YYYY-MM-DD
    type: z.string(),
})

export async function createExamWithAssignments(formData: FormData, studentIds: string[]) {
    try {
        const rawData = {
            name: formData.get("name"),
            date: formData.get("date"),
            type: formData.get("type"),
        }

        const pdfFile = formData.get("pdfFile") as File | null
        let pdfData: Uint8Array | null = null
        let pdfName: string | null = null
        let pdfMimeType: string | null = null

        if (pdfFile && pdfFile.size > 0) {
            const bytes = await pdfFile.arrayBuffer()
            pdfData = new Uint8Array(bytes)
            pdfName = pdfFile.name
            pdfMimeType = pdfFile.type
        }

        const validatedData = ExamSchema.parse(rawData)

        // Transaction to create exam and assignments
        await prisma.$transaction(async (tx) => {
            // 1. Create Exam
            const exam = await tx.exam.create({
                data: {
                    name: validatedData.name,
                    date: new Date(validatedData.date),
                    type: validatedData.type,
                    pdfData: pdfData as any,
                    pdfName: pdfName,
                    pdfMimeType: pdfMimeType,
                }
            })

            // 2. Create Assignments for selected students
            if (studentIds.length > 0) {
                await tx.examAssignment.createMany({
                    data: studentIds.map(studentId => ({
                        examId: exam.id,
                        studentId: studentId,
                    }))
                })
            }
        })

        revalidatePath("/dashboard/admin/exams")
        revalidatePath("/dashboard/student")

        return {
            message: `Sınav başarıyla yüklendi ve ${studentIds.length} öğrenciye atandı.`,
            success: true
        }
    } catch (e) {
        console.error(e)
        return { message: "İşlem sırasında bir hata oluştu.", success: false }
    }
}

export async function deleteExam(examId: string) {
    try {
        await prisma.exam.delete({
            where: { id: examId }
        })
        revalidatePath("/dashboard/admin/exams")
        return { message: "Sınav silindi.", success: true }
    } catch (e) {
        return { message: "Silme işlemi başarısız.", success: false }
    }
}

export async function getAllStudents() {
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: {
                id: true,
                name: true,
                surname: true,
                username: true,
            },
            orderBy: [
                { surname: "asc" },
                { name: "asc" }
            ]
        })
        return { students, success: true }
    } catch (e) {
        console.error(e)
        return { students: [], success: false }
    }
}
