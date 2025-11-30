"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        })
        return { success: true, value: setting?.value }
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error)
        return { success: false, error: "Ayar getirilemedi" }
    }
}

export async function setSystemSetting(key: string, value: string) {
    try {
        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        })

        revalidatePath("/hakkimizda")
        revalidatePath("/dashboard/admin/settings")
        return { success: true, data: setting }
    } catch (error) {
        console.error(`Error setting ${key}:`, error)
        return { success: false, error: "Ayar güncellenemedi" }
    }
}
