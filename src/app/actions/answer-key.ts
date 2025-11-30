"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const UploadSchema = z.object({
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
    file: z.instanceof(File, { message: "Lütfen bir dosya seçin" })
        .refine((file) => file.size > 0, "Dosya boş olamaz")
        .refine((file) => file.type === "application/pdf", "Sadece PDF dosyaları yüklenebilir"),
})

export async function getAnswerKeys(query?: string) {
    try {
        const keys = await prisma.answerKey.findMany({
            where: query ? {
                title: {
                    contains: query,
                    mode: 'insensitive'
                }
            } : undefined,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                pdfName: true,
                // Don't select pdfData to keep response light
            }
        })
        return { success: true, data: keys }
    } catch (error) {
        console.error("Error fetching answer keys:", error)
        return { success: false, error: "Cevap anahtarları getirilemedi" }
    }
}

export async function uploadAnswerKey(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const file = formData.get("file") as File

        const validatedFields = UploadSchema.safeParse({ title, file })

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors.title?.[0] ||
                    validatedFields.error.flatten().fieldErrors.file?.[0] ||
                    "Geçersiz veri"
            }
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        await prisma.answerKey.create({
            data: {
                title,
                pdfData: buffer,
                pdfName: file.name,
                pdfMimeType: file.type,
            }
        })

        revalidatePath("/cevap-anahtarlari")
        revalidatePath("/dashboard/admin/answer-keys")
        return { success: true, message: "Cevap anahtarı başarıyla yüklendi" }
    } catch (error) {
        console.error("Error uploading answer key:", error)
        return { success: false, error: "Yükleme sırasında bir hata oluştu" }
    }
}

export async function deleteAnswerKey(id: string) {
    try {
        await prisma.answerKey.delete({
            where: { id }
        })
        revalidatePath("/cevap-anahtarlari")
        revalidatePath("/dashboard/admin/answer-keys")
        return { success: true, message: "Cevap anahtarı silindi" }
    } catch (error) {
        console.error("Error deleting answer key:", error)
        return { success: false, error: "Silme işlemi başarısız" }
    }
}

export async function getAnswerKeyFile(id: string) {
    try {
        const key = await prisma.answerKey.findUnique({
            where: { id },
            select: {
                pdfData: true,
                pdfMimeType: true,
                pdfName: true
            }
        })
        return key
    } catch (error) {
        console.error("Error fetching answer key file:", error)
        return null
    }
}
