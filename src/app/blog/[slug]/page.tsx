import { SiteHeader } from "@/components/SiteHeader"
import { getBlogPost, getBlogPosts } from "@/app/actions/blog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { data: post } = await getBlogPost(slug)
    const { data: recentPosts } = await getBlogPosts(1, 5, true)

    if (!post) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="mb-6">
                    <Link href="/blog">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Blog Anasayfasına Dön
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content - Article */}
                    <div className="flex-1">
                        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {post.imageMimeType && (
                                <div className="w-full aspect-video relative">
                                    <img
                                        src={`/api/blog/${post.id}/image`}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    {post.title}
                                </h1>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                    </div>
                                    <div className="flex items-center gap-2 text-orange-500 font-medium">
                                        <User className="w-4 h-4" />
                                        {post.author || "Ordu Sınav Merkezi"}
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    <Markdown
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {post.content}
                                    </Markdown>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar - Recent Posts */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Son Blog Yazılarımız</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentPosts && recentPosts.map((recent: any) => (
                                        <Link key={recent.id} href={`/blog/${recent.slug}`} className="block group">
                                            <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {recent.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(recent.createdAt).toLocaleDateString("tr-TR")}
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
