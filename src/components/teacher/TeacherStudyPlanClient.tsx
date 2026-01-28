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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { CURRICULUM_BY_GRADE, SUBJECTS, GRADES } from "@/lib/constants/curriculum-index"
import { Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { parseStudyPlanMarkdown } from "@/lib/utils/study-plan-parser"
import { Upload } from "lucide-react"

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

type Lesson = {
    id: string // Temporary ID for UI
    subject: string
    classLevel: string
    duration: number
    outcomes?: string[]
}

type WeeklyPlan = {
    [key: string]: Lesson[]
}

interface TeacherStudyPlanClientProps {
    students: {
        id: string
        name: string
        surname: string
        username: string
    }[]
}

export function TeacherStudyPlanClient({ students }: TeacherStudyPlanClientProps) {
    const [plan, setPlan] = useState<WeeklyPlan>({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState<string>("")
    const [openCombobox, setOpenCombobox] = useState(false)

    useEffect(() => {
        if (selectedStudentId) {
            loadPlan(selectedStudentId)
        } else {
            setPlan({})
        }
    }, [selectedStudentId])

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
                    classLevel: item.classLevel || "8",
                    duration: item.duration,
                    outcomes: item.outcomes || []
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
            [day]: [...(prev[day] || []), { id: Math.random().toString(), subject: SUBJECTS[0], classLevel: "8", duration: 40, outcomes: [] }]
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

    const toggleOutcome = (day: string, lessonId: string, outcome: string) => {
        setPlan(prev => {
            const dayLessons = prev[day] || []
            const lessonIndex = dayLessons.findIndex(l => l.id === lessonId)
            if (lessonIndex === -1) return prev

            const lesson = dayLessons[lessonIndex]
            const currentOutcomes = lesson.outcomes || []
            const newOutcomes = currentOutcomes.includes(outcome)
                ? currentOutcomes.filter(o => o !== outcome)
                : [...currentOutcomes, outcome]

            const newLessons = [...dayLessons]
            newLessons[lessonIndex] = { ...lesson, outcomes: newOutcomes }

            return {
                ...prev,
                [day]: newLessons
            }
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("[StudyPlan] handleFileUpload called")
        const file = e.target.files?.[0]
        if (!file) {
            console.log("[StudyPlan] No file selected")
            return
        }

        console.log("[StudyPlan] File selected:", file.name, file.type)

        if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
            toast.error("Lütfen .md veya .txt uzantılı bir dosya yükleyin.")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result as string
            console.log("[StudyPlan] File content length:", content?.length)
            console.log("[StudyPlan] File content preview:", content?.substring(0, 200))

            if (content) {
                try {
                    const parsedPlan = parseStudyPlanMarkdown(content)
                    console.log("[StudyPlan] Parsed plan:", JSON.stringify(parsedPlan, null, 2))

                    // Count total lessons
                    let totalLessons = 0
                    Object.values(parsedPlan).forEach(lessons => {
                        totalLessons += lessons.length
                    })
                    console.log("[StudyPlan] Total parsed lessons:", totalLessons)

                    const newPlan: WeeklyPlan = {}

                    Object.entries(parsedPlan).forEach(([day, lessons]) => {
                        newPlan[day] = lessons.map(l => ({
                            id: Math.random().toString(36).substr(2, 9),
                            subject: l.subject,
                            classLevel: l.classLevel,
                            duration: l.duration,
                            outcomes: l.outcomes
                        }))
                    })

                    console.log("[StudyPlan] Setting plan state with", Object.keys(newPlan).length, "days")
                    setPlan(newPlan)
                    toast.success(`Çalışma planı yüklendi: ${totalLessons} ders bulundu.`)
                } catch (error) {
                    console.error("[StudyPlan] Parse error:", error)
                    toast.error("Dosya okunurken bir hata oluştu.")
                }
            }
        }
        reader.onerror = (error) => {
            console.error("[StudyPlan] FileReader error:", error)
            toast.error("Dosya okunamadı.")
        }
        reader.readAsText(file)
        // Reset input value to allow uploading the same file again if needed
        e.target.value = ''
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
                        outcomes: lesson.outcomes
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
                <h1 className="text-3xl font-bold">Öğrenci Ders Çalışma Programı</h1>

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

                    <div className="flex gap-2">
                        <label htmlFor="plan-upload">
                            <Button variant="outline" className="cursor-pointer" asChild>
                                <span>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Plan Yükle
                                </span>
                            </Button>
                        </label>
                        <Input
                            id="plan-upload"
                            type="file"
                            accept=".md,.txt"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <Button onClick={handleSave} disabled={saving || !selectedStudentId}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Kaydet
                        </Button>
                    </div>
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
                                                    updateLesson(day, lesson.id, 'outcomes', []) // Reset outcomes when subject changes
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

                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Sınıf</Label>
                                            <Select
                                                value={lesson.classLevel}
                                                onValueChange={(val) => {
                                                    updateLesson(day, lesson.id, 'classLevel', val)
                                                    updateLesson(day, lesson.id, 'outcomes', []) // Reset outcomes when class changes
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GRADES.map(grade => (
                                                        <SelectItem key={grade} value={grade}>{grade}. Sınıf</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {CURRICULUM_BY_GRADE[lesson.classLevel]?.[lesson.subject] && (
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Kazanımlar</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full justify-between h-auto min-h-[2rem] py-1 px-3 text-xs"
                                                        >
                                                            {lesson.outcomes && lesson.outcomes.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {lesson.outcomes.length} kazanım seçildi
                                                                </div>
                                                            ) : (
                                                                "Kazanım seçiniz"
                                                            )}
                                                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0" align="start">
                                                        <Command>
                                                            <CommandInput placeholder="Kazanım ara..." />
                                                            <CommandList>
                                                                <CommandEmpty>Kazanım bulunamadı.</CommandEmpty>
                                                                {Object.entries(CURRICULUM_BY_GRADE[lesson.classLevel]?.[lesson.subject] || {}).map(([unit, outcomes]) => (
                                                                    <CommandGroup key={unit} heading={unit}>
                                                                        {(outcomes as string[]).map((outcome: string) => (
                                                                            <CommandItem
                                                                                key={outcome}
                                                                                value={outcome}
                                                                                onSelect={() => toggleOutcome(day, lesson.id, outcome)}
                                                                            >
                                                                                <div className={cn(
                                                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                                    lesson.outcomes?.includes(outcome)
                                                                                        ? "bg-primary text-primary-foreground"
                                                                                        : "opacity-50 [&_svg]:invisible"
                                                                                )}>
                                                                                    <Check className={cn("h-4 w-4")} />
                                                                                </div>
                                                                                <span className="text-xs">{outcome}</span>
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                ))}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                {lesson.outcomes && lesson.outcomes.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {lesson.outcomes.map((outcome, i) => (
                                                            <Badge key={i} variant="secondary" className="text-[10px] font-normal px-1 py-0 h-auto whitespace-normal text-left">
                                                                {outcome.length > 30 ? outcome.substring(0, 30) + "..." : outcome}
                                                                <button
                                                                    className="ml-1 hover:text-red-500"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleOutcome(day, lesson.id, outcome)
                                                                    }}
                                                                >
                                                                    ×
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
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
