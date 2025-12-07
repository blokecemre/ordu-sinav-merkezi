"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Camera, Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Mistake {
    id: string
    imageData: string
    description: string | null
    lesson: string
    adminNote: string | null
    createdAt: string
}

const LESSONS = [
    "Matematik",
    "Fen Bilimleri",
    "Türkçe",
    "Din Kültürü ve Ahlak Bilgisi",
    "Sosyal Bilgiler",
    "İngilizce"
]

export default function MistakeNotebookPage() {
    const [mistakes, setMistakes] = useState<Mistake[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [description, setDescription] = useState("")
    const [lesson, setLesson] = useState(LESSONS[0])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchMistakes()
    }, [])

    const fetchMistakes = async () => {
        try {
            const res = await fetch("/api/mistakes")
            if (res.ok) {
                const data = await res.json()
                setMistakes(data)
            }
        } catch (error) {
            console.error("Failed to fetch mistakes", error)
            toast.error("Hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("description", description)
        formData.append("lesson", lesson)

        try {
            const res = await fetch("/api/mistakes", {
                method: "POST",
                body: formData
            })

            if (res.ok) {
                toast.success("Görsel yüklendi")
                setIsOpen(false)
                setSelectedFile(null)
                setPreviewUrl(null)
                setDescription("")
                setLesson(LESSONS[0])
                fetchMistakes()
            } else {
                const msg = await res.text()
                toast.error(msg || "Yükleme başarısız")
            }
        } catch (error) {
            console.error("Upload error", error)
            toast.error("Yükleme sırasında hata oluştu")
        } finally {
            setIsUploading(false)
        }
    }

    // Group mistakes by lesson
    const groupedMistakes = mistakes.reduce((acc, mistake) => {
        const lesson = mistake.lesson || "Genel"
        if (!acc[lesson]) {
            acc[lesson] = []
        }
        acc[lesson].push(mistake)
        return acc
    }, {} as Record<string, Mistake[]>)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Yanlış Soru Defteri</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Camera className="mr-2 h-4 w-4" />
                            Soru Yükle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Yanlış Soru Yükle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Görsel</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Dosya Seç / Kamera
                                    </Button>
                                    <Input
                                        ref={fileInputRef}
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>

                            {previewUrl && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-100">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 h-6 w-6"
                                        onClick={() => {
                                            setSelectedFile(null)
                                            setPreviewUrl(null)
                                            if (fileInputRef.current) fileInputRef.current.value = ""
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="lesson">Ders</Label>
                                <Select value={lesson} onValueChange={setLesson}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ders seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LESSONS.map((l) => (
                                            <SelectItem key={l} value={l}>
                                                {l}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Hangi konu, neden yanlış yapıldı..."
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={!selectedFile || isUploading}>
                                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Yükle
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : mistakes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-gray-50 border-dashed">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Henüz soru yüklenmemiş</h3>
                    <p className="text-sm text-gray-500 max-w-sm mt-2">
                        Yanlış yaptığın soruları buraya yükleyerek tekrar edebilirsin.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedMistakes).map(([groupLesson, groupMistakes]) => (
                        <div key={groupLesson} className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">{groupLesson}</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groupMistakes.map((mistake) => (
                                    <Card key={mistake.id} className="overflow-hidden group">
                                        <div className="aspect-[3/4] relative bg-gray-100">
                                            <img
                                                src={mistake.imageData}
                                                alt="Mistake"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                                onClick={() => window.open(mistake.imageData, '_blank')}
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {new Date(mistake.createdAt).toLocaleDateString("tr-TR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                            {mistake.description && (
                                                <p className="text-sm text-gray-700 line-clamp-2">{mistake.description}</p>
                                            )}
                                            {mistake.adminNote && (
                                                <div className="mt-3 bg-blue-50 p-2 rounded border border-blue-100">
                                                    <span className="text-xs font-semibold text-blue-600 block mb-1">Eğitmen Notu:</span>
                                                    <p className="text-sm text-gray-800">{mistake.adminNote}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
