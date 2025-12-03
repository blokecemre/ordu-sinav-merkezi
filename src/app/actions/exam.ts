"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ExamSchema = z.object({
    name: z.string().min(3),
    date: z.string(), // YYYY-MM-DD
    type: z.string(),
})

type StudentResult = {
    studentId: string
    totalScore: number
    totalNet: number
}

export async function createExamWithAssignments(
    formData: FormData,
    studentIds: string[],
    results: StudentResult[] = []
) {
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

        // Transaction to create exam, assignments, and results
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

            // 3. Create Results if provided
            if (results.length > 0) {
                await tx.result.createMany({
                    data: results.map(result => ({
                        examId: exam.id,
                        studentId: result.studentId,
                        totalScore: result.totalScore,
                        totalNet: result.totalNet,
                        details: JSON.stringify({}), // Empty details for now
                    }))
                })
            }
        })

        revalidatePath("/dashboard/admin/exams")
        revalidatePath("/dashboard/student")

        return {
            message: `Sınav başarıyla yüklendi. ${studentIds.length} öğrenciye atandı${results.length > 0 ? ` ve ${results.length} sonuç kaydedildi` : ''}.`,
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

export async function updateStudentResult(
    examId: string,
    studentId: string,
    formData: FormData
) {
    try {
        const totalScore = parseFloat(formData.get("totalScore") as string) || 0
        const totalNet = parseFloat(formData.get("totalNet") as string) || 0
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

        // Check if result exists
        const existingResult = await prisma.result.findUnique({
            where: {
                studentId_examId: {
                    studentId,
                    examId
                }
            }
        })

        const data: any = {
            totalScore,
            totalNet,
        }

        if (pdfData) {
            data.resultPdfData = pdfData
            data.resultPdfName = pdfName
            data.resultPdfMimeType = pdfMimeType
        }

        if (existingResult) {
            await prisma.result.update({
                where: { id: existingResult.id },
                data
            })
        } else {
            await prisma.result.create({
                data: {
                    examId,
                    studentId,
                    totalScore,
                    totalNet,
                    details: JSON.stringify({}),
                    ...data
                }
            })
        }

        revalidatePath(`/dashboard/admin/exams`)
        revalidatePath(`/dashboard/student`)

        return { success: true, message: "Sonuç başarıyla güncellendi" }
    } catch (error) {
        console.error("Error updating result:", error)
        return { success: false, message: "Güncelleme sırasında bir hata oluştu" }
    }
}

export async function getExamResults(examId: string) {
    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: {
                assignments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                username: true
                            }
                        }
                    }
                },
                results: true
            }
        })

        if (!exam) return { success: false, error: "Sınav bulunamadı" }

        const students = exam.assignments.map(a => a.student)
        const results = exam.results

        return { success: true, students, results, examName: exam.name }
    } catch (error) {
        console.error("Error fetching exam results:", error)
        return { success: false, error: "Sonuçlar getirilemedi" }
    }
}
