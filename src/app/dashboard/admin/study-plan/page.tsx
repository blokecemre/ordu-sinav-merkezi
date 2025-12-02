"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getStudyPlan, updateStudyPlan } from "@/app/actions/study-plan"

const DAYS = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
]

const SUBJECTS = [
    "Matematik",
    "Türkçe",
    "Fen Bilimleri",
    "İngilizce",
    "Sosyal Bilgiler",
    "Din Kültürü ve Ahlak Bilgisi"
]

type Lesson = {
    id: string // Temporary ID for UI
    subject: string
    duration: number
}

type WeeklyPlan = {
    [key: string]: Lesson[]
}

export default function AdminStudyPlanPage() {
    const [plan, setPlan] = useState<WeeklyPlan>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadPlan()
    }, [])

    const loadPlan = async () => {
        setLoading(true)
        const result = await getStudyPlan()
        if (result.success && result.data) {
            const newPlan: WeeklyPlan = {}
            DAYS.forEach(day => newPlan[day] = [])

            result.data.forEach((item: any) => {
                if (!newPlan[item.day]) newPlan[item.day] = []
                newPlan[item.day].push({
                    id: Math.random().toString(36).substr(2, 9),
                    subject: item.subject,
                    duration: item.duration
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
        setSaving(true)
        const itemsToSave: any[] = []

        DAYS.forEach(day => {
            if (plan[day]) {
                plan[day].forEach((lesson, index) => {
                    itemsToSave.push({
                        day,
                        subject: lesson.subject,
                        duration: Number(lesson.duration),
                        order: index
                    })
                })
            }
        })

        const result = await updateStudyPlan(itemsToSave)
        if (result.success) {
            toast.success("Çalışma planı kaydedildi")
        } else {
            toast.error("Kaydetme başarısız")
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Ders Çalışma Programı</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kaydet
                </Button>
            </div>

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
                                            onValueChange={(val) => updateLesson(day, lesson.id, 'subject', val)}
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
        </div>
    )
}
