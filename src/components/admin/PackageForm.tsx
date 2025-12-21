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
        theme?: string
    }
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function PackageForm({ initialData, onSubmit }: PackageFormProps) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        theme: initialData?.theme || "blue"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setSubmitting(true)
        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("theme", formData.theme)

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

    const THEMES = [
        { id: "blue", name: "Mavi Tema", gradient: "from-blue-600 via-blue-500 to-cyan-400" },
        { id: "purple", name: "Mor Tema", gradient: "from-fuchsia-600 via-purple-500 to-pink-400" },
        { id: "orange", name: "Turuncu Tema", gradient: "from-amber-500 via-orange-500 to-red-400" },
    ]

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
                            <Label>Paket Teması</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {THEMES.map((theme) => (
                                    <div
                                        key={theme.id}
                                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                                        className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${formData.theme === theme.id
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-transparent hover:border-border"
                                            }`}
                                    >
                                        <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-medium shadow-sm`}>
                                            {theme.name}
                                        </div>
                                    </div>
                                ))}
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
