"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPartners() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                url: true,
                createdAt: true,
                updatedAt: true,
                logoData: false, // Don't fetch heavy image data
                logoMimeType: true
            }
        })
        return { success: true, data: partners }
    } catch (error) {
        console.error("Error fetching partners:", error)
        return { success: false, error: "Partnerler getirilemedi" }
    }
}

export async function createPartner(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const url = formData.get("url") as string || ""
        const logoFile = formData.get("logo") as File | null

        if (!name) {
            return { success: false, error: "İsim zorunludur" }
        }

        const data: any = {
            name,
            url
        }

        if (logoFile && logoFile.size > 0) {
            data.logoData = Buffer.from(await logoFile.arrayBuffer())
            data.logoMimeType = logoFile.type
        }

        const partner = await prisma.partner.create({
            data
        })

        revalidatePath("/hakkimizda")
        revalidatePath("/dashboard/admin/partners")
        return { success: true, data: partner }
    } catch (error) {
        console.error("Error creating partner:", error)
        return { success: false, error: "Partner oluşturulamadı" }
    }
}

export async function deletePartner(id: string) {
    try {
        await prisma.partner.delete({
            where: { id }
        })

        revalidatePath("/hakkimizda")
        revalidatePath("/dashboard/admin/partners")
        return { success: true, message: "Partner silindi" }
    } catch (error) {
        console.error("Error deleting partner:", error)
        return { success: false, error: "Partner silinemedi" }
    }
}
