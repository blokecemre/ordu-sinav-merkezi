"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { getBlogPosts, deleteBlogPost, updateBlogPost, toggleBlogPostPublish } from "@/app/actions/blog"
import { useRouter } from "next/navigation"

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchPosts = async () => {
        setLoading(true)
        const result = await getBlogPosts(1, 100, false) // Fetch all, including unpublished
        if (result.success) {
            setPosts(result.data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return

        const result = await deleteBlogPost(id)
        if (result.success) {
            fetchPosts()
        } else {
            alert("Silme başarısız")
        }
    }

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        const result = await toggleBlogPostPublish(id, !currentStatus)
        if (result.success) {
            fetchPosts()
        } else {
            alert("Güncelleme başarısız")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
                <Link href="/dashboard/admin/blog/new">
                    <Button>
                        <Plus className="mr-2 w-4 h-4" />
                        Yeni Yazı Ekle
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm Yazılar</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Yükleniyor...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Henüz blog yazısı bulunmuyor.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-lg truncate" title={post.title}>
                                                {post.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {post.published ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            /{post.slug}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleTogglePublish(post.id, post.published)}
                                            title={post.published ? "Yayından Kaldır" : "Yayınla"}
                                        >
                                            {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                                        </Button>
                                        <Link href={`/dashboard/admin/blog/${post.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
