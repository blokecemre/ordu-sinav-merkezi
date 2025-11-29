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
import { Upload, Loader2, Search } from "lucide-react"
import { toast } from "sonner"

type Student = {
    id: string
    name: string
    surname: string
    username: string
}

export function UploadExamDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (open) {
            loadStudents()
        }
    }, [open])

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
        } else {
            newSelected.add(studentId)
        }
        setSelectedStudents(newSelected)
    }

    const toggleAll = () => {
        if (selectedStudents.size === filteredStudents.length) {
            setSelectedStudents(new Set())
        } else {
            setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const pdfFile = formData.get("pdfFile") as File

        if (!pdfFile || pdfFile.size === 0) {
            toast.error("Lütfen PDF dosyası seçin.")
            return
        }

        if (selectedStudents.size === 0) {
            toast.error("Lütfen en az bir öğrenci seçin.")
            return
        }

        // Vercel Serverless Function Payload Limit is 4.5MB
        const MAX_FILE_SIZE = 4.5 * 1024 * 1024

        if (pdfFile.size > MAX_FILE_SIZE) {
            toast.error(`PDF dosyası çok büyük (${(pdfFile.size / 1024 / 1024).toFixed(2)}MB). Vercel limiti 4.5MB'dır. Lütfen dosyanızı sıkıştırın.`)
            return
        }

        setLoading(true)

        try {
            const result = await createExamWithAssignments(formData, Array.from(selectedStudents))

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                setSelectedStudents(new Set())
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Sınav Yükle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Sınav Yükle</DialogTitle>
                    <DialogDescription>
                        Sınav bilgilerini girin, PDF dosyasını yükleyin ve öğrencileri seçin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Sınav Adı
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required placeholder="Örn: TYT Deneme 1" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Tarih
                        </Label>
                        <Input id="date" name="date" type="date" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Tür
                        </Label>
                        <div className="col-span-3">
                            <Select name="type" defaultValue="TYT" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tür seçin" />
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
                        <Label htmlFor="pdfFile" className="text-right">
                            PDF Dosyası
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="pdfFile"
                                name="pdfFile"
                                type="file"
                                accept=".pdf"
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label>Öğrenci Seçimi ({selectedStudents.size} seçili)</Label>
                            <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
                                {selectedStudents.size === filteredStudents.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                            </Button>
                        </div>

                        <div className="relative mb-2">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Öğrenci ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <div className="border rounded-md max-h-[200px] overflow-y-auto p-2">
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

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yükle ve Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
