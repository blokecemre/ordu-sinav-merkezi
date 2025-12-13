"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const AnalysisSchema = z.object({
    studentId: z.string(),
    title: z.string().min(3),
    content: z.string(),
    analysisType: z.enum(["GENEL_DENEME", "YANLIS_SORU"]).default("GENEL_DENEME"),
})

export async function createAnalysis(formData: FormData) {
    try {
        const file = formData.get("file") as File
        if (!file || !file.name.endsWith(".md")) {
            return { message: "Lütfen geçerli bir .md dosyası yükleyin.", success: false }
        }

        const content = await file.text()

        const rawData = {
            studentId: formData.get("studentId"),
            title: formData.get("title"),
            content: content,
            analysisType: formData.get("analysisType") || "GENEL_DENEME",
        }

        const validatedData = AnalysisSchema.parse(rawData)

        await prisma.analysis.create({
            data: validatedData
        })

        revalidatePath("/dashboard/admin/analyses")
        return { message: "Analiz başarıyla yüklendi.", success: true }
    } catch (e) {
        console.error(e)
        return { message: "Bir hata oluştu.", success: false }
    }
}

export async function deleteAnalysis(id: string) {
    try {
        await prisma.analysis.delete({
            where: { id }
        })
        revalidatePath("/dashboard/admin/analyses")
        return { message: "Analiz silindi.", success: true }
    } catch (e) {
        return { message: "Silme işlemi başarısız.", success: false }
    }
}
