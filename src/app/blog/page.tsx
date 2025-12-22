
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { getBlogPosts } from "@/app/actions/blog"
import Link from "next/link"
import { Calendar, User, ArrowRight, BookOpen, Clock } from "lucide-react"

// Helper to calculate read time
function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dk`;
}

// Helper to strip HTML tags for excerpt if needed
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
}

export default async function Blog() {
    const { data: posts } = await getBlogPosts(1, 100, true)

    const categories = ["Tümü", "Motivasyon", "Rehberlik", "Strateji", "Ebeveyn Rehberi", "Temel Bilgiler"];

    // Map DB posts to UI format
    const blogPosts = posts ? posts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || stripHtml(post.content).substring(0, 150) + "...",
        author: post.author || "Ordu Sınav Merkezi",
        date: new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        category: "Genel", // Default since DB doesn't have it
        image: post.imageMimeType ? `/api/blog/${post.id}/image` : null, // Handle null image in UI
        readTime: calculateReadTime(post.content)
    })) : []

    const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null
    const gridPosts = blogPosts.length > 1 ? blogPosts.slice(1) : []

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8 border border-white/20">
                            <BookOpen className="w-4 h-4" />
                            Eğitim Blogu
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Bilgi ve İlham<br />
                            <span className="text-white/80">Kaynağınız</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                            LGS yolculuğunuzda size rehberlik edecek stratejiler,
                            motivasyon yazıları ve uzman tavsiyeleri
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-20 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat, index) => (
                            <button
                                key={cat}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${index === 0
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <main className="py-16">
                <div className="container mx-auto px-4">

                    {/* Empty State */}
                    {blogPosts.length === 0 && (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold text-foreground">Henüz yazı bulunmuyor</h3>
                            <p className="text-muted-foreground mt-2">Daha sonra tekrar kontrol ediniz.</p>
                        </div>
                    )}

                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-16">
                            <article className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="grid md:grid-cols-2 gap-0">
                                    <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-muted">
                                        {featuredPost.image ? (
                                            <img
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                                                <BookOpen className="w-16 h-16 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                                                {featuredPost.category}
                                            </span>
                                            <span className="text-muted-foreground text-sm flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {featuredPost.readTime}
                                            </span>
                                        </div>
                                        <Link href={`/blog/${featuredPost.slug}`} className="block">
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                                                {featuredPost.title}
                                            </h2>
                                        </Link>
                                        <p className="text-muted-foreground mb-6 text-base leading-relaxed line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{featuredPost.author}</p>
                                                    <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                                                </div>
                                            </div>
                                            <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-2 text-primary font-semibold group/btn">
                                                <span>Devamını Oku</span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    )}

                    {/* Posts Grid */}
                    {gridPosts.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gridPosts.map((post: any, index: number) => (
                                <article
                                    key={post.id}
                                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500"
                                >
                                    <div className="relative h-52 overflow-hidden bg-muted">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <BookOpen className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-foreground text-xs font-medium rounded-full shadow-lg">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-foreground">{post.author}</p>
                                                    <p className="text-xs text-muted-foreground">{post.date}</p>
                                                </div>
                                            </div>
                                            <Link href={`/blog/${post.slug}`} className="inline-block">
                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Load More - Hidden for now as we load 100 */}
                    {/* <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
              <span>Daha Fazla Yazı</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div> */}
                </div>
            </main>

            {/* Newsletter Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Yeni yazılardan haberdar olun
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            E-posta listemize katılın, en son içerikler doğrudan gelen kutunuza gelsin.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="flex-1 px-5 py-3.5 rounded-full bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <button className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                                Abone Ol
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
