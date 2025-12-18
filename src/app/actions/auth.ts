"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Mock SMS service for now - in production this would integrate with a provider (e.g. Netgsm/Twilio)
async function sendSMS(phone: string, text: string) {
    // In a real app, you would call your SMS provider API here
    // For development/demo, we'll just log it. 
    console.log(`[SMS MOCK] To: ${phone}, Message: ${text}`)
    return true
}

export async function requestPasswordReset(phone: string) {
    try {
        // Normalize phone: remove spaces
        const cleanPhone = phone.replace(/\s/g, "")

        // 1. Check if user exists with this phone
        const userCount = await prisma.user.count({
            where: { phone: cleanPhone }
        })

        if (userCount === 0) {
            return { success: false, error: "Bu telefon numarası ile kayıtlı kullanıcı bulunamadı." }
        }

        // 2. Generate Code (6 digits)
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        // 3. Save Code (Upsert ensures we replace old code if exists)
        await prisma.verificationCode.upsert({
            where: { phone: cleanPhone },
            update: {
                code,
                expiresAt,
                createdAt: new Date()
            },
            create: {
                phone: cleanPhone,
                code,
                expiresAt
            }
        })

        // 4. Send SMS
        await sendSMS(cleanPhone, `Ordu Sinav Merkezi Dogrulama Kodu: ${code}`)

        return { success: true, message: "Onay kodu telefonunuza gönderildi." }

    } catch (error) {
        console.error("Request reset error:", error)
        return { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." }
    }
}

export async function resetPassword(phone: string, code: string, newPassword: string) {
    try {
        const cleanPhone = phone.replace(/\s/g, "")

        // 1. Verify Code
        const record = await prisma.verificationCode.findUnique({
            where: { phone: cleanPhone }
        })

        if (!record) {
            return { success: false, error: "Onay kodu talebi bulunamadı. Lütfen tekrar kod isteyin." }
        }

        if (record.code !== code) {
            return { success: false, error: "Hatalı onay kodu girdiniz." }
        }

        if (new Date() > record.expiresAt) {
            return { success: false, error: "Onay kodunun süresi dolmuş. Lütfen tekrar kod isteyin." }
        }

        // 2. Validate Password Rules
        if (newPassword.length < 8) {
            return { success: false, error: "Şifre en az 8 karakter olmalıdır." }
        }

        // Basic complexity check: 1 letter, 1 number
        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);

        if (!hasLetter || !hasNumber) {
            return { success: false, error: "Şifre en az bir harf ve bir rakam içermelidir." }
        }

        // 3. Update User Password(s)
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.updateMany({
            where: { phone: cleanPhone },
            data: { password: hashedPassword }
        })

        // 4. Delete Code
        await prisma.verificationCode.delete({
            where: { phone: cleanPhone }
        })

        return { success: true, message: "Şifreniz başarıyla güncellendi." }

    } catch (error) {
        console.error("Reset password error:", error)
        // Check for specific Prisma errors if needed
        return { success: false, error: "İşlem sırasında bir hata oluştu." }
    }
}
