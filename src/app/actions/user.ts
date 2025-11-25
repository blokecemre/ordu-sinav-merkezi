"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const UserSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    surname: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
})

export async function createUser(prevState: any, formData: FormData) {
    try {
        const rawData = {
            username: formData.get("username"),
            password: formData.get("password"),
            name: formData.get("name"),
            surname: formData.get("surname"),
            role: formData.get("role"),
        }

        const validatedData = UserSchema.parse(rawData)
        const hashedPassword = await hash(validatedData.password, 10)

        await prisma.user.create({
            data: {
                ...validatedData,
                password: hashedPassword,
            },
        })

        revalidatePath("/dashboard/admin/users")
        return { message: "Kullanıcı başarıyla oluşturuldu.", success: true }
    } catch (e) {
        if (e instanceof z.ZodError) {
            return { message: (e as any).errors[0].message, success: false }
        }
        if ((e as any).code === 'P2002') {
            return { message: "Bu kullanıcı adı zaten kullanılıyor.", success: false }
        }
        return { message: "Bir hata oluştu.", success: false }
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        })
        revalidatePath("/dashboard/admin/users")
        return { message: "Kullanıcı silindi.", success: true }
    } catch (e) {
        return { message: "Silme işlemi başarısız.", success: false }
    }
}
