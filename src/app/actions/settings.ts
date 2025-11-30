"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSettings() {
    try {
        const settings = await prisma.systemSetting.findMany()
        const settingsMap: Record<string, string> = {}
        settings.forEach(s => {
            settingsMap[s.key] = s.value
        })
        return { success: true, data: settingsMap }
    } catch (error) {
        console.error("Error fetching settings:", error)
        return { success: false, error: "Ayarlar getirilemedi" }
    }
}

export async function updateSettings(formData: FormData) {
    try {
        const updates = [
            { key: "lgsDate", value: formData.get("lgsDate") as string },
            { key: "address", value: formData.get("address") as string },
            { key: "phone", value: formData.get("phone") as string },
            { key: "email", value: formData.get("email") as string },
        ]

        for (const update of updates) {
            if (update.value !== null) {
                await prisma.systemSetting.upsert({
                    where: { key: update.key },
                    update: { value: update.value },
                    create: { key: update.key, value: update.value }
                })
            }
        }

        revalidatePath("/")
        revalidatePath("/iletisim")
        revalidatePath("/hakkimizda")
        revalidatePath("/dashboard/admin/settings")

        return { success: true, message: "Ayarlar güncellendi" }
    } catch (error) {
        console.error("Error updating settings:", error)
        return { success: false, error: "Ayarlar güncellenemedi" }
    }
}
