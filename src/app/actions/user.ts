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
        // Use transaction to delete related records first, ensuring deletion succeeds
        // regardless of database foreign key cascade configuration
        await prisma.$transaction(async (tx) => {
            // Delete related records where user is student
            await tx.result.deleteMany({ where: { studentId: userId } })
            await tx.analysis.deleteMany({ where: { studentId: userId } })
            await tx.examAssignment.deleteMany({ where: { studentId: userId } })

            // Delete related records where user is student OR teacher in assignments
            await tx.teacherStudent.deleteMany({
                where: {
                    OR: [
                        { studentId: userId },
                        { teacherId: userId }
                    ]
                }
            })

            // Finally delete the user
            await tx.user.delete({
                where: { id: userId },
            })
        })

        revalidatePath("/dashboard/admin/users")
        return { message: "Kullanıcı ve ilişkili tüm veriler silindi.", success: true }
    } catch (e) {
        console.error("Delete user error:", e)
        return { message: "Silme işlemi başarısız. Lütfen konsol loglarını kontrol edin.", success: false }
    }
}
