"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { createBlogPost, updateBlogPost } from "@/app/actions/blog"
import { Loader2, Save } from "lucide-react"

interface BlogFormProps {
    initialData?: {
        id?: string
        title: string
        slug: string
        content: string
        excerpt?: string | null
        imageUrl?: string | null
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
        imageUrl: initialData?.imageUrl || "",
        published: initialData?.published || false
    })

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
        setLoading(true)
        setError(null)

        try {
            let result
            if (initialData?.id) {
                result = await updateBlogPost(initialData.id, formData)
            } else {
                result = await createBlogPost(formData)
            }

            if (result.success) {
                router.push("/dashboard/admin/blog")
                router.refresh()
            } else {
                setError(result.error || "Bir hata oluştu")
            }
        } catch (err) {
            setError("Beklenmedik bir hata oluştu")
        } finally {
            setLoading(false)
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
                <Label htmlFor="imageUrl">Kapak Görseli URL</Label>
                <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                    Şimdilik harici resim URL'si kullanıyoruz. İleride dosya yükleme eklenebilir.
                </p>
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
                    Basit HTML etiketleri kullanabilirsiniz (p, h2, h3, ul, li, strong, em).
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
    )
}
