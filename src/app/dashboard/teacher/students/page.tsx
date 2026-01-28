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
import { ArrowRight, Search, Users, Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default async function TeacherStudentsPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const assignments = await prisma.teacherStudent.findMany({
        where: { teacherId: session.user.id },
        include: { student: true },
        orderBy: { student: { name: "asc" } }
    })

    // Group students by Grade (Sınıf Seviyesi)
    const studentsByGrade: Record<string, typeof assignments> = {}

    assignments.forEach(assignment => {
        let groupName = "Sınıfı Yok"
        const student = assignment.student

        if (student.classLevel) {
            // Extract the number from classLevel (e.g. "8-A" -> "8")
            const gradeMatch = student.classLevel.match(/\d+/)
            if (gradeMatch) {
                groupName = `${gradeMatch[0]}. Sınıf`
            } else if (student.classLevel.toLowerCase().includes("mezun")) {
                groupName = "Mezun"
            } else {
                groupName = student.classLevel
            }
        }

        if (!studentsByGrade[groupName]) {
            studentsByGrade[groupName] = []
        }
        studentsByGrade[groupName].push(assignment)
    })

    // Sort class names (5. Sınıf < 6. Sınıf < ... < Diğer)
    const sortedGrades = Object.keys(studentsByGrade).sort((a, b) => {
        const getVal = (s: string) => {
            if (s.includes("Sınıfı Yok")) return 999
            if (s.includes("Mezun")) return 998
            const match = s.match(/\d+/)
            return match ? parseInt(match[0]) : 997
        }
        return getVal(a) - getVal(b)
    })


    return (
        <div className="space-y-8 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Öğrencilerim</h2>
                    <p className="text-muted-foreground mt-1">Toplam {assignments.length} öğrenci</p>
                </div>

                {/* Search - Visual only for now as filtering is complex with accordion on the client side without state */}
                <div className="relative hidden md:block opacity-50 cursor-not-allowed" title="Arama devre dışı">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        disabled
                        placeholder="Öğrenci ara..."
                        className="pl-10 w-64 bg-card border-border focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            {/* Students List */}
            {assignments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Henüz öğrenci bulunmuyor</p>
                </div>
            ) : (
                <div className="bg-transparent">
                    <Accordion type="multiple" defaultValue={sortedGrades} className="w-full space-y-4">
                        {sortedGrades.map((grade) => {
                            const classAssignments = studentsByGrade[grade]
                            return (
                                <AccordionItem key={grade} value={grade} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                <Folder className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-lg text-foreground">{grade}</span>
                                            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                {classAssignments.length} Öğrenci
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="border-t border-border">
                                        <Table>
                                            <TableHeader className="bg-muted/30">
                                                <TableRow className="border-none">
                                                    <TableHead className="pl-6 font-semibold text-muted-foreground">Ad Soyad</TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground">Sınıf / Okul</TableHead>
                                                    <TableHead className="text-right pr-6 font-semibold text-muted-foreground">İşlemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {classAssignments.map((assignment, index) => (
                                                    <TableRow
                                                        key={assignment.id}
                                                        className="hover:bg-muted/30 transition-colors duration-200 border-b border-border last:border-0"
                                                    >
                                                        <TableCell className="py-4 pl-6">
                                                            <Link href={`/dashboard/teacher/students/${assignment.studentId}`} className="block group">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-transform group-hover:scale-105"
                                                                        style={{
                                                                            background: `linear-gradient(135deg, ${['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][index % 5]
                                                                                }, ${['#2563EB', '#059669', '#7C3AED', '#D97706', '#DC2626'][index % 5]
                                                                                })`
                                                                        }}
                                                                    >
                                                                        {assignment.student.name.charAt(0)}{assignment.student.surname.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {assignment.student.name} {assignment.student.surname}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">@{assignment.student.username}</div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-foreground">{assignment.student.classLevel || '-'}</span>
                                                                <span className="text-xs text-muted-foreground">{assignment.student.school || '-'}</span>
                                                            </div>
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
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>
            )}
        </div>
    )
}
