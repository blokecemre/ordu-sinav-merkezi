"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    surname: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    role: z.enum(["STUDENT", "TEACHER"]),
})

export async function registerUser(formData: FormData) {
    try {
        const rawData = {
            username: formData.get("username"),
            password: formData.get("password"),
            name: formData.get("name"),
            surname: formData.get("surname"),
            role: formData.get("role"),
        }

        const validatedData = RegisterSchema.parse(rawData)

        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: validatedData.username }
        })

        if (existingUser) {
            return { message: "Bu kullanıcı adı zaten kullanılıyor.", success: false }
        }

        // Hash password
        const hashedPassword = await hash(validatedData.password, 10)

        // Create user
        await prisma.user.create({
            data: {
                username: validatedData.username,
                password: hashedPassword,
                name: validatedData.name,
                surname: validatedData.surname,
                role: validatedData.role,
            }
        })

        return { message: "Kayıt başarılı! Giriş yapabilirsiniz.", success: true }
    } catch (e) {
        if (e instanceof z.ZodError) {
            return { message: (e as any).errors[0].message, success: false }
        }
        console.error(e)
        return { message: "Bir hata oluştu.", success: false }
    }
}
