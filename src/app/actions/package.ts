"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPackages() {
    try {
        const packages = await prisma.package.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                imageData: false, // Don't fetch heavy image data
                imageMimeType: true,
                theme: true
            }
        })
        return { success: true, data: packages }
    } catch (error) {
        console.error("Error fetching packages:", error)
        return { success: false, error: "Paketler getirilemedi" }
    }
}

export async function getPackage(id: string) {
    try {
        const pkg = await prisma.package.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                imageMimeType: true,
                theme: true
            }
        })
        return { success: true, data: pkg }
    } catch (error) {
        console.error("Error fetching package:", error)
        return { success: false, error: "Paket getirilemedi" }
    }
}

export async function createPackage(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const theme = formData.get("theme") as string || "blue"
        // Image is now optional
        const imageFile = formData.get("image") as File | null

        if (!title || !description) {
            return { success: false, error: "Başlık ve açıklama zorunludur" }
        }

        const data: any = {
            title,
            description,
            theme
        }

        if (imageFile && imageFile.size > 0) {
            data.imageData = Buffer.from(await imageFile.arrayBuffer())
            data.imageMimeType = imageFile.type
        }

        const pkg = await prisma.package.create({
            data
        })

        revalidatePath("/paketler")
        revalidatePath("/dashboard/admin/packages")
        return { success: true, data: pkg }
    } catch (error) {
        console.error("Error creating package:", error)
        return { success: false, error: "Paket oluşturulamadı" }
    }
}

export async function updatePackage(id: string, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const theme = formData.get("theme") as string
        const imageFile = formData.get("image") as File | null

        const data: any = {
            title,
            description,
            theme
        }

        if (imageFile && imageFile.size > 0) {
            data.imageData = Buffer.from(await imageFile.arrayBuffer()) as any
            data.imageMimeType = imageFile.type
        }

        await prisma.package.update({
            where: { id },
            data
        })

        revalidatePath("/paketler")
        revalidatePath("/dashboard/admin/packages")
        return { success: true, message: "Paket güncellendi" }
    } catch (error) {
        console.error("Error updating package:", error)
        return { success: false, error: "Paket güncellenemedi" }
    }
}

export async function deletePackage(id: string) {
    try {
        await prisma.package.delete({
            where: { id }
        })

        revalidatePath("/paketler")
        revalidatePath("/dashboard/admin/packages")
        return { success: true, message: "Paket silindi" }
    } catch (error) {
        console.error("Error deleting package:", error)
        return { success: false, error: "Paket silinemedi" }
    }
}
