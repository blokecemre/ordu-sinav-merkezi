export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { AssignmentForm } from "@/components/admin/AssignmentForm"

export default async function AssignmentsPage() {
    const teachers = await prisma.user.findMany({
        where: { role: "TEACHER" },
        orderBy: { name: "asc" }
    })

    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { name: "asc" }
    })

    // We need to fetch existing assignments to show initial state.
    // Since this is a server component, we can pass all data to the client form.
    const assignments = await prisma.teacherStudent.findMany()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Öğretmen - Öğrenci Atama</h1>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <AssignmentForm
                    teachers={teachers}
                    students={students}
                    initialAssignments={assignments}
                />
            </div>
        </div>
    )
}
