"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { logActivity } from "@/app/actions/performance"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts"

interface Props {
    subjects: { id: string, name: string }[]
    dailyStats: any[]
    subjectStats: any[]
    successTrend: any[]
    studentId: string
    readOnly?: boolean
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c']

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg z-50">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                        <span className="text-slate-600">{entry.name}:</span>
                        <span className="font-bold">{entry.value}</span>
                    </div>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2 text-xs text-slate-500 font-medium">
                    Toplam: {payload.reduce((acc: number, curr: any) => acc + curr.value, 0)} Soru
                </div>
            </div>
        )
    }
    return null
}

export function PerformanceClientPage({ subjects, dailyStats, subjectStats, successTrend, studentId, readOnly = false }: Props) {
    const [loading, setLoading] = useState(false)
    const [subjectId, setSubjectId] = useState("")
    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [readingPage, setReadingPage] = useState(0)

    const handleSubmit = async () => {
        if (!subjectId && readingPage === 0) {
            toast.error("Lütfen ders seçiniz veya okuma bilgisi giriniz.")
            return
        }

        setLoading(true)
        const result = await logActivity({
            studentId,
            subjectId: subjectId || subjects[0]?.id, // Default to first if reading only
            correctCount,
            wrongCount,
            readingPage
        })
        setLoading(false)

        if (result.success) {
            toast.success("Kayıt başarılı!")
            // Reset form
            setCorrectCount(0)
            setWrongCount(0)
            setReadingPage(0)
            setSubjectId("")
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-12">
            {/* Left Column: Input Form (4 cols) - Hide if readOnly */}
            {!readOnly && (
                <div className="md:col-span-4 space-y-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-md">
                        <CardHeader>
                            <CardTitle>Hızlı Veri Girişi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Ders</Label>
                                <Select value={subjectId} onValueChange={setSubjectId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ders Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Label className="text-green-600 font-semibold">Doğru</Label>
                                        <span className="text-sm font-bold text-green-600">{correctCount}</span>
                                    </div>
                                    <Slider
                                        value={[correctCount]}
                                        onValueChange={(val) => setCorrectCount(val[0])}
                                        max={100}
                                        step={1}
                                        className="bg-green-100 rounded-full"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Label className="text-red-600 font-semibold">Yanlış</Label>
                                        <span className="text-sm font-bold text-red-600">{wrongCount}</span>
                                    </div>
                                    <Slider
                                        value={[wrongCount]}
                                        onValueChange={(val) => setWrongCount(val[0])}
                                        max={50}
                                        step={1}
                                        className="bg-red-100 rounded-full"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Label className="text-blue-600 font-semibold">Kitap Okuma (Sayfa)</Label>
                                        <span className="text-sm font-bold text-blue-600">{readingPage}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => setReadingPage(Math.max(0, readingPage - 5))}>-</Button>
                                        <Input
                                            type="number"
                                            value={readingPage}
                                            onChange={(e) => setReadingPage(parseInt(e.target.value) || 0)}
                                            className="text-center font-bold"
                                        />
                                        <Button variant="outline" size="icon" onClick={() => setReadingPage(readingPage + 5)}>+</Button>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Kaydet
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Subject Performance Stacked Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Ders Bazlı Performans (Son 30 Gün)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectStats} layout="vertical" margin={{ left: 20, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="correct" name="Doğru" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]}>
                                        {/* Try to show total count on the right? Difficult in stacked. 
                                         Let's just rely on tooltips for exact numbers to keep it clean, 
                                         but format the axis to show range? 
                                         User said "soru sayısı gözükmüyor". 
                                         Let's add a label to the end of the bar?
                                     */}
                                    </Bar>
                                    <Bar dataKey="wrong" name="Yanlış" stackId="a" fill="#dc2626" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Right Column: Charts */}
            <div className={`${readOnly ? "md:col-span-12" : "md:col-span-8"} space-y-6`}>
                {/* Daily Correct/Wrong Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Son 7 Günlük Performans</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="correct" name="Doğru" stackId="a" fill="#16a34a" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="wrong" name="Yanlış" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Success Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Başarı Yüzdesi Trendi</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={successTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="percentage" name="Başarı %" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
