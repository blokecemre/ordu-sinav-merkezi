import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function TeacherStudentsPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const assignments = await prisma.teacherStudent.findMany({
        where: { teacherId: session.user.id },
        include: { student: true },
        orderBy: { student: { name: "asc" } }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Öğrencilerim</h1>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>Kullanıcı Adı</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                    {assignment.student.name} {assignment.student.surname}
                                </TableCell>
                                <TableCell>{assignment.student.username}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/teacher/students/${assignment.studentId}`}>
                                        <Button variant="ghost" size="sm">
                                            Detaylar <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
