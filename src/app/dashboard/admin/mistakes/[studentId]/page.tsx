"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, ArrowLeft, Trash2, Camera, Upload, X, Image as ImageIcon, Save } from "lucide-react"
import { toast } from "sonner"

interface Mistake {
    id: string
    imageData: string | null
    imageUrl: string | null
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

export default function AdminStudentMistakesPage() {
    const params = useParams()
    const router = useRouter()
    const [mistakes, setMistakes] = useState<Mistake[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [description, setDescription] = useState("")
    const [lesson, setLesson] = useState(LESSONS[0])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Admin Note State
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [noteContent, setNoteContent] = useState("")
    const [isSavingNote, setIsSavingNote] = useState(false)

    useEffect(() => {
        if (params.studentId) {
            fetchMistakes()
        }
    }, [params.studentId])

    const fetchMistakes = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/mistakes?studentId=${params.studentId}`)
            if (res.ok) {
                const data = await res.json()
                setMistakes(data)
            } else {
                setError("Veriler yüklenemedi")
            }
        } catch (err) {
            console.error(err)
            setError("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    // --- Upload Handlers ---
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
        if (!selectedFile || !params.studentId) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("description", description)
        formData.append("lesson", lesson)
        formData.append("studentId", params.studentId as string)

        try {
            const res = await fetch("/api/mistakes", {
                method: "POST",
                body: formData
            })

            if (res.ok) {
                toast.success("Soru yüklendi")
                setIsUploadOpen(false)
                setSelectedFile(null)
                setPreviewUrl(null)
                setDescription("")
                setLesson(LESSONS[0])
                fetchMistakes()
            } else {
                toast.error("Yükleme başarısız")
            }
        } catch (error) {
            console.error("Upload error", error)
            toast.error("Hata oluştu")
        } finally {
            setIsUploading(false)
        }
    }

    // --- Delete Handler ---
    const handleDelete = async (id: string) => {
        if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return

        try {
            const res = await fetch(`/api/mistakes?id=${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                toast.success("Soru silindi")
                setMistakes(mistakes.filter(m => m.id !== id))
            } else {
                toast.error("Silme başarısız")
            }
        } catch (error) {
            console.error("Delete error", error)
            toast.error("Hata oluştu")
        }
    }

    // --- Admin Note Handlers ---
    const handleEditNote = (mistake: Mistake) => {
        setEditingNoteId(mistake.id)
        setNoteContent(mistake.adminNote || "")
    }

    const handleSaveNote = async (id: string) => {
        setIsSavingNote(true)
        try {
            const res = await fetch("/api/mistakes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, adminNote: noteContent })
            })

            if (res.ok) {
                toast.success("Not kaydedildi")
                setMistakes(mistakes.map(m => m.id === id ? { ...m, adminNote: noteContent } : m))
                setEditingNoteId(null)
            } else {
                toast.error("Kaydetme başarısız")
            }
        } catch (error) {
            console.error("Save note error", error)
            toast.error("Hata oluştu")
        } finally {
            setIsSavingNote(false)
        }
    }

    if (isLoading && mistakes.length === 0) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 text-red-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
            </div>
        )
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
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Öğrenci Yanlış Soruları</h1>
                </div>

                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Camera className="mr-2 h-4 w-4" />
                            Soru Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Öğrenci Adına Soru Yükle</DialogTitle>
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

            {mistakes.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    Bu öğrenci henüz soru yüklememiş.
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedMistakes).map(([groupLesson, groupMistakes]) => (
                        <div key={groupLesson} className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">{groupLesson}</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groupMistakes.map((mistake) => (
                                    <Card key={mistake.id} className="overflow-hidden group flex flex-col">
                                        <div className="aspect-[3/4] relative bg-gray-100">
                                            <img
                                                src={(mistake.imageUrl || mistake.imageData) as string}
                                                alt="Mistake"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                                onClick={() => {
                                                    const url = mistake.imageUrl || mistake.imageData
                                                    if (url) window.open(url, '_blank')
                                                }}
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDelete(mistake.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-4 flex-1">
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
                                                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{mistake.description}</p>
                                            )}

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-blue-600">Admin Notu</span>
                                                    {editingNoteId !== mistake.id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-xs"
                                                            onClick={() => handleEditNote(mistake)}
                                                        >
                                                            Düzenle
                                                        </Button>
                                                    )}
                                                </div>

                                                {editingNoteId === mistake.id ? (
                                                    <div className="space-y-2">
                                                        <Textarea
                                                            value={noteContent}
                                                            onChange={(e) => setNoteContent(e.target.value)}
                                                            className="text-sm min-h-[60px]"
                                                            placeholder="Açıklama giriniz..."
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                onClick={() => setEditingNoteId(null)}
                                                            >
                                                                İptal
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                disabled={isSavingNote}
                                                                onClick={() => handleSaveNote(mistake.id)}
                                                            >
                                                                {isSavingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : "Kaydet"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm bg-blue-50 p-2 rounded text-gray-700 min-h-[40px]">
                                                        {mistake.adminNote || <span className="text-gray-400 italic">Not eklenmemiş...</span>}
                                                    </div>
                                                )}
                                            </div>
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
