"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSliderImages, createSliderImage, deleteSliderImage, updateSliderOrder } from "@/app/actions/slider"
import { Loader2, Plus, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminSliderPage() {
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)

    const fetchImages = async () => {
        setLoading(true)
        const result = await getSliderImages()
        if (result.success) {
            setImages(result.data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchImages()
    }, [])

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!uploadFile) {
            toast.error("Lütfen bir görsel seçin")
            return
        }

        // 5MB limit check
        if (uploadFile.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır")
            return
        }

        setSubmitting(true)
        const data = new FormData()
        data.append("image", uploadFile)

        try {
            // Create a promise that rejects after 25 seconds (Vercel hobby limit is usually 10s or 60s, but let's be safe)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı. Görsel çok büyük olabilir veya sunucu yanıt vermiyor.")), 25000)
            );

            const result = await Promise.race([
                createSliderImage(data),
                timeoutPromise
            ]) as any;

            if (result.success) {
                toast.success("Görsel yüklendi")
                setIsDialogOpen(false)
                setUploadFile(null)
                fetchImages()
            } else {
                toast.error(result.error || "Bir hata oluştu")
            }
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Yükleme sırasında bir hata oluştu")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return

        const result = await deleteSliderImage(id)
        if (result.success) {
            toast.success("Görsel silindi")
            fetchImages()
        } else {
            toast.error("Silme işlemi başarısız")
        }
    }

    const moveImage = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === images.length - 1) return

        const newImages = [...images]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        // Swap
        const temp = newImages[index]
        newImages[index] = newImages[targetIndex]
        newImages[targetIndex] = temp

        // Update orders locally
        newImages.forEach((img, i) => img.order = i)
        setImages(newImages)

        // Sync with server
        const updates = newImages.map(img => ({ id: img.id, order: img.order }))
        await updateSliderOrder(updates)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Slider Yönetimi</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Görsel Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Slider Görseli Ekle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Görsel Seç</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setUploadFile(e.target.files[0])
                                        }
                                    }}
                                    required
                                    className="cursor-pointer"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Önerilen boyut: 1920x600px (Geniş banner formatı)
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    "Yükle"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="space-y-4">
                    {images.map((img, index) => (
                        <Card key={img.id} className="p-4 flex items-center gap-4">
                            <div className="w-32 h-16 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                                <img
                                    src={`/api/slider/${img.id}/image`}
                                    alt="Slider"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 text-sm text-gray-500">
                                Sıra: {index + 1}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveImage(index, 'up')}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveImage(index, 'down')}
                                    disabled={index === images.length - 1}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(img.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {images.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            Henüz hiç görsel eklenmemiş.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
