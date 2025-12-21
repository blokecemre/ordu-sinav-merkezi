import { BookOpen } from "lucide-react"

interface Partner {
    id: string
    name: string
    url: string
}

interface PartnersProps {
    partners: Partner[]
}

export function Partners({ partners }: PartnersProps) {
    return (
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                        <BookOpen className="w-4 h-4" />
                        Güvenilir Kaynaklar
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Sınav İçin Tercih Edilen Yayınlar
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Türkiye'nin önde gelen yayınevleri ile çalışıyoruz
                    </p>
                </div>

                {/* Publishers - 3D Flowing Layout */}
                {partners && partners.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 md:gap-8 max-w-5xl mx-auto">
                        {partners.map((partner, index) => (
                            <a
                                key={partner.id}
                                href={partner.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards"
                                style={{
                                    animationDelay: `${0.1 + index * 0.08}s`,
                                    perspective: "1000px",
                                }}
                            >
                                <div
                                    className="relative px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-card border border-border/50 transition-all duration-500 cursor-pointer transform-gpu hover:scale-105 hover:-translate-y-1"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* 3D Shadow layers */}
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-primary/20 transition-transform duration-500 blur-sm opacity-0 group-hover:opacity-100"
                                        style={{ transform: "translateZ(-10px) translateX(4px) translateY(4px)" }}
                                    />

                                    {/* Main content */}
                                    <div
                                        className="relative bg-card rounded-2xl transform transition-all duration-500 flex items-center justify-center min-w-[140px] md:min-w-[180px] h-16 md:h-20 shadow-sm group-hover:shadow-xl"
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        <span className="relative block text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">
                                            {partner.name}
                                        </span>
                                    </div>

                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                                    {/* External link indicator */}
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 shadow-lg z-20">
                                        ↗
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">Henüz yayıncı eklenmemiş.</p>
                )}

                {/* Decorative line */}
                <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    )
}
