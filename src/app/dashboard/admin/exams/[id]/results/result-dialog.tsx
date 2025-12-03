"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateStudentResult } from "@/app/actions/exam"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Upload } from "lucide-react"

export function ResultDialog({ examId, student, result }: { examId: string, student: any, result: any }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        try {
            const res = await updateStudentResult(examId, student.id, formData)
            if (res.success) {
                toast.success(res.message)
                setOpen(false)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sonuç Düzenle: {student.name} {student.surname}</DialogTitle>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalScore">Toplam Puan</Label>
                            <Input
                                id="totalScore"
                                name="totalScore"
                                type="number"
                                step="0.01"
                                defaultValue={result?.totalScore}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalNet">Toplam Net</Label>
                            <Input
                                id="totalNet"
                                name="totalNet"
                                type="number"
                                step="0.01"
                                defaultValue={result?.totalNet}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pdfFile">Sonuç PDF'i</Label>
                        <Input
                            id="pdfFile"
                            name="pdfFile"
                            type="file"
                            accept=".pdf"
                        />
                        {result?.resultPdfName && (
                            <p className="text-xs text-muted-foreground">
                                Mevcut dosya: {result.resultPdfName}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
