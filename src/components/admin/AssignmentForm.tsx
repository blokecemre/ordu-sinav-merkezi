"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { assignStudents } from "@/app/actions/assignment"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type User = {
    id: string
    name: string
    surname: string
    username: string
}

type Assignment = {
    teacherId: string
    studentId: string
}

interface AssignmentFormProps {
    teachers: User[]
    students: User[]
    initialAssignments: Assignment[]
}

export function AssignmentForm({ teachers, students, initialAssignments }: AssignmentFormProps) {
    const [selectedTeacher, setSelectedTeacher] = useState<string>("")
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // Update selected students when teacher changes
    useEffect(() => {
        if (selectedTeacher) {
            const teacherAssignments = initialAssignments
                .filter(a => a.teacherId === selectedTeacher)
                .map(a => a.studentId)
            setSelectedStudents(teacherAssignments)
        } else {
            setSelectedStudents([])
        }
    }, [selectedTeacher, initialAssignments])

    const handleStudentToggle = (studentId: string) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const handleSave = async () => {
        if (!selectedTeacher) return

        setLoading(true)
        try {
            const result = await assignStudents(selectedTeacher, selectedStudents)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="max-w-md space-y-2">
                <Label>Öğretmen Seçin</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                        <SelectValue placeholder="Öğretmen seçiniz..." />
                    </SelectTrigger>
                    <SelectContent>
                        {teachers.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name} {teacher.surname} ({teacher.username})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedTeacher && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Öğrenciler</Label>
                        <span className="text-sm text-muted-foreground">
                            {selectedStudents.length} öğrenci seçildi
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-md max-h-[400px] overflow-y-auto">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                <Checkbox
                                    id={student.id}
                                    checked={selectedStudents.includes(student.id)}
                                    onCheckedChange={() => handleStudentToggle(student.id)}
                                />
                                <label
                                    htmlFor={student.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                                >
                                    {student.name} {student.surname}
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        {student.username}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
