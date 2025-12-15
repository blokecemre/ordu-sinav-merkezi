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
import { Upload, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface UploadAnalysisDialogProps {
    students: { id: string; name: string; surname: string; username: string }[]
}

export function UploadAnalysisDialog({ students }: UploadAnalysisDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [analysisType, setAnalysisType] = useState("GENEL_DENEME")
    const [openCombobox, setOpenCombobox] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState("")

    // Reset state when dialog opens/closes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setSelectedStudentId("")
            setAnalysisType("GENEL_DENEME")
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        formData.set("analysisType", analysisType)

        try {
            const result = await createAnalysis(formData)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                setSelectedStudentId("")
                setAnalysisType("GENEL_DENEME")
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Yeni Analiz Yükle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Öğrenci Analizi Yükle</DialogTitle>
                    <DialogDescription>
                        Öğrenci seçin, analiz türünü belirleyin ve Markdown (.md) formatında dosyayı yükleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="studentId" className="text-right">
                            Öğrenci
                        </Label>
                        <div className="col-span-3">
                            <input type="hidden" name="studentId" value={selectedStudentId} />
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full justify-between"
                                    >
                                        {selectedStudentId
                                            ? (() => {
                                                const s = students.find((student) => student.id === selectedStudentId)
                                                return s ? `${s.name} ${s.surname} (${s.username})` : "Öğrenci seçin"
                                            })()
                                            : "Öğrenci seçin"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Öğrenci ara..." />
                                        <CommandList>
                                            <CommandEmpty>Öğrenci bulunamadı.</CommandEmpty>
                                            <CommandGroup>
                                                {students.map((student) => (
                                                    <CommandItem
                                                        key={student.id}
                                                        value={student.name + " " + student.surname + " " + student.username}
                                                        onSelect={() => {
                                                            setSelectedStudentId(student.id)
                                                            setOpenCombobox(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedStudentId === student.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {student.name} {student.surname} ({student.username})
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="analysisType" className="text-right">
                            Analiz Türü
                        </Label>
                        <div className="col-span-3">
                            <Select value={analysisType} onValueChange={setAnalysisType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Analiz türü seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GENEL_DENEME">Genel Deneme Analizi</SelectItem>
                                    <SelectItem value="YANLIS_SORU">Yanlış Soru Analizi</SelectItem>
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
