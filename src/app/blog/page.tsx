import { SiteHeader } from "@/components/SiteHeader"
import { getBlogPosts } from "@/app/actions/blog"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

export default async function BlogPage() {
    const { data: posts } = await getBlogPosts(1, 20, true)

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content - Blog Grid */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>

                        <div className="grid md:grid-cols-2 gap-6">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                                            {post.imageUrl && (
                                                <div className="aspect-video w-full overflow-hidden">
                                                    <img
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-orange-500">
                                                        <User className="w-3 h-3" />
                                                        Ada Sınav Merkezi
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-500">
                                    Henüz yayınlanmış blog yazısı bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Recent Posts */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Son Blog Yazılarımız</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {posts && posts.slice(0, 5).map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                                            <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Ordu Sınav Merkezi. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    )
}
