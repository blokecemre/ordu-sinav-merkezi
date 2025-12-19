"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSliderImages, createSliderImage, deleteSliderImage, updateSliderOrder, updateSliderText } from "@/app/actions/slider"
import { Loader2, Plus, Trash2, Upload, ArrowUp, ArrowDown, Edit, Save } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { compressImage } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSliderPage() {
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [editingImage, setEditingImage] = useState<any>(null)

    // Form states for new/edit
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [description, setDescription] = useState("")
    const [highlight, setHighlight] = useState("")
    const [bgClass, setBgClass] = useState("from-blue-600 to-blue-900")

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

    const resetForm = () => {
        setUploadFile(null)
        setTitle("")
        setSubtitle("")
        setDescription("")
        setHighlight("")
        setBgClass("from-blue-600 to-blue-900")
        setEditingImage(null)
    }

    const openEditDialog = (img: any) => {
        setEditingImage(img)
        setTitle(img.title || "")
        setSubtitle(img.subtitle || "")
        setDescription(img.description || "")
        setHighlight(img.highlight || "")
        setBgClass(img.bgClass || "from-blue-600 to-blue-900")
        setIsEditDialogOpen(true)
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!uploadFile) {
            toast.error("Lütfen bir görsel seçin")
            return
        }

        setSubmitting(true)

        try {
            // 1. Optimize Image
            setStatusMessage("Görsel optimize ediliyor...")
            const optimizedFile = await compressImage(uploadFile)

            // 2. Upload
            setStatusMessage("Sunucuya yükleniyor...")
            const data = new FormData()
            data.append("image", optimizedFile)
            data.append("title", title)
            data.append("subtitle", subtitle)
            data.append("description", description)
            data.append("highlight", highlight)
            data.append("bgClass", bgClass)

            // Create a promise that rejects after 25 seconds
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı.")), 25000)
            );

            const result = await Promise.race([
                createSliderImage(data),
                timeoutPromise
            ]) as any;

            if (result.success) {
                toast.success("Görsel başarıyla yüklendi")
                setIsDialogOpen(false)
                resetForm()
                fetchImages()
            } else {
                toast.error(result.error || "Bir hata oluştu")
            }
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Yükleme sırasında bir hata oluştu")
        } finally {
            setSubmitting(false)
            setStatusMessage("")
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingImage) return

        setSubmitting(true)
        setStatusMessage("Güncelleniyor...")

        try {
            const data = new FormData()
            data.append("title", title)
            data.append("subtitle", subtitle)
            data.append("description", description)
            data.append("highlight", highlight)
            data.append("bgClass", bgClass)

            const result = await updateSliderText(editingImage.id, data)

            if (result.success) {
                toast.success("İçerik güncellendi")
                setIsEditDialogOpen(false)
                resetForm()
                fetchImages()
            } else {
                toast.error(result.error || "Bir hata oluştu")
            }
        } catch (error: any) {
            console.error("Update error:", error)
            toast.error("Güncelleme sırasında hata oluştu")
        } finally {
            setSubmitting(false)
            setStatusMessage("")
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
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Görsel Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                <p className="text-xs text-muted-foreground">
                                    Önerilen boyut: 1920x600px.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Başlık (Title)</Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: DOĞRU DENEME ANALİZİ" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vurgu (Highlight - Badge)</Label>
                                    <Input value={highlight} onChange={e => setHighlight(e.target.value)} placeholder="Örn: 20 Yıllık Tecrübe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Alt Başlık (Subtitle)</Label>
                                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Örn: Türkiye geneli sınavlarla test edin" />
                            </div>

                            <div className="space-y-2">
                                <Label>Açıklama (Description)</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Kısa açıklama..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Arkaplan Gradyanı (Resim yüklenemezse veya overlay olarak)</Label>
                                <Select value={bgClass} onValueChange={setBgClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Renk seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="from-blue-600 to-blue-900">Mavi Tonlar (Varsayılan)</SelectItem>
                                        <SelectItem value="from-purple-600 to-indigo-900">Mor İndigo</SelectItem>
                                        <SelectItem value="from-teal-600 to-emerald-900">Yeşil Turkuaz</SelectItem>
                                        <SelectItem value="from-orange-500 to-red-800">Turuncu Kırmızı</SelectItem>
                                        <SelectItem value="from-gray-700 to-black">Gri Siyah (Karanlık)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {statusMessage || "İşleniyor..."}
                                    </>
                                ) : (
                                    "Yükle ve Kaydet"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>İçeriği Düzenle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Başlık</Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vurgu</Label>
                                    <Input value={highlight} onChange={e => setHighlight(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Alt Başlık</Label>
                                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Açıklama</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Gradyan</Label>
                                <Select value={bgClass} onValueChange={setBgClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Renk seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="from-blue-600 to-blue-900">Mavi Tonlar</SelectItem>
                                        <SelectItem value="from-purple-600 to-indigo-900">Mor İndigo</SelectItem>
                                        <SelectItem value="from-teal-600 to-emerald-900">Yeşil Turkuaz</SelectItem>
                                        <SelectItem value="from-orange-500 to-red-800">Turuncu Kırmızı</SelectItem>
                                        <SelectItem value="from-gray-700 to-black">Gri Siyah</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {statusMessage || "Güncelleniyor..."}
                                    </>
                                ) : (
                                    "Güncelle"
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
                            <div className="w-32 h-16 bg-gray-100 rounded overflow-hidden relative flex-shrink-0 group cursor-pointer" onClick={() => openEditDialog(img)}>
                                <img
                                    src={`/api/slider/${img.id}/image`}
                                    alt="Slider"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="font-bold text-gray-900">{img.title || "(Başlık Yok)"}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">{img.subtitle}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    {img.highlight && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{img.highlight}</span>
                                    )}
                                    <span className="text-xs text-gray-400">Sıra: {index + 1}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(img)}
                                    title="Düzenle"
                                >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveImage(index, 'up')}
                                    disabled={index === 0}
                                    title="Yukarı Taşı"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveImage(index, 'down')}
                                    disabled={index === images.length - 1}
                                    title="Aşağı Taşı"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(img.id)}
                                    title="Sil"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {images.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            Henüz hiç görsel eklenmemiş. "Yeni Görsel Ekle" butonunu kullanarak başlayın.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
