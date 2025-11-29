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
    // New fields
    classLevel: z.string().optional(),
    school: z.string().optional(),
    session: z.string().optional(),
    examCenter: z.string().optional(),
    parentName: z.string().optional(),
    parentSurname: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    phone: z.string().optional(),
    referenceSource: z.string().optional(),
    kvkkConsent: z.string().transform((val) => val === "on" || val === "true").refine((val) => val === true, {
        message: "KVKK aydınlatma metnini onaylamanız gerekmektedir.",
    }),
})

export async function registerUser(formData: FormData) {
    const rawData = {
        username: formData.get("username"),
        password: formData.get("password"),
        name: formData.get("name"),
        surname: formData.get("surname"),
        role: formData.get("role"),
        classLevel: formData.get("classLevel") || undefined,
        school: formData.get("school") || undefined,
        session: formData.get("session") || undefined,
        examCenter: formData.get("examCenter") || undefined,
        parentName: formData.get("parentName") || undefined,
        parentSurname: formData.get("parentSurname") || undefined,
        city: formData.get("city") || undefined,
        district: formData.get("district") || undefined,
        phone: formData.get("phone") || undefined,
        referenceSource: formData.get("referenceSource") || undefined,
        kvkkConsent: formData.get("kvkkConsent"),
    }

    const validatedFields = RegisterSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            message: validatedFields.error.issues[0].message,
            success: false
        }
    }

    const validatedData = validatedFields.data

    try {
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
                // New fields
                classLevel: validatedData.classLevel,
                school: validatedData.school,
                session: validatedData.session,
                examCenter: validatedData.examCenter,
                parentName: validatedData.parentName,
                parentSurname: validatedData.parentSurname,
                city: validatedData.city,
                district: validatedData.district,
                phone: validatedData.phone,
                referenceSource: validatedData.referenceSource,
                kvkkConsent: validatedData.kvkkConsent,
            }
        })

        return { message: "Kayıt başarılı! Giriş yapabilirsiniz.", success: true }
    } catch (e) {
        console.error(e)
        return { message: "Bir hata oluştu.", success: false }
    }
}
