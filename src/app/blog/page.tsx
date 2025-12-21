import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Calendar, User, ArrowRight, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

const blogPosts = [
    {
        id: "deneme-kotu-gecti",
        title: "Eyvah! Deneme Çok Kötü Geçti. Ne yapmalıyım?",
        excerpt: "Kötü bir sonuç moral bozukluğu yaratabilir ancak bu süreçte en büyük hata puana takılıp kalmaktır. Puan odaklı değil, süreç odaklı olmalısınız.",
        author: "İbrahim Özcan",
        date: "15 Aralık 2025",
        category: "Motivasyon",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
        featured: true,
    },
    {
        id: "deneme-analiz-raporu",
        title: "Deneme Analiz Raporu Nasıl Okunur?",
        excerpt: "Bu rapor, öğrencinin sadece aldığı puanı değil; çalışma alışkanlıklarını, konu eksiklerini, dikkat hatalarını ve gelecek potansiyelini analiz eder.",
        author: "İbrahim Özcan",
        date: "14 Aralık 2025",
        category: "Rehberlik",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        featured: true,
    },
    {
        id: "egitimde-devrim",
        title: "Çocuğunuzun Eğitiminde Devrim Yaratacak 5 Aykırı Fikir",
        excerpt: "Ebeveyn olarak çocuğunuzun eğitimi söz konusu olduğunda her şeyi doğru yapma baskısı hissetmeniz çok doğal.",
        author: "İbrahim Özcan",
        date: "13 Aralık 2025",
        category: "Ebeveyn Rehberi",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
        featured: false,
    },
    {
        id: "deneme-sinavlari-gucu",
        title: "LGS'ye Giden Yolda Deneme Sınavlarının Gizli Gücü",
        excerpt: "Deneme sınavları sadece puan almak için değil, stratejik bir araç olarak kullanılmalıdır. Puandan daha fazlası var.",
        author: "İbrahim Özcan",
        date: "13 Aralık 2025",
        category: "Strateji",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
        featured: false,
    },
    {
        id: "neden-deneme",
        title: "Neden Deneme Yapmalıyız?",
        excerpt: "Deneme sınavları, öğrencilerin gerçek sınav ortamını deneyimlemesi ve eksiklerini görmesi için vazgeçilmez araçlardır.",
        author: "İbrahim Özcan",
        date: "12 Aralık 2025",
        category: "Temel Bilgiler",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        featured: false,
    },
]

const recentPosts = blogPosts.slice(0, 4)

export default function Blog() {
    const featuredPosts = blogPosts.filter((post) => post.featured)
    const regularPosts = blogPosts.filter((post) => !post.featured)

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 hero-gradient opacity-90" />
                <div className="absolute inset-0 pattern-dots opacity-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                            <BookOpen className="w-4 h-4" />
                            Eğitim Blogu
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Bilgi ve İlham Kaynağınız
                        </h1>
                        <p className="text-lg md:text-xl text-white/80">
                            Eğitim dünyasından güncel içerikler, stratejiler ve motivasyon yazıları
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H0Z" fill="hsl(var(--background))" />
                    </svg>
                </div>
            </section>

            <main className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Featured Posts */}
                            {featuredPosts.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Öne Çıkan Yazılar</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {featuredPosts.map((post, index) => (
                                            <article
                                                key={post.id}
                                                className="group glass-card rounded-3xl overflow-hidden card-lift"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                                        {post.category}
                                                    </span>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {post.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {post.author}
                                                            </span>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Posts */}
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-8">Tüm Yazılar</h2>
                                <div className="space-y-6">
                                    {regularPosts.map((post, index) => (
                                        <article
                                            key={post.id}
                                            className="group glass-card rounded-2xl overflow-hidden card-lift"
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="sm:w-48 md:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-6 flex flex-col justify-center">
                                                    <span className="inline-block w-fit px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                                                        {post.category}
                                                    </span>
                                                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {post.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {post.author}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-28 space-y-8">
                                {/* Recent Posts Widget */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Son Yazılar
                                    </h3>
                                    <div className="space-y-4">
                                        {recentPosts.map((post, index) => (
                                            <div
                                                key={post.id}
                                                className="group flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0 cursor-pointer"
                                            >
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                        {post.title}
                                                    </h4>
                                                    <span className="text-xs text-muted-foreground">{post.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories Widget */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-foreground mb-6">Kategoriler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Motivasyon", "Rehberlik", "Strateji", "Ebeveyn Rehberi", "Temel Bilgiler"].map((cat) => (
                                            <span
                                                key={cat}
                                                className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Widget */}
                                <div className="relative rounded-2xl overflow-hidden">
                                    <div className="absolute inset-0 hero-gradient" />
                                    <div className="relative p-6 text-center">
                                        <h3 className="text-xl font-bold text-white mb-3">Başarıya Hazır mısınız?</h3>
                                        <p className="text-white/80 text-sm mb-4">
                                            Hemen üye olun ve deneme sınavlarına katılın.
                                        </p>
                                        <Link
                                            href="/register"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors"
                                        >
                                            Üye Ol
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
