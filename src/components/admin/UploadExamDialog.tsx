"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createExamWithAssignments, getAllStudents } from "@/app/actions/exam"
import { Upload, Loader2, Search, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

type Student = {
    id: string
    name: string
    surname: string
    username: string
}

type StudentResult = {
    studentId: string
    totalScore: number
    totalNet: number
}

export function UploadExamDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")

    // Form data
    const [examName, setExamName] = useState("")
    const [examDate, setExamDate] = useState("")
    const [examType, setExamType] = useState("TYT")
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [results, setResults] = useState<Map<string, StudentResult>>(new Map())

    useEffect(() => {
        if (open && currentStep === 2) {
            loadStudents()
        }
    }, [open, currentStep])

    const loadStudents = async () => {
        const result = await getAllStudents()
        if (result.success) {
            setStudents(result.students)
        }
    }

    const filteredStudents = students.filter(student => {
        const fullName = `${student.name} ${student.surname} ${student.username}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
    })

    const toggleStudent = (studentId: string) => {
        const newSelected = new Set(selectedStudents)
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId)
            // Remove result if student is deselected
            const newResults = new Map(results)
            newResults.delete(studentId)
            setResults(newResults)
        } else {
            newSelected.add(studentId)
            // Initialize result for new student
            const newResults = new Map(results)
            newResults.set(studentId, { studentId, totalScore: 0, totalNet: 0 })
            setResults(newResults)
        }
        setSelectedStudents(newSelected)
    }

    const toggleAll = () => {
        if (selectedStudents.size === filteredStudents.length) {
            setSelectedStudents(new Set())
            setResults(new Map())
        } else {
            const allIds = new Set(filteredStudents.map(s => s.id))
            setSelectedStudents(allIds)
            const newResults = new Map<string, StudentResult>()
            filteredStudents.forEach(s => {
                newResults.set(s.id, { studentId: s.id, totalScore: 0, totalNet: 0 })
            })
            setResults(newResults)
        }
    }

    const updateResult = (studentId: string, field: 'totalScore' | 'totalNet', value: string) => {
        const newResults = new Map(results)
        const current = newResults.get(studentId) || { studentId, totalScore: 0, totalNet: 0 }
        newResults.set(studentId, {
            ...current,
            [field]: parseFloat(value) || 0
        })
        setResults(newResults)
    }

    const handleNext = () => {
        if (currentStep === 1) {
            if (!examName || !examDate || !pdfFile) {
                toast.error("Lütfen tüm alanları doldurun ve PDF seçin.")
                return
            }
            const MAX_FILE_SIZE = 4.5 * 1024 * 1024
            if (pdfFile.size > MAX_FILE_SIZE) {
                toast.error(`PDF dosyası çok büyük (${(pdfFile.size / 1024 / 1024).toFixed(2)}MB). Vercel limiti 4.5MB'dır.`)
                return
            }
        }
        if (currentStep === 2 && selectedStudents.size === 0) {
            toast.error("Lütfen en az bir öğrenci seçin.")
            return
        }
        setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", examName)
            formData.append("date", examDate)
            formData.append("type", examType)
            if (pdfFile) {
                formData.append("pdfFile", pdfFile)
            }

            const resultsArray = Array.from(results.values())
            const result = await createExamWithAssignments(
                formData,
                Array.from(selectedStudents),
                resultsArray
            )

            if (result.success) {
                toast.success(result.message)
                resetForm()
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("İşlem sırasında bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setCurrentStep(1)
        setExamName("")
        setExamDate("")
        setExamType("TYT")
        setPdfFile(null)
        setSelectedStudents(new Set())
        setResults(new Map())
        setSearchQuery("")
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Sınav Yükle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Sınav Yükle - Adım {currentStep}/3</DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && "Sınav bilgilerini girin ve PDF dosyasını yükleyin."}
                        {currentStep === 2 && "Sınava katılacak öğrencileri seçin."}
                        {currentStep === 3 && "Her öğrenci için puan ve net değerlerini girin."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Step 1: Exam Info */}
                    {currentStep === 1 && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Sınav Adı</Label>
                                <Input
                                    id="name"
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Örn: TYT Deneme 1"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Tarih</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">Tür</Label>
                                <div className="col-span-3">
                                    <Select value={examType} onValueChange={setExamType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TYT">TYT</SelectItem>
                                            <SelectItem value="AYT">AYT</SelectItem>
                                            <SelectItem value="LGS">LGS</SelectItem>
                                            <SelectItem value="OTHER">Diğer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="pdfFile" className="text-right">PDF Dosyası</Label>
                                <div className="col-span-3">
                                    <Input
                                        id="pdfFile"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Student Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Öğrenci Seçimi ({selectedStudents.size} seçili)</Label>
                                <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
                                    {selectedStudents.size === filteredStudents.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                                </Button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Öğrenci ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            <div className="border rounded-md max-h-[300px] overflow-y-auto p-2">
                                {filteredStudents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Öğrenci bulunamadı
                                    </p>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <div key={student.id} className="flex items-center space-x-2 py-2 hover:bg-accent rounded px-2">
                                            <Checkbox
                                                id={student.id}
                                                checked={selectedStudents.has(student.id)}
                                                onCheckedChange={() => toggleStudent(student.id)}
                                            />
                                            <label
                                                htmlFor={student.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                            >
                                                {student.name} {student.surname} ({student.username})
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Result Entry */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <Label>Sonuç Girişi ({selectedStudents.size} öğrenci)</Label>
                            <div className="border rounded-md max-h-[400px] overflow-y-auto p-4 space-y-4">
                                {Array.from(selectedStudents).map(studentId => {
                                    const student = students.find(s => s.id === studentId)
                                    if (!student) return null
                                    const result = results.get(studentId)

                                    return (
                                        <div key={studentId} className="border-b pb-4 last:border-b-0">
                                            <p className="font-medium mb-2">
                                                {student.name} {student.surname}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`score-${studentId}`} className="text-sm">Toplam Puan</Label>
                                                    <Input
                                                        id={`score-${studentId}`}
                                                        type="number"
                                                        step="0.01"
                                                        value={result?.totalScore || 0}
                                                        onChange={(e) => updateResult(studentId, 'totalScore', e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`net-${studentId}`} className="text-sm">Toplam Net</Label>
                                                    <Input
                                                        id={`net-${studentId}`}
                                                        type="number"
                                                        step="0.01"
                                                        value={result?.totalNet || 0}
                                                        onChange={(e) => updateResult(studentId, 'totalNet', e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <div>
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Geri
                            </Button>
                        )}
                    </div>
                    <div>
                        {currentStep < 3 ? (
                            <Button type="button" onClick={handleNext}>
                                İleri
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleSubmit} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Kaydet
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
