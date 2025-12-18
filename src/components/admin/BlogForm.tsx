"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { createBlogPost, updateBlogPost } from "@/app/actions/blog"
import { Loader2, Save, Upload } from "lucide-react"
import { compressImage } from "@/lib/utils"

interface BlogFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        content: string
        excerpt?: string | null
        author?: string | null
        imageMimeType?: string | null
        published: boolean
    }
}

export function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        excerpt: initialData?.excerpt || "",
        author: initialData?.author || "",
        published: initialData?.published || false
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [statusMessage, setStatusMessage] = useState("")

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            // Only auto-generate slug if it's a new post or slug hasn't been manually edited
            slug: !initialData ? generateSlug(title) : prev.slug
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (imageFile && imageFile.size > 50 * 1024 * 1024) {
            setError("Dosya boyutu 50MB'dan küçük olmalıdır")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("slug", formData.slug)
            data.append("content", formData.content)
            data.append("excerpt", formData.excerpt)
            data.append("author", formData.author)
            data.append("published", String(formData.published))

            if (imageFile) {
                setStatusMessage("Görsel optimize ediliyor...")
                const optimizedFile = await compressImage(imageFile)
                data.append("image", optimizedFile)
            }

            setStatusMessage("Kaydediliyor...")

            // Create a promise that rejects after 25 seconds
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı.")), 25000)
            );

            let resultPromise;
            if (initialData?.id) {
                resultPromise = updateBlogPost(initialData.id, data)
            } else {
                resultPromise = createBlogPost(data)
            }

            const result = await Promise.race([
                resultPromise,
                timeoutPromise
            ]) as any;

            if (result.success) {
                router.push("/dashboard/admin/blog")
                router.refresh()
            } else {
                setError(result.error || "Bir hata oluştu")
            }
        } catch (err: any) {
            console.error("Blog save error:", err)
            setError(err.message || "Beklenmedik bir hata oluştu")
        } finally {
            setLoading(false)
            setStatusMessage("")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                        placeholder="Blog yazısı başlığı"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL (Slug)</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                        placeholder="blog-yazisi-basligi"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="author">Yazar (Opsiyonel)</Label>
                <Input
                    id="author"
                    value={formData.author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Yazar adı"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Kapak Görseli</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files?.[0]) {
                                setImageFile(e.target.files[0])
                            }
                        }}
                        className="cursor-pointer"
                    />
                </div>
                {initialData?.imageMimeType && !imageFile && (
                    <p className="text-xs text-green-600">
                        Mevcut bir görsel yüklü. Değiştirmek için yeni dosya seçin.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Özet (Opsiyonel)</Label>
                <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Yazının kısa bir özeti..."
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">İçerik (HTML)</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    placeholder="<p>Blog yazısı içeriği...</p>"
                    className="font-mono text-sm"
                    rows={15}
                />
                <p className="text-xs text-muted-foreground">
                    HTML veya Markdown kullanabilirsiniz. Başlıklar için #, ##, kalın yazı için **text** kullanabilirsiniz.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Yayınla</Label>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    İptal
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {statusMessage || "Kaydediliyor..."}
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
    )
}
