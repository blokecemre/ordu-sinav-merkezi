"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ExamSchema = z.object({
    name: z.string().min(3),
    date: z.string(), // YYYY-MM-DD
    type: z.string(),
})

// Type for parsed Excel data
type ExamResultData = {
    username: string
    totalScore: number
    totalNet: number
    details: any // JSON object
}



export async function createExamAndUploadResults(formData: FormData, resultsData: ExamResultData[]) {
    try {
        const rawData = {
            name: formData.get("name"),
            date: formData.get("date"),
            type: formData.get("type"),
        }

        const pdfFile = formData.get("pdfFile") as File | null
        let pdfData: Buffer | null = null
        let pdfName: string | null = null
        let pdfMimeType: string | null = null

        if (pdfFile && pdfFile.size > 0) {
            const bytes = await pdfFile.arrayBuffer()
            pdfData = Buffer.from(bytes)
            pdfName = pdfFile.name
            pdfMimeType = pdfFile.type
        }

        const validatedData = ExamSchema.parse(rawData)

        // Transaction to create exam and results
        await prisma.$transaction(async (tx) => {
            // 1. Create Exam
            const exam = await tx.exam.create({
                data: {
                    name: validatedData.name,
                    date: new Date(validatedData.date),
                    type: validatedData.type,
                    pdfData: pdfData,
                    pdfName: pdfName,
                    pdfMimeType: pdfMimeType,
                }
            })

            // 2. Process Results
            for (const result of resultsData) {
                // Find student by username
                const student = await tx.user.findUnique({
                    where: { username: result.username }
                })

                if (student) {
                    await tx.result.create({
                        data: {
                            examId: exam.id,
                            studentId: student.id,
                            totalScore: result.totalScore,
                            totalNet: result.totalNet,
                            details: JSON.stringify(result.details)
                        }
                    })
                } else {
                    // Log warning: Student not found for username
                    console.warn(`Student not found for username: ${result.username}`)
                }
            }
        })

        revalidatePath("/dashboard/admin/exams")
        return { message: "Sınav ve sonuçlar başarıyla yüklendi.", success: true }
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
