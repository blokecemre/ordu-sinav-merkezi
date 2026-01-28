import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TeacherStudyPlanClient } from "@/components/teacher/TeacherStudyPlanClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function TeacherStudyPlanPage() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "TEACHER") {
        redirect("/")
    }

    const relations = await prisma.teacherStudent.findMany({
        where: { teacherId: session.user.id },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    username: true,
                }
            }
        },
        orderBy: { student: { name: "asc" } }
    })

    const students = relations.map(rel => rel.student)

    return (
        <TeacherStudyPlanClient students={students} />
    )
}
