"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Save, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { getStudyPlan, updateStudyPlan } from "@/app/actions/study-plan"
import { getUsers } from "@/app/actions/user"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { CURRICULUM } from "@/lib/constants/curriculum"

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

const SUBJECTS = Object.keys(CURRICULUM)

type Lesson = {
    id: string // Temporary ID for UI
    subject: string
    duration: number
    outcome?: string
}

type WeeklyPlan = {
    [key: string]: Lesson[]
}

export default function AdminStudyPlanPage() {
    const [plan, setPlan] = useState<WeeklyPlan>({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [students, setStudents] = useState<any[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState<string>("")
    const [openCombobox, setOpenCombobox] = useState(false)

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        if (selectedStudentId) {
            loadPlan(selectedStudentId)
        } else {
            setPlan({})
        }
    }, [selectedStudentId])

    const fetchStudents = async () => {
        const result = await getUsers("STUDENT")
        if (result.success) {
            setStudents(result.data || [])
        }
    }

    const loadPlan = async (studentId: string) => {
        setLoading(true)
        const result = await getStudyPlan(studentId)
        if (result.success && result.data) {
            const newPlan: WeeklyPlan = {}
            DAYS.forEach(day => newPlan[day] = [])

            result.data.forEach((item: any) => {
                if (!newPlan[item.day]) newPlan[item.day] = []
                newPlan[item.day].push({
                    id: Math.random().toString(36).substr(2, 9),
                    subject: item.subject,
                    duration: item.duration,
                    outcome: item.outcome || undefined
                })
            })
            setPlan(newPlan)
        }
        setLoading(false)
    }

    const addLesson = (day: string) => {
        if ((plan[day]?.length || 0) >= 5) {
            toast.error("Bir güne en fazla 5 ders ekleyebilirsiniz.")
            return
        }

        setPlan(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), { id: Math.random().toString(), subject: SUBJECTS[0], duration: 40 }]
        }))
    }

    const removeLesson = (day: string, lessonId: string) => {
        setPlan(prev => ({
            ...prev,
            [day]: prev[day].filter(l => l.id !== lessonId)
        }))
    }

    const updateLesson = (day: string, lessonId: string, field: keyof Lesson, value: any) => {
        setPlan(prev => ({
            ...prev,
            [day]: prev[day].map(l => l.id === lessonId ? { ...l, [field]: value } : l)
        }))
    }

    const handleSave = async () => {
        if (!selectedStudentId) {
            toast.error("Lütfen bir öğrenci seçin")
            return
        }

        setSaving(true)
        const itemsToSave: any[] = []

        DAYS.forEach(day => {
            if (plan[day]) {
                plan[day].forEach((lesson, index) => {
                    itemsToSave.push({
                        day,
                        subject: lesson.subject,
                        duration: Number(lesson.duration),
                        order: index,
                        outcome: lesson.outcome
                    })
                })
            }
        })

        const result = await updateStudyPlan(selectedStudentId, itemsToSave)
        if (result.success) {
            toast.success("Çalışma planı kaydedildi")
        } else {
            toast.error("Kaydetme başarısız")
        }
        setSaving(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Ders Çalışma Programı</h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCombobox}
                                className="w-[250px] justify-between"
                            >
                                {selectedStudentId
                                    ? students.find((student) => student.id === selectedStudentId)?.name + " " + students.find((student) => student.id === selectedStudentId)?.surname
                                    : "Öğrenci Seç..."}
                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                            <Command>
                                <CommandInput placeholder="Öğrenci ara..." />
                                <CommandList>
                                    <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                                    <CommandGroup>
                                        {students.map((student) => (
                                            <CommandItem
                                                key={student.id}
                                                value={student.name + " " + student.surname}
                                                onSelect={() => {
                                                    setSelectedStudentId(student.id)
                                                    setOpenCombobox(false)
                                                }}
                                            >
                                                {student.name} {student.surname}
                                                <span className="ml-2 text-xs text-muted-foreground">({student.username})</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleSave} disabled={saving || !selectedStudentId}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Kaydet
                    </Button>
                </div>
            </div>

            {!selectedStudentId ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed rounded-lg text-muted-foreground">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Lütfen işlem yapmak için bir öğrenci seçin</p>
                </div>
            ) : loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {DAYS.map(day => (
                        <Card key={day} className="flex flex-col h-full">
                            <CardHeader className="pb-3 bg-gray-50 rounded-t-lg border-b">
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    {day}
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {(plan[day]?.length || 0)}/5 Ders
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 space-y-4">
                                {plan[day]?.map((lesson, index) => (
                                    <div key={lesson.id} className="bg-white p-3 rounded-lg border shadow-sm space-y-3 relative group">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeLesson(day, lesson.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>

                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Ders</Label>
                                            <Select
                                                value={lesson.subject}
                                                onValueChange={(val) => {
                                                    updateLesson(day, lesson.id, 'subject', val)
                                                    updateLesson(day, lesson.id, 'outcome', undefined) // Reset outcome when subject changes
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SUBJECTS.map(sub => (
                                                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {CURRICULUM[lesson.subject] && (
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Kazanım</Label>
                                                <Select
                                                    value={lesson.outcome || ""}
                                                    onValueChange={(val) => updateLesson(day, lesson.id, 'outcome', val)}
                                                >
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="Kazanım seçiniz" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[300px]">
                                                        {Object.entries(CURRICULUM[lesson.subject]).map(([unit, outcomes]) => (
                                                            <div key={unit}>
                                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-gray-50 sticky top-0">
                                                                    {unit}
                                                                </div>
                                                                {outcomes.map((outcome) => (
                                                                    <SelectItem
                                                                        key={outcome}
                                                                        value={outcome}
                                                                        className="text-xs pl-4"
                                                                    >
                                                                        {outcome.length > 50 ? outcome.substring(0, 50) + "..." : outcome}
                                                                    </SelectItem>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Süre (dk)</Label>
                                            <Input
                                                type="number"
                                                value={lesson.duration}
                                                onChange={(e) => updateLesson(day, lesson.id, 'duration', parseInt(e.target.value) || 0)}
                                                className="h-8"
                                                min={1}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {(plan[day]?.length || 0) < 5 && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary"
                                        onClick={() => addLesson(day)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ders Ekle
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
