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
import { createExamAndUploadResults } from "@/app/actions/exam"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import * as XLSX from "xlsx"
import { toast } from "sonner"

export function UploadExamDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const pdfFile = formData.get("pdfFile") as File

        if (!file && (!pdfFile || pdfFile.size === 0)) {
            toast.error("Lütfen en az bir dosya (Excel veya PDF) seçin.")
            return
        }

        // Vercel Serverless Function Payload Limit is 4.5MB
        const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB

        if (pdfFile && pdfFile.size > MAX_FILE_SIZE) {
            toast.error(`PDF dosyası çok büyük (${(pdfFile.size / 1024 / 1024).toFixed(2)}MB). Vercel limiti 4.5MB'dır. Lütfen dosyanızı sıkıştırın.`);
            return;
        }

        setLoading(true)

        try {
            let resultsData: any[] = []

            if (file) {
                // Parse Excel file
                const data = await file.arrayBuffer()
                const workbook = XLSX.read(data)
                const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(worksheet)

                // Transform data to expected format
                // Expected Excel columns: username, score, net, ...details
                resultsData = jsonData.map((row: any) => ({
                    username: row.username?.toString(),
                    totalScore: Number(row.score || 0),
                    totalNet: Number(row.net || 0),
                    details: row // Store all row data as details for now
                })).filter(r => r.username) // Filter out empty rows
            }

            const result = await createExamAndUploadResults(formData, resultsData)

            if (result.success) {
                if (result.notFoundUsernames && result.notFoundUsernames.length > 0) {
                    toast.warning(result.message, { duration: 10000 })
                } else {
                    toast.success(result.message)
                }
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Dosya işlenirken bir hata oluştu.")
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Sınav ve Sonuç Yükle</DialogTitle>
                    <DialogDescription>
                        Sınav bilgilerini girin ve sonuç Excel dosyasını yükleyin.
                        <br />
                        <span className="text-xs text-muted-foreground">
                            Excel formatı: username, score, net sütunlarını içermelidir.
                        </span>
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
                            Sonuç Dosyası (PDF)
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="pdfFile"
                                name="pdfFile"
                                type="file"
                                accept=".pdf"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Excel Dosyası
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="file"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                            />
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
