"use client"

import { useState } from "react"
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
import { createAnalysis } from "@/app/actions/analysis"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadAnalysisDialogProps {
    students: { id: string; name: string; surname: string; username: string }[]
}

export function UploadAnalysisDialog({ students }: UploadAnalysisDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            const result = await createAnalysis(formData)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Yeni Analiz Yükle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Öğrenci Analizi Yükle</DialogTitle>
                    <DialogDescription>
                        Öğrenci seçin ve Markdown (.md) formatında analiz dosyasını yükleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="studentId" className="text-right">
                            Öğrenci
                        </Label>
                        <div className="col-span-3">
                            <Select name="studentId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Öğrenci seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name} {student.surname} ({student.username})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Başlık
                        </Label>
                        <Input id="title" name="title" className="col-span-3" required placeholder="Örn: Kasım Ayı Değerlendirmesi" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Dosya (.md)
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept=".md"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yükle
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
