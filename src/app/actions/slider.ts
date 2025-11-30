"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSliderImages() {
    try {
        const images = await prisma.sliderImage.findMany({
            orderBy: { order: 'asc' },
            select: {
                id: true,
                order: true,
                createdAt: true,
                updatedAt: true,
                imageData: false, // Don't fetch heavy image data
                imageMimeType: true
            }
        })
        return { success: true, data: images }
    } catch (error) {
        console.error("Error fetching slider images:", error)
        return { success: false, error: "Slider görselleri getirilemedi" }
    }
}

export async function createSliderImage(formData: FormData) {
    try {
        const imageFile = formData.get("image") as File | null

        if (!imageFile) {
            return { success: false, error: "Görsel zorunludur" }
        }

        const imageData = Buffer.from(await imageFile.arrayBuffer())
        const imageMimeType = imageFile.type

        // Get the highest order to append to the end
        const lastImage = await prisma.sliderImage.findFirst({
            orderBy: { order: 'desc' }
        })
        const newOrder = (lastImage?.order ?? -1) + 1

        const image = await prisma.sliderImage.create({
            data: {
                imageData: imageData as any,
                imageMimeType,
                order: newOrder
            }
        })

        revalidatePath("/")
        revalidatePath("/dashboard/admin/slider")
        return { success: true, data: image }
    } catch (error) {
        console.error("Error creating slider image:", error)
        return { success: false, error: "Görsel yüklenemedi" }
    }
}

export async function deleteSliderImage(id: string) {
    try {
        await prisma.sliderImage.delete({
            where: { id }
        })

        revalidatePath("/")
        revalidatePath("/dashboard/admin/slider")
        return { success: true, message: "Görsel silindi" }
    } catch (error) {
        console.error("Error deleting slider image:", error)
        return { success: false, error: "Görsel silinemedi" }
    }
}

export async function updateSliderOrder(items: { id: string; order: number }[]) {
    try {
        for (const item of items) {
            await prisma.sliderImage.update({
                where: { id: item.id },
                data: { order: item.order }
            })
        }
        revalidatePath("/")
        revalidatePath("/dashboard/admin/slider")
        return { success: true }
    } catch (error) {
        console.error("Error updating slider order:", error)
        return { success: false, error: "Sıralama güncellenemedi" }
    }
}
