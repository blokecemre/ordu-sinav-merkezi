"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

interface PackageFormProps {
    initialData?: {
        id: string
        title: string
        description: string
    }
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function PackageForm({ initialData, onSubmit }: PackageFormProps) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                const canvas = document.createElement("canvas")
                let width = img.width
                let height = img.height

                // Max dimensions
                const MAX_WIDTH = 1200
                const MAX_HEIGHT = 1200

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")
                ctx?.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            })
                            resolve(newFile)
                        } else {
                            reject(new Error("Image compression failed"))
                        }
                    },
                    "image/jpeg",
                    0.8 // Quality
                )
            }
            img.onerror = (error) => reject(error)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!initialData && !imageFile) {
            toast.error("Lütfen bir görsel seçin")
            return
        }

        setSubmitting(true)
        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)

            if (imageFile) {
                // Compress image if it's larger than 1MB
                if (imageFile.size > 1024 * 1024) {
                    try {
                        const compressedFile = await compressImage(imageFile)
                        data.append("image", compressedFile)
                    } catch (error) {
                        console.error("Compression error:", error)
                        // Fallback to original file
                        data.append("image", imageFile)
                    }
                } else {
                    data.append("image", imageFile)
                }
            }

            const result = await onSubmit(data)

            if (result.success) {
                toast.success(initialData ? "Paket güncellendi" : "Paket oluşturuldu")
                router.push("/dashboard/admin/packages")
                router.refresh()
            } else {
                toast.error(result.error || "Bir hata oluştu")
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {initialData ? "Paketi Düzenle" : "Yeni Paket Ekle"}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Paket Adı</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Örn: LGS Hazırlık Kampı"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Paket Detayları</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Paket içeriği, özellikleri ve avantajları..."
                                className="min-h-[200px]"
                            />
                            <p className="text-sm text-muted-foreground">
                                HTML etiketleri kullanabilirsiniz veya her özelliği yeni bir satıra yazabilirsiniz.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Paket Görseli</Label>
                            <div className="flex flex-col gap-4">
                                {initialData && (
                                    <div className="w-40 h-40 relative bg-gray-100 rounded-lg overflow-hidden border">
                                        <img
                                            src={`/api/package/${initialData.id}/image`}
                                            alt="Current"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImageFile(e.target.files[0])
                                        }
                                    }}
                                    required={!initialData}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/dashboard/admin/packages">
                                <Button type="button" variant="outline">İptal</Button>
                            </Link>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Kaydet
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
