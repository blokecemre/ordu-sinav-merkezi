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
import { ArrowRight, Search, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default async function TeacherStudentsPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const assignments = await prisma.teacherStudent.findMany({
        where: { teacherId: session.user.id },
        include: { student: true },
        orderBy: { student: { name: "asc" } }
    })

    return (
        <div className="space-y-8 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Öğrencilerim</h2>
                    <p className="text-muted-foreground mt-1">Toplam {assignments.length} öğrenci</p>
                </div>

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Öğrenci ara..."
                        className="pl-10 w-64 bg-card border-border focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            {/* Students Table */}
            <Card className="border-border shadow-sm bg-card overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/60 border-b border-border">
                                <TableHead className="text-muted-foreground font-semibold py-4 pl-6">Ad Soyad</TableHead>
                                <TableHead className="text-muted-foreground font-semibold py-4">Kullanıcı Adı</TableHead>
                                <TableHead className="text-muted-foreground font-semibold py-4 text-right pr-6">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((assignment, index) => (
                                <TableRow
                                    key={assignment.id}
                                    className="hover:bg-muted/30 transition-colors duration-200 border-b border-border last:border-0"
                                >
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                                                style={{
                                                    background: `linear-gradient(135deg, ${['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][index % 5]
                                                        }, ${['#2563EB', '#059669', '#7C3AED', '#D97706', '#DC2626'][index % 5]
                                                        })`
                                                }}
                                            >
                                                {assignment.student.name.charAt(0)}{assignment.student.surname.charAt(0)}
                                            </div>
                                            <span className="font-medium text-foreground">
                                                {assignment.student.name} {assignment.student.surname}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className="text-muted-foreground">@{assignment.student.username}</span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <Link href={`/dashboard/teacher/students/${assignment.studentId}`}>
                                            <Button variant="ghost" className="inline-flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors duration-200 font-medium text-sm group">
                                                Detaylar
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {assignments.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Henüz öğrenci bulunmuyor</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
